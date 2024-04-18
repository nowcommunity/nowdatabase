import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

import type { com_people, com_peopleId } from './com_people'
import type { now_sp_coord, now_sp_coordId } from './now_sp_coord'

export class now_sp_coord_people extends Model<
  InferAttributes<now_sp_coord_people>,
  InferCreationAttributes<now_sp_coord_people>
> {
  declare sp_coord_id: CreationOptional<number>
  declare initials: CreationOptional<string>

  // now_sp_coord_people belongsTo com_people via initials
  declare initials_com_person?: Sequelize.NonAttribute<com_people>
  declare getInitials_com_person: Sequelize.BelongsToGetAssociationMixin<com_people>
  declare setInitials_com_person: Sequelize.BelongsToSetAssociationMixin<com_people, number>
  declare createInitials_com_person: Sequelize.BelongsToCreateAssociationMixin<com_people>
  // now_sp_coord_people belongsTo now_sp_coord via sp_coord_id
  declare sp_coord?: Sequelize.NonAttribute<now_sp_coord>
  declare getSp_coord: Sequelize.BelongsToGetAssociationMixin<now_sp_coord>
  declare setSp_coord: Sequelize.BelongsToSetAssociationMixin<now_sp_coord, number>
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
