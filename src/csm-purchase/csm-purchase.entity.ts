import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from "typeorm";
import { DecimalTransformer } from "../typeorm-transformers/decimal-transaformer";

@Entity("pur_documents", { schema: "dp6_quipu_prod" })
export class PurDocuments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "status_tax", type: "int" })
  statusTax?: number;

  @Column({ name: "status_tax_sri", type: "int" })
  statusTaxSri?: number;

  @Column({ name: "sunat_error", type: "text" })
  sunatError?: string;

  @Column({ name: "qr_url", type: "varchar" })
  qrUrl?: string;

  @Column({ name: "taxes_amount", type: "json" })
  taxesAmount?: any;

  @Column({ name: "flag_dispatch", type: "tinyint" })
  flagDispatch?: number;

  @Column({ name: "pur_documents_id", type: "int" })
  purDocumentsId?: number;

  @Column({ name: "flag_use", type: "tinyint" })
  flagUse?: number;

  @Column({ name: "pur_document_annex_id", type: "int" })
  purDocumentAnnexId?: number;

  @Column({ name: "reference_external", type: "text" })
  referenceExternal?: string;

  @Column({ name: "related_documents", type: "json" })
  relatedDocuments?: any;

  @Column({ name: "commentary", type: "text" })
  commentary?: string;

  @Column({ name: "url_images", type: "json" })
  urlImages?: any;

  @Column({ name: "document_number", type: "text" })
  documentNumber?: string;

  @Column({ name: "type_expense_id", type: "int" })
  typeExpenseId?: number;

  @Column({ name: "number", type: "text" })
  number?: string;

  @Column({ name: "serie", type: "text" })
  serie?: string;

  @Column({ name: "entity_state_id", type: "int" })
  entityStateId?: number;

  @Column({ name: "payment_state_id", type: "int" })
  paymentStateId?: number;

  @Column({ name: "type_catalog_id", type: "int" })
  typeCatalogId?: number;

  @Column({
    name: "due_amount",
    type: "decimal",
    transformer: new DecimalTransformer(),
  })
  dueAmount?: number;

  @Column({
    name: "exchange_rate",
    type: "decimal",
    transformer: new DecimalTransformer(),
  })
  exchangeRate?: number;

  @Column({
    name: "exchange_amount",
    type: "decimal",
    transformer: new DecimalTransformer(),
  })
  exchangeAmount?: number;

  @Column({
    name: "discount_percentage",
    type: "decimal",
    transformer: new DecimalTransformer(),
  })
  discountPercentage?: number;

  @Column({
    name: "discount_amount",
    type: "decimal",
    transformer: new DecimalTransformer(),
  })
  discountAmount?: number;

  @Column({ name: "type_billing", type: "int" })
  typeBilling?: number;

  @Column({ name: "supplier_id", type: "int" })
  supplierId?: number;

  @Column({ name: "type_document_id", type: "int" })
  typeDocumentId?: number;

  @Column({ name: "payment_method_id", type: "int" })
  paymentMethodId?: number;

  @Column({ name: "date_document", type: "datetime" })
  dateDocument?: Date;

  @Column({ name: "document_date_number", type: "bigint" })
  documentDateNumber?: number;

  @Column({ name: "state_id", type: "int" })
  stateId?: number;

  @Column({ name: "com_employees_id", type: "int" })
  comEmployeesId?: number;

  @Column({ name: "terminal_id", type: "int" })
  terminalId?: number;

  @Column({ name: "subsidiary_id", type: "int" })
  subsidiaryId?: number;

  @Column({ name: "warehouse_id", type: "int" })
  warehouseId?: number;

  @Column({ name: "warehouse_name", type: "text" })
  warehouseName?: string;

  @Column({ name: "currency", type: "varchar" })
  currency?: string;

  @Column({
    name: "amount",
    type: "decimal",
    transformer: new DecimalTransformer(),
  })
  amount?: number;

  @Column({
    name: "sub_total",
    type: "decimal",
    transformer: new DecimalTransformer(),
  })
  subTotal?: number;

  @Column({
    name: "total_without_withholding",
    type: "decimal",
    transformer: new DecimalTransformer(),
  })
  totalWithoutWithholding?: number;

  @Column({ name: "additional_information", type: "json" })
  additionalInformation?: any;

  @Column({
    name: "taxes",
    type: "decimal",
    transformer: new DecimalTransformer(),
  })
  taxes?: number;

  @Column({ name: "flag_includes_taxes", type: "tinyint" })
  flagIncludesTaxes?: number;

  @Column({ name: "withholding_tax_id", type: "int" })
  withholdingTaxId?: number;

  @Column({
    name: "total_perception",
    type: "decimal",
    transformer: new DecimalTransformer(),
  })
  totalPerception?: number;

  @Column({ name: "perception", type: "json" })
  perception?: any;

  @Column({ name: "status_perception", type: "int" })
  statusPerception?: number;

  @Column({ name: "flag_config_taxes", type: "int" })
  flagConfigTaxes?: number;

  @Column({ name: "status_orc_id", type: "int" })
  statusOrcId?: number;

  @Column({ name: "type_transfer_kardex", type: "tinyint" })
  typeTransferKardex?: number;

  @Column({ name: "flag_transfer_orc", type: "tinyint" })
  flagTransferOrc?: number;

  @Column({ name: "flag_income_status", type: "tinyint" })
  flagIncomeStatus?: number;

  @Column({ name: "date_income", type: "datetime" })
  dateIncome?: Date;

  @Column({ name: "send_kardex_message", type: "text" })
  sendKardexMessage?: string;

  @Column({ name: "send_kardex_status", type: "int" })
  sendKardexStatus?: number;

  @Column({ name: "closed_at", type: "timestamp" })
  closedAt?: Date;

  @Column({ name: "cancel_user_id", type: "int" })
  cancelUserId?: number;

  @Column({ name: "cancel_user_name", type: "text" })
  cancelUserName?: string;

  @Column({ name: "origin_platform", type: "int" })
  originPlatform?: number;

  @Column({ name: "accounting_account", type: "json" })
  accountingAccount?: any;

  @Column({ name: "accounting_seat", type: "json" })
  accountingSeat?: any;

  @Column({ name: "serie_id", type: "int" })
  serieId?: number;

  @Column({ name: "url_password", type: "text" })
  urlPassword?: string;

  @Column({ name: "password", type: "text" })
  password?: string;

  @Column({ name: "emission", type: "text" })
  emission?: string;

  @Column({ name: "environment", type: "text" })
  environment?: string;

  @Column({ name: "authorization_date", type: "date" })
  authorizationDate?: Date;

  @Column({ name: "period_id", type: "int" })
  periodId?: number;

  @Column({ name: "authorization_number", type: "text" })
  authorizationNumber?: string;

  @Column({ name: "hash_online", type: "varchar" })
  hashOnline?: string;

  @Column({ name: "date_online", type: "text" })
  dateOnline?: string;

  @Column({ name: "company_id", type: "int" })
  companyId?: number;

  @Column({ name: "cash_id", type: "int" })
  cashId?: number;

  @Column({ name: "sal_cash_desk_closing_id", type: "int" })
  salCashDeskClosingId?: number;

  @Column({ name: "flag_active", type: "tinyint" })
  flagActive?: number;

  @DeleteDateColumn({ name: "deleted_at", type: "timestamp" })
  deletedAt?: Date;

  @Column({ name: "created_at", type: "timestamp" })
  createdAt?: Date;

  @Column({ name: "creation_date_number", type: "bigint" })
  creationDateNumber?: number;

  @Column({ name: "updated_at", type: "timestamp" })
  updatedAt?: Date;
}
