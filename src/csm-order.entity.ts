import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("bank_account_id_sal_orders_fk", ["bankAccountId"], {})
@Index("company_id", ["companyId"], {})
@Index("company_id_order_annex_id", ["companyId", "orderAnnexId"], {})
@Index("customer_bill_id_sal_orders_fk", ["customerBillId"], {})
@Index("customer_order_state_fk", ["customerId"], {})
@Index("order_state_id_fk", ["orderStateId"], {})
@Index("sal_orders_annex_order_annex_id", ["orderAnnexId"], {})
@Index("sal_orders_customer_address_id", ["customerAddressId"], {})
@Index("sal_orders_delivery_id", ["deliveryId"], {})
@Index("sal_orders_employee_id", ["employeeId"], {})
@Index("sal_orders_order_pick_state", ["orderPickState"], {})
@Index("sal_orders_route_id", ["routeId"], {})
@Index("sal_orders_way_payment_id_foreign", ["wayPaymentId"], {})
@Index(
  "search_sal_orders",
  ["channel", "warehouseName", "warehouseAddress", "comments"],
  {
    fulltext: true,
  },
)
@Index("subsidiary_order_state_fk", ["subsidiaryId"], {})
@Index("terminal_id_sal_orders", ["terminalId"], {})
@Index("type_document_id_sal_orders", ["typeDocumentId"], {})
@Entity("sal_orders", { schema: "dp6_quipu_prod" })
export class SalOrders {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "code_app", nullable: true, length: 255 })
  codeApp: string | null;

  @Column("text", { name: "reference_external", nullable: true })
  referenceExternal: string | null;

  @Column("text", { name: "type_order_code", nullable: true })
  typeOrderCode: string | null;

  @Column("int", { name: "number", nullable: true })
  number: number | null;

  @Column("text", { name: "channel", nullable: true })
  channel: string | null;

  @Column("int", {
    name: "flag_kardex",
    nullable: true,
    comment: "1: Aún no se mueve, 2: Ya se movió",
    default: () => "'1'",
  })
  flagKardex: number | null;

  @Column("tinyint", {
    name: "flag_sale",
    nullable: true,
    comment: "Documento de Venta: 0 Sin Convertir - 1 Convertido",
    default: () => "'0'",
  })
  flagSale: boolean | null;

  @Column("tinyint", {
    name: "flag_guides",
    nullable: true,
    default: () => "'0'",
  })
  flagGuides: boolean | null;

  @Column("int", { name: "order_state_id", nullable: true, unsigned: true })
  orderStateId: number | null;

  @Column("tinyint", {
    name: "flag_pick_up",
    nullable: true,
    comment: "1: Domicilio, 2: Tienda",
  })
  flagPickUp: boolean | null;

  @Column("text", { name: "pick_up_name", nullable: true })
  pickUpName: string | null;

  @Column("int", {
    name: "order_pick_state",
    nullable: true,
    unsigned: true,
    default: () => "'1'",
  })
  orderPickState: number | null;

  @Column("int", { name: "route_id", nullable: true, unsigned: true })
  routeId: number | null;

  @Column("int", {
    name: "route_customer_id",
    nullable: true,
    comment: "Referencia de pedidos por ruta de clientes.",
    unsigned: true,
  })
  routeCustomerId: number | null;

  @Column("varchar", { name: "route_name", nullable: true, length: 255 })
  routeName: string | null;

  @Column("int", {
    name: "route_sort",
    nullable: true,
    comment: "Ordernar pedidos por detalle de ruta relacionada",
    default: () => "'0'",
  })
  routeSort: number | null;

  @Column("decimal", {
    name: "weight",
    nullable: true,
    precision: 18,
    scale: 4,
    default: () => "'0.0000'",
  })
  weight: string | null;

  @Column("int", {
    name: "route_id_pick_up",
    nullable: true,
    comment: "Ruta de Recojo",
  })
  routeIdPickUp: number | null;

  @Column("json", { name: "responsible_pick_up", nullable: true })
  responsiblePickUp: object | null;

  @Column("int", { name: "customer_bill_id", nullable: true, unsigned: true })
  customerBillId: number | null;

  @Column("tinyint", {
    name: "flag_bill",
    nullable: true,
    comment: "true: emite facturacion, false: no emite factura",
    default: () => "'0'",
  })
  flagBill: boolean | null;

  @Column("json", { name: "data_bill", nullable: true })
  dataBill: object | null;

  @Column("text", { name: "document_number_relate", nullable: true })
  documentNumberRelate: string | null;

  @Column("tinyint", { name: "flag_document", nullable: true})
  flagDocument: boolean | null;

  @Column("int", { name: "way_payment_id", nullable: true, unsigned: true })
  wayPaymentId: number | null;

  @Column("text", {
    name: "way_payment_detail_code",
    nullable: true,
    comment: "Guarda el código del tipo de pago. Ej: POS-VISA, XCHANGE, etc",
  })
  wayPaymentDetailCode: string | null;

  @Column("int", { name: "subsidiary_id", nullable: true, unsigned: true })
  subsidiaryId: number | null;

  @Column("int", { name: "warehouse_id", nullable: true })
  warehouseId: number | null;

  @Column("text", { name: "warehouse_name", nullable: true })
  warehouseName: string | null;

  @Column("text", { name: "warehouse_address", nullable: true })
  warehouseAddress: string | null;

  @Column("int", { name: "customer_id", nullable: true, unsigned: true })
  customerId: number | null;

  @Column("int", { name: "employee_id", nullable: true, unsigned: true })
  employeeId: number | null;

  @Column("int", {
    name: "user_id",
    nullable: true,
    comment:
      "Campo de auditoria que almacena el id del empleado que registro el pedido",
    unsigned: true,
  })
  userId: number | null;

  @Column("int", { name: "guide_id", nullable: true })
  guideId: number | null;

  @Column("int", {
    name: "flag_status_order",
    nullable: true,
    comment: "1: Realizada, 2: Procesada, 3: Procesada y notificada.",
    default: () => "'1'",
  })
  flagStatusOrder: number | null;

  @Column("int", {
    name: "sync_status",
    nullable: true,
    comment: "1: pendiente de sync, 2: sincronizado",
    unsigned: true,
    default: () => "'1'",
  })
  syncStatus: number | null;

  @Column("int", { name: "bank_account_id", nullable: true, unsigned: true })
  bankAccountId: number | null;

  @Column("int", {
    name: "customer_address_id",
    nullable: true,
    unsigned: true,
  })
  customerAddressId: number | null;

  @Column("json", { name: "delivery_address", nullable: true })
  deliveryAddress: object | null;

  @Column("datetime", { name: "delivery_date", nullable: true })
  deliveryDate: Date | null;

  @Column("decimal", {
    name: "delivery_price",
    nullable: true,
    precision: 18,
    scale: 2,
  })
  deliveryPrice: string | null;

  @Column("json", { name: "delivery_json", nullable: true })
  deliveryJson: object | null;

  @Column("decimal", {
    name: "distance",
    nullable: true,
    precision: 18,
    scale: 2,
    default: () => "'0.00'",
  })
  distance: string | null;

  @Column("int", { name: "payment_state_id", nullable: true, unsigned: true })
  paymentStateId: number | null;

  @Column("text", { name: "comments", nullable: true })
  comments: string | null;

  @Column("json", { name: "additional_info", nullable: true })
  additionalInfo: object | null;

  @Column("decimal", {
    name: "cost_shipping",
    nullable: true,
    comment: "monto total de costo de envio",
    precision: 18,
    scale: 2,
    default: () => "'0.00'",
  })
  costShipping: string | null;

  @Column("decimal", {
    name: "cost_shipping_tax_amount",
    nullable: true,
    precision: 15,
    scale: 2,
    default: () => "'0.00'",
  })
  costShippingTaxAmount: string | null;

  @Column("decimal", {
    name: "cost_shipping_tax",
    nullable: true,
    precision: 10,
    scale: 2,
    default: () => "'0.00'",
  })
  costShippingTax: string | null;

  @Column("tinyint", {
    name: "cost_shipping_flag_tax",
    nullable: true,
    default: () => "'0'",
  })
  costShippingFlagTax: boolean | null;

  @Column("decimal", { name: "taxes", nullable: true, precision: 18, scale: 2 })
  taxes: string | null;

  @Column("text", { name: "currency", nullable: true })
  currency: string | null;

  @Column("decimal", {
    name: "subtotal",
    nullable: true,
    precision: 18,
    scale: 2,
  })
  subtotal: string | null;

  @Column("decimal", {
    name: "discount",
    nullable: true,
    precision: 18,
    scale: 2,
  })
  discount: string | null;

  @Column("decimal", { name: "total", nullable: true, precision: 18, scale: 2 })
  total: string | null;

  @Column("json", { name: "session_gateway", nullable: true })
  sessionGateway: object | null;

  @Column("text", { name: "token_gateway", nullable: true })
  tokenGateway: string | null;

  @Column("text", { name: "merchant_id", nullable: true })
  merchantId: string | null;

  @Column("json", { name: "gateway_authorization_response", nullable: true })
  gatewayAuthorizationResponse: object | null;

  @Column("text", { name: "gateway_error_code", nullable: true })
  gatewayErrorCode: string | null;

  @Column("tinyint", {
    name: "flag_involve_stock",
    nullable: true,
    default: () => "'0'",
  })
  flagInvolveStock: boolean | null;

  @Column("int", {
    name: "send_kardex_status",
    nullable: true,
    comment:
      "Estados: 1. Pendiente, 2. En proceso, 3. Despachado, 4. No despachable",
    default: () => "'1'",
  })
  sendKardexStatus: number | null;

  @Column("tinyint", {
    name: "flag_approval",
    nullable: true,
    default: () => "'0'",
  })
  flagApproval: boolean | null;

  @Column("json", { name: "state_logs", nullable: true })
  stateLogs: object | null;

  @Column("int", { name: "company_id", nullable: true, unsigned: true })
  companyId: number | null;

  @Column("int", { name: "commerce_id", nullable: true, unsigned: true })
  commerceId: number | null;

  @Column("int", { name: "delivery_id", nullable: true, unsigned: true })
  deliveryId: number | null;

  @Column("tinyint", {
    name: "flag_money_taken_driver",
    nullable: true,
    comment: "Flag que indica si el repartidor recibió la totalidad del pedido",
    default: () => "'0'",
  })
  flagMoneyTakenDriver: boolean | null;

  @Column("decimal", {
    name: "amount_collect_driver",
    nullable: true,
    comment: "Monto que recibe el repartidor del cliente final",
    precision: 10,
    scale: 2,
  })
  amountCollectDriver: string | null;

  @Column("int", {
    name: "liquidation_id_commerce",
    nullable: true,
    unsigned: true,
  })
  liquidationIdCommerce: number | null;

  @Column("int", {
    name: "liquidation_id_delivery",
    nullable: true,
    unsigned: true,
  })
  liquidationIdDelivery: number | null;

  @Column("json", { name: "liquidation_info", nullable: true })
  liquidationInfo: object | null;

  @Column("text", { name: "location_origin", nullable: true })
  locationOrigin: string | null;

  @Column("text", { name: "location_destination", nullable: true })
  locationDestination: string | null;

  @Column("text", { name: "guide_code", nullable: true })
  guideCode: string | null;

  @Column("json", { name: "additional_information", nullable: true })
  additionalInformation: object | null;

  @Column("json", { name: "tracking_information", nullable: true })
  trackingInformation: object | null;

  @Column("int", { name: "origin_platform", nullable: true })
  originPlatform: number | null;

  @Column("int", { name: "type_order", nullable: true, default: () => "'1'" })
  typeOrder: number | null;

  @Column("int", { name: "order_annex_id", nullable: true, unsigned: true })
  orderAnnexId: number | null;

  @Column("int", {
    name: "picking_history_id",
    nullable: true,
    comment: "Referencia de historico de preparacion",
  })
  pickingHistoryId: number | null;

  @Column("tinyint", { name: "flag_active", default: () => "'1'" })
  flagActive: boolean;

  @Column("int", {
    name: "price_change_status",
    comment:
      "1: Pendiente, 2: Aprobado, 3: Rechazado, 4: Aplicado, 5: No aplica",
    unsigned: true,
    default: () => "'5'",
  })
  priceChangeStatus: number;

  @Column("timestamp", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("bigint", {
    name: "created_at_number",
    nullable: true,
    comment: "Campo para filtros equivalente de created_at",
  })
  createdAtNumber: string | null;

  @Column("timestamp", {
    name: "creation_generated_at",
    nullable: true,
    comment:
      "Fecha de creación del registro en la base de datos(fecha de auditoria)",
  })
  creationGeneratedAt: Date | null;

  @Column("timestamp", {
    name: "updated_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @Column("int", { name: "terminal_id", nullable: true, unsigned: true })
  terminalId: number | null;

  @Column("int", { name: "type_document_id", nullable: true, unsigned: true })
  typeDocumentId: number | null;

  @Column("varchar", { name: "serie", nullable: true, length: 255 })
  serie: string | null;

  @Column("varchar", { name: "document_number", nullable: true, length: 255 })
  documentNumber: string | null;

  @Column("int", {
    name: "type_distribution_id",
    nullable: true,
    comment: "Id de la tabla maestra asociada",
  })
  typeDistributionId: number | null;

  @Column("int", {
    name: "transport_agency_id",
    nullable: true,
    comment: "Id de la tabla maestra asociada",
  })
  transportAgencyId: number | null;

  @Column("int", { name: "delivery_id_2", nullable: true })
  deliveryId_2: number | null;
}
