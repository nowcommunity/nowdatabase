import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

import type { com_people } from './com_people'
import type { now_sp_coord_people } from './now_sp_coord_people'
import type { now_sp_coord_taxa } from './now_sp_coord_taxa'

export class now_sp_coord extends Model<InferAttributes<now_sp_coord>, InferCreationAttributes<now_sp_coord>> {
  declare sp_coord_id: CreationOptional<number>
  declare tax_group: string

  // now_sp_coord belongsToMany com_people via sp_coord_id and initials
  declare initials_com_people_now_sp_coord_people: Sequelize.NonAttribute<com_people[]>
  declare getInitials_com_people_now_sp_coord_people: Sequelize.BelongsToManyGetAssociationsMixin<com_people>
  declare setInitials_com_people_now_sp_coord_people: Sequelize.BelongsToManySetAssociationsMixin<com_people, number>
  declare addInitials_com_people_now_sp_coord_person: Sequelize.BelongsToManyAddAssociationMixin<com_people, number>
  declare addInitials_com_people_now_sp_coord_people: Sequelize.BelongsToManyAddAssociationsMixin<com_people, number>
  declare createInitials_com_people_now_sp_coord_person: Sequelize.BelongsToManyCreateAssociationMixin<
    com_people,
    'sp_coord_id'
  >
  declare removeInitials_com_people_now_sp_coord_person: Sequelize.BelongsToManyRemoveAssociationMixin<
    com_people,
    number
  >
  declare removeInitials_com_people_now_sp_coord_people: Sequelize.BelongsToManyRemoveAssociationsMixin<
    com_people,
    number
  >
  declare hasInitials_com_people_now_sp_coord_person: Sequelize.BelongsToManyHasAssociationMixin<com_people, number>
  declare hasInitials_com_people_now_sp_coord_people: Sequelize.BelongsToManyHasAssociationsMixin<com_people, number>
  declare countInitials_com_people_now_sp_coord_people: Sequelize.BelongsToManyCountAssociationsMixin
  // now_sp_coord hasMany now_sp_coord_people via sp_coord_id
  declare now_sp_coord_people?: Sequelize.NonAttribute<now_sp_coord_people[]>
  declare getNow_sp_coord_people: Sequelize.HasManyGetAssociationsMixin<now_sp_coord_people>
  declare setNow_sp_coord_people: Sequelize.HasManySetAssociationsMixin<now_sp_coord_people, number>
  declare addNow_sp_coord_person: Sequelize.HasManyAddAssociationMixin<now_sp_coord_people, number>
  declare addNow_sp_coord_people: Sequelize.HasManyAddAssociationsMixin<now_sp_coord_people, number>
  declare createNow_sp_coord_person: Sequelize.HasManyCreateAssociationMixin<now_sp_coord_people, 'sp_coord_id'>
  declare removeNow_sp_coord_person: Sequelize.HasManyRemoveAssociationMixin<now_sp_coord_people, number>
  declare removeNow_sp_coord_people: Sequelize.HasManyRemoveAssociationsMixin<now_sp_coord_people, number>
  declare hasNow_sp_coord_person: Sequelize.HasManyHasAssociationMixin<now_sp_coord_people, number>
  declare hasNow_sp_coord_people: Sequelize.HasManyHasAssociationsMixin<now_sp_coord_people, number>
  declare countNow_sp_coord_people: Sequelize.HasManyCountAssociationsMixin
  // now_sp_coord hasMany now_sp_coord_taxa via sp_coord_id
  declare now_sp_coord_taxas?: Sequelize.NonAttribute<now_sp_coord_taxa[]>
  declare getNow_sp_coord_taxas: Sequelize.HasManyGetAssociationsMixin<now_sp_coord_taxa>
  declare setNow_sp_coord_taxas: Sequelize.HasManySetAssociationsMixin<now_sp_coord_taxa, number>
  declare addNow_sp_coord_taxa: Sequelize.HasManyAddAssociationMixin<now_sp_coord_taxa, number>
  declare addNow_sp_coord_taxas: Sequelize.HasManyAddAssociationsMixin<now_sp_coord_taxa, number>
  declare createNow_sp_coord_taxa: Sequelize.HasManyCreateAssociationMixin<now_sp_coord_taxa, 'sp_coord_id'>
  declare removeNow_sp_coord_taxa: Sequelize.HasManyRemoveAssociationMixin<now_sp_coord_taxa, number>
  declare removeNow_sp_coord_taxas: Sequelize.HasManyRemoveAssociationsMixin<now_sp_coord_taxa, number>
  declare hasNow_sp_coord_taxa: Sequelize.HasManyHasAssociationMixin<now_sp_coord_taxa, number>
  declare hasNow_sp_coord_taxas: Sequelize.HasManyHasAssociationsMixin<now_sp_coord_taxa, number>
  declare countNow_sp_coord_taxas: Sequelize.HasManyCountAssociationsMixin

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
