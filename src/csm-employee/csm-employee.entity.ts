import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm'

@Entity('com_employee', { schema: 'dp6_quipu_prod' })
export class ComEmployee {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ name: 'code', type: 'varchar' })
	code?: string

	@Column({ name: 'document_number', type: 'text' })
	documentNumber?: string

	@Column({ name: 'flag_type_person', type: 'int' })
	flagTypePerson?: number

	@Column({ name: 'person_id', type: 'int' })
	personId?: number

	@Column({ name: 'acl_user_code', type: 'varchar' })
	aclUserCode?: string

	@Column({ name: 'acl_user_id', type: 'int' })
	aclUserId?: number

	@Column({ name: 'role_id', type: 'int' })
	roleId?: number

	@Column({ name: 'app_id', type: 'int' })
	appId?: number

	@Column({ name: 'housekeeping_score', type: 'int' })
	housekeepingScore?: number

	@Column({ name: 'com_subsidiaries_id', type: 'int' })
	comSubsidiariesId?: number

	@Column({ name: 'com_ms_state_emp_id', type: 'int' })
	comMsStateEmpId?: number

	@Column({ name: 'war_warehouses_id', type: 'int' })
	warWarehousesId?: number

	@Column({ name: 'cash_id', type: 'int' })
	cashId?: number

	@Column({ name: 'sal_terminals_id', type: 'int' })
	salTerminalsId?: number

	@Column({ name: 'name', type: 'varchar' })
	name?: string

	@Column({ name: 'lastname', type: 'varchar' })
	lastname?: string

	@Column({ name: 'nationality', type: 'varchar' })
	nationality?: string

	@Column({ name: 'email', type: 'varchar' })
	email?: string

	@Column({ name: 'phone', type: 'varchar' })
	phone?: string

	@Column({ name: 'gender', type: 'int' })
	gender?: number

	@Column({ name: 'date_birth', type: 'date' })
	dateBirth?: Date

	@Column({ name: 'civil_status', type: 'int' })
	civilStatus?: number

	@Column({ name: 'son_number', type: 'int' })
	sonNumber?: number

	@Column({ name: 'group', type: 'int' })
	group?: number

	@Column({ name: 'date_healing', type: 'date' })
	dateHealing?: Date

	@Column({ name: 'languages', type: 'json' })
	languages?: any

	@Column({ name: 'subsidiaries', type: 'json' })
	subsidiaries?: any

	@Column({ name: 'url_image', type: 'varchar' })
	urlImage?: string

	@Column({ name: 'code_type_rol', type: 'text' })
	codeTypeRol?: string

	@Column({ name: 'token_device', type: 'varchar' })
	tokenDevice?: string

	@Column({ name: 'flag_admin', type: 'int' })
	flagAdmin?: number

	@Column({ name: 'flag_not_show_cost_price', type: 'tinyint' })
	flagNotShowCostPrice?: number

	@Column({ name: 'config_filters', type: 'json' })
	configFilters?: any

	@Column({ name: 'code_app', type: 'varchar' })
	codeApp?: string

	@Column({ name: 'level', type: 'text' })
	level?: string

	@Column({ name: 'specialty', type: 'varchar' })
	specialty?: string

	@Column({ name: 'additional_information', type: 'json' })
	additionalInformation?: any

	@Column({ name: 'flag_display_stock', type: 'tinyint' })
	flagDisplayStock?: number

	@Column({ name: 'settlement_id', type: 'int' })
	settlementId?: number

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
