import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { com_people, com_peopleId } from './com_people'
import type { now_sp_coord_people, now_sp_coord_peopleId } from './now_sp_coord_people'
import type { now_sp_coord_taxa, now_sp_coord_taxaId } from './now_sp_coord_taxa'

export interface now_sp_coordAttributes {
  sp_coord_id: number
  tax_group: string
}

export type now_sp_coordPk = 'sp_coord_id'
export type now_sp_coordId = now_sp_coord[now_sp_coordPk]
export type now_sp_coordOptionalAttributes = 'sp_coord_id' | 'tax_group'
export type now_sp_coordCreationAttributes = Optional<now_sp_coordAttributes, now_sp_coordOptionalAttributes>

export class now_sp_coord
  extends Model<now_sp_coordAttributes, now_sp_coordCreationAttributes>
  implements now_sp_coordAttributes
{
  sp_coord_id!: number
  tax_group!: string

  // now_sp_coord belongsToMany com_people via sp_coord_id and initials
  initials_com_people_now_sp_coord_people!: com_people[]
  getInitials_com_people_now_sp_coord_people!: Sequelize.BelongsToManyGetAssociationsMixin<com_people>
  setInitials_com_people_now_sp_coord_people!: Sequelize.BelongsToManySetAssociationsMixin<com_people, com_peopleId>
  addInitials_com_people_now_sp_coord_person!: Sequelize.BelongsToManyAddAssociationMixin<com_people, com_peopleId>
  addInitials_com_people_now_sp_coord_people!: Sequelize.BelongsToManyAddAssociationsMixin<com_people, com_peopleId>
  createInitials_com_people_now_sp_coord_person!: Sequelize.BelongsToManyCreateAssociationMixin<com_people>
  removeInitials_com_people_now_sp_coord_person!: Sequelize.BelongsToManyRemoveAssociationMixin<
    com_people,
    com_peopleId
  >
  removeInitials_com_people_now_sp_coord_people!: Sequelize.BelongsToManyRemoveAssociationsMixin<
    com_people,
    com_peopleId
  >
  hasInitials_com_people_now_sp_coord_person!: Sequelize.BelongsToManyHasAssociationMixin<com_people, com_peopleId>
  hasInitials_com_people_now_sp_coord_people!: Sequelize.BelongsToManyHasAssociationsMixin<com_people, com_peopleId>
  countInitials_com_people_now_sp_coord_people!: Sequelize.BelongsToManyCountAssociationsMixin
  // now_sp_coord hasMany now_sp_coord_people via sp_coord_id
  now_sp_coord_people!: now_sp_coord_people[]
  getNow_sp_coord_people!: Sequelize.HasManyGetAssociationsMixin<now_sp_coord_people>
  setNow_sp_coord_people!: Sequelize.HasManySetAssociationsMixin<now_sp_coord_people, now_sp_coord_peopleId>
  addNow_sp_coord_person!: Sequelize.HasManyAddAssociationMixin<now_sp_coord_people, now_sp_coord_peopleId>
  addNow_sp_coord_people!: Sequelize.HasManyAddAssociationsMixin<now_sp_coord_people, now_sp_coord_peopleId>
  createNow_sp_coord_person!: Sequelize.HasManyCreateAssociationMixin<now_sp_coord_people>
  removeNow_sp_coord_person!: Sequelize.HasManyRemoveAssociationMixin<now_sp_coord_people, now_sp_coord_peopleId>
  removeNow_sp_coord_people!: Sequelize.HasManyRemoveAssociationsMixin<now_sp_coord_people, now_sp_coord_peopleId>
  hasNow_sp_coord_person!: Sequelize.HasManyHasAssociationMixin<now_sp_coord_people, now_sp_coord_peopleId>
  hasNow_sp_coord_people!: Sequelize.HasManyHasAssociationsMixin<now_sp_coord_people, now_sp_coord_peopleId>
  countNow_sp_coord_people!: Sequelize.HasManyCountAssociationsMixin
  // now_sp_coord hasMany now_sp_coord_taxa via sp_coord_id
  now_sp_coord_taxas!: now_sp_coord_taxa[]
  getNow_sp_coord_taxas!: Sequelize.HasManyGetAssociationsMixin<now_sp_coord_taxa>
  setNow_sp_coord_taxas!: Sequelize.HasManySetAssociationsMixin<now_sp_coord_taxa, now_sp_coord_taxaId>
  addNow_sp_coord_taxa!: Sequelize.HasManyAddAssociationMixin<now_sp_coord_taxa, now_sp_coord_taxaId>
  addNow_sp_coord_taxas!: Sequelize.HasManyAddAssociationsMixin<now_sp_coord_taxa, now_sp_coord_taxaId>
  createNow_sp_coord_taxa!: Sequelize.HasManyCreateAssociationMixin<now_sp_coord_taxa>
  removeNow_sp_coord_taxa!: Sequelize.HasManyRemoveAssociationMixin<now_sp_coord_taxa, now_sp_coord_taxaId>
  removeNow_sp_coord_taxas!: Sequelize.HasManyRemoveAssociationsMixin<now_sp_coord_taxa, now_sp_coord_taxaId>
  hasNow_sp_coord_taxa!: Sequelize.HasManyHasAssociationMixin<now_sp_coord_taxa, now_sp_coord_taxaId>
  hasNow_sp_coord_taxas!: Sequelize.HasManyHasAssociationsMixin<now_sp_coord_taxa, now_sp_coord_taxaId>
  countNow_sp_coord_taxas!: Sequelize.HasManyCountAssociationsMixin

  static initModel(sequelize: Sequelize.Sequelize): typeof now_sp_coord {
    return now_sp_coord.init(
      {
        sp_coord_id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        tax_group: {
          type: DataTypes.STRING(80),
          allowNull: false,
          defaultValue: '',
        },
      },
      {
        sequelize,
        tableName: 'now_sp_coord',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'sp_coord_id' }],
          },
        ],
      }
    )
  }
}
