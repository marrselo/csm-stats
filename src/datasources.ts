import { DataSource } from "typeorm";
import { AclCompany } from "./acl-company/acl-company.entity";
import { AclTemplate } from "./acl-template/acl-template.entity";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";
import { ComCompanies } from "./csm-company/csm-company.entity";
import { WarWarehouses } from "./csm-warehouse/csm-warehouse.entity";
import { ComDelivery } from "./csm-delivery/csm-delivery.entity";
import { ComEmployee } from "./csm-employee/csm-employee.entity";
import { PurDocuments } from "./csm-purchase/csm-purchase.entity";
import { SalDocuments } from "./csm-sale/csm-sale.entity";
import { ComSubsidiaries } from "./csm-subsidiary/csm-subsidiary.entity";
import { AbstractSale } from "./abstract-sale/sale-abstract.entity";
import { WarWarehousesProducts } from "./csm-warehouse/csm-warehouse-product.entity";
import { SalTerminal } from "./csm-terminal/csm-terminal.entity";
import { WarProduct } from "./csm-product/war-product.entity";
import { CsmTypeDocument } from "./csm-document-type.entity";
import { SalOrders } from "./csm-order.entity";
import { WarDocumentKardex } from "./csm-document-kardex.entity";

const client = new SecretsManagerClient({
  region: "us-east-1",
  // credentials: {
  //     accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
  //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? ''
  // }
});

async function getSecret(secretName: string): Promise<{
  username: string;
  password: string;
  engine: string;
  host: string;
  port: string;
  dbname: string;
}> {
  try {
    const response = await client.send(
      new GetSecretValueCommand({ SecretId: secretName }),
    );

    if (response.SecretString) {
      // If the secret is a string, parse it if it's JSON
      return JSON.parse(response.SecretString);
    } else if (response.SecretBinary) {
      // If the secret is binary, handle it as needed
      return JSON.parse(response.SecretBinary.toString());
    }
    return {} as any;
  } catch (error) {
    console.error("Error retrieving secret:", error);
    throw error; // Re-throw the error for handling in your application
  }
}

const secretsNames: { products: string; sales: string; nodeName: string }[] = [
  {
    nodeName: "n1",
    sales: "secret-N1SalesDb",
    products: "secret-N1ProductsDb",
  },
  {
    nodeName: "n3",
    sales: "secret-N2nodeDbSales",
    products: "secret-N2nodeDbProducts",
  },
  {
    nodeName: "dev",
    sales: "secret-N2nodeDbSales",
    products: "secret-N2nodeDbProducts",
  },
  {
    nodeName: "n4",
    sales: "secret-n4SalesDb",
    products: "secret-n4ProductsDb",
  },
  {
    nodeName: "n5",
    sales: "secret-n5SalesDb",
    products: "secret-n5ProductsDb",
  },
];

const datasources: Record<string, { products: DataSource; sales: DataSource }> =
  {};
export let aclDataSource: DataSource;

async function initDbs() {
  const secretValueAcl = await getSecret("secret-dbAcl");
  const datasourceConfigAcl: MysqlConnectionOptions = {
    type: "mysql",
    host: secretValueAcl.host,
    port: Number(secretValueAcl.port),
    username: secretValueAcl.username,
    password: secretValueAcl.password,
    database: secretValueAcl.dbname,
    entities: [AclCompany, AclTemplate],
    synchronize: false,
    logging: process.env.TYPEORM_LOGS === "true",
  };
  aclDataSource = await new DataSource(datasourceConfigAcl).initialize();

  for (const secrets of secretsNames) {
    try {
      const secretValueSales = await getSecret(secrets.sales);
      const datasourceConfig: MysqlConnectionOptions = {
        type: "mysql",
        host: secretValueSales.host,
        port: Number(secretValueSales.port),
        username: secretValueSales.username,
        password: secretValueSales.password,
        database: secretValueSales.dbname,
        entities: [
          ComCompanies,
          ComDelivery,
          ComEmployee,
          PurDocuments,
          SalDocuments,
          ComSubsidiaries,
          AbstractSale,
          SalTerminal,
          CsmTypeDocument,
          SalOrders,
        ],
        synchronize: false,
        logging: process.env.TYPEORM_LOGS === "true",
      };
      const datasourceSales = await new DataSource(
        datasourceConfig,
      ).initialize();
      const secretValueProducts = await getSecret(secrets.products);
      const datasourceConfigProducts: MysqlConnectionOptions = {
        type: "mysql",
        host: secretValueProducts.host,
        port: Number(secretValueProducts.port),
        username: secretValueProducts.username,
        password: secretValueProducts.password,
        database: secretValueProducts.dbname,
        entities: [
          WarWarehouses,
          WarWarehousesProducts,
          WarProduct,
          WarDocumentKardex,
        ],
        synchronize: false,
        logging: process.env.TYPEORM_LOGS === "true",
      };

      console.log(datasourceConfig);
      const datasourceProducts = await new DataSource(
        datasourceConfigProducts,
      ).initialize();
      datasources[secrets.nodeName] = {
        sales: datasourceSales,
        products: datasourceProducts,
      };

      console.log("Database connected successfully");
    } catch (error) {
      console.log("Error connecting to database", error);
      throw error;
    }
  }
}

initDbs();

export const getDatasource = (nodeName: string) => datasources[nodeName];
