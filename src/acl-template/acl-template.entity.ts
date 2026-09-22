import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm'

@Entity('dp6_template', { schema: 'dp6_acl_quipu_prod' })
export class AclTemplate {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ name: 'name' })
	name: string

	@Column({ name: 'template', type: 'json' })
	template?: any

	@Column({ name: 'flag_allow_access' })
	flagAllowAccess?: number

	@Column({ name: 'integrations', type: 'json' })
	integrations: any

	@Column({ name: 'settings', type: 'json' })
	settings?: any

	@Column({ name: 'created_at' })
	createdAt?: Date

	@Column({ name: 'updated_at' })
	updatedAt?: Date

	@DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
	deletedAt?: Date

	@Column({ name: 'category' })
	category?: string

	@Column({ name: 'flag_sync_companies' })
	flagSyncCompanies?: number

	@Column({ name: 'flag_maintenance' })
	flagMaintenance?: number

	@Column({ name: 'status' })
	status?: number

	@Column({ name: 'project_id' })
	projectId?: number

	@Column({ name: 'code_template' })
	codeTemplate?: string

	@Column({ name: 'description', type: 'text' })
	description?: string

	@Column({ name: 'item_id' })
	itemId?: number
}
