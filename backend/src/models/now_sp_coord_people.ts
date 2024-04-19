import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { com_people, com_peopleId } from './com_people'
import type { now_sp_coord, now_sp_coordId } from './now_sp_coord'

export interface now_sp_coord_peopleAttributes {
  sp_coord_id: number
  initials: string
}

export type now_sp_coord_peoplePk = 'sp_coord_id' | 'initials'
export type now_sp_coord_peopleId = now_sp_coord_people[now_sp_coord_peoplePk]
export type now_sp_coord_peopleOptionalAttributes = 'sp_coord_id' | 'initials'
export type now_sp_coord_peopleCreationAttributes = Optional<
  now_sp_coord_peopleAttributes,
  now_sp_coord_peopleOptionalAttributes
>

export class now_sp_coord_people
  extends Model<now_sp_coord_peopleAttributes, now_sp_coord_peopleCreationAttributes>
  implements now_sp_coord_peopleAttributes
{
  declare sp_coord_id: number
  declare initials: string

  // now_sp_coord_people belongsTo com_people via initials
  declare initials_com_person: com_people
  declare getInitials_com_person: Sequelize.BelongsToGetAssociationMixin<com_people>
  declare setInitials_com_person: Sequelize.BelongsToSetAssociationMixin<com_people, com_peopleId>
  declare createInitials_com_person: Sequelize.BelongsToCreateAssociationMixin<com_people>
  // now_sp_coord_people belongsTo now_sp_coord via sp_coord_id
  declare sp_coord: now_sp_coord
  declare getSp_coord: Sequelize.BelongsToGetAssociationMixin<now_sp_coord>
  declare setSp_coord: Sequelize.BelongsToSetAssociationMixin<now_sp_coord, now_sp_coordId>
  declare createSp_coord: Sequelize.BelongsToCreateAssociationMixin<now_sp_coord>

  static initModel(sequelize: Sequelize.Sequelize): typeof now_sp_coord_people {
    return now_sp_coord_people.init(
      {
        sp_coord_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          primaryKey: true,
          references: {
            model: 'now_sp_coord',
            key: 'sp_coord_id',
          },
        },
        initials: {
          type: DataTypes.STRING(10),
          allowNull: false,
          defaultValue: '',
          primaryKey: true,
          references: {
            model: 'com_people',
            key: 'initials',
          },
        },
      },
      {
        sequelize,
        tableName: 'now_sp_coord_people',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'sp_coord_id' }, { name: 'initials' }],
          },
          {
            name: 'now_test_sp_coord_people_FKIndex1',
            using: 'BTREE',
            fields: [{ name: 'sp_coord_id' }],
          },
          {
            name: 'now_test_sp_coord_people_FKIndex2',
            using: 'BTREE',
            fields: [{ name: 'initials' }],
          },
        ],
      }
    )
  }
}
