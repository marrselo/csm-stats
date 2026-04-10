import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";

@Index("com_ms_type_documents_com_country_id_foreign", ["comCountryId"], {})
@Index("flag_type", ["flagType"], {})
@Entity("com_ms_type_documents", { schema: "dp6_quipu_prod" })
export class ComMsTypeDocuments {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("int", { name: "type_document_id", nullable: true, unsigned: true })
  typeDocumentId: number | null;

  @Column("int", { name: "com_country_id", nullable: true, unsigned: true })
  comCountryId: number | null;

  @Column("varchar", { name: "name", nullable: true, length: 255 })
  name: string | null;

  @Column("int", {
    name: "flag_type",
    nullable: true,
    comment: "1 Ventas - 2 Compras",
  })
  flagType: number | null;

  @Column("varchar", { name: "code", nullable: true, length: 6 })
  code: string | null;

  @Column("text", { name: "code_taxes", nullable: true })
  codeTaxes: string | null;

  @Column("text", { name: "summary_code", nullable: true })
  summaryCode: string | null;

  @Column("text", {
    name: "qp_code",
    nullable: true,
    comment: "Prefijo de tipo de documento en FES",
  })
  qpCode: string | null;

  @Column("varchar", { name: "description", nullable: true, length: 255 })
  description: string | null;

  @Column("json", { name: "settings", nullable: true })
  settings: object | null;

  @Column("tinyint", { name: "include_in_list", nullable: true, width: 1 })
  includeInList: boolean | null;

  @Column("int", { name: "flag_fee", nullable: true, default: () => "'1'" })
  flagFee: number | null;

  @Column("tinyint", {
    name: "flag_convert_document",
    nullable: true,
    comment: "Permitir convertir documentos",
    width: 1,
  })
  flagConvertDocument: boolean | null;

  @Column("tinyint", {
    name: "flag_display_transfer",
    nullable: true,
    comment: "Permitir movimineto de transacciones cash/bank",
    width: 1,
  })
  flagDisplayTransfer: boolean | null;

  @Column("tinyint", { name: "flag_active", width: 1, default: () => "'1'" })
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

  @Column("tinyint", {
    name: "flag_include_notes",
    nullable: true,
    width: 1,
    default: () => "'0'",
  })
  flagIncludeNotes: boolean | null;
}
