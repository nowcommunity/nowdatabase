import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

import type { now_reg_coord, now_reg_coordId } from './now_reg_coord'

export class now_reg_coord_country extends Model<
  InferAttributes<now_reg_coord_country>,
  InferCreationAttributes<now_reg_coord_country>
> {
  declare reg_coord_id: CreationOptional<number>
  declare country: CreationOptional<string>

  // now_reg_coord_country belongsTo now_reg_coord via reg_coord_id
  declare reg_coord?: Sequelize.NonAttribute<now_reg_coord>
  declare getReg_coord: Sequelize.BelongsToGetAssociationMixin<now_reg_coord>
  declare setReg_coord: Sequelize.BelongsToSetAssociationMixin<now_reg_coord, number>
  declare createReg_coord: Sequelize.BelongsToCreateAssociationMixin<now_reg_coord>

  static initModel(sequelize: Sequelize.Sequelize): typeof now_reg_coord_country {
    return now_reg_coord_country.init(
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
        country: {
          type: DataTypes.STRING(80),
          allowNull: false,
          defaultValue: '',
          primaryKey: true,
        },
      },
      {
        sequelize,
        tableName: 'now_reg_coord_country',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'reg_coord_id' }, { name: 'country' }],
          },
          {
            name: 'now_test_reg_coord_country_FKIndex1',
            using: 'BTREE',
            fields: [{ name: 'reg_coord_id' }],
          },
        ],
      }
    )
  }
}
