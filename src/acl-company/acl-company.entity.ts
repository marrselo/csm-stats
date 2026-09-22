import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm'

@Entity('dp6_company', { schema: 'dp6_acl_quipu_prod' })
export class AclCompany {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ name: 'project_id' })
	projectId: number

	@Column({ name: 'nombre_comercial', type: 'text' })
	nombreComercial?: string

	@Column({ name: 'razon_social', type: 'text' })
	razonSocial?: string

	@Column({ name: 'ruc' })
	ruc?: string

	@Column({ name: 'hash' })
	hash?: string

	@Column({ name: 'code_company' })
	codeCompany: string

	@Column({ name: 'domain' })
	domain?: string

	@Column({ name: 'access_user_id' })
	accessUserId?: number

	@Column({ name: 'settings', type: 'json' })
	settings?: any

	@Column({ name: 'id_item' })
	idItem?: number

	@Column({ name: 'flag_allow_access' })
	flagAllowAccess?: number

	@Column({ name: 'flag_company_parent' })
	flagCompanyParent?: number

	@Column({ name: 'company_parent_id' })
	companyParentId?: number

	@Column({ name: 'type_plan' })
	typePlan?: number

	@Column({ name: 'billing_week' })
	billingWeek?: string

	@Column({ name: 'date_billing' })
	dateBilling?: Date

	@Column({ name: 'flag_blocked' })
	flagBlocked?: number

	@Column({ name: 'created_at' })
	createdAt?: Date

	@Column({ name: 'updated_at' })
	updatedAt?: Date

	@DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
	deletedAt?: Date

	@Column({ name: 'country_id' })
	countryId?: number

	@Column({ name: 'languages', type: 'json' })
	languages?: any

	@Column({ name: 'template_id' })
	templateId?: number

	@Column({ name: 'flag_sync_template' })
	flagSyncTemplate?: number
}
