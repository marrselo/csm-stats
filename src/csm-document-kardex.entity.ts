import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("war_document_kardex", { schema: "dp6_product_quipu_pro" })
export class WarDocumentKardex {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("int", { name: "document_id", nullable: true, unsigned: true })
  documentId: number | null;

  @Column("text", {
    name: "document_number",
    nullable: true,
    comment: "Número de documento relacionado",
  })
  documentNumber: string | null;

  @Column("text", {
    name: "entity_name",
    nullable: true,
    comment: "Referencia de la entidad (cliente o proveedor)",
  })
  entityName: string | null;

  @Column("int", {
    name: "user_id",
    nullable: true,
    comment: "Referencia a ID del usuario",
  })
  userId: number | null;

  @Column("int", {
    name: "document_type_id",
    nullable: true,
    comment: "Tipo de movimiento del kardex",
  })
  documentTypeId: number | null; // war_ms_type_documents -> ms_type_document

  @Column("text", {
    name: "document_type_name",
    nullable: true,
    comment: "Nombre de tipo de documento relacionado",
  })
  documentTypeName: string | null;

  @Column("datetime", { name: "operation_date", nullable: true })
  operationDate: Date | null;

  @Column("json", { name: "aditional_information", nullable: true })
  aditionalInformation: object | null;

  @Column("datetime", { name: "due_date", nullable: true })
  dueDate: Date | null;

  @Column("int", {
    name: "total_details",
    nullable: true,
    comment:
      "Número de registros en la tabla detalle relacionadas al documento del kardex.",
    default: () => "'0'",
  })
  totalDetails: number | null;

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

  @Column("text", { name: "id_reference" })
  idReference: string;

  @Column("json", { name: "logs", nullable: true })
  logs: object | null;

  @Column("int", {
    name: "status",
    nullable: true,
    comment: "1 iniciado, 2 pendiente, 3 finalizado, 4 error",
    default: () => "'3'",
  })
  status: number | null;
}
