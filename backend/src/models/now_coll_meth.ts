import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

import type { now_loc, now_locId } from './now_loc'

export class now_coll_meth extends Model<InferAttributes<now_coll_meth>, InferCreationAttributes<now_coll_meth>> {
  declare lid: CreationOptional<number>
  declare coll_meth: CreationOptional<string>

  // now_coll_meth belongsTo now_loc via lid
  declare lid_now_loc?: Sequelize.NonAttribute<now_loc>
  declare getLid_now_loc: Sequelize.BelongsToGetAssociationMixin<now_loc>
  declare setLid_now_loc: Sequelize.BelongsToSetAssociationMixin<now_loc, number>
  declare createLid_now_loc: Sequelize.BelongsToCreateAssociationMixin<now_loc>

  static initModel(sequelize: Sequelize.Sequelize): typeof now_coll_meth {
    return now_coll_meth.init(
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
        coll_meth: {
          type: DataTypes.STRING(21),
          allowNull: false,
          primaryKey: true,
        },
      },
      {
        sequelize,
        tableName: 'now_coll_meth',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'lid' }, { name: 'coll_meth' }],
          },
          {
            name: 'now_test_coll_meth_FKIndex1',
            using: 'BTREE',
            fields: [{ name: 'lid' }],
          },
        ],
      }
    )
  }
}
