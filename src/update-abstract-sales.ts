import { Between, IsNull } from "typeorm";
import { ComCompanies } from "./csm-company/csm-company.entity";
import { SalDocuments } from "./csm-sale/csm-sale.entity";
import { getDatasource } from "./datasources";
import { AbstractSale } from "./abstract-sale/sale-abstract.entity";
export async function updateAbstractSales(
  nodeName: string,
  chunkSize: number,
  recreateTable = false,
) {
  const datasource = getDatasource(nodeName);

  if (recreateTable) {
    await datasource.sales.query(`DROP TABLE IF EXISTS abstract_sale;`);
  }

  await datasource.sales.query(`
    CREATE TABLE IF NOT EXISTS abstract_sale (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sale_id INT,
        acl_id INT,
        warehouse_id INT,
        terminal_id INT,
        amount DECIMAL(12,2),
        type TINYINT,
        state TINYINT,
        created_at BIGINT(20)
);`);
  try {
    await datasource.sales.query(
      `ALTER TABLE abstract_sale ADD INDEX idx_abstract_sale_acl_id_created_at (acl_id, created_at);`,
    );
  } catch (error) {
    console.log(
      "ERROR AL CREAR EL INDICE: idx_abstract_sale_acl_id_created_at",
      error,
    );
  }

  try {
    await datasource.sales.query(
      `ALTER TABLE abstract_sale ADD INDEX idx_abstract_sale_created_at (created_at);`,
    );
  } catch (error) {
    console.log(
      "ERROR AL CREAR EL INDICE: idx_abstract_sale_created_at",
      error,
    );
  }

  // datasource.sales.setOptions({ entities: [ComCompanies, ComDelivery, ComEmployee, PurDocuments, SalDocuments, ComSubsidiaries, AbstractSale] })

  const csmCompanyRepo = datasource.sales.getRepository(ComCompanies);
  const abstractSaleRepo = datasource.sales.getRepository(AbstractSale);

  const csmSalesRepo = datasource.sales.getRepository(SalDocuments);
  const companies = await csmCompanyRepo.find({
    select: { id: true, aclId: true },
  });
  const companiesMap = Object.fromEntries(
    companies.map((c) => [c.id, c.aclId]),
  );

  const lastAbstractSale = await abstractSaleRepo.findOne({
    where: {},
    select: { id: true, saleId: true },
    order: { id: "DESC" },
  });
  let firstId = 0;
  // console.log(companiesMap);
  if (!lastAbstractSale) {
    const firstSale = await csmSalesRepo.findOne({
      where: {},
      select: { id: true },
      order: { id: "ASC" },
    });

    if (!firstSale) return;

    firstId = firstSale.id ?? 1;
  } else {
    firstId = lastAbstractSale.saleId;
  }

  const lastSale = await csmSalesRepo.findOne({
    where: {},
    select: { id: true },
    order: { id: "DESC" },
  });

  if (!lastSale || !lastSale.id) return;

  const lastId = lastSale.id;

  if (lastId - firstId <= 0) {
    console.log("No hay filas para escanear ", lastId - firstId);
    return;
  }

  const chunksCount = (lastId - firstId) / chunkSize;

  for (let i = 0; i <= chunksCount; i++) {
    const fromId = i * chunkSize + firstId;
    const toId =
      Math.floor(chunksCount) === i
        ? lastId
        : i * chunkSize + chunkSize + firstId - 1;
    console.log(`📥 Scanning rows ${fromId} - ${toId} `);

    const sales = await csmSalesRepo.find({
      where: { id: Between(fromId, toId) },
      select: {
        id: true,
        companyId: true,
        amount: true,
        salTypeDocumentId: true,
        salStatesId: true,
        creationGeneratedAt: true,
        warehouseId: true,
        terminalId: true,
      },
    });

    if (sales && sales.length) {
      const salesToInsert: AbstractSale[] = [];
      sales.forEach((sale) => {
        if(sale.deletedAt) return
        const aclId = companiesMap[sale.companyId];
        if (!aclId) return;
        const createdAt = sale.creationGeneratedAt
          ? Number.isNaN(sale.creationGeneratedAt?.getTime())
            ? 0
            : sale.creationGeneratedAt?.getTime()
          : 0;

        salesToInsert.push({
          aclId,
          // companyId: sale.companyId,
          amount: sale.amount ?? 0,
          createdAt,
          type: sale.salTypeDocumentId ?? 0,
          state: sale.salStatesId ?? 0,
          saleId: sale.id ?? 0,
          terminalId: sale.terminalId ?? 0,
          warehouseId: sale.warehouseId ?? 0,
        });
      });

      await abstractSaleRepo.insert(salesToInsert);
      console.log(
        `📥 Rows scanned in interval ${fromId} - ${toId} completed ${sales.length}`,
      );
    }
    console.log(`DATETIME :${new Date().toISOString()}`);
  }
}
