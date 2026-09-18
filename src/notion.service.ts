import { Between, MoreThanOrEqual, Repository } from "typeorm";
import { AbstractSale } from "./abstract-sale/sale-abstract.entity";
import { ComCompanies } from "./csm-company/csm-company.entity";
import { getDatasource } from "./datasources";

const NOTION_ACCESS_TOKEN = process.env.NOTION_ACCESS_TOKEN;
const NOTION_WAREHOUSES_DATABASE_ID = process.env.NOTION_WAREHOUSES_DATABASE_ID;
const NOTION_CLIENTS_DATABASE_ID = process.env.NOTION_CLIENTS_DATABASE_ID;
const NOTION_API_URL = "https://api.notion.com/v1";
const DEFAULT_NOTION_VERSION = "2022-06-28";

function transformPropsNotion(row: Record<string, any>): Record<string, null | number | string> {
    const war = {};
    const properties = row.properties
    for (const column in properties) {
        const valueContent = properties[column][properties[column].type];
        const columnType = properties[column].type;

        if (valueContent === null || valueContent === undefined) {
            war[column] = null;
            continue;
        }

        if (columnType === 'rollup') {
            // console.log(column,properties[column]);
            if (!valueContent.array[0]) {
                war[column] = null
                continue
            }
            const typeRollup = valueContent.array[0].type

            war[column] = valueContent.array[0][typeRollup] ?? null;
            continue;
        }
        if (columnType === 'formula') {
            // console.log(column,properties[column]);

            const typeFormula = valueContent.type

            war[column] = valueContent[typeFormula] ?? null;
            continue;
        }
        if (Array.isArray(valueContent)) {
            war[column] = valueContent.map((c) => c.plain_text).join('  ');
            continue;
        }
        if (typeof valueContent === 'object') {
            war[column] = valueContent.start ?? valueContent.name;
            continue;
        }

        war[column] = properties[column][properties[column].type];
    }
    // console.log('ROW', JSON.stringify(row), war);
    return { pageId: row.id, props: war } as any;
}

async function listWarehouses(
    pageSize: number,
    startCursor?: string | null
): Promise<{ items: any[]; nextCursor?: string | null }> {
    console.log(`REQUESTING_WAREHOUSES_${pageSize}_${startCursor}`);

    const filter: any = {
    };
    // const filter: any = {
    //     and: [
    //         {
    //             property: 'Uso del sistema',
    //             checkbox: {
    //                 equals: true
    //             }
    //         }
    //     ]
    // };

    const requestBody: any = {
        page_size: pageSize
    };

    if (startCursor && startCursor?.trim() !== '') {
        requestBody.start_cursor = startCursor;
    }

    try {
        const res = await fetch(`${NOTION_API_URL}/databases/${NOTION_WAREHOUSES_DATABASE_ID}/query?filter_properties=tVcw&filter_properties=title`, {
            body: JSON.stringify(requestBody),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${NOTION_ACCESS_TOKEN}`,
                'Notion-Version': DEFAULT_NOTION_VERSION
            }

        })

        const responseBody = await res.json() as unknown as { results: any[]; next_cursor: string };
        // console.log({ responseBody });

        return {
            // items: responseBody.results,
            // items: responseBody.results.map((i) =>
            //     toCamelCase(transformRowNotion(i.properties))
            // ),
            items: responseBody.results.map((i) =>
                transformPropsNotion(i)
            ),
            nextCursor: responseBody.next_cursor
        };
    } catch (_error) {
        const error = _error as Error;
        console.log(error);
        throw error;
    }
}

async function listCompanies(
    pageSize: number,
    startCursor?: string | null
): Promise<{ items: any[]; nextCursor?: string | null }> {
    console.log(`REQUESTING_COMPANIES_${pageSize}_${startCursor}`);

    const filter: any = {
    };
    // const filter: any = {
    //     and: [
    //         {
    //             property: 'Uso del sistema',
    //             checkbox: {
    //                 equals: true
    //             }
    //         }
    //     ]
    // };

    const requestBody: any = {
        page_size: pageSize
    };

    if (startCursor && startCursor?.trim() !== '') {
        requestBody.start_cursor = startCursor;
    }

    try {
        const res = await fetch(`${NOTION_API_URL}/databases/${NOTION_CLIENTS_DATABASE_ID}/query?filter_properties=%5Edo%5D&filter_properties=title`, {
            body: JSON.stringify(requestBody),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${NOTION_ACCESS_TOKEN}`,
                'Notion-Version': DEFAULT_NOTION_VERSION
            }

        })

        const responseBody = await res.json() as unknown as { results: any[]; next_cursor: string };


        return {
            items: responseBody.results.map((i) =>
                transformPropsNotion(i)
            ),
            nextCursor: responseBody.next_cursor
        };
    } catch (_error) {
        const error = _error as Error;
        console.log(error);
        throw error;
    }
}

async function findCompanyByAclCode(
    aclCode: string,
): Promise<{ items: any[]; nextCursor?: string | null }> {
    console.log(`REQUESTING_COMPANIES_${aclCode}`);


    const filter: any = {
        and: [
            {
                property: 'ACL',
               rich_text: {
                        equals: String(aclCode)
                    }
            }
        ]
    };

    const requestBody: any = {
        page_size: 2,
        filter
    };

    try {
        const res = await fetch(`${NOTION_API_URL}/databases/${NOTION_CLIENTS_DATABASE_ID}/query?filter_properties=%5Edo%5D&filter_properties=title&filter_properties=%3FYJX&filter_properties=rO%3EV&filter_properties=%3Ce%5Es`, {
            body: JSON.stringify(requestBody),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${NOTION_ACCESS_TOKEN}`,
                'Notion-Version': DEFAULT_NOTION_VERSION
            }

        })

        const responseBody = await res.json() as unknown as { results: any[]; next_cursor: string };


        return {
            items: responseBody.results.map((i) =>
                transformPropsNotion(i)
            ),
            nextCursor: responseBody.next_cursor
        };
    } catch (_error) {
        const error = _error as Error;
        console.log(error);
        throw error;
    }
}

async function findWarehouseById(warehouseId: string) {
    const bodyReq = JSON.stringify({
        filter: {
            and: [
                {
                    property: 'id Tienda',
                    rich_text: {
                        equals: String(warehouseId)
                    }
                }
            ]
        },

    });
    try {
        const response = await fetch(
            `${NOTION_API_URL}/databases/${NOTION_WAREHOUSES_DATABASE_ID}/query?filter_properties=tVcw&filter_properties=title`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${NOTION_ACCESS_TOKEN}`,
                    'Notion-Version': DEFAULT_NOTION_VERSION
                },
                body: bodyReq
            }
        );

        const responseBody = await response.json();
        return responseBody;
    } catch (_error) {
        const error = _error as Error;
        console.log(error);
        throw error;
    }
}

async function findRubros() {
    try {
        const res = await fetch(
            `${NOTION_API_URL}/databases/${NOTION_CLIENTS_DATABASE_ID}`,
            {
                headers: {
                    Authorization: `Bearer ${NOTION_ACCESS_TOKEN}`,
                    Accept: 'application/json',
                    'Notion-Version': DEFAULT_NOTION_VERSION
                }
            }
        );

        const responseBody = await res.json() as unknown as { properties: any };
        // console.log(responseBody.properties);

        return responseBody.properties['NEGOCIO'].select.options;
    } catch (_error) {
        const error = _error as Error;
        console.log(error);
        throw error;
    }
}

async function getNotionWarehousesMap() {

    const notionWarehousesMap = new Map()

    const pageSize = 100;
    let startCursor: string | undefined | null;
    do {
        const res = await listWarehouses(
            pageSize,
            startCursor
        );

        const notionWarehouses = res.items;
        startCursor = res.nextCursor;

        for (const nw of notionWarehouses) {
            notionWarehousesMap.set(nw.props['id Tienda'], nw.pageId)
        }
        await Bun.sleep(350)

    } while (startCursor);

    return notionWarehousesMap
}

async function getNotionCompaniesMap() {

    const notionCompaniesMap = new Map()

    const pageSize = 100;
    let startCursor: string | undefined | null;
    do {
        const res = await listCompanies(
            pageSize,
            startCursor
        );

        const notionCompanies = res.items;
        startCursor = res.nextCursor;

        for (const nc of notionCompanies) {
            notionCompaniesMap.set(nc.props['ACL'], nc.pageId)
        }
        await Bun.sleep(350)

    } while (startCursor);

    return notionCompaniesMap
}

async function getDataWC(
    abstractSaleRepo: Repository<AbstractSale>,
    companiesRepo: Repository<ComCompanies>,
) {
    const today = new Date();
    const limitDate = new Date()
    limitDate.setDate(limitDate.getDate() - 30)

    const companies = await companiesRepo.find({
        select: {
            id: true,
            aclCode: true,
            aclId: true
        },
    });

    const companiesMap = new Map(companies.map(c => [c.aclId, c]))

    const warehousesSalesMap: Map<string, { uid: string, amount: number, quantity: number, lastSaleTs: number }> = new Map()
    const companiesSalesMap: Map<string, { aclCode: string, amount: number, quantity: number, lastSaleTs: number }> = new Map()

    const chunkSize = 50000

    const firstSale = await abstractSaleRepo.findOne({
        where: {
            createdAt: MoreThanOrEqual(limitDate.getTime()),
        },
        select: { id: true },
        order: { id: "ASC" },
    });

    if (!firstSale || !firstSale.id) {
        throw new Error('MISSING_FIRST_SALE')
    }

    const lastSale = await abstractSaleRepo.findOne({
        where: {},
        select: { id: true },
        order: { id: "DESC" },
    });

    if (!lastSale || !lastSale.id) throw new Error('MISSING_FIRST_SALE')

    const firstId = firstSale.id
    const lastId = lastSale.id

    console.log(`ANALYZING_SALES_ROWS_${lastSale.id}-${firstSale.id}=>${lastSale.id - firstSale.id}`);

    if (lastSale.id - firstSale.id <= 0) {
        throw new Error('MISSING_ROWS')
    }

    const chunksCount = (lastId - firstId) / chunkSize;

    for (let i = 0; i <= chunksCount; i++) {
        const fromId = i * chunkSize + firstId;
        const toId =
            Math.floor(chunksCount) === i
                ? lastId
                : i * chunkSize + chunkSize + firstId - 1;
        console.log(`📥 Scanning rows ${fromId} - ${toId} `);

        const sales = await abstractSaleRepo.find({
            where: { id: Between(fromId, toId) },
            select: {
                amount: true,
                warehouseId: true,
                aclId: true,
                createdAt: true

            },
        });

        if (sales && sales.length) {
            for (const sale of sales) {
                if (!sale.aclId) continue
                if (!sale.warehouseId) continue

                const company = companiesMap.get(sale.aclId)
                if (!company) continue

                const warehouseUid = `${company.aclCode} - ${sale.warehouseId}`
                const aclCode = `${company.aclCode}`
                if (!warehousesSalesMap.has(warehouseUid)) {
                    warehousesSalesMap.set(warehouseUid, { amount: 0, quantity: 0, uid: warehouseUid, lastSaleTs: 0 })
                }
                if (!companiesSalesMap.has(aclCode)) {
                    companiesSalesMap.set(aclCode, { aclCode, amount: 0, quantity: 0, lastSaleTs: 0 })
                }

                const wsd = warehousesSalesMap.get(warehouseUid)
                if (!wsd) continue
                wsd.amount += Number(sale.amount)
                wsd.quantity += 1
                wsd.lastSaleTs = Math.max(wsd.lastSaleTs, sale.createdAt)

                const csd = companiesSalesMap.get(aclCode)
                if (!csd) continue
                csd.amount += Number(sale.amount)
                csd.quantity += 1
                csd.lastSaleTs = Math.max(csd.lastSaleTs, sale.createdAt)

            }

            console.log(
                `📥 Rows scanned in interval ${fromId} - ${toId} completed ${sales.length}`,
            );
        }
        console.log(`DATETIME :${new Date().toISOString()}`);
    }

    return { companies: Array.from(companiesSalesMap.values()), warehouses: Array.from(warehousesSalesMap.values()) }
}

export async function updateNotionData() {

    const nWarehouseMap = await getNotionWarehousesMap()
    const nCompaniesMap = await getNotionCompaniesMap()
    const now = new Date()

    for (const csmNode of ['n1', 'n3', 'n4', 'n5']) {
        const datasource = getDatasource(csmNode);
        const abstractSaleRepo = datasource.sales.getRepository(AbstractSale);
        const csmCompanyRepo = datasource.sales.getRepository(ComCompanies);

        const salesData = await getDataWC(abstractSaleRepo, csmCompanyRepo)

        for (const companyData of salesData.companies) {

            const pageId = nCompaniesMap.get(companyData.aclCode)

            if (!pageId) continue
            console.log(`UPDATING_COMPANY_${pageId}_${companyData.aclCode} => ${companyData.quantity}`);

            await updatePage(pageId, {
                "Cantidad de ventas ultimo mes": {
                    "number": companyData.quantity
                },
                'ULT ACTUALIZACION': {
                    date: { start: now.toISOString() },
                },
                'Fecha ultima consulta': {
                    date: { start: now.toISOString() },
                },
                "Fecha ultima venta": {
                    "date":{start: new Date(companyData.lastSaleTs).toISOString() }
                },
                "Total venta ultimo mes": {
                    "number": companyData.amount
                },
            })
            await Bun.sleep(350)
        }

        for (const warehouseData of salesData.warehouses) {
            const pageId = nWarehouseMap.get(warehouseData.uid)

            if (!pageId) continue
            console.log(`UPDATING_WAREHOUSE_${pageId}_${warehouseData.uid} => ${warehouseData.quantity}`);

            await updatePage(pageId, {
                "Cantidad de ventas ultimo mes": {
                    "number": warehouseData.quantity
                },
                'Fecha ultima actualizacion': {
                    date: { start: now.toISOString() },
                },
                "Total venta ultimo mes": {
                    number: warehouseData.amount
                }
            })
            await Bun.sleep(350)
        }


    }
}

type NotionProperty = Record<string, unknown>;
type NotionProperties = Record<string, NotionProperty>;

async function updatePage(
    pageId: string,
    properties: NotionProperties,
) {
    if (!pageId.trim()) throw new Error("MISSING_OR_INVALID_PAGE_ID");

    const body = JSON.stringify({ properties })

    const res = await fetch(`${NOTION_API_URL}/pages/${pageId}`, {
        method: 'PATCH',
        body,
        headers: {
            Authorization: `Bearer ${NOTION_ACCESS_TOKEN}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Notion-Version': DEFAULT_NOTION_VERSION
        }
    })

    const resBody = await res.json()

    return resBody
}
