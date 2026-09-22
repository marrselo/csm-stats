import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm'

@Entity('war_warehouses_products', { schema: 'dp6_product_quipu_pro' })
export class WarWarehousesProducts {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ name: 'warehouse_id', type: 'int' })
	warehouseId: number

	@Column({ name: 'product_id', type: 'int' })
	productId: number

	@Column({ name: 'stock', type: 'decimal' })
	stock?: number

	@Column({ name: 'stock_reserved', type: 'decimal' })
	stockReserved?: number

	@Column({ name: 'location', type: 'text' })
	location?: string

	@Column({ name: 'quantity', type: 'decimal' })
	quantity?: number

	@Column({ name: 'min_stock', type: 'decimal' })
	minStock?: number

	@Column({ name: 'max_stock', type: 'decimal' })
	maxStock?: number

	@Column({ name: 'price_list', type: 'json' })
	priceList?: any

	@Column({ name: 'flag_active', type: 'tinyint' })
	flagActive?: number

	@DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
	deletedAt?: Date

	@Column({ name: 'updated_at', type: 'datetime' })
	updatedAt?: Date

	@Column({ name: 'created_at', type: 'datetime' })
	createdAt?: Date

	@Column({ name: 'brand_id', type: 'int' })
	brandId?: number

	@Column({ name: 'price_cost', type: 'decimal' })
	priceCost?: number

	@Column({ name: 'price_sale', type: 'decimal' })
	priceSale?: number

	@Column({ name: 'observation', type: 'text' })
	observation?: string

	@Column({ name: 'last_date_sale', type: 'datetime' })
	lastDateSale?: Date

	@Column({ name: 'last_date_purchase', type: 'datetime' })
	lastDatePurchase?: Date

	@Column({ name: 'serial', type: 'tinyint' })
	serial?: number

	@Column({ name: 'taxes', type: 'json' })
	taxes?: any

	@Column({ name: 'accounts', type: 'json' })
	accounts?: any

	@Column({ name: 'conversion_stock', type: 'json' })
	conversionStock?: any
}
