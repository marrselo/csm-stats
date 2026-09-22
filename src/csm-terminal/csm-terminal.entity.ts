import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm'

@Entity('sal_terminals', { schema: 'dp6_quipu_prod' })
export class SalTerminal {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ name: 'com_subsidiaries_id', type: 'int' })
	comSubsidiariesId?: number

	@Column({ name: 'war_warehouses_id', type: 'int' })
	warWarehousesId?: number

	@Column({ name: 'war_warehouses_name', type: 'text' })
	warWarehousesName?: string

	@Column({ name: 'sal_type_terminals_id', type: 'int' })
	salTypeTerminalsId?: number

	@Column({ name: 'type_terminal', type: 'int' })
	typeTerminal?: number

	@Column({ name: 'type_device', type: 'int' })
	typeDevice?: number

	@Column({ name: 'flag_sale_offline', type: 'tinyint' })
	flagSaleOffline?: number

	@Column({ name: 'code', type: 'varchar' })
	code?: string

	@Column({ name: 'sunat_code', type: 'varchar' })
	sunatCode?: string

	@Column({ name: 'code_taxes', type: 'varchar' })
	codeTaxes?: string

	@Column({ name: 'name', type: 'varchar' })
	name?: string

	@Column({ name: 'description', type: 'varchar' })
	description?: string

	@Column({ name: 'print_code', type: 'varchar' })
	printCode?: string

	@Column({ name: 'ruc', type: 'varchar' })
	ruc?: string

	@Column({ name: 'cash_id', type: 'int' })
	cashId?: number

	@Column({ name: 'authorization_date', type: 'timestamp' })
	authorizationDate?: Date

	@Column({ name: 'flag_ecommerce', type: 'tinyint' })
	flagEcommerce?: number

	@Column({ name: 'flag_admin', type: 'tinyint' })
	flagAdmin?: number

	@Column({ name: 'company_id', type: 'int' })
	companyId?: number

	@Column({ name: 'flag_active', type: 'tinyint' })
	flagActive?: number

	@Column({ name: 'flag_cron', type: 'tinyint' })
	flagCron?: number

	@Column({ name: 'sales_cron_date', type: 'datetime' })
	salesCronDate?: Date

	@DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
	deletedAt?: Date

	@Column({ name: 'created_at', type: 'timestamp' })
	createdAt?: Date

	@Column({ name: 'updated_at', type: 'timestamp' })
	updatedAt?: Date

	@Column({ name: 'session_status_id', type: 'int' })
	sessionStatusId?: number

	@Column({ name: 'commerce_id', type: 'int' })
	commerceId?: number
}
