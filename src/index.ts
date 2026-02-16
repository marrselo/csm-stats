import "reflect-metadata";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { aclDataSource, getDatasource } from "./datasources";
import { AclCompany } from "./acl-company/acl-company.entity";
import { ComCompanies } from "./csm-company/csm-company.entity";
import { ComEmployee } from "./csm-employee/csm-employee.entity";
import { ComSubsidiaries } from "./csm-subsidiary/csm-subsidiary.entity";
import { WarWarehouses } from "./csm-warehouse/csm-warehouse.entity";
import { ComDelivery } from "./csm-delivery/csm-delivery.entity";
import { AbstractSale } from "./abstract-sale/sale-abstract.entity";
import { Between, Equal, In, IsNull, Not, Repository } from "typeorm";
import { PurDocuments } from "./csm-purchase/csm-purchase.entity";
import { updateAbstractSales } from "./update-abstract-sales";
import { AclTemplate } from "./acl-template/acl-template.entity";
import { SalTerminal } from "./csm-terminal/csm-terminal.entity";
import { WarProduct } from "./csm-product/war-product.entity";
import { CsmTypeDocument } from "./csm-document-type.entity";
import { proxyC3Controller } from "./csm-c3-proxy";
import { SalOrders } from "./csm-order.entity";
import { WarDocumentKardex } from "./csm-document-kardex.entity";

process.env.TZ = "UTC";
const app = new Hono();

app.use("/*", cors());
app.use(logger());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

function getMonthUnixRange(date: Date): { start: number; end: number } {
  // Inicio del mes
  const start = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);

  // Fin del mes (día 0 del siguiente mes es el último día del mes actual)
  const end = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  );

  return {
    start: start.getTime(),
    end: end.getTime(),
  };
}

function getMonthName(date: Date, locale: string = "es-ES"): string {
  return date.toLocaleString(locale, { month: "long" });
}

interface AbstractMonthData {
  month_name: string;
  month_number: number;
  sales_count: number;
  sales_amount: number;
  sales_types_count: {
    total: number;
    facturas: number;
    boletas: number;
    otros: number;
  };
  purchases_count: number;
  purchases_amount: number;
  purchases_types_count: {
    total: number;
    facturas: number;
    boletas: number;
    otros: number;
  };
  orders_count: number;
  orders_amount: number;
  orders_types_count: {
    total: number;
    facturas: number;
    boletas: number;
    otros: number;
  };
}

interface AbstractWarehouse {
  id: number;
  name: string;
  code: string;
  ubigeo: string;
  department: string;
  province: string;
  district: string;
  address: string;
  location: { x: number; y: number } | null;
  enable: boolean;
  last_three_months: AbstractMonthData[];
}

interface AbstractResponse {
  csm_node: string;
  acl_id: number;
  acl_code: string;
  company_id: number;
  first_sale_date: Date | null;
  last_sale_date: Date | null;
  last_purchase_date: Date | null;
  last_order_date: Date | null;
  last_three_months: AbstractMonthData[];
  employees_count: number;
  warehouses_count: number;
  warehouses: AbstractWarehouse[];
  subsidiaries_count: number;
  deliveries_count: number;
  sellers_count: number;
  terminals_count: number;
  merchandise_entries_count: number;
  skus_count: number;
  cost_used: "average" | "last";
}

function getMonthByUnixTime(
  time: number,
  ranges: { monthName: string; start: number; end: number }[]
) {
  for (const range of ranges) {
    if (range.start <= time && time <= range.end) {
      return range;
    }
  }
  return null;
}

async function getDataLastMonths(
  countMonths: number,
  abstractSaleRepo: Repository<AbstractSale>,
  aclCompany: AclCompany,
  warehouses: WarWarehouses[],
  docTypesMap: Record<string, CsmTypeDocument>,
  csmPurchasesRepo: Repository<PurDocuments>,
  csmCompany: ComCompanies,
  csmOrdersRepo: Repository<SalOrders>
) {
  const today = new Date();
  today.setDate(today.getDate() - 15);
  const months: {
    monthName: string;
    monthNumber: number;
    start: number;
    end: number;
  }[] = [];

  for (let i = 0; i <= countMonths; i++) {
    const dateMonth = new Date(today.getFullYear(), today.getMonth() - i, 2);
    const monthName = getMonthName(dateMonth);
    const monthRange = getMonthUnixRange(dateMonth);
    months.push({
      monthName,
      monthNumber: dateMonth.getMonth() + 1,
      ...monthRange,
    });
  }

  const lastMonth = months[0];
  const firstMonth = months[countMonths];
  const sales = await abstractSaleRepo.find({
    where: {
      aclId: aclCompany?.id,
      createdAt: Between(firstMonth.start, lastMonth.end),
    },
    select: {
      id: true,
      amount: true,
      warehouseId: true,
      type: true,
      createdAt: true,
    },
  });

  const warehousesMonthsData: Record<
    string,
    { id: number; months: Record<string, AbstractMonthData> }
  > = Object.fromEntries(
    warehouses.map((w) => [
      w.id,
      {
        id: w.id,
        months: Object.fromEntries(
          months.map((r) => [
            r.monthName,
            {
              month_name: r.monthName,
              month_number: r.monthNumber,
              sales_count: 0,
              sales_amount: 0,
              sales_types_count: {
                total: 0,
                facturas: 0,
                boletas: 0,
                otros: 0,
              },
              purchases_count: 0,
              purchases_types_count: {
                total: 0,
                facturas: 0,
                boletas: 0,
                otros: 0,
              },
              purchases_amount: 0,
              orders_count: 0,
              orders_types_count: {
                total: 0,
                facturas: 0,
                boletas: 0,
                otros: 0,
              },
              orders_amount: 0,
            },
          ])
        ),
      },
    ])
  );
  const monthsData = Object.fromEntries(
    months.map((r) => [
      r.monthName,
      {
        month_name: r.monthName,
        month_number: r.monthNumber,
        sales_count: 0,
        sales_amount: 0,
        sales_types_count: { total: 0, facturas: 0, boletas: 0, otros: 0 },
        purchases_count: 0,
        purchases_amount: 0,
        purchases_types_count: { total: 0, facturas: 0, boletas: 0, otros: 0 },
        orders_count: 0,
        orders_amount: 0,
        orders_types_count: { total: 0, facturas: 0, boletas: 0, otros: 0 },
      },
    ])
  );

  sales.forEach((sal: AbstractSale) => {
    if (!sal.warehouseId) return;

    const warData = warehousesMonthsData[sal.warehouseId];
    if (!warData) return;

    const month = getMonthByUnixTime(sal.createdAt, months);
    if (!month) return;

    const monthData = monthsData[month.monthName];
    const warMonthData = warData.months[month.monthName];

    monthData.sales_amount += Number(sal.amount);
    monthData.sales_count += 1;
    monthData.sales_types_count.total += 1;
    warMonthData.sales_amount += Number(sal.amount);
    warMonthData.sales_count += 1;
    warMonthData.sales_types_count.total += 1;
    if (docTypesMap[sal.type].code === "FAC") {
      warMonthData.sales_types_count.facturas += 1;
      monthData.sales_types_count.facturas += 1;
    } else if (docTypesMap[sal.type].code === "BOL") {
      warMonthData.sales_types_count.boletas += 1;
      monthData.sales_types_count.boletas += 1;
    } else {
      warMonthData.sales_types_count.otros += 1;
      monthData.sales_types_count.otros += 1;
    }
  });

  const purchases = await csmPurchasesRepo.find({
    where: {
      companyId: csmCompany?.id,
      documentDateNumber: Between(firstMonth.start, lastMonth.end),
      deletedAt: IsNull(),
    },
    select: {
      id: true,
      amount: true,
      warehouseId: true,
      typeDocumentId: true,
      documentDateNumber: true,
    },
  });

  purchases.forEach((pur: PurDocuments) => {
    if (!pur.warehouseId) return;
    if (!pur.typeDocumentId) return;
    if (!pur.documentDateNumber) return;
    const warData = warehousesMonthsData[pur.warehouseId];
    if (!warData) return;

    const month = getMonthByUnixTime(pur.documentDateNumber, months);
    if (!month) return;

    const monthData = monthsData[month.monthName];
    const warMonthData = warData.months[month.monthName];

    monthData.purchases_amount += Number(pur.amount ?? 0);
    monthData.purchases_count += 1;
    monthData.purchases_types_count.total += 1;

    warMonthData.purchases_amount += Number(pur.amount ?? 0);
    warMonthData.purchases_count += 1;
    warMonthData.purchases_types_count.total += 1;
    if (docTypesMap[pur.typeDocumentId].code === "FAC") {
      warMonthData.purchases_types_count.facturas += 1;
      monthData.purchases_types_count.facturas += 1;
    } else if (docTypesMap[pur.typeDocumentId].code === "BOL") {
      warMonthData.purchases_types_count.boletas += 1;
      monthData.purchases_types_count.boletas += 1;
    } else {
      warMonthData.purchases_types_count.otros += 1;
      monthData.purchases_types_count.otros += 1;
    }
  });

  const orders = await csmOrdersRepo.find({
    where: {
      companyId: csmCompany?.id,
      createdAtNumber: Between(firstMonth.start, lastMonth.end),
      deletedAt: IsNull(),
    },
    select: {
      id: true,
      typeDocumentId: true,
      createdAtNumber: true,
      warehouseId: true,
      total: true,
    },
  });

  orders.forEach((order: SalOrders) => {
    if (!order.warehouseId) return;
    if (!order.typeDocumentId) return;
    if (!order.createdAtNumber) return;
    const warData = warehousesMonthsData[order.warehouseId];
    if (!warData) return;

    const month = getMonthByUnixTime(order.createdAtNumber, months);
    if (!month) return;

    const monthData = monthsData[month.monthName];
    const warMonthData = warData.months[month.monthName];

    monthData.orders_amount += Number(order.total ?? 0);
    monthData.orders_count += 1;
    monthData.orders_types_count.total += 1;

    warMonthData.orders_amount += Number(order.total ?? 0);
    warMonthData.orders_count += 1;
    warMonthData.orders_types_count.total += 1;
    if (docTypesMap[order.typeDocumentId].code === "FAC") {
      warMonthData.orders_types_count.facturas += 1;
      monthData.orders_types_count.facturas += 1;
    } else if (docTypesMap[order.typeDocumentId].code === "BOL") {
      warMonthData.orders_types_count.boletas += 1;
      monthData.orders_types_count.boletas += 1;
    } else {
      warMonthData.orders_types_count.otros += 1;
      monthData.orders_types_count.otros += 1;
    }
  });

  return { warehousesMonthsData, monthsData };
}

app.get("abstract/acl-code/:aclCode", async (c) => {
  const aclCompanyRepo = aclDataSource.getRepository(AclCompany);
  const aclTemplateRepo = aclDataSource.getRepository(AclTemplate);
  const companyAclCode = c.req.param().aclCode
  const aclCompany = await aclCompanyRepo.findOneBy({
    codeCompany: companyAclCode,
  });
  if (!aclCompany) {
    return c.json({ error: `ACL Company ${companyAclCode} not found` }, 404);
  }

  const aclTemplate = await aclTemplateRepo.findOneBy({
    id: aclCompany?.templateId,
  });

    if (!aclTemplate) {
    return c.json({ error: `ACL Template  ${aclCompany.templateId} not found` }, 400);
  }

  // console.log('ACL TEMPLATE SETTINGS',aclTemplate?.settings)
  const csmNode: string = aclTemplate?.settings.domains
    .find((d: any) => d.code === "PRODUCTS_URL")
    .endPoint.replace("https://", "")
    .split(".")[0];

  
  if(!csmNode){
    console.log('CSM NODE not found',aclTemplate?.settings)
    return c.json({ error: `Node not found` }, 400);

  }

  const datasource = getDatasource(csmNode);

  if(!datasource){
    console.log('Datasource not found',aclTemplate?.settings)
    return c.json({ error: `DataSource ${csmNode} not found` }, 400);
  }

  const csmCompanyRepo = datasource.sales.getRepository(ComCompanies);
  const csmCompany = await csmCompanyRepo.findOneBy({ aclId: aclCompany?.id });

  if (!csmCompany) {
    return c.json({ error: `Company not found in node ${csmNode} ` }, 404);
  }

  const csmEmployeesRepo = datasource.sales.getRepository(ComEmployee);
  const employeesCount = await csmEmployeesRepo.countBy({
    companyId: csmCompany?.id,
  });
  const sellersCount = await csmEmployeesRepo.countBy({
    companyId: csmCompany?.id,
  });

  const csmDeliveriesRepo = datasource.sales.getRepository(ComDelivery);
  const deliveriesCount = await csmDeliveriesRepo.countBy({
    companyId: csmCompany?.id,
  });

  const csmDocumentTypesRepo = datasource.sales.getRepository(CsmTypeDocument);
  const documentTypes = await csmDocumentTypesRepo.find();

  const docTypesMap = Object.fromEntries(
    documentTypes.map((dt) => [dt.id, dt])
  );

  const csmSubsidiariesRepo = datasource.sales.getRepository(ComSubsidiaries);
  const subsidiariesCount = await csmSubsidiariesRepo.countBy({
    companyId: csmCompany?.id,
  });

  const csmWarehousesRepo = datasource.products.getRepository(WarWarehouses);
  const warehouses = await csmWarehousesRepo.findBy({
    companyId: csmCompany?.id,
  });
  const warehousesMap = Object.fromEntries(warehouses.map((w) => [w.id, w]));

  const csmTerminalRepo = datasource.sales.getRepository(SalTerminal);
  const terminalCount = await csmTerminalRepo.countBy({
    companyId: csmCompany?.id,
  });

  const csmProductsRepo = datasource.products.getRepository(WarProduct);
  const skusCount = await csmProductsRepo.countBy({
    companyId: csmCompany?.id,
  });

  const csmDocumentsKardexRepo =
    datasource.products.getRepository(WarDocumentKardex);
  const documentsKardex = await csmDocumentsKardexRepo.find({
    where: { companyId: csmCompany?.id },
    select: { id: true, documentTypeName: true },
  });
  const documentsKardexEntries = documentsKardex.filter(
    (dk) => dk.documentTypeName?.trim() === "Ingreso de Mercaderia"
  );

  const csmPurchasesRepo = datasource.sales.getRepository(PurDocuments);
  const csmOrdersRepo = datasource.sales.getRepository(SalOrders);
  const abstractSaleRepo = datasource.sales.getRepository(AbstractSale);

  const firstSale = await abstractSaleRepo.findOne({
    where: { aclId: aclCompany?.id, createdAt: Not(Equal(0)) },
    order: { createdAt: "ASC" },
  });
  const lastSale = await abstractSaleRepo.findOne({
    where: { aclId: aclCompany?.id, createdAt: Not(Equal(0)) },
    order: { createdAt: "DESC" },
  });
  const lastPurchase = await csmPurchasesRepo.findOne({
    where: { companyId: csmCompany?.id, deletedAt: IsNull() },
    order: { documentDateNumber: "DESC" },
  });
  const lastOrder = await csmOrdersRepo.findOne({
    where: { companyId: csmCompany?.id, deletedAt: IsNull() },
    order: { createdAtNumber: "DESC" },
  });
  const abstractData = await getDataLastMonths(
    3,
    abstractSaleRepo,
    aclCompany,
    warehouses,
    docTypesMap,
    csmPurchasesRepo,
    csmCompany,
    csmOrdersRepo
  );
  const warehousesData: AbstractWarehouse[] = [];
  const last_three_months: AbstractMonthData[] = Object.values(
    abstractData.monthsData
  );
  for (const warehouseId in abstractData.warehousesMonthsData) {
    const warehouse = warehousesMap[warehouseId];
    const warMonthData = abstractData.warehousesMonthsData[warehouseId];
    warehousesData.push({
      id: warehouse.id,
      name: warehouse.name,
      code: warehouse.code,
      ubigeo: warehouse.ubigeo ?? "",
      department: warehouse.departmentName ?? "",
      province: warehouse.provinceName ?? "",
      district: warehouse.districtName ?? "",
      address: warehouse.address ?? "",
      location: warehouse.location ?? null,
      enable: Boolean(warehouse.flagActive),
      last_three_months: Object.values(warMonthData.months),
    });
  }

  const response: AbstractResponse = {
    csm_node: csmNode,
    acl_id: aclCompany?.id,
    acl_code: aclCompany?.codeCompany,
    company_id: csmCompany?.id,
    first_sale_date: firstSale?.createdAt
      ? new Date(firstSale?.createdAt)
      : null,
    last_sale_date: lastSale?.createdAt ? new Date(lastSale?.createdAt) : null,
    last_purchase_date: lastPurchase?.dateDocument ?? null,
    last_order_date: lastOrder?.deliveryDate ?? null,
    last_three_months,
    employees_count: employeesCount,
    warehouses_count: warehouses.length,
    warehouses: warehousesData,
    subsidiaries_count: subsidiariesCount,
    deliveries_count: deliveriesCount,
    sellers_count: sellersCount,
    terminals_count: terminalCount,
    skus_count: skusCount,
    // merchandise_entries_count: 0,
    merchandise_entries_count: documentsKardexEntries.length,
    cost_used: csmCompany?.settings.flagKardexValued ? "average" : "last",
  };

  return c.json(response);
});

app.get("abstract-company/acl-code/:aclCode", async (c) => {
  const aclCompanyRepo = aclDataSource.getRepository(AclCompany);
  const aclTemplateRepo = aclDataSource.getRepository(AclTemplate);
  const aclCompany = await aclCompanyRepo.findOneBy({
    codeCompany: c.req.param().aclCode,
  });
  if (!aclCompany) {
    return c.json({ error: "ACL Company not found" }, 404);
  }

  const aclTemplate = await aclTemplateRepo.findOneBy({
    id: aclCompany?.templateId,
  });

  // console.log('ACL TEMPLATE SETTINGS',aclTemplate?.settings)
  const nodeName = aclTemplate?.settings.domains
    .find((d: any) => d.code === "PRODUCTS_URL")
    .endPoint.replace("https://", "")
    .split(".")[0];
  const datasource = getDatasource(nodeName);

  const csmCompanyRepo = datasource.sales.getRepository(ComCompanies);
  const csmCompany = await csmCompanyRepo.findOneBy({ aclId: aclCompany?.id });
  const cost_used = csmCompany?.settings.flagKardexValued ? "average" : "last";

  return c.json({
    csm_node: nodeName,
    acl_id: aclCompany?.id,
    acl_code: aclCompany?.codeCompany,
    acl_template: aclTemplate?.name,
    company_id: csmCompany?.id,
    company_ruc: aclCompany?.ruc,
    company_name: aclCompany?.nombreComercial,
    cost_used,
  });
});

app.get("abstract-company/acl-id/:aclId", async (c) => {
  const aclCompanyRepo = aclDataSource.getRepository(AclCompany);
  const aclTemplateRepo = aclDataSource.getRepository(AclTemplate);
  const aclCompany = await aclCompanyRepo.findOneBy({
    id: Number(c.req.param().aclId),
  });
  if (!aclCompany) {
    return c.json({ error: "ACL Company not found" }, 404);
  }

  const aclTemplate = await aclTemplateRepo.findOneBy({
    id: aclCompany?.templateId,
  });

  // console.log('ACL TEMPLATE SETTINGS',aclTemplate?.settings)
  const nodeName = aclTemplate?.settings.domains
    .find((d: any) => d.code === "PRODUCTS_URL")
    .endPoint.replace("https://", "")
    .split(".")[0];

  const urls = Object.fromEntries(aclTemplate?.settings.domains
    .map((d: any) =>[ d.code,d.endPoint]))


  return c.json({
    csm_node: nodeName,
    acl_id: aclCompany?.id,
    acl_code: aclCompany?.codeCompany,
    acl_template: aclTemplate?.name,
    company_ruc: aclCompany?.ruc,
    company_name: aclCompany?.nombreComercial,
    urls
  });
});

app.post("abstract-sales/init-update", async (c) => {
  const body = await c.req.json();
  const force = body["force"] === true;
  const csmNodes =
    body["csmNodes"] && Array.isArray(body["csmNodes"])
      ? body["csmNodes"]
      : ["n1", "n3", "n4", "n5"];

  console.log(body);
  (async () => {
    for (const csmNode of csmNodes) {
      await updateAbstractSales(csmNode, Number(body["chunkSize"]), force);
    }
  })();

  return c.json({
    ok: "ok",
  });
});

interface SalWarehouse {
  id: number;
  csmNode: string;
  aclId: number;
  aclCode: string;
  name: string;
  address: string;
  district: string;
  province: string;
  department: string;
  ubigeo: string;
  location: { x: number; y: number } | null;
  companyId: number;
}

app.get("warehouses", async (c) => {
  const aclCompanyRepo = aclDataSource.getRepository(AclCompany);
  const aclTemplateRepo = aclDataSource.getRepository(AclTemplate);
  const aclCompanies = await aclCompanyRepo.find({});
  const aclTemplates = await aclTemplateRepo.find({});

  const templateCsmNode = Object.fromEntries(
    aclTemplates.map((t) => {
      //	    console.log({t})
      const csmNode = t?.settings.domains
        .find((d: any) => d.code === "PRODUCTS_URL")
        ?.endPoint?.replace("https://", "")
        .split(".")[0];

      return [t.id, csmNode];
    })
  );

  const groups: Record<
    string,
    {
      id: number;
      code: string;
    }[]
  > = {};

  aclCompanies.forEach((c) => {
    if (!c.templateId) return;
    const csmNode = templateCsmNode[c.templateId];
    // if (!csmNodesMap[csmNode]) return;

    if (groups[csmNode]) {
      groups[csmNode].push({
        id: c.id,
        code: c.codeCompany.trim(),
      });
    } else {
      groups[csmNode] = [
        {
          id: c.id,
          code: c.codeCompany.trim(),
        },
      ];
    }
  });
  const allWarehouses: SalWarehouse[] = [];

  for (const csmNode in groups) {
    const datasource = getDatasource(csmNode);
    if (!datasource) continue;
    const nodeCompanies = groups[csmNode];
    const csmCompanyRepo = datasource.sales.getRepository(ComCompanies);
    const csmCompany = await csmCompanyRepo.find({
      where: { aclId: In(nodeCompanies.map((nc) => nc.id)) },
    });
    const csmCompanyMap = Object.fromEntries(csmCompany.map((w) => [w.id, w]));

    const csmWarehousesRepo = datasource.products.getRepository(WarWarehouses);
    const warehouses = await csmWarehousesRepo.find({});

    warehouses.forEach((w) => {
      const csmCompany = csmCompanyMap[w.companyId];
      if (!csmCompany) return;
      allWarehouses.push({
        aclCode: csmCompany.aclCode ?? "",
        aclId: csmCompany.aclId ?? 0,
        csmNode,
        name: w.name,
        department: w.departmentName ?? "",
        district: w.districtName ?? "",
        province: w.districtName ?? "",
        ubigeo: w.ubigeo ?? "",
        location: w.location ?? null,
        address: w.address ?? "",
        id: w.id,
        companyId: w.companyId,
      });
    });
  }

  return c.json(allWarehouses);
});

app.route("c3-proxy", proxyC3Controller);

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
  idleTimeout: 240,
};
