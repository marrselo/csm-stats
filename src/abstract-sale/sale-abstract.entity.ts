import { Entity, Column, PrimaryGeneratedColumn, Index } from "typeorm";
import { DecimalTransformer } from "../typeorm-transformers/decimal-transaformer";

@Entity("abstract_sale", { schema: "dp6_quipu_prod" })
@Index("idx_abstract_sale_acl_id_created_at", ["aclId", "createdAt"])
export class AbstractSale {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: "sale_id" })
  saleId: number;

  @Column({ name: "acl_id" })
  aclId: number;

  @Column({ name: "warehouse_id" })
  warehouseId: number;

  @Column({ name: "terminal_id" })
  terminalId: number;

  @Column({
    name: "amount",
    type: "decimal",
    precision: 12,
    scale: 2,
    nullable: true,
    transformer: new DecimalTransformer(),
  })
  amount: number;

  @Column({ name: "type" })
  type: number;

  @Column({ name: "state" })
  state: number;

  @Column({ name: "created_at" })
  @Index("idx_abstract_sale_created_at")
  createdAt: number;
}
