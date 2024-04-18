import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

import type { com_people } from './com_people'
import type { now_reg_coord_country } from './now_reg_coord_country'
import type { now_reg_coord_people } from './now_reg_coord_people'

export class now_reg_coord extends Model<InferAttributes<now_reg_coord>, InferCreationAttributes<now_reg_coord>> {
  declare reg_coord_id: CreationOptional<number>
  declare region: string

  // now_reg_coord belongsToMany com_people via reg_coord_id and initials
  declare initials_com_people_now_reg_coord_people: Sequelize.NonAttribute<com_people[]>
  declare getInitials_com_people_now_reg_coord_people: Sequelize.BelongsToManyGetAssociationsMixin<com_people>
  declare setInitials_com_people_now_reg_coord_people: Sequelize.BelongsToManySetAssociationsMixin<com_people, number>
  declare addInitials_com_people_now_reg_coord_person: Sequelize.BelongsToManyAddAssociationMixin<com_people, number>
  declare addInitials_com_people_now_reg_coord_people: Sequelize.BelongsToManyAddAssociationsMixin<com_people, number>
  declare createInitials_com_people_now_reg_coord_person: Sequelize.BelongsToManyCreateAssociationMixin<
    com_people,
    'reg_coord_id'
  >
  declare removeInitials_com_people_now_reg_coord_person: Sequelize.BelongsToManyRemoveAssociationMixin<
    com_people,
    number
  >
  declare removeInitials_com_people_now_reg_coord_people: Sequelize.BelongsToManyRemoveAssociationsMixin<
    com_people,
    number
  >
  declare hasInitials_com_people_now_reg_coord_person: Sequelize.BelongsToManyHasAssociationMixin<com_people, number>
  declare hasInitials_com_people_now_reg_coord_people: Sequelize.BelongsToManyHasAssociationsMixin<com_people, number>
  declare countInitials_com_people_now_reg_coord_people: Sequelize.BelongsToManyCountAssociationsMixin
  // now_reg_coord hasMany now_reg_coord_country via reg_coord_id
  declare now_reg_coord_countries?: Sequelize.NonAttribute<now_reg_coord_country[]>
  declare getNow_reg_coord_countries: Sequelize.HasManyGetAssociationsMixin<now_reg_coord_country>
  declare setNow_reg_coord_countries: Sequelize.HasManySetAssociationsMixin<now_reg_coord_country, number>
  declare addNow_reg_coord_country: Sequelize.HasManyAddAssociationMixin<now_reg_coord_country, number>
  declare addNow_reg_coord_countries: Sequelize.HasManyAddAssociationsMixin<now_reg_coord_country, number>
  declare createNow_reg_coord_country: Sequelize.HasManyCreateAssociationMixin<now_reg_coord_country, 'reg_coord_id'>
  declare removeNow_reg_coord_country: Sequelize.HasManyRemoveAssociationMixin<now_reg_coord_country, number>
  declare removeNow_reg_coord_countries: Sequelize.HasManyRemoveAssociationsMixin<now_reg_coord_country, number>
  declare hasNow_reg_coord_country: Sequelize.HasManyHasAssociationMixin<now_reg_coord_country, number>
  declare hasNow_reg_coord_countries: Sequelize.HasManyHasAssociationsMixin<now_reg_coord_country, number>
  declare countNow_reg_coord_countries: Sequelize.HasManyCountAssociationsMixin
  // now_reg_coord hasMany now_reg_coord_people via reg_coord_id
  declare now_reg_coord_people?: Sequelize.NonAttribute<now_reg_coord_people[]>
  declare getNow_reg_coord_people: Sequelize.HasManyGetAssociationsMixin<now_reg_coord_people>
  declare setNow_reg_coord_people: Sequelize.HasManySetAssociationsMixin<now_reg_coord_people, number>
  declare addNow_reg_coord_person: Sequelize.HasManyAddAssociationMixin<now_reg_coord_people, number>
  declare addNow_reg_coord_people: Sequelize.HasManyAddAssociationsMixin<now_reg_coord_people, number>
  declare createNow_reg_coord_person: Sequelize.HasManyCreateAssociationMixin<now_reg_coord_people, 'reg_coord_id'>
  declare removeNow_reg_coord_person: Sequelize.HasManyRemoveAssociationMixin<now_reg_coord_people, number>
  declare removeNow_reg_coord_people: Sequelize.HasManyRemoveAssociationsMixin<now_reg_coord_people, number>
  declare hasNow_reg_coord_person: Sequelize.HasManyHasAssociationMixin<now_reg_coord_people, number>
  declare hasNow_reg_coord_people: Sequelize.HasManyHasAssociationsMixin<now_reg_coord_people, number>
  declare countNow_reg_coord_people: Sequelize.HasManyCountAssociationsMixin

  static initModel(sequelize: Sequelize.Sequelize): typeof now_reg_coord {
    return now_reg_coord.init(
      {
        reg_coord_id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        region: {
          type: DataTypes.STRING(80),
          allowNull: false,
          defaultValue: '',
        },
      },
      {
        sequelize,
        tableName: 'now_reg_coord',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'reg_coord_id' }],
          },
        ],
      }
    )
  }
}
