import { ComCompanies } from "./csm-company/csm-company.entity";
import { Between, IsNull, Repository } from "typeorm";
import { PurDocuments } from "./csm-purchase/csm-purchase.entity";
import { SalTerminal } from "./csm-terminal/csm-terminal.entity";
import { SalOrders } from "./csm-order.entity";
import { SalDocuments } from "./csm-sale/csm-sale.entity";
import { SalCashDeskClosing } from "./SalCashDeskClosing";
import { AbstractSale } from "./abstract-sale/sale-abstract.entity";
import { AclCompany } from "./acl-company/acl-company.entity";

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
            id: true,
            amount: true,
            terminalId: true,
            // salTypeDocumentId: true,
            createdAt: true,
            // creationDateNumber: true,
            // deletedAt: true
        },
    });


    sales.forEach((sal: AbstractSale) => {
        // if (sal.deletedAt) return
        const terminalId = sal.terminalId
        if (!terminalId) return;

        const warehouseId = sal.warehouseId
        if (!warehouseId) return;

        // const subsidiaryId = sal.comSubsidiaryId
        // if (!subsidiaryId) return;

        // const companyId = sal.companyId
        // if (!companyId) return;

        // if (!sal.creationDateNumber) return;
        const saleDate = new Date(sal.createdAt)
        if (Number.isNaN(saleDate.getTime())) return;
        const dateString = saleDate.toISOString().split('Z').shift() as string;

        const dateData = abstractData[dateString];

        const amount = Number(sal.amount)
        if (Number.isNaN(amount) || sal.amount === null) return
        if (!dateData) {
            abstractData[dateString] = {
                date: dateString,
                sales: { totalAmount: amount, totalCount: 1, terminals: { [terminalId]: { terminalId, totalAmount: amount, totalCount: 1 } } },
                purchases: { totalAmount: 0, totalCount: 0, terminals: { [terminalId]: { terminalId, totalAmount: 0, totalCount: 0 } } },
                cashClosings: { totalAmount: 0, totalCount: 0, terminals: { [terminalId]: { terminalId, totalAmount: 0, totalCount: 0 } } },
                orders: { totalAmount: 0, totalCount: 0, terminals: { [terminalId]: { terminalId, totalAmount: 0, totalCount: 0 } } },
            }
            return

        }


        abstractData[dateString].sales.totalAmount += amount
        abstractData[dateString].sales.totalCount += 1
        abstractData[dateString].sales.terminals[terminalId].totalAmount += amount
        abstractData[dateString].sales.terminals[terminalId].totalCount += 1

        // warDateData.sales_amount += Number(sal.amount);
        // warDateData.sales_count += 1;
        // warDateData.sales_types_count.total += 1;
        // if (docTypesMap[sal.type].code === "FAC") {
        //     warDateData.sales_types_count.facturas += 1;
        // } else if (docTypesMap[sal.type].code === "BOL") {
        //     warDateData.sales_types_count.boletas += 1;
        // } else {
        //     warDateData.sales_types_count.otros += 1;
        // }
    });


    const purchases = await csmPurchasesRepo.find({
        where: {
            companyId: csmCompany.id,
            deletedAt: IsNull(),
            creationDateNumber: Between(dates[0].getTime(), (dates.at(-1) as Date)?.getTime() + 86400000),
        },
        select: {
            id: true,
            amount: true,
            warehouseId: true,
            typeDocumentId: true,
            documentDateNumber: true,
            terminalId: true,
            subsidiaryId: true,
            deletedAt: true,
            creationDateNumber: true
        },
    });

    purchases.forEach((pur: PurDocuments) => {
        if (pur.deletedAt) return
        const terminalId = pur.terminalId
        if (!terminalId) return;

        const warehouseId = pur.warehouseId
        if (!warehouseId) return;

        const subsidiaryId = pur.subsidiaryId
        if (!subsidiaryId) return;

        const companyId = pur.companyId
        if (!companyId) return;

        if (!pur.creationDateNumber) return;
        const saleDate = new Date(pur.creationDateNumber)
        if (Number.isNaN(saleDate.getTime())) return;
        const dateString = saleDate.toISOString().split('Z').shift() as string;

        const dateData = abstractData[dateString];

        const amount = Number(pur.amount)
        if (Number.isNaN(amount) || pur.amount === null) return
        if (!dateData) {

            abstractData[dateString] = {
                date: dateString,
                purchases: { totalAmount: amount, totalCount: 1, terminals: { [terminalId]: { terminalId, totalAmount: amount, totalCount: 1 } } },
                sales: { totalAmount: 0, totalCount: 0, terminals: { [terminalId]: { terminalId, totalAmount: 0, totalCount: 0 } } },
                cashClosings: { totalAmount: 0, totalCount: 0, terminals: { [terminalId]: { terminalId, totalAmount: 0, totalCount: 0 } } },
                orders: { totalAmount: 0, totalCount: 0, terminals: { [terminalId]: { terminalId, totalAmount: 0, totalCount: 0 } } },


            }
            return
        };

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
            id: true,
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

        const companyId = cashClosing.companyId
        if (!companyId) return;

        if (!cashClosing.closedAt) return;
        const date = cashClosing.closedAt
        if (Number.isNaN(date.getTime())) return;
        const dateString = date.toISOString().split('Z').shift() as string;

        const dateData = abstractData[dateString];

        const amount = Number(cashClosing.endAmount)
        if (Number.isNaN(amount) || cashClosing.endAmount === null) return
        if (!dateData) {

            abstractData[dateString] = {
                date: dateString,

                cashClosings: { totalAmount: amount, totalCount: 1, terminals: { [terminalId]: { terminalId, totalAmount: amount, totalCount: 1 } } },
                sales: { totalAmount: 0, totalCount: 0, terminals: { [terminalId]: { terminalId, totalAmount: 0, totalCount: 0 } } },
                purchases: { totalAmount: 0, totalCount: 0, terminals: { [terminalId]: { terminalId, totalAmount: 0, totalCount: 0 } } },
                orders: { totalAmount: 0, totalCount: 0, terminals: { [terminalId]: { terminalId, totalAmount: 0, totalCount: 0 } } },

            }
            return
        };

        abstractData[dateString].cashClosings.totalAmount += amount
        abstractData[dateString].cashClosings.totalCount += 1
        abstractData[dateString].cashClosings.terminals[terminalId].totalAmount += amount
        abstractData[dateString].cashClosings.terminals[terminalId].totalCount += 1
    });

    const orders = await csmOrdersRepo.find({
        where: {
            companyId: csmCompany?.id,
            deletedAt: IsNull(),
            createdAtNumber: Between(dates[0].getTime(), (dates.at(-1) as Date)?.getTime() + 86400000)
        },
        select: {
            id: true,
            typeDocumentId: true,
            createdAtNumber: true,
            warehouseId: true,
            total: true,
            terminalId: true,
            subsidiaryId: true,
            deletedAt: true
        },
    });
    orders.forEach((order: SalOrders) => {
        if (order.deletedAt) return
        const terminalId = order.terminalId
        if (!terminalId) return;

        const companyId = order.companyId
        if (!companyId) return;

        if (!order.createdAtNumber) return;
        const date = new Date(order.createdAtNumber)
        if (Number.isNaN(date.getTime())) return;
        const dateString = date.toISOString().split('Z').shift() as string;

        const dateData = abstractData[dateString];

        const amount = Number(order.total)
        if (Number.isNaN(amount) || order.total === null) return
        if (!dateData) {

            abstractData[dateString] = {
                date: dateString,

                orders: { totalAmount: amount, totalCount: 1, terminals: { [terminalId]: { terminalId, totalAmount: amount, totalCount: 1 } } },
                sales: { totalAmount: 0, totalCount: 0, terminals: { [terminalId]: { terminalId, totalAmount: 0, totalCount: 0 } } },
                purchases: { totalAmount: 0, totalCount: 0, terminals: { [terminalId]: { terminalId, totalAmount: 0, totalCount: 0 } } },
                cashClosings: { totalAmount: 0, totalCount: 0, terminals: { [terminalId]: { terminalId, totalAmount: 0, totalCount: 0 } } },

            }
            return
        };

        abstractData[dateString].orders.totalAmount += amount
        abstractData[dateString].orders.totalCount += 1
        abstractData[dateString].orders.terminals[terminalId].totalAmount += amount
        abstractData[dateString].orders.terminals[terminalId].totalCount += 1
    });

    // }

    return abstractData


}