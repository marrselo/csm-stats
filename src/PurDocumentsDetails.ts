import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";

@Index("com_cost_center_pur_documents_details_id", ["costCenterId"], {})
@Index(
  "pur_documents_details_purchase_document_id_foreign",
  ["purchaseDocumentId"],
  {}
)
@Entity("pur_documents_details", { schema: "dp6_quipu_prod" })
export class PurDocumentsDetails {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("int", {
    name: "purchase_document_id",
    nullable: true,
    unsigned: true,
  })
  purchaseDocumentId: number | null;

  @Column("varchar", { name: "currency", nullable: true, length: 255 })
  currency: string | null;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("varchar", { name: "commentary", nullable: true, length: 255 })
  commentary: string | null;

  @Column("int", { name: "pur_documents_id", nullable: true })
  purDocumentsId: number | null;

  @Column("text", { name: "documents_number", nullable: true })
  documentsNumber: string | null;

  @Column("tinyint", { name: "flag_dispatch", nullable: true, })
  flagDispatch: boolean | null;

  @Column("tinyint", { name: "flag_use", nullable: true, })
  flagUse: boolean | null;

  @Column("int", { name: "war_warehouses_id", nullable: true })
  warWarehousesId: number | null;

  @Column("text", { name: "category_name", nullable: true })
  categoryName: string | null;

  @Column("decimal", {
    name: "unit_quantity",
    nullable: true,
    precision: 18,
    scale: 4,
    default: () => "'0.0000'",
  })
  unitQuantity: string | null;

  @Column("text", { name: "unit_name", nullable: true })
  unitName: string | null;

  @Column("text", { name: "unit_code", nullable: true })
  unitCode: string | null;

  @Column("decimal", {
    name: "unit_conversion",
    nullable: true,
    precision: 18,
    scale: 4,
    default: () => "'0.0000'",
  })
  unitConversion: string | null;

  @Column("int", { name: "brand_id", nullable: true })
  brandId: number | null;

  @Column("int", {
    name: "brand_sp_id",
    nullable: true,
    comment: "Referencia de marca es simple para compa-ias configuradas",
  })
  brandSpId: number | null;

  @Column("text", { name: "brand_name", nullable: true })
  brandName: string | null;

  @Column("int", { name: "unit_id", nullable: true })
  unitId: number | null;

  @Column("decimal", {
    name: "tax_amount",
    nullable: true,
    precision: 18,
    scale: 4,
    default: () => "'0.0000'",
  })
  taxAmount: string | null;

  @Column("decimal", {
    name: "tax",
    nullable: true,
    precision: 18,
    scale: 4,
    default: () => "'0.0000'",
  })
  tax: string | null;

  @Column("text", { name: "code_taxes", nullable: true })
  codeTaxes: string | null;

  @Column("decimal", {
    name: "stock_quantity",
    nullable: true,
    precision: 18,
    scale: 4,
    default: () => "'0.0000'",
  })
  stockQuantity: string | null;

  @Column("decimal", {
    name: "discount_percentage",
    nullable: true,
    precision: 18,
    scale: 4,
    default: () => "'0.0000'",
  })
  discountPercentage: string | null;

  @Column("decimal", {
    name: "discount_amount",
    nullable: true,
    precision: 18,
    scale: 4,
    default: () => "'0.0000'",
  })
  discountAmount: string | null;

  @Column("decimal", {
    name: "quantity",
    nullable: true,
    precision: 18,
    scale: 4,
    default: () => "'0.0000'",
  })
  quantity: string | null;

  @Column("decimal", { name: "price", nullable: true, precision: 18, scale: 7 })
  price: string | null;

  @Column("decimal", {
    name: "subtotal_without_tax",
    nullable: true,
    precision: 18,
    scale: 4,
    default: () => "'0.0000'",
  })
  subtotalWithoutTax: string | null;

  @Column("int", { name: "product_id", nullable: true })
  productId: number | null;

  @Column("text", { name: "product_code", nullable: true })
  productCode: string | null;

  @Column("json", { name: "alternate_code", nullable: true })
  alternateCode: object | null;

  @Column("int", { name: "product_type", nullable: true })
  productType: number | null;

  @Column("timestamp", { name: "closed_at", nullable: true })
  closedAt: Date | null;

  @Column("json", { name: "additional_information", nullable: true })
  additionalInformation: object | null;

  @Column("int", { name: "cost_center_id", nullable: true, unsigned: true })
  costCenterId: number | null;

  @Column("varchar", { name: "cost_center_code", nullable: true, length: 255 })
  costCenterCode: string | null;

  @Column("decimal", {
    name: "total_refund",
    nullable: true,
    comment: "Monto de devolucion por items",
    precision: 18,
    scale: 4,
    default: () => "'0.0000'",
  })
  totalRefund: string | null;

  @Column("decimal", {
    name: "quantity_refund",
    nullable: true,
    comment: "Cantidad de devolucion por items",
    precision: 18,
    scale: 4,
    default: () => "'0.0000'",
  })
  quantityRefund: string | null;

  @Column("int", { name: "company_id", nullable: true })
  companyId: number | null;

  @Column("tinyint", { name: "flag_active", default: () => "'1'" })
  flagActive: boolean;

  @Column("timestamp", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("timestamp", {
    name: "updated_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;
}
