import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";

@Index("sal_cash_desk_closing_cash_id_index", ["cashId"], {})
@Index("sal_cash_desk_closing_company_id_index", ["companyId"], {})
@Index(
  "sal_cash_desk_closing_terminal_id_cash_id_company_id_index",
  ["terminalId", "companyId", "cashId"],
  {}
)
@Index(
  "sal_cash_desk_closing_unique_cash_terminal_date_opened_unique",
  ["terminalId", "dateOpened", "companyId", "cashId"],
  { unique: true }
)
@Entity("sal_cash_desk_closing", { schema: "dp6_quipu_prod" })
export class SalCashDeskClosing {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("int", { name: "employee_id", nullable: true })
  employeeId: number | null;

  @Column("decimal", {
    name: "end_amount",
    nullable: true,
    precision: 18,
    scale: 2,
    default: () => "'0.00'",
  })
  endAmount: string | null;

  @Column("decimal", {
    name: "start_amount",
    nullable: true,
    precision: 18,
    scale: 2,
    default: () => "'0.00'",
  })
  startAmount: string | null;

  @Column("int", { name: "terminal_id", nullable: true, unsigned: true })
  terminalId: number | null;

  @Column("int", { name: "closed_employee_id", nullable: true })
  closedEmployeeId: number | null;

  @Column("timestamp", { name: "date_opened", nullable: true })
  dateOpened: Date | null;

  @Column("text", { name: "currency", nullable: true })
  currency: string | null;

  @Column("datetime", { name: "closed_at", nullable: true })
  closedAt: Date | null;

  @Column("int", { name: "company_id", nullable: true })
  companyId: number | null;

  @Column("json", { name: "cash_register_information", nullable: true })
  cashRegisterInformation: object | null;

  @Column("text", {
    name: "hash_offline",
    nullable: true,
    comment: "Hash creado por el mobile al crear un cierre de caja offline",
  })
  hashOffline: string | null;

  @Column("int", { name: "cash_id", nullable: true })
  cashId: number | null;

  @Column("int", {
    name: "close_state",
    nullable: true,
    comment: "1: abierto, 2: cerrado, 3: en proceso, 4: error",
    default: () => "'1'",
  })
  closeState: number | null;

  @Column("int", {
    name: "status_transfers",
    nullable: true,
    comment: "Estado del cierrre de cajo. 1.-Proceso, 2.-Parcial, 3.-Completo",
    default: () => "'1'",
  })
  statusTransfers: number | null;

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
