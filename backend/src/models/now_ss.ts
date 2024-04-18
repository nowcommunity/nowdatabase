import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

import type { now_loc, now_locId } from './now_loc'

export class now_ss extends Model<InferAttributes<now_ss>, InferCreationAttributes<now_ss>> {
  declare lid: CreationOptional<number>
  declare sed_struct: CreationOptional<string>

  // now_ss belongsTo now_loc via lid
  declare lid_now_loc?: Sequelize.NonAttribute<now_loc>
  declare getLid_now_loc: Sequelize.BelongsToGetAssociationMixin<now_loc>
  declare setLid_now_loc: Sequelize.BelongsToSetAssociationMixin<now_loc, number>
  declare createLid_now_loc: Sequelize.BelongsToCreateAssociationMixin<now_loc>

  static initModel(sequelize: Sequelize.Sequelize): typeof now_ss {
    return now_ss.init(
      {
        lid: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          primaryKey: true,
          references: {
            model: 'now_loc',
            key: 'lid',
          },
        },
        sed_struct: {
          type: DataTypes.STRING(30),
          allowNull: false,
          defaultValue: '',
          primaryKey: true,
        },
      },
      {
        sequelize,
        tableName: 'now_ss',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'lid' }, { name: 'sed_struct' }],
          },
          {
            name: 'now_test_ss_FKIndex1',
            using: 'BTREE',
            fields: [{ name: 'lid' }],
          },
        ],
      }
    )
  }
}
