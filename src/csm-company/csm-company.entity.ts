import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm'

@Entity('com_companies', { schema: 'dp6_quipu_prod' })
export class ComCompanies {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ name: 'flag_test', type: 'tinyint' })
	flagTest?: number

	@Column({ name: 'com_item_id', type: 'int' })
	comItemId?: number

	@Column({ name: 'code', type: 'varchar' })
	code?: string

	@Column({ name: 'company_id', type: 'int' })
	companyId?: number

	@Column({ name: 'flag_master', type: 'tinyint' })
	flagMaster?: number

	@Column({ name: 'flag_loyalti', type: 'tinyint' })
	flagLoyalti?: number

	@Column({ name: 'credential', type: 'varchar' })
	credential?: string

	@Column({ name: 'company_name', type: 'varchar' })
	companyName?: string

	@Column({ name: 'address', type: 'varchar' })
	address?: string

	@Column({ name: 'company_rz_social', type: 'varchar' })
	companyRzSocial?: string

	@Column({ name: 'quotation_report_code', type: 'varchar' })
	quotationReportCode?: string

	@Column({ name: 'sale_report_code', type: 'varchar' })
	saleReportCode?: string

	@Column({ name: 'commerce_code', type: 'varchar' })
	commerceCode?: string

	@Column({ name: 'area_code', type: 'varchar' })
	areaCode?: string

	@Column({ name: 'currency', type: 'varchar' })
	currency?: string

	@Column({ name: 'email', type: 'varchar' })
	email?: string

	@Column({ name: 'language_id', type: 'varchar' })
	languageId?: string

	@Column({ name: 'language_json', type: 'json' })
	languageJson?: any

	@Column({ name: 'logo', type: 'varchar' })
	logo?: string

	@Column({ name: 'com_country_id', type: 'int' })
	comCountryId?: number

	@Column({ name: 'city_id', type: 'int' })
	cityId?: number

	@Column({ name: 'ruc', type: 'varchar' })
	ruc?: string

	@Column({ name: 'website', type: 'varchar' })
	website?: string

	@Column({ name: 'website_description', type: 'varchar' })
	websiteDescription?: string

	@Column({ name: 'company_plan', type: 'json' })
	companyPlan?: any

	@Column({ name: 'phone', type: 'varchar' })
	phone?: string

	@Column({ name: 'url_image', type: 'json' })
	urlImage?: any

	@Column({ name: 'bank_account', type: 'json' })
	bankAccount?: any

	@Column({ name: 'weight', type: 'varchar' })
	weight?: string

	@Column({ name: 'convert_weight_to', type: 'varchar' })
	convertWeightTo?: string

	@Column({ name: 'banners', type: 'json' })
	banners?: any

	@Column({ name: 'settings', type: 'json' })
	settings?: any

	@Column({ name: 'theme', type: 'json' })
	theme?: any

	@Column({ name: 'additional_information', type: 'json' })
	additionalInformation?: any

	@Column({ name: 'flag_plan', type: 'tinyint' })
	flagPlan?: number

	@Column({ name: 'flag_igv', type: 'tinyint' })
	flagIgv?: number

	@Column({ name: 'flag_update_price', type: 'tinyint' })
	flagUpdatePrice?: number

	@Column({ name: 'flag_barcode_reader', type: 'tinyint' })
	flagBarcodeReader?: number

	@Column({ name: 'flag_account', type: 'tinyint' })
	flagAccount?: number

	@Column({ name: 'flag_automatic_routes_close', type: 'tinyint' })
	flagAutomaticRoutesClose?: number

	@Column({ name: 'hour_of_close', type: 'text' })
	hourOfClose?: string

	@Column({ name: 'acl_id', type: 'int' })
	aclId?: number

	@Column({ name: 'acl_code', type: 'varchar' })
	aclCode?: string

	@Column({ name: 'color_code', type: 'text' })
	colorCode?: string

	@Column({ name: 'template_code', type: 'text' })
	templateCode?: string

	@Column({ name: 'social_media', type: 'json' })
	socialMedia?: any

	@Column({ name: 'config_integration', type: 'json' })
	configIntegration?: any

	@Column({ name: 'plans', type: 'json' })
	plans?: any

	@Column({ name: 'flag_active', type: 'tinyint' })
	flagActive?: number

	@DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
	deletedAt?: Date

	@Column({ name: 'created_at', type: 'timestamp' })
	createdAt?: Date

	@Column({ name: 'updated_at', type: 'timestamp' })
	updatedAt?: Date
}
