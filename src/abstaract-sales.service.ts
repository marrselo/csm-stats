import { ComCompanies } from "./csm-company/csm-company.entity";
import { Between, IsNull, Repository } from "typeorm";
import { PurDocuments } from "./csm-purchase/csm-purchase.entity";
import { SalTerminal } from "./csm-terminal/csm-terminal.entity";
import { SalOrders } from "./csm-order.entity";
import { SalCashDeskClosing } from "./SalCashDeskClosing";
import { AbstractSale } from "./abstract-sale/sale-abstract.entity";
import { AclCompany } from "./acl-company/acl-company.entity";
import { ExpenseEntity } from "./expense.entity";
import { GoogleAuth } from 'google-auth-library'
import { BigQuery } from '@google-cloud/bigquery'
import fs from 'fs'
import { PurDocumentsDetails } from "./PurDocumentsDetails";

// ⚠️ tú controlas qué archivo cargas (esto evita el riesgo)
const credentials = JSON.parse(
    process.env.BQ_CM_CREDENTIALS ?? '{}'
)

const auth = new GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
})

const bigquery = new BigQuery({
    projectId: credentials.project_id,
    authClient: await auth.getClient(),
})

async function getSkusByDates(start: Date, end: Date, warehousesUids: string[]) {
    try {
        const query = `
    SELECT
      DATE(created_at) AS date,
      COUNT(DISTINCT(product_code)) AS productsCount,
      SUM(quantity) AS quantity_date,
      SUM(sale_price) AS amount
    FROM \`casamerketapp.test2.sale_detail\`
    WHERE
      created_at >= TIMESTAMP(@start)
      AND created_at < TIMESTAMP(@end)
      AND warehouse_uid IN UNNEST(@warehouses)
    GROUP BY date
    ORDER BY date
  `

        const [job] = await bigquery.createQueryJob({
            query,
            params: { start: start.toISOString().split('T').shift(), end: end.toISOString().split('T').shift(), warehouses: warehousesUids },
        })

        const [rows] = await job.getQueryResults()

        return rows as { date: { value: string }, productsCount: number, amount: number }[]
    } catch (error) {
        console.error(error)
        throw error
    }
}

interface AbstractDateData {
    date: string;
    // sales: {
    //     [x: string]: { name: string, code: string, dimension: string, amount: number, count: number };
    // }
    // purchases: {
    //     [x: string]: { name: string, code: string, dimension: string, amount: number, count: number };


    // },
    // orders: {
    //     [x: string]: { name: string, code: string, dimension: string, amount: number, count: number };


    // },
    // sales: {
    //     total_count: number;
    //     total_amount: number;
    //     facturas_amount: number,
    //     boletas_amount: number,
    //     otros_amount: number,
    //     facturas_count: number;
    //     boletas_count: number;
    //     otros_count: number;
    //     products_count: number,
    // }
    // purchases: {
    //     total_count: number;
    //     total_amount: number;
    //     facturas_amount: number,
    //     boletas_amount: number,
    //     otros_amount: number,
    //     facturas_count: number;
    //     boletas_count: number;
    //     otros_count: number;
    //     products_count: number,

    // },
    // orders: {
    //     total_count: number;
    //     total_amount: number;
    //     facturas_amount: number,
    //     boletas_amount: number,
    //     otros_amount: number,
    //     facturas_count: number;
    //     boletas_count: number;
    //     otros_count: number;
    //     products_count: number,

    // }

    // sales: {
    //     total_count: number,
    //     total_amount: number,
    //     subsidiaries: {

    //         [x: string]: {
    //             total_count: number,
    //             total_amount: number,
    //             warehouses: {
    //                 [x: string]: {
    //                     total_count: number,
    //                     total_amount: number,
    //                     terminals: {
    //                         [x: string]: { count: number, amount: number }
    //                     }
    //                 },
    //             }
    //         }
    //     }

    // }
    sales: {
        totalCount: number,
        totalAmount: number,
        terminals: {
            [x: string]: {
                totalCount: number,
                totalAmount: number,
                terminalId: number,
            }
        }

    },
    purchases: {
        totalCount: number,
        totalAmount: number,
        terminals: {
            [x: string]: {
                totalCount: number,
                totalAmount: number,
                terminalId: number,

            }
        }

    },
    cashClosings: {
        totalCount: number,
        totalAmount: number,
        terminals: {
            [x: string]: {
                totalCount: number,
                totalAmount: number,
                terminalId: number,

            }
        }

    },
    orders: {
        totalCount: number,
        totalAmount: number,
        terminals: {
            [x: string]: {
                totalCount: number,
                totalAmount: number,
                terminalId: number,

            }
        }

    }
    // purchases: {
    //     [x: string]: { name: string, code: string, dimension: string, amount: number, count: number };
    // },
    // orders: {
    //     [x: string]: { name: string, code: string, dimension: string, amount: number, count: number };
    // }
}

function getDatesBetween(startDate: Date, endDate: Date) {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        // dates.push(new Date(currentDate).toISOString().split('T').shift());
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}

export async function getAbstractData(
    csmCompany: ComCompanies,
    aclCompany: AclCompany,
    salDocsRepo: Repository<AbstractSale>,
    salTerminalsRepo: Repository<SalTerminal>,
    csmPurchasesRepo: Repository<PurDocuments>,
    csmOrdersRepo: Repository<SalOrders>,
    cashClosingsRepo: Repository<SalCashDeskClosing>,
) {
    const today = new Date();
    const init = new Date(today.getFullYear(), today.getMonth() - 3, 1)

    const dates = getDatesBetween(init, today);


    const abstractData: Record<
        string,
        AbstractDateData
    > = {};


    // for (const terminal of terminals) {

    const sales = await salDocsRepo.find({
        where: {
            aclId: aclCompany.id,
            createdAt: Between(dates[0].getTime(), (dates.at(-1) as Date)?.getTime() + 86400000)
        },
        select: {
            amount: true,
            terminalId: true,
            createdAt: true,
        },
    });


    sales.forEach((sal: AbstractSale) => {
        const terminalId = sal.terminalId
        if (!terminalId) return;

        const saleDate = new Date(Number(sal.createdAt))
        if (Number.isNaN(saleDate.getTime())) return;
        const dateString = saleDate.toISOString().split('T').shift() as string;

        const dateData = abstractData[dateString];

        const amount = Number(sal.amount)
        if (Number.isNaN(amount) || sal.amount === null) return
        if (!dateData) {
            abstractData[dateString] = {
                date: dateString,
                sales: { totalAmount: 0, totalCount: 0, terminals: { [terminalId]: { terminalId, totalAmount: 0, totalCount: 0 } } },
                purchases: { totalAmount: 0, totalCount: 0, terminals: { [terminalId]: { terminalId, totalAmount: 0, totalCount: 0 } } },
                cashClosings: { totalAmount: 0, totalCount: 0, terminals: { [terminalId]: { terminalId, totalAmount: 0, totalCount: 0 } } },
                orders: { totalAmount: 0, totalCount: 0, terminals: { [terminalId]: { terminalId, totalAmount: 0, totalCount: 0 } } },
            }
        }
        if (!abstractData[dateString].sales.terminals[terminalId]) {
            abstractData[dateString].sales.terminals[terminalId] = { terminalId, totalAmount: 0, totalCount: 0 }
        }

        abstractData[dateString].sales.totalAmount += amount
        abstractData[dateString].sales.totalCount += 1
        abstractData[dateString].sales.terminals[terminalId].totalAmount += amount
        abstractData[dateString].sales.terminals[terminalId].totalCount += 1
    });


    const purchases = await csmPurchasesRepo.find({
        where: {
            companyId: csmCompany.id,
            deletedAt: IsNull(),
            creationDateNumber: Between(dates[0].getTime(), (dates.at(-1) as Date)?.getTime() + 86400000),
        },
        select: {
            amount: true,
            documentDateNumber: true,
            terminalId: true,
            deletedAt: true,
        },
    });

    console.log('PUR', purchases.length, purchases.slice(0, 4))

    purchases.forEach((pur: PurDocuments) => {
        if (pur.deletedAt) return
        const terminalId = pur.terminalId
        if (!terminalId) return;

        if (!pur.documentDateNumber) return;
        const saleDate = new Date(Number(pur.documentDateNumber))
        if (Number.isNaN(saleDate.getTime())) return;
        const dateString = saleDate.toISOString().split('T').shift() as string;

        const dateData = abstractData[dateString];

        const amount = Number(pur.amount)
        if (Number.isNaN(amount) || pur.amount === null) return
        if (!dateData) {
            abstractData[dateString] = {
                date: dateString,
                sales: { totalAmount: 0, totalCount: 0, terminals: { [terminalId]: { terminalId, totalAmount: 0, totalCount: 0 } } },
                purchases: { totalAmount: 0, totalCount: 0, terminals: { [terminalId]: { terminalId, totalAmount: 0, totalCount: 0 } } },
                cashClosings: { totalAmount: 0, totalCount: 0, terminals: { [terminalId]: { terminalId, totalAmount: 0, totalCount: 0 } } },
                orders: { totalAmount: 0, totalCount: 0, terminals: { [terminalId]: { terminalId, totalAmount: 0, totalCount: 0 } } },
            }
        }
        if (!abstractData[dateString].purchases.terminals[terminalId]) {
            abstractData[dateString].purchases.terminals[terminalId] = { terminalId, totalAmount: 0, totalCount: 0 }
        }

        abstractData[dateString].purchases.totalAmount += amount
        abstractData[dateString].purchases.totalCount += 1
        abstractData[dateString].purchases.terminals[terminalId].totalAmount += amount
        abstractData[dateString].purchases.terminals[terminalId].totalCount += 1
    });


    const cashClosings = await cashClosingsRepo.find({
        where: {
            companyId: csmCompany.id,
            deletedAt: IsNull(),
            createdAt: Between(dates[0], new Date((dates.at(-1) as Date)?.getTime() + 86400000))
        },
        select: {
            endAmount: true,
            terminalId: true,
            closedAt: true,
            deletedAt: true,
        },
    });

    cashClosings.forEach((cashClosing: SalCashDeskClosing) => {
        if (cashClosing.deletedAt) return
        const terminalId = cashClosing.terminalId
        if (!terminalId) return;

        if (!cashClosing.closedAt) return;
        const date = cashClosing.closedAt
        if (Number.isNaN(date.getTime())) return;
        const dateString = date.toISOString().split('T').shift() as string;

        const dateData = abstractData[dateString];

        const amount = Number(cashClosing.endAmount)
        if (Number.isNaN(amount) || cashClosing.endAmount === null) return
        if (!dateData) {
            abstractData[dateString] = {
                date: dateString,
                sales: { totalAmount: 0, totalCount: 0, terminals: { [terminalId]: { terminalId, totalAmount: 0, totalCount: 0 } } },
                purchases: { totalAmount: 0, totalCount: 0, terminals: { [terminalId]: { terminalId, totalAmount: 0, totalCount: 0 } } },
                cashClosings: { totalAmount: 0, totalCount: 0, terminals: { [terminalId]: { terminalId, totalAmount: 0, totalCount: 0 } } },
                orders: { totalAmount: 0, totalCount: 0, terminals: { [terminalId]: { terminalId, totalAmount: 0, totalCount: 0 } } },
            }
        }
        if (!abstractData[dateString].cashClosings.terminals[terminalId]) {
            abstractData[dateString].cashClosings.terminals[terminalId] = { terminalId, totalAmount: 0, totalCount: 0 }
        }

        abstractData[dateString].cashClosings.totalAmount += amount
        abstractData[dateString].cashClosings.totalCount += 1
        abstractData[dateString].cashClosings.terminals[terminalId].totalAmount += amount
        abstractData[dateString].cashClosings.terminals[terminalId].totalCount += 1
    });

    const orders = await csmOrdersRepo.find({
        where: {
            companyId: csmCompany?.id,
            deletedAt: IsNull(),
            createdAtNumber: Between(String(dates[0].getTime()), String((dates.at(-1) as Date)?.getTime() + 86400000))
        },
        select: {
            createdAtNumber: true,
            total: true,
            terminalId: true,
            deletedAt: true
        },
    });
    orders.forEach((order: SalOrders) => {
        if (order.deletedAt) return
        const terminalId = order.terminalId
        if (!terminalId) return;

        if (!order.createdAtNumber) return;
        const date = new Date(Number(order.createdAtNumber))
        if (Number.isNaN(date.getTime())) return;
        const dateString = date.toISOString().split('T').shift() as string;

        const dateData = abstractData[dateString];

        const amount = Number(order.total)
        if (Number.isNaN(amount) || order.total === null) return
        if (!dateData) {
            abstractData[dateString] = {
                date: dateString,
                sales: { totalAmount: 0, totalCount: 0, terminals: { [terminalId]: { terminalId, totalAmount: 0, totalCount: 0 } } },
                purchases: { totalAmount: 0, totalCount: 0, terminals: { [terminalId]: { terminalId, totalAmount: 0, totalCount: 0 } } },
                cashClosings: { totalAmount: 0, totalCount: 0, terminals: { [terminalId]: { terminalId, totalAmount: 0, totalCount: 0 } } },
                orders: { totalAmount: 0, totalCount: 0, terminals: { [terminalId]: { terminalId, totalAmount: 0, totalCount: 0 } } },
            }
        }
        if (!abstractData[dateString].orders.terminals[terminalId]) {
            abstractData[dateString].orders.terminals[terminalId] = { terminalId, totalAmount: 0, totalCount: 0 }
        }

        abstractData[dateString].orders.totalAmount += amount
        abstractData[dateString].orders.totalCount += 1
        abstractData[dateString].orders.terminals[terminalId].totalAmount += amount
        abstractData[dateString].orders.terminals[terminalId].totalCount += 1
    });

    // }

    return abstractData

}


export async function getAbstractSales(
    aclCompany: AclCompany,
    salDocsRepo: Repository<AbstractSale>,
) {
    const today = new Date();
    const init = new Date(today.getFullYear(), today.getMonth() - 3, 1)

    const dates = getDatesBetween(init, today);


    const abstractData: Record<
        string,
        {
            totalCount: number,
            totalAmount: number,
            date: string,
            terminals: {
                [x: string]: {
                    totalCount: number,
                    totalAmount: number,
                    terminalId: number,
                }
            }
        }
    > = {};


    // for (const terminal of terminals) {

    const sales = await salDocsRepo.find({
        where: {
            aclId: aclCompany.id,
            createdAt: Between(dates[0].getTime(), (dates.at(-1) as Date)?.getTime() + 86400000)
        },
        select: {
            amount: true,
            terminalId: true,
            createdAt: true,
        },
    });


    sales.forEach((sal: AbstractSale) => {
        const terminalId = sal.terminalId
        if (!terminalId) return;

        const saleDate = new Date(Number(sal.createdAt))
        if (Number.isNaN(saleDate.getTime())) return;
        const dateString = saleDate.toISOString().split('T').shift() as string;

        const dateData = abstractData[dateString];

        const amount = Number(sal.amount)
        if (Number.isNaN(amount) || sal.amount === null) return
        if (!dateData) {
            abstractData[dateString] = {
                date: dateString,
                totalAmount: 0, totalCount: 0, terminals: { [terminalId]: { terminalId, totalAmount: 0, totalCount: 0 } }

            }
        }
        if (!abstractData[dateString].terminals[terminalId]) {
            abstractData[dateString].terminals[terminalId] = { terminalId, totalAmount: 0, totalCount: 0 }
        }

        abstractData[dateString].totalAmount += amount
        abstractData[dateString].totalCount += 1
        abstractData[dateString].terminals[terminalId].totalAmount += amount
        abstractData[dateString].terminals[terminalId].totalCount += 1
    });

    return Object.values(abstractData)


}

export async function getAbstractPurchases(
    csmCompany: ComCompanies,
    csmPurchasesRepo: Repository<PurDocuments>,
) {
    const today = new Date();
    const init = new Date(today.getFullYear(), today.getMonth() - 3, 1)

    const dates = getDatesBetween(init, today);


    const abstractData: Record<
        string,
        {
            date: string,
            totalAmount: number, totalCount: number
        }
    > = {};

    const purchases = await csmPurchasesRepo.find({
        where: {
            companyId: csmCompany.id,
            deletedAt: IsNull(),
            creationDateNumber: Between(dates[0].getTime(), (dates.at(-1) as Date)?.getTime() + 86400000),
        },
        select: {
            amount: true,
            documentDateNumber: true,
            terminalId: true,
            deletedAt: true,
        },
    });

    console.log('PUR', purchases.length, purchases.slice(0, 4))

    purchases.forEach((pur: PurDocuments) => {
        if (pur.deletedAt) return
        const terminalId = pur.terminalId
        if (!terminalId) return;

        if (!pur.documentDateNumber) return;
        const saleDate = new Date(Number(pur.documentDateNumber))
        if (Number.isNaN(saleDate.getTime())) return;
        const dateString = saleDate.toISOString().split('T').shift() as string;

        const dateData = abstractData[dateString];

        const amount = Number(pur.amount)
        if (Number.isNaN(amount) || pur.amount === null) return
        if (!dateData) {
            abstractData[dateString] = {
                date: dateString,
                totalAmount: 0, totalCount: 0
            }
        }

        abstractData[dateString].totalAmount += amount
        abstractData[dateString].totalCount += 1
    });
    return Object.values(abstractData)


}

export async function getAbstractCashClosings(
    csmCompany: ComCompanies,
    cashClosingsRepo: Repository<SalCashDeskClosing>,
) {
    const today = new Date();
    const init = new Date(today.getFullYear(), today.getMonth() - 3, 1)

    const dates = getDatesBetween(init, today);


    const abstractData: Record<
        string,
        {
            date: string,
            totalAmount: number, totalCount: number,
            terminalId: number,
        }
    > = {};



    const cashClosings = await cashClosingsRepo.find({
        where: {
            companyId: csmCompany.id,
            deletedAt: IsNull(),
            createdAt: Between(dates[0], new Date((dates.at(-1) as Date)?.getTime() + 86400000))
        },
        select: {
            endAmount: true,
            terminalId: true,
            closedAt: true,
            deletedAt: true,
        },
    });

    cashClosings.forEach((cashClosing: SalCashDeskClosing) => {
        if (cashClosing.deletedAt) return
        const terminalId = cashClosing.terminalId
        if (!terminalId) return;

        if (!cashClosing.closedAt) return;
        const date = cashClosing.closedAt
        if (Number.isNaN(date.getTime())) return;
        const dateString = date.toISOString().split('T').shift() as string;

        const dateData = abstractData[`${dateString}_${terminalId}`];

        const amount = Number(cashClosing.endAmount)
        if (Number.isNaN(amount) || cashClosing.endAmount === null) return
        if (!dateData) {
            abstractData[`${dateString}_${terminalId}`] = {
                date: dateString,
                totalAmount: 0, totalCount: 0,
                terminalId
            }
        }

        abstractData[`${dateString}_${terminalId}`].totalAmount += amount
        abstractData[`${dateString}_${terminalId}`].totalCount += 1
    });



    return Object.values(abstractData)

}


export async function getAbstractExpense(
    aclCompany: AclCompany,
    expensesRepo: Repository<ExpenseEntity>,
) {
    const today = new Date();
    const init = new Date(today.getFullYear(), today.getMonth() - 3, 1)

    const dates = getDatesBetween(init, today);


    const abstractData: Record<
        string,
        {
            date: string,
            totalAmount: number, totalCount: number
        }
    > = {};


    const expenses = await expensesRepo.find({
        where: {
            aclId: aclCompany.id,
            deletedAt: IsNull(),
            expiredAt: Between(dates[0], new Date((dates.at(-1) as Date)?.getTime() + 86400000))
        },
        select: {
            mount: true,
            expiredAt: true,
            deletedAt: true,
        },
    });

    expenses.forEach((expense: ExpenseEntity) => {
        if (expense.deletedAt) return

        if (!expense.expiredAt) return;
        const date = expense.expiredAt
        if (Number.isNaN(date.getTime())) return;
        const dateString = date.toISOString().split('T').shift() as string;

        const dateData = abstractData[dateString];

        const amount = Number(expense.mount)
        if (Number.isNaN(amount) || expense.mount === null) return
        if (!dateData) {
            abstractData[dateString] = {
                date: dateString,
                totalAmount: 0, totalCount: 0
            }

        }

        abstractData[dateString].totalAmount += amount
        abstractData[dateString].totalCount += 1
    });

    return Object.values(abstractData)
}



export async function getAbstractSkusSales(
    warehousesUids: string[],
) {
    const today = new Date();
    const init = new Date(today.getFullYear(), today.getMonth() - 3, 1)

    const dates = getDatesBetween(init, today);
    const skus = await getSkusByDates(dates[0], new Date((dates.at(-1) as Date)?.getTime() + 86700000), warehousesUids)

    console.log('SKUS', skus.length, skus.slice(0, 10))
    const abstractData: Record<
        string,
        {
            date: string,
            totalAmount: number, totalCount: number
        }
    > = Object.fromEntries(skus.map(s => [s.date.value, { date: s.date.value, totalAmount: s.amount, totalCount: s.productsCount }]));

    return Object.values(abstractData)

}


export async function getAbstractSkusPurchases(
    purchaseDetailsRepo: Repository<PurDocumentsDetails>,
    csmCompany: ComCompanies,
) {

    const today = new Date();
    const init = new Date(today.getFullYear(), today.getMonth() - 3, 1)

    const dates = getDatesBetween(init, today);

    const abstractData: {
        date: string,
        totalCount: number
    }[] = await purchaseDetailsRepo // tu entidad
        .createQueryBuilder('detail')
        .select('DATE(detail.created_at)', 'date')
        .addSelect('COUNT(DISTINCT detail.product_id)', 'totalCount')
        .where('detail.created_at BETWEEN :start AND :end', { start: dates[0].toISOString(), end: new Date((dates.at(-1) as Date)?.getTime() + 86400000).toISOString() })
        .andWhere('detail.company_id = :companyId', { companyId: csmCompany.id })
        .groupBy('date')
        .orderBy('date', 'DESC')
        .getRawMany();


    return abstractData

}