import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

import type { ref_keywords, ref_keywordsId } from './ref_keywords'
import type { ref_ref, ref_refId } from './ref_ref'

export class ref_keywords_ref extends Model<
  InferAttributes<ref_keywords_ref>,
  InferCreationAttributes<ref_keywords_ref>
> {
  declare keywords_id: CreationOptional<number>
  declare rid: CreationOptional<number>

  // ref_keywords_ref belongsTo ref_keywords via keywords_id
  declare keyword?: Sequelize.NonAttribute<ref_keywords>
  declare getKeyword: Sequelize.BelongsToGetAssociationMixin<ref_keywords>
  declare setKeyword: Sequelize.BelongsToSetAssociationMixin<ref_keywords, number>
  declare createKeyword: Sequelize.BelongsToCreateAssociationMixin<ref_keywords>
  // ref_keywords_ref belongsTo ref_ref via rid
  declare rid_ref_ref?: Sequelize.NonAttribute<ref_ref>
  declare getRid_ref_ref: Sequelize.BelongsToGetAssociationMixin<ref_ref>
  declare setRid_ref_ref: Sequelize.BelongsToSetAssociationMixin<ref_ref, number>
  declare createRid_ref_ref: Sequelize.BelongsToCreateAssociationMixin<ref_ref>

  static initModel(sequelize: Sequelize.Sequelize): typeof ref_keywords_ref {
    return ref_keywords_ref.init(
      {
        keywords_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          primaryKey: true,
          references: {
            model: 'ref_keywords',
            key: 'keywords_id',
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
        tableName: 'ref_keywords_ref',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'keywords_id' }, { name: 'rid' }],
          },
          {
            name: 'ref_keywords_ref_FKIndex1',
            using: 'BTREE',
            fields: [{ name: 'keywords_id' }],
          },
          {
            name: 'ref_keywords_ref_FKIndex2',
            using: 'BTREE',
            fields: [{ name: 'rid' }],
          },
        ],
      }
    )
  }
}
