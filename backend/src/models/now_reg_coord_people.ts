import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { com_people, com_peopleId } from './com_people'
import type { now_reg_coord, now_reg_coordId } from './now_reg_coord'

export interface now_reg_coord_peopleAttributes {
  reg_coord_id: number
  initials: string
}

export type now_reg_coord_peoplePk = 'reg_coord_id' | 'initials'
export type now_reg_coord_peopleId = now_reg_coord_people[now_reg_coord_peoplePk]
export type now_reg_coord_peopleOptionalAttributes = 'reg_coord_id' | 'initials'
export type now_reg_coord_peopleCreationAttributes = Optional<
  now_reg_coord_peopleAttributes,
  now_reg_coord_peopleOptionalAttributes
>

export class now_reg_coord_people
  extends Model<now_reg_coord_peopleAttributes, now_reg_coord_peopleCreationAttributes>
  implements now_reg_coord_peopleAttributes
{
  reg_coord_id!: number
  initials!: string

  // now_reg_coord_people belongsTo com_people via initials
  initials_com_person!: com_people
  getInitials_com_person!: Sequelize.BelongsToGetAssociationMixin<com_people>
  setInitials_com_person!: Sequelize.BelongsToSetAssociationMixin<com_people, com_peopleId>
  createInitials_com_person!: Sequelize.BelongsToCreateAssociationMixin<com_people>
  // now_reg_coord_people belongsTo now_reg_coord via reg_coord_id
  reg_coord!: now_reg_coord
  getReg_coord!: Sequelize.BelongsToGetAssociationMixin<now_reg_coord>
  setReg_coord!: Sequelize.BelongsToSetAssociationMixin<now_reg_coord, now_reg_coordId>
  createReg_coord!: Sequelize.BelongsToCreateAssociationMixin<now_reg_coord>

  static initModel(sequelize: Sequelize.Sequelize): typeof now_reg_coord_people {
    return now_reg_coord_people.init(
      {
        reg_coord_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          primaryKey: true,
          references: {
            model: 'now_reg_coord',
            key: 'reg_coord_id',
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
        tableName: 'now_reg_coord_people',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'reg_coord_id' }, { name: 'initials' }],
          },
          {
            name: 'now_test_reg_coord_people_FKIndex1',
            using: 'BTREE',
            fields: [{ name: 'reg_coord_id' }],
          },
          {
            name: 'now_test_reg_coord_people_FKIndex2',
            using: 'BTREE',
            fields: [{ name: 'initials' }],
          },
        ],
      }
    )
  }
}
