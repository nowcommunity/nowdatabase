import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

import type { com_people, com_peopleId } from './com_people'
import type { now_reg_coord, now_reg_coordId } from './now_reg_coord'

export class now_reg_coord_people extends Model<
  InferAttributes<now_reg_coord_people>,
  InferCreationAttributes<now_reg_coord_people>
> {
  declare reg_coord_id: CreationOptional<number>
  declare initials: CreationOptional<string>

  // now_reg_coord_people belongsTo com_people via initials
  declare initials_com_person?: Sequelize.NonAttribute<com_people>
  declare getInitials_com_person: Sequelize.BelongsToGetAssociationMixin<com_people>
  declare setInitials_com_person: Sequelize.BelongsToSetAssociationMixin<com_people, number>
  declare createInitials_com_person: Sequelize.BelongsToCreateAssociationMixin<com_people>
  // now_reg_coord_people belongsTo now_reg_coord via reg_coord_id
  declare reg_coord?: Sequelize.NonAttribute<now_reg_coord>
  declare getReg_coord: Sequelize.BelongsToGetAssociationMixin<now_reg_coord>
  declare setReg_coord: Sequelize.BelongsToSetAssociationMixin<now_reg_coord, number>
  declare createReg_coord: Sequelize.BelongsToCreateAssociationMixin<now_reg_coord>

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
