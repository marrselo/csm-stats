import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from "typeorm";
import { DecimalTransformer } from "../typeorm-transformers/decimal-transaformer";

@Entity("sal_documents", { schema: "dp6_quipu_prod" })
export class SalDocuments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "user_id", type: "int" })
  userId?: number;

  @Column({ name: "sal_documents_id", type: "int" })
  salDocumentsId?: number;

  @Column({ name: "ballot_summary_id", type: "int" })
  ballotSummaryId?: number;

  @Column({ name: "summary_unsubscribe_id", type: "int" })
  summaryUnsubscribeId?: number;

  @Column({ name: "withholding_tax_id", type: "int" })
  withholdingTaxId?: number;

  @Column({ name: "order_id", type: "int" })
  orderId?: number;

  @Column({ name: "reference_external", type: "text" })
  referenceExternal?: string;

  @Column({ name: "serie_id", type: "int" })
  serieId: number;

  @Column({ name: "type_billing", type: "int" })
  typeBilling?: number;

  @Column({ name: "terminal_id", type: "int" })
  terminalId?: number;

  @Column({ name: "flag_base_price", type: "int" })
  flagBasePrice?: number;

  @Column({ name: "payment_method_id", type: "int" })
  paymentMethodId?: number;

  @Column({ name: "sal_type_payment_id", type: "int" })
  salTypePaymentId?: number;

  @Column({ name: "sal_states_id", type: "int" })
  salStatesId?: number;

  @Column({ name: "com_employee_id", type: "int" })
  comEmployeeId?: number;

  @Column({ name: "com_employee_registered_id", type: "int" })
  comEmployeeRegisteredId?: number;

  @Column({ name: "com_turns_id", type: "int" })
  comTurnsId?: number;

  @Column({ name: "route_id", type: "int" })
  routeId?: number;

  @Column({ name: "currency", type: "varchar" })
  currency?: string;

  @Column({
    name: "amount",
    type: "decimal",
    transformer: new DecimalTransformer(),
  })
  amount?: number;

  @Column({
    name: "subsidy_amount",
    type: "decimal",
    transformer: new DecimalTransformer(),
  })
  subsidyAmount?: number;

  @Column({
    name: "balance",
    type: "decimal",
    transformer: new DecimalTransformer(),
  })
  balance?: number;

  @Column({
    name: "due_amount",
    type: "decimal",
    transformer: new DecimalTransformer(),
  })
  dueAmount?: number;

  @Column({
    name: "amount_cash",
    type: "decimal",
    transformer: new DecimalTransformer(),
  })
  amountCash?: number;

  @Column({
    name: "amount_credit",
    type: "decimal",
    transformer: new DecimalTransformer(),
  })
  amountCredit?: number;

  @Column({ name: "credit_card_name", type: "varchar" })
  creditCardName?: string;

  @Column({
    name: "subtotal",
    type: "decimal",
    transformer: new DecimalTransformer(),
  })
  subtotal?: number;

  @Column({
    name: "taxes",
    type: "decimal",
    transformer: new DecimalTransformer(),
  })
  taxes?: number;

  @Column({
    name: "taxes_isc",
    type: "decimal",
    transformer: new DecimalTransformer(),
  })
  taxesIsc?: number;

  @Column({ name: "total_points", type: "int" })
  totalPoints?: number;

  @Column({
    name: "change",
    type: "decimal",
    transformer: new DecimalTransformer(),
  })
  change?: number;

  @Column({ name: "flag_type_return", type: "int" })
  flagTypeReturn?: number;

  @Column({ name: "flag_transfer", type: "tinyint" })
  flagTransfer?: number;

  @Column({ name: "send_kardex_message", type: "text" })
  sendKardexMessage?: string;

  @Column({ name: "send_kardex_status", type: "int" })
  sendKardexStatus?: number;

  @Column({ name: "down_payment_document_id", type: "int" })
  downPaymentDocumentId?: number;

  @Column({ name: "flag_advance", type: "int" })
  flagAdvance?: number;

  @Column({ name: "ticket_number", type: "varchar" })
  ticketNumber?: string;

  @Column({
    name: "exchange_amount",
    type: "decimal",
    transformer: new DecimalTransformer(),
  })
  exchangeAmount?: number;

  @Column({ name: "data_client", type: "json" })
  dataClient?: any;

  @Column({ name: "table_code", type: "varchar" })
  tableCode?: string;

  @Column({ name: "table_id", type: "int" })
  tableId?: number;

  @Column({ name: "status_order", type: "int" })
  statusOrder?: number;

  @Column({ name: "serie", type: "varchar" })
  serie?: string;

  @Column({ name: "number", type: "varchar" })
  number?: string;

  @Column({ name: "document_number", type: "varchar" })
  documentNumber?: string;

  @Column({ name: "document_number_filter", type: "bigint" })
  documentNumberFilter?: number;

  @Column({ name: "flag_offline", type: "tinyint" })
  flagOffline?: number;

  @Column({ name: "date_emission", type: "datetime" })
  dateEmission?: Date;

  @Column({ name: "warehouse_id", type: "int" })
  warehouseId?: number;

  @Column({ name: "import_days", type: "int" })
  importDays?: number;

  @Column({ name: "delivered_at", type: "timestamp" })
  deliveredAt?: Date;

  @Column({ name: "expirated_at", type: "timestamp" })
  expiratedAt?: Date;

  @Column({ name: "date_dispatch", type: "timestamp" })
  dateDispatch?: Date;

  @Column({ name: "closed_at", type: "timestamp" })
  closedAt?: Date;

  @Column({ name: "customer_id", type: "int" })
  customerId?: number;

  @Column({ name: "commentary", type: "text" })
  commentary?: string;

  @Column({ name: "date_cancel", type: "date" })
  dateCancel?: Date;

  @Column({
    name: "exchange_rate",
    type: "decimal",
    transformer: new DecimalTransformer(),
  })
  exchangeRate?: number;

  @Column({
    name: "payment_amount",
    type: "decimal",
    transformer: new DecimalTransformer(),
  })
  paymentAmount?: number;

  @Column({ name: "commerce_code", type: "varchar" })
  commerceCode?: string;

  @Column({ name: "operation_code", type: "varchar" })
  operationCode?: string;

  @Column({ name: "idsd_others", type: "int" })
  idsdOthers?: number;

  @Column({ name: "com_company_id", type: "int" })
  companyId: number;

  @Column({ name: "com_subsidiary_id", type: "int" })
  comSubsidiaryId?: number;

  @Column({ name: "subsidiary_rz_social", type: "text" })
  subsidiaryRzSocial?: string;

  @Column({ name: "subsidiary_address", type: "text" })
  subsidiaryAddress?: string;

  @Column({ name: "subsidiary_name", type: "text" })
  subsidiaryName?: string;

  @Column({ name: "subsidiary_ruc", type: "text" })
  subsidiaryRuc?: string;

  @Column({ name: "sal_type_document_id", type: "int" })
  salTypeDocumentId?: number;

  @Column({ name: "type_catalog_sunat_id", type: "int" })
  typeCatalogSunatId?: number;

  @Column({ name: "qr_url", type: "text" })
  qrUrl?: string;

  @Column({ name: "date_issue", type: "timestamp" })
  dateIssue?: Date;

  @Column({ name: "reason", type: "text" })
  reason?: string;

  @Column({
    name: "discount",
    type: "decimal",
    transformer: new DecimalTransformer(),
  })
  discount?: number;

  @Column({
    name: "tip",
    type: "decimal",
    transformer: new DecimalTransformer(),
  })
  tip?: number;

  @Column({ name: "considerations", type: "json" })
  considerations?: any;

  @Column({ name: "work_to_do", type: "json" })
  workToDo?: any;

  @Column({ name: "related_documents", type: "json" })
  relatedDocuments?: any;

  @Column({ name: "warehouse_name", type: "text" })
  warehouseName?: string;

  @Column({ name: "type_payment_codes", type: "json" })
  typePaymentCodes?: any;

  @Column({ name: "sub_type_documents", type: "json" })
  subTypeDocuments?: any;

  @Column({ name: "url_images", type: "json" })
  urlImages?: any;

  @Column({ name: "sal_cash_desk_closing_id", type: "int" })
  salCashDeskClosingId?: number;

  @Column({ name: "cash_id", type: "int" })
  cashId?: number;

  @Column({ name: "hash_offline", type: "text" })
  hashOffline?: string;

  @Column({ name: "hash_online", type: "varchar" })
  hashOnline?: string;

  @Column({ name: "date_online", type: "text" })
  dateOnline?: string;

  @Column({ name: "date_tax_send", type: "datetime" })
  dateTaxSend?: Date;

  @Column({ name: "status_tax", type: "int" })
  statusTax?: number;

  @Column({ name: "status_tax_sri", type: "int" })
  statusTaxSri?: number;

  @Column({ name: "cancel_user_id", type: "int" })
  cancelUserId?: number;

  @Column({ name: "cancel_user_name", type: "text" })
  cancelUserName?: string;

  @Column({ name: "taxes_amount", type: "json" })
  taxesAmount?: any;

  @Column({ name: "payment_state", type: "int" })
  paymentState?: number;

  @Column({ name: "entity_state_id", type: "int" })
  entityStateId?: number;

  @Column({ name: "external_data", type: "json" })
  externalData?: any;

  @Column({ name: "flag_dispatch", type: "tinyint" })
  flagDispatch?: number;

  @Column({ name: "flag_use", type: "tinyint" })
  flagUse?: number;

  @Column({ name: "flag_mobile", type: "tinyint" })
  flagMobile?: number;

  @Column({ name: "flag_old_sale", type: "tinyint" })
  flagOldSale?: number;

  @Column({ name: "origin_platform", type: "int" })
  originPlatform?: number;

  @Column({ name: "flag_sync_fb", type: "int" })
  flagSyncFb?: number;

  @Column({ name: "sunat_error", type: "text" })
  sunatError?: string;

  @Column({ name: "data_response_taxes", type: "json" })
  dataResponseTaxes?: any;

  @Column({ name: "tax_cancellation_status", type: "tinyint" })
  taxCancellationStatus?: number;

  @Column({ name: "total_taxes_amount", type: "json" })
  totalTaxesAmount?: any;

  @Column({ name: "warehouse_code_taxes", type: "text" })
  warehouseCodeTaxes?: string;

  @Column({ name: "password", type: "text" })
  password?: string;

  @Column({ name: "emission", type: "text" })
  emission?: string;

  @Column({ name: "environment", type: "text" })
  environment?: string;

  @Column({ name: "authorization_date", type: "datetime" })
  authorizationDate?: Date;

  @Column({ name: "authorization_number", type: "text" })
  authorizationNumber?: string;

  @Column({ name: "url_password", type: "text" })
  urlPassword?: string;

  @Column({ name: "day_import_term", type: "int" })
  dayImportTerm?: number;

  @Column({ name: "accounting_account", type: "json" })
  accountingAccount?: any;

  @Column({ name: "accounting_seat", type: "json" })
  accountingSeat?: any;

  @Column({ name: "withholding_taxes", type: "json" })
  withholdingTaxes?: any;

  @Column({
    name: "total_without_withholding",
    type: "decimal",
    transformer: new DecimalTransformer(),
  })
  totalWithoutWithholding?: number;

  @Column({ name: "status_withholding", type: "int" })
  statusWithholding?: number;

  @Column({ name: "cron_billing_counter", type: "int" })
  cronBillingCounter?: number;

  @Column({ name: "flag_active", type: "tinyint" })
  flagActive?: number;

  @Column({ name: "local_date_at", type: "timestamp" })
  localDateAt?: Date;

  @Column({ name: "local_date_number", type: "bigint" })
  localDateNumber?: number;

  @Column({ name: "year_number", type: "int" })
  yearNumber?: number;

  @Column({ name: "month_number", type: "int" })
  monthNumber?: number;

  @Column({ name: "day_number", type: "int" })
  dayNumber?: number;

  @DeleteDateColumn({ name: "deleted_at", type: "timestamp" })
  deletedAt?: Date;

  @Column({ name: "synced_at", type: "timestamp" })
  syncedAt?: Date;

  @Column({ name: "created_at", type: "timestamp" })
  createdAt?: Date;

  @Column({ name: "creation_date_number", type: "bigint" })
  creationDateNumber?: number;

  @Column({ name: "creation_generated_at", type: "timestamp" })
  creationGeneratedAt?: Date;

  @Column({ name: "updated_at", type: "timestamp" })
  updatedAt?: Date;

  @Column({
    name: "discount_global",
    type: "decimal",
    transformer: new DecimalTransformer(),
  })
  discountGlobal?: number;
}
