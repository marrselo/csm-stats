import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	DeleteDateColumn,
} from 'typeorm'
import { DecimalTransformer } from './typeorm-transformers/decimal-transaformer'

export interface Flag {
	name: string
	code: string
	enable: boolean
}
export interface Metadata {
	name: string
	code: string
	value: any
}

export interface AccountingAccount {
	code: string
	name: string
}
export enum ExpensePeriod {
	NONE = 'none',
	WEEKLY = 'weekly',
	BIWEEKLY = 'biweekly',
	MONTHLY = 'monthly',
	// YEARLY = 'yearly',
}

export enum ExpenseType {
	FIXED = 'fixed',
	VARIABLE = 'variable',
	UNIQUE = 'unique',
}

@Entity('expense', { comment: 'Almacena los gastos de las compañias' })
export class ExpenseEntity {
	@PrimaryGeneratedColumn({ type: 'int', name: 'id' })
	id?: number

	@Column('varchar', { name: 'name', length: 255 })
	name: string

	@Column('varchar', { name: 'description', nullable: true, length: 255 })
	description?: string | null

	@Column('enum', { name: 'type', enum: ExpenseType })
	type: ExpenseType

	@Column('int', {
		name: 'current_status_id',
		nullable: true,
		comment: 'id del estado actual del gasto',
	})
	currentStatusId?: number | null

	@Column('int', {
		name: 'transaction_id',
		nullable: true,
		comment:
			'id de la transacción asociada al ejecutar el gasto (egreso de caja)',
	})
	transactionId?: number | null

	@Column('int', {
		name: 'company_id',
		comment: 'Id de la compañía que creó el gasto',
	})
	companyId: number

	@Column('int', { name: 'warehouse_id' })
	warehouseId: number

	@Column('varchar', {
		name: 'sales_expense_type_code',
		nullable: true,
		comment:
			'código de referencia para el servicio de sales-purchases, es necesario para generar una transacción',
		length: 255,
	})
	salesExpenseTypeCode?: string | null

	@Column('datetime', {
		name: 'period_date',
		comment: 'período del gasto (mensual, semanal, anual, etc)',
	})
	periodDate: Date

	@Column('int', { name: 'template_id', nullable: true })
	templateId?: number | null

	@Column('json', { name: 'metadata', nullable: true })
	metadata?: Metadata[] | null

	@Column('datetime', { name: 'expired_at', nullable: true })
	expiredAt: Date | null

	@CreateDateColumn({
		type: 'datetime',

		name: 'created_at',
		default: () => "'CURRENT_TIMESTAMP(6)'",
	})
	createdAt?: Date

	@UpdateDateColumn({
		type: 'datetime',
		name: 'updated_at',
		default: () => "'CURRENT_TIMESTAMP(6)'",
	})
	updatedAt?: Date

	@DeleteDateColumn({
		type: 'datetime',
		name: 'deleted_at',
		nullable: true,
	})
	deletedAt?: Date | null

	@Column('varchar', {
		name: 'created_by',
		comment: 'email del empleado que creo el gasto',
		length: 255,
	})
	createdBy: string

	@Column('int', { name: 'category_id', nullable: true })
	categoryId?: number | null

	@Column('int', { name: 'sub_category_id', nullable: true })
	subCategoryId?: number | null

	@Column('enum', {
		name: 'period',
		nullable: true,
		enum: ExpensePeriod,
	})
	period?: ExpensePeriod | null

	@Column('varchar', {
		name: 'currency_code',
		comment: 'codigo de la moneda',
		length: 255,
	})
	currencyCode: string

	@Column('json', { name: 'flags', nullable: true })
	flags?: Flag[] | null

	@Column('int', { name: 'projection_id', nullable: true })
	projectionId?: number | null

	@Column('varchar', { name: 'origin', length: 255 })
	origin: string

	@Column('int', { name: 'acl_id' })
	aclId: number

	@Column('decimal', {
		name: 'mount',
		comment: 'monto total monetario del gasto',
		precision: 10,
		scale: 2,
		transformer: new DecimalTransformer(),
	})
	mount: number

	@Column('json', { name: 'url_files', nullable: true })
	urlFiles?: string[] | null

	@Column('text', { name: 'commentary', nullable: true })
	commentary?: string | null

	@Column('int', { name: 'commentary_user', nullable: true })
	commentaryUser?: number | null

	@Column('json', { name: 'additional_information', nullable: true })
	additionalInformation?: any | null

	@Column({ type: 'json', name: 'accounting_account', nullable: true })
	accountingAccount?: AccountingAccount[]

	
}
