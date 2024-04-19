import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { com_people, com_peopleId } from './com_people'
import type { now_reg_coord_country, now_reg_coord_countryId } from './now_reg_coord_country'
import type { now_reg_coord_people, now_reg_coord_peopleId } from './now_reg_coord_people'

export interface now_reg_coordAttributes {
  reg_coord_id: number
  region: string
}

export type now_reg_coordPk = 'reg_coord_id'
export type now_reg_coordId = now_reg_coord[now_reg_coordPk]
export type now_reg_coordOptionalAttributes = 'reg_coord_id' | 'region'
export type now_reg_coordCreationAttributes = Optional<now_reg_coordAttributes, now_reg_coordOptionalAttributes>

export class now_reg_coord
  extends Model<now_reg_coordAttributes, now_reg_coordCreationAttributes>
  implements now_reg_coordAttributes
{
  declare reg_coord_id: number
  declare region: string

  // now_reg_coord belongsToMany com_people via reg_coord_id and initials
  declare initials_com_people_now_reg_coord_people: com_people[]
  declare getInitials_com_people_now_reg_coord_people: Sequelize.BelongsToManyGetAssociationsMixin<com_people>
  declare setInitials_com_people_now_reg_coord_people: Sequelize.BelongsToManySetAssociationsMixin<
    com_people,
    com_peopleId
  >
  declare addInitials_com_people_now_reg_coord_person: Sequelize.BelongsToManyAddAssociationMixin<
    com_people,
    com_peopleId
  >
  declare addInitials_com_people_now_reg_coord_people: Sequelize.BelongsToManyAddAssociationsMixin<
    com_people,
    com_peopleId
  >
  declare createInitials_com_people_now_reg_coord_person: Sequelize.BelongsToManyCreateAssociationMixin<com_people>
  declare removeInitials_com_people_now_reg_coord_person: Sequelize.BelongsToManyRemoveAssociationMixin<
    com_people,
    com_peopleId
  >
  declare removeInitials_com_people_now_reg_coord_people: Sequelize.BelongsToManyRemoveAssociationsMixin<
    com_people,
    com_peopleId
  >
  declare hasInitials_com_people_now_reg_coord_person: Sequelize.BelongsToManyHasAssociationMixin<
    com_people,
    com_peopleId
  >
  declare hasInitials_com_people_now_reg_coord_people: Sequelize.BelongsToManyHasAssociationsMixin<
    com_people,
    com_peopleId
  >
  declare countInitials_com_people_now_reg_coord_people: Sequelize.BelongsToManyCountAssociationsMixin
  // now_reg_coord hasMany now_reg_coord_country via reg_coord_id
  declare now_reg_coord_countries: now_reg_coord_country[]
  declare getNow_reg_coord_countries: Sequelize.HasManyGetAssociationsMixin<now_reg_coord_country>
  declare setNow_reg_coord_countries: Sequelize.HasManySetAssociationsMixin<
    now_reg_coord_country,
    now_reg_coord_countryId
  >
  declare addNow_reg_coord_country: Sequelize.HasManyAddAssociationMixin<now_reg_coord_country, now_reg_coord_countryId>
  declare addNow_reg_coord_countries: Sequelize.HasManyAddAssociationsMixin<
    now_reg_coord_country,
    now_reg_coord_countryId
  >
  declare createNow_reg_coord_country: Sequelize.HasManyCreateAssociationMixin<now_reg_coord_country>
  declare removeNow_reg_coord_country: Sequelize.HasManyRemoveAssociationMixin<
    now_reg_coord_country,
    now_reg_coord_countryId
  >
  declare removeNow_reg_coord_countries: Sequelize.HasManyRemoveAssociationsMixin<
    now_reg_coord_country,
    now_reg_coord_countryId
  >
  declare hasNow_reg_coord_country: Sequelize.HasManyHasAssociationMixin<now_reg_coord_country, now_reg_coord_countryId>
  declare hasNow_reg_coord_countries: Sequelize.HasManyHasAssociationsMixin<
    now_reg_coord_country,
    now_reg_coord_countryId
  >
  declare countNow_reg_coord_countries: Sequelize.HasManyCountAssociationsMixin
  // now_reg_coord hasMany now_reg_coord_people via reg_coord_id
  declare now_reg_coord_people: now_reg_coord_people[]
  declare getNow_reg_coord_people: Sequelize.HasManyGetAssociationsMixin<now_reg_coord_people>
  declare setNow_reg_coord_people: Sequelize.HasManySetAssociationsMixin<now_reg_coord_people, now_reg_coord_peopleId>
  declare addNow_reg_coord_person: Sequelize.HasManyAddAssociationMixin<now_reg_coord_people, now_reg_coord_peopleId>
  declare addNow_reg_coord_people: Sequelize.HasManyAddAssociationsMixin<now_reg_coord_people, now_reg_coord_peopleId>
  declare createNow_reg_coord_person: Sequelize.HasManyCreateAssociationMixin<now_reg_coord_people>
  declare removeNow_reg_coord_person: Sequelize.HasManyRemoveAssociationMixin<
    now_reg_coord_people,
    now_reg_coord_peopleId
  >
  declare removeNow_reg_coord_people: Sequelize.HasManyRemoveAssociationsMixin<
    now_reg_coord_people,
    now_reg_coord_peopleId
  >
  declare hasNow_reg_coord_person: Sequelize.HasManyHasAssociationMixin<now_reg_coord_people, now_reg_coord_peopleId>
  declare hasNow_reg_coord_people: Sequelize.HasManyHasAssociationsMixin<now_reg_coord_people, now_reg_coord_peopleId>
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
