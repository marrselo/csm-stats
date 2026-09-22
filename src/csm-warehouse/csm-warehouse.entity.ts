import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm'

@Entity('war_warehouses', { schema: 'dp6_product_quipu_pro' })
export class WarWarehouses {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ name: 'subsidiary_id', type: 'int' })
	subsidiaryId: number

	@Column({ name: 'name', type: 'varchar' })
	name: string

	@Column({ name: 'code', type: 'varchar' })
	code: string

	@Column({ name: 'external_code', type: 'text' })
	externalCode?: string

	@Column({ name: 'code_taxes', type: 'text' })
	codeTaxes?: string

	@Column({ name: 'address', type: 'text' })
	address?: string

	@Column({ name: 'is_main', type: 'tinyint' })
	isMain: number

	@Column({ name: 'phone', type: 'text' })
	phone?: string

	@Column({ name: 'url_logo', type: 'text' })
	urlLogo?: string

	@Column({ name: 'location', type: 'text' })
	location?: { x: number; y: number } | null

	@Column({ name: 'longitude', type: 'decimal' })
	longitude?: number

	@Column({ name: 'latitude', type: 'decimal' })
	latitude?: number

	@Column({ name: 'ubigeo', type: 'varchar' })
	ubigeo?: string

	@Column({ name: 'district_name', type: 'varchar' })
	districtName?: string

	@Column({ name: 'district_id', type: 'int' })
	districtId?: number

	@Column({ name: 'province_name', type: 'varchar' })
	provinceName?: string

	@Column({ name: 'province_id', type: 'int' })
	provinceId?: number

	@Column({ name: 'department_name', type: 'varchar' })
	departmentName?: string

	@Column({ name: 'department_id', type: 'int' })
	departmentId?: number

	@Column({ name: 'settings', type: 'json' })
	settings?: any

	@Column({ name: 'sync_status', type: 'int' })
	syncStatus?: number

	@Column({ name: 'last_sync', type: 'datetime' })
	lastSync?: Date

	@Column({ name: 'company_id', type: 'int' })
	companyId: number

	@Column({ name: 'flag_ecommerce', type: 'tinyint' })
	flagEcommerce?: number

	@Column({ name: 'flag_active', type: 'tinyint' })
	flagActive?: number

	@DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
	deletedAt?: Date

	@Column({ name: 'created_at', type: 'datetime' })
	createdAt?: Date

	@Column({ name: 'updated_at', type: 'datetime' })
	updatedAt?: Date
}
