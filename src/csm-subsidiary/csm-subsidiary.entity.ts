import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm'

@Entity('com_subsidiaries', { schema: 'dp6_quipu_prod' })
export class ComSubsidiaries {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ name: 'sucursal_name', type: 'varchar' })
	sucursalName?: string

	@Column({ name: 'rz_social', type: 'text' })
	rzSocial?: string

	@Column({ name: 'ruc', type: 'text' })
	ruc?: string

	@Column({ name: 'location', type: 'text' })
	location?: any

	@Column({ name: 'ubigeo', type: 'varchar' })
	ubigeo?: string

	@Column({ name: 'sucursal_code', type: 'varchar' })
	sucursalCode?: string

	@Column({ name: 'phone', type: 'varchar' })
	phone?: string

	@Column({ name: 'address', type: 'text' })
	address?: string

	@Column({ name: 'district_id', type: 'int' })
	districtId?: number

	@Column({ name: 'province_id', type: 'int' })
	provinceId?: number

	@Column({ name: 'department_id', type: 'int' })
	departmentId?: number

	@Column({ name: 'contact_name', type: 'varchar' })
	contactName?: string

	@Column({ name: 'contact_lastname', type: 'varchar' })
	contactLastname?: string

	@Column({ name: 'email', type: 'varchar' })
	email?: string

	@Column({ name: 'url_image', type: 'varchar' })
	urlImage?: string

	@Column({ name: 'url_logo', type: 'text' })
	urlLogo?: string

	@Column({ name: 'website_description', type: 'json' })
	websiteDescription?: any

	@Column({ name: 'flag_taxes', type: 'int' })
	flagTaxes?: number

	@Column({ name: 'type_billing_agreed', type: 'text' })
	typeBillingAgreed?: string

	@Column({ name: 'date_cron_billing', type: 'datetime' })
	dateCronBilling?: Date

	@Column({ name: 'date_cron_pending_billing', type: 'datetime' })
	dateCronPendingBilling?: Date

	@Column({ name: 'date_cron_unsuscribe_billing', type: 'datetime' })
	dateCronUnsuscribeBilling?: Date

	@Column({ name: 'date_cron_last_week_billing', type: 'datetime' })
	dateCronLastWeekBilling?: Date

	@Column({ name: 'date_cron_last_week_notes_billing', type: 'datetime' })
	dateCronLastWeekNotesBilling?: Date

	@Column({ name: 'flag_billing_cron', type: 'tinyint' })
	flagBillingCron?: number

	@Column({ name: 'flag_account', type: 'tinyint' })
	flagAccount?: number

	@Column({ name: 'flag_accounting_automatic', type: 'tinyint' })
	flagAccountingAutomatic?: number

	@Column({ name: 'flag_accounting_engine', type: 'tinyint' })
	flagAccountingEngine?: number

	@Column({ name: 'special_contributor', type: 'text' })
	specialContributor?: string

	@Column({ name: 'debts_sales', type: 'json' })
	debtsSales?: any

	@Column({ name: 'type_ambient_tax', type: 'int' })
	typeAmbientTax?: number

	@Column({ name: 'flag_credit_dispatch', type: 'tinyint' })
	flagCreditDispatch?: number

	@Column({ name: 'flag_default', type: 'tinyint' })
	flagDefault?: number

	@Column({ name: 'rise', type: 'text' })
	rise?: string

	@Column({ name: 'settings', type: 'json' })
	settings?: any

	@Column({ name: 'token_store', type: 'text' })
	tokenStore?: string

	@Column({ name: 'subsidiary_acl_code', type: 'text' })
	subsidiaryAclCode?: string

	@Column({ name: 'flag_integrations', type: 'tinyint' })
	flagIntegrations?: number

	@Column({ name: 'company_id', type: 'int' })
	companyId?: number

	@Column({ name: 'config_integrations', type: 'json' })
	configIntegrations?: any

	@Column({ name: 'flag_company_default', type: 'tinyint' })
	flagCompanyDefault?: number

	@Column({ name: 'sales_cron_date', type: 'datetime' })
	salesCronDate?: Date

	@Column({ name: 'flag_active', type: 'tinyint' })
	flagActive?: number

	@DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
	deletedAt?: Date

	@Column({ name: 'created_at', type: 'timestamp' })
	createdAt?: Date

	@Column({ name: 'updated_at', type: 'timestamp' })
	updatedAt?: Date

	@Column({ name: 'subsidiary_id', type: 'int' })
	subsidiaryId?: number

	@Column({ name: 'distributor_customer_id', type: 'int' })
	distributorCustomerId?: number
}
