import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { com_people, com_peopleId } from './com_people'
import type { now_strat_coord, now_strat_coordId } from './now_strat_coord'

export interface now_strat_coord_peopleAttributes {
  strat_coord_id: number
  initials: string
}

export type now_strat_coord_peoplePk = 'strat_coord_id' | 'initials'
export type now_strat_coord_peopleId = now_strat_coord_people[now_strat_coord_peoplePk]
export type now_strat_coord_peopleOptionalAttributes = 'strat_coord_id' | 'initials'
export type now_strat_coord_peopleCreationAttributes = Optional<
  now_strat_coord_peopleAttributes,
  now_strat_coord_peopleOptionalAttributes
>

export class now_strat_coord_people
  extends Model<now_strat_coord_peopleAttributes, now_strat_coord_peopleCreationAttributes>
  implements now_strat_coord_peopleAttributes
{
  strat_coord_id!: number
  initials!: string

  // now_strat_coord_people belongsTo com_people via initials
  initials_com_person!: com_people
  getInitials_com_person!: Sequelize.BelongsToGetAssociationMixin<com_people>
  setInitials_com_person!: Sequelize.BelongsToSetAssociationMixin<com_people, com_peopleId>
  createInitials_com_person!: Sequelize.BelongsToCreateAssociationMixin<com_people>
  // now_strat_coord_people belongsTo now_strat_coord via strat_coord_id
  strat_coord!: now_strat_coord
  getStrat_coord!: Sequelize.BelongsToGetAssociationMixin<now_strat_coord>
  setStrat_coord!: Sequelize.BelongsToSetAssociationMixin<now_strat_coord, now_strat_coordId>
  createStrat_coord!: Sequelize.BelongsToCreateAssociationMixin<now_strat_coord>

  static initModel(sequelize: Sequelize.Sequelize): typeof now_strat_coord_people {
    return now_strat_coord_people.init(
      {
        strat_coord_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          primaryKey: true,
          references: {
            model: 'now_strat_coord',
            key: 'strat_coord_id',
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
        tableName: 'now_strat_coord_people',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'strat_coord_id' }, { name: 'initials' }],
          },
          {
            name: 'now_test_strat_coord_people_FKIndex1',
            using: 'BTREE',
            fields: [{ name: 'strat_coord_id' }],
          },
          {
            name: 'now_test_strat_coord_people_FKIndex2',
            using: 'BTREE',
            fields: [{ name: 'initials' }],
          },
        ],
      }
    )
  }
}
