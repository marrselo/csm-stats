import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn } from 'typeorm'

@Entity('war_products', { synchronize: false })
export class WarProduct {
	@PrimaryGeneratedColumn()
	id?: number

	@Column({ nullable: true })
	slug?: string

	@Column({ name: 'price_sale_min', nullable: true })
	priceSaleMin?: number

	@Column({ name: 'price_sale_max', nullable: true, default: 0.0 })
	priceSaleMax?: number

	@Column({ name: 'code_product_cubso', nullable: true })
	codeProductCubso?: string

	@Column({ name: 'product_parent_id', nullable: true })
	productParentId?: number

	@Column({ nullable: true })
	name?: string

	@Column({ nullable: true })
	description?: string

	@Column({ name: 'additional_information', nullable: true, type: 'json' })
	additionalInformation?: any

	@Column({ name: 'category_id', nullable: true })
	categoryId?: number

	@Column({ name: 'e_commerces', nullable: true, type: 'json' })
	eCommerces?: any

	@Column({ nullable: true })
	price?: number

	@Column({ nullable: true, default: 0.0 })
	cost?: number

	@Column({ name: 'last_cost', nullable: true, default: 0.0 })
	lastCost?: number

	@Column({ name: 'flag_avg_cost', nullable: true, default: 0 })
	flagAvgCost?: number

	@Column({ name: 'flag_tax_cost', nullable: true, default: 0 })
	flagTaxCost?: number

	@Column({ name: 'tax_cost_percentage', nullable: true, default: 0.0 })
	taxCostPercentage?: number

	@Column({ nullable: true, default: 0.0 })
	stock?: number

	@Column({ name: 'stock_reserved', nullable: true, default: 0.0 })
	stockReserved?: number

	@Column({ name: 'stock_virtual', nullable: true, default: 0.0 })
	stockVirtual?: number

	@Column({ nullable: true })
	type?: number

	@Column({ name: 'group_type', nullable: true, default: 3 })
	groupType?: number

	@Column({})
	code: string

	@Column({ name: 'alternate_code', nullable: true, type: 'json' })
	alternateCode?: any

	@Column({ name: 'auto_barcode' })
	autoBarcode: string

	@Column({ name: 'unit_id', nullable: true })
	unitId?: number

	@Column({ name: 'brand_sp_id', nullable: true })
	brandSpId?: number

	@Column({ name: 'url_image', nullable: true })
	urlImage?: string

	@Column({ nullable: true, type: 'json' })
	banners?: any

	@Column({ name: 'external_code', nullable: true })
	externalCode?: string

	@Column({ name: 'weigth_type', nullable: true })
	weigthType?: string

	@Column({ nullable: true })
	weigth?: number

	@Column({ name: 'price_list', nullable: true, type: 'json' })
	priceList?: any

	@Column({ nullable: true })
	conversions?: string

	@Column({ nullable: true })
	lot?: string

	@Column({ name: 'due_date', nullable: true, type: 'datetime' })
	dueDate?: Date

	@Column({ nullable: true })
	score?: number

	@Column({ nullable: true, type: 'json' })
	features?: any

	@Column({ name: 'inline_features', nullable: true })
	inlineFeatures?: string

	@Column({ name: 'inline_alternate_code', nullable: true })
	inlineAlternateCode?: string

	@Column({ name: 'is_public', nullable: true, default: 0 })
	isPublic?: number

	@Column({ name: 'price_old', nullable: true })
	priceOld?: number

	@Column({ name: 'sub_category_id', nullable: true })
	subCategoryId?: number

	@Column({ name: 'flag_igv', nullable: true, default: 1 })
	flagIgv?: number

	@Column({ name: 'flag_not_control_inventory', nullable: true, default: 0 })
	flagNotControlInventory?: number

	@Column({ name: 'flag_stock_negative', nullable: true, default: 0 })
	flagStockNegative?: number

	@Column({ name: 'flag_flow_manufactured', nullable: true, default: 0 })
	flagFlowManufactured?: number

	@Column({ name: 'flag_lots_enabled', nullable: true, default: 0 })
	flagLotsEnabled?: number

	@Column({ name: 'cms_product_id', nullable: true })
	cmsProductId?: number

	@Column({ name: 'flag_type_unit', nullable: true, default: 1 })
	flagTypeUnit?: number

	@Column({ name: 'code_retention', nullable: true })
	codeRetention?: string

	@Column({ name: 'type_category', nullable: true, default: 1 })
	typeCategory?: number

	@Column({ name: 'warranty_quantity', nullable: true, default: 0 })
	warrantyQuantity?: number

	@Column({ name: 'warranty_frequency', nullable: true, default: 0 })
	warrantyFrequency?: number

	@Column({ nullable: true })
	model?: string

	@Column({ nullable: true })
	rating?: number

	@Column({ name: 'number_visit', nullable: true, default: 0 })
	numberVisit?: number

	@Column({ nullable: true, type: 'json' })
	tags?: any

	@Column({ nullable: true, type: 'json' })
	filters?: any

	@Column({ nullable: true })
	sections?: string

	@Column({ name: 'e_categories', nullable: true, type: 'json' })
	eCategories?: any

	@Column({ name: 'price_discount', nullable: true })
	priceDiscount?: number

	@Column({ name: 'flag_ecommerce', nullable: true })
	flagEcommerce?: number

	@Column({ name: 'products_related', nullable: true, type: 'json' })
	productsRelated?: any

	@Column({ name: 'flag_control_serie', nullable: true, default: 0 })
	flagControlSerie?: number

	@Column({ name: 'company_id', nullable: true })
	companyId?: number

	@Column({ name: 'subsidiary_id', nullable: true })
	subsidiaryId?: number

	@Column({ name: 'origin_platform', nullable: true })
	originPlatform?: number

	@Column({ name: 'sync_status', nullable: true })
	syncStatus?: number

	@Column({ name: 'last_sync', nullable: true, type: 'timestamp' })
	lastSync?: Date

	@Column({ name: 'flag_sales', nullable: true, default: 0 })
	flagSales?: number

	@Column({ name: 'flag_loyalti', nullable: true, default: 0 })
	flagLoyalti?: number

	@Column({ name: 'accounting_account', nullable: true, type: 'json' })
	accountingAccount?: any

	@Column({ name: 'conversion_stock', nullable: true, type: 'json' })
	conversionStock?: any

	@Column({ name: 'price_soles', nullable: true })
	priceSoles?: number

	@DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
	deletedAt?: Date
}
