import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { getDatasource } from "./datasources";
import { ComMsTypeDocuments } from "./com-ms-type-documents.entity";
import { ComCompanies } from "./csm-company/csm-company.entity";

export const starsoftController = new Hono();

async function getAclCredentials(token: string) {
  const req = await fetch("https://acl.casamarketapp.com/api/authorization", {
    headers: {
      accept: "application/json",
      authorization: `Bearer ${token}`,
    },
  });
  const data: any = await req.json();
  return data.data;
}

starsoftController.get("/bank-transactions/income", async (c) => {
  try {
    const authorization = c.req.header("Authorization");
    if (!authorization)
      throw new HTTPException(401, {
        message: "Authorization header not found",
      });
    const token = authorization.split(" ")[1];
    const aclCredentials = await getAclCredentials(token);
    const nodeName = JSON.parse(aclCredentials.company.settings)
      .domains.find((d: any) => d.code === "PRODUCTS_URL")
      .endPoint.replace("https://", "")
      .split(".")[0];
    const datasource = getDatasource(nodeName);

    const dateStart = c.req.query("dateStart");
    const dateEnd = c.req.query("dateEnd");
    const currency = c.req.query("currency");
    const subsidiaryId = c.req.query("subsidiaryId");

    const comMsTypeDocumentsRepo =
      datasource.sales.getRepository(ComMsTypeDocuments);
    const comCompanyRepo = datasource.sales.getRepository(ComCompanies);

    const company = await comCompanyRepo.findOne({
      where: { aclId: aclCredentials.company.id },
    });
    if (!company)
      throw new HTTPException(404, { message: "Company not found" });
    const typeDocuments = await comMsTypeDocumentsRepo.find();
    const typeDocumentsMap = new Map(typeDocuments.map((t) => [t.id, t]));

    const sqlQuery = `
SELECT
    cad.id AS amortizationDetailId,
    cad.amount AS amortizationAmount,
    mttb.code AS typeTransactionBankCode,
    ctb.currency,
    ctb.concept,
    DATE_FORMAT(ctb.payment_date, '%Y-%m-%d') AS paymentDate,
    proof_document.document_number AS proofNumber,
    DATE_FORMAT(CONVERT_TZ(proof_document.date_emission, '+05:00', '+00:00'), '%Y-%m-%d') AS proofEmissionDate,
    proof_document.sal_type_document_id AS proofTypeId,
    mp.document_number AS customerDocument,
    ca.operation_number AS operationNumber
FROM ca_amortizations_details AS cad
INNER JOIN ca_amortizations AS ca 
    ON ca.id = cad.amortization_id
INNER JOIN com_transaction_bank AS ctb 
    ON ctb.id = ca.transaction_bank_id
INNER JOIN sal_documents AS proof_document 
    ON proof_document.id = ctb.sal_documents_id
    OR proof_document.id = cad.sal_document_id
LEFT JOIN com_customers AS cc 
    ON cc.id = proof_document.customer_id
LEFT JOIN ms_person AS mp 
    ON mp.id = cc.person_id
INNER JOIN ms_type_transaction_bank AS mttb 
    ON mttb.id = ctb.type_transaction_bank_id
WHERE ctb.deleted_at IS NULL AND ctb.company_id = ? AND ctb.type_movement = 1 AND ctb.payment_date >= ? AND ctb.payment_date <= ? AND ctb.currency = ? AND ctb.subsidiary_id = ?;`;

    const rawBankTransactions = await datasource.sales.query(sqlQuery, [
      company.id,
      dateStart,
      dateEnd,
      currency,
      subsidiaryId,
    ]);

    console.log(sqlQuery, [
      aclCredentials.company.id,
      dateStart,
      dateEnd,
      currency,
      subsidiaryId,
    ]);

    const transactions = rawBankTransactions.map((t: any) => {
      const typeDocument = typeDocumentsMap.get(t.proofTypeId);
      return {
        ...t,
        proofTypeCode: typeDocument?.code,
        proofNumber: `${typeDocument?.qpCode}${t.proofNumber}`,
      };
    });
    return c.json(transactions, 200);
  } catch (error) {
    console.error("ERROR GET BANK TRANSACTIONS", error);
    throw new HTTPException(400, {
      message: "Error al obtener transacciones bancarias",
    });
  }
});

starsoftController.get("/bank-transactions/expenses", async (c) => {
  try {
    const authorization = c.req.header("Authorization");
    if (!authorization)
      throw new HTTPException(401, {
        message: "Authorization header not found",
      });
    const token = authorization.split(" ")[1];
    const aclCredentials = await getAclCredentials(token);
    const nodeName = JSON.parse(aclCredentials.company.settings)
      .domains.find((d: any) => d.code === "PRODUCTS_URL")
      .endPoint.replace("https://", "")
      .split(".")[0];
    const datasource = getDatasource(nodeName);

    const dateStart = c.req.query("dateStart");
    const dateEnd = c.req.query("dateEnd");
    const currency = c.req.query("currency");
    const subsidiaryId = c.req.query("subsidiaryId");
    const comCompanyRepo = datasource.sales.getRepository(ComCompanies);

    const company = await comCompanyRepo.findOne({
      where: { aclId: aclCredentials.company.id },
    });
    if (!company)
      throw new HTTPException(404, { message: "Company not found" });

    const comMsTypeDocumentsRepo =
      datasource.sales.getRepository(ComMsTypeDocuments);

    const typeDocuments = await comMsTypeDocumentsRepo.find();
    const typeDocumentsMap = new Map(typeDocuments.map((t) => [t.id, t]));

    const bankTransactions: {
      id: number;
      amount: number;
      typeTransactionBankCode: string;
      currency: string;
      concept: string;
      paymentDate: string;
      operationNumber: string;
      proofDocumentId: number;
    }[] = await datasource.sales.query(
      `
      SELECT
      ctb.id,
      ctb.amount,
      mttb.code AS typeTransactionBankCode,
      ctb.currency,
      ctb.concept,
      DATE_FORMAT(ctb.payment_date, '%Y-%m-%d') AS paymentDate,
      ctb.document_number as operationNumber,
      ctb.pur_documents_id AS proofDocumentId
      FROM com_transaction_bank AS ctb 
      LEFT JOIN ms_type_transaction_bank AS mttb ON mttb.id = ctb.type_transaction_bank_id
      WHERE ctb.deleted_at IS NULL AND ctb.company_id = ? AND ctb.type_movement = 2 AND ctb.payment_date >= ? AND ctb.payment_date <= ? AND ctb.currency = ? AND ctb.subsidiary_id = ?;`,
      [company.id, dateStart, dateEnd, currency, subsidiaryId],
    );

    const proofDocumentsIds = bankTransactions
      .filter((t: any) => t.proofDocumentId !== null)
      .map((t: any) => t.proofDocumentId);
    if (proofDocumentsIds.length) {
      const proofDocuments: {
        id: number;
        proofNumber: string;
        proofEmissionDate: string;
        proofTypeId: number;
        customerDocument: string;
      }[] = await datasource.sales.query(`
SELECT
    proof_document.id,
    proof_document.document_number AS proofNumber,
    DATE_FORMAT(CONVERT_TZ(proof_document.date_document, '+05:00', '+00:00'), '%Y-%m-%d') AS proofEmissionDate,
    proof_document.type_document_id AS proofTypeId,
    mp.document_number AS customerDocument
FROM pur_documents AS proof_document 
LEFT JOIN pur_suppliers AS ps 
    ON ps.id = proof_document.supplier_id
LEFT JOIN ms_person AS mp 
    ON mp.id = ps.person_id
WHERE proof_document.id IN (${proofDocumentsIds.join(",")});`);

      const proofDocumentsMap = new Map(proofDocuments.map((t) => [t.id, t]));

      const transactions = bankTransactions.map((t) => {
        const proofDocument = proofDocumentsMap.get(t.proofDocumentId);
        const typeDocument = typeDocumentsMap.get(proofDocument?.proofTypeId);
        return {
          ...t,
          proofTypeCode: typeDocument?.code || null,
          proofNumber: proofDocument?.proofNumber ?? t.operationNumber,
          proofEmissionDate: proofDocument?.proofEmissionDate ?? null,
          customerDocument: proofDocument?.customerDocument ?? null,
        };
      });
      return c.json(transactions, 200);
    }

    const transactions = bankTransactions.map((t) => {
      return {
        ...t,
        proofTypeCode: null,
        proofNumber: t.operationNumber,
        proofEmissionDate: null,
        customerDocument: null,
      };
    });

    return c.json(transactions, 200);
  } catch (error) {
    console.error("ERROR GET BANK TRANSACTIONS", error);
    throw new HTTPException(400, {
      message: "Error al obtener transacciones bancarias",
    });
  }
});
