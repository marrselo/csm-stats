import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn } from 'typeorm'

@Entity('com_ms_type_documents', { schema: 'dp6_quipu_prod' })
export class CsmTypeDocument {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ name: 'name', type: 'varchar' })
	name: string

	@Column({ name: 'flag_type', type: 'tinyint' })
	flagType: number

	@Column({ name: 'code', type: 'varchar' })
	code: string

	@Column({ name: 'code_taxes', type: 'text' })
	codeTaxes?: string

	@Column({ name: 'flag_active', type: 'tinyint' })
	flagActive?: number

	@DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
	deletedAt?: Date

	@Column({ name: 'created_at', type: 'datetime' })
	createdAt?: Date

	@Column({ name: 'updated_at', type: 'datetime' })
	updatedAt?: Date
}
