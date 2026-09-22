import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm'

@Entity('com_delivery', { schema: 'dp6_quipu_prod' })
export class ComDelivery {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ name: 'name', type: 'text' })
	name?: string

	@Column({ name: 'lastname', type: 'text' })
	lastname?: string

	@Column({ name: 'description', type: 'text' })
	description?: string

	@Column({ name: 'type_document_id', type: 'int' })
	typeDocumentId?: number

	@Column({ name: 'document_number', type: 'text' })
	documentNumber?: string

	@Column({ name: 'plate', type: 'text' })
	plate?: string

	@Column({ name: 'licence', type: 'text' })
	licence?: string

	@Column({ name: 'email', type: 'text' })
	email?: string

	@Column({ name: 'phone', type: 'text' })
	phone?: string

	@Column({ name: 'address', type: 'varchar' })
	address?: string

	@Column({ name: 'photo', type: 'text' })
	photo?: string

	@Column({ name: 'gender', type: 'int' })
	gender?: number

	@Column({ name: 'code', type: 'text' })
	code?: string

	@Column({ name: 'subsidiary_id', type: 'int' })
	subsidiaryId?: number

	@Column({ name: 'employee_id', type: 'int' })
	employeeId?: number

	@Column({ name: 'vehicle_id', type: 'int' })
	vehicleId?: number

	@Column({ name: 'time_tracking', type: 'decimal' })
	timeTracking?: number

	@Column({ name: 'group_id', type: 'int' })
	groupId?: number

	@Column({ name: 'settings', type: 'json' })
	settings?: any

	@Column({ name: 'flag_limit_users', type: 'int' })
	flagLimitUsers?: number

	@Column({ name: 'warehouses', type: 'json' })
	warehouses?: any

	@Column({ name: 'company_id', type: 'int' })
	companyId?: number

	@Column({ name: 'flag_active', type: 'tinyint' })
	flagActive?: number

	@DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
	deletedAt?: Date

	@Column({ name: 'created_at', type: 'timestamp' })
	createdAt?: Date

	@Column({ name: 'updated_at', type: 'timestamp' })
	updatedAt?: Date
}
