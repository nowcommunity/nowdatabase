import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

import type { com_people, com_peopleId } from './com_people'
import type { now_strat_coord, now_strat_coordId } from './now_strat_coord'

export class now_strat_coord_people extends Model<
  InferAttributes<now_strat_coord_people>,
  InferCreationAttributes<now_strat_coord_people>
> {
  declare strat_coord_id: CreationOptional<number>
  declare initials: CreationOptional<string>

  // now_strat_coord_people belongsTo com_people via initials
  declare initials_com_person?: Sequelize.NonAttribute<com_people>
  declare getInitials_com_person: Sequelize.BelongsToGetAssociationMixin<com_people>
  declare setInitials_com_person: Sequelize.BelongsToSetAssociationMixin<com_people, number>
  declare createInitials_com_person: Sequelize.BelongsToCreateAssociationMixin<com_people>
  // now_strat_coord_people belongsTo now_strat_coord via strat_coord_id
  declare strat_coord?: Sequelize.NonAttribute<now_strat_coord>
  declare getStrat_coord: Sequelize.BelongsToGetAssociationMixin<now_strat_coord>
  declare setStrat_coord: Sequelize.BelongsToSetAssociationMixin<now_strat_coord, number>
  declare createStrat_coord: Sequelize.BelongsToCreateAssociationMixin<now_strat_coord>

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
