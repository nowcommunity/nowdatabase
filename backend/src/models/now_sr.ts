import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

import type { now_sau, now_sauId } from './now_sau'
import type { ref_ref, ref_refId } from './ref_ref'

export class now_sr extends Model<InferAttributes<now_sr>, InferCreationAttributes<now_sr>> {
  declare suid: CreationOptional<number>
  declare rid: CreationOptional<number>

  // now_sr belongsTo now_sau via suid
  declare su?: Sequelize.NonAttribute<now_sau>
  declare getSu: Sequelize.BelongsToGetAssociationMixin<now_sau>
  declare setSu: Sequelize.BelongsToSetAssociationMixin<now_sau, number>
  declare createSu: Sequelize.BelongsToCreateAssociationMixin<now_sau>
  // now_sr belongsTo ref_ref via rid
  declare rid_ref_ref?: Sequelize.NonAttribute<ref_ref>
  declare getRid_ref_ref: Sequelize.BelongsToGetAssociationMixin<ref_ref>
  declare setRid_ref_ref: Sequelize.BelongsToSetAssociationMixin<ref_ref, number>
  declare createRid_ref_ref: Sequelize.BelongsToCreateAssociationMixin<ref_ref>

  static initModel(sequelize: Sequelize.Sequelize): typeof now_sr {
    return now_sr.init(
      {
        suid: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          primaryKey: true,
          references: {
            model: 'now_sau',
            key: 'suid',
          },
        },
        rid: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          primaryKey: true,
          references: {
            model: 'ref_ref',
            key: 'rid',
          },
        },
      },
      {
        sequelize,
        tableName: 'now_sr',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'suid' }, { name: 'rid' }],
          },
          {
            name: 'now_test_sr_FKIndex1',
            using: 'BTREE',
            fields: [{ name: 'suid' }],
          },
          {
            name: 'now_test_sr_FKIndex2',
            using: 'BTREE',
            fields: [{ name: 'rid' }],
          },
        ],
      }
    )
  }
}
