import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { ref_keywords, ref_keywordsId } from './ref_keywords'
import type { ref_ref, ref_refId } from './ref_ref'

export interface ref_keywords_refAttributes {
  keywords_id: number
  rid: number
}

export type ref_keywords_refPk = 'keywords_id' | 'rid'
export type ref_keywords_refId = ref_keywords_ref[ref_keywords_refPk]
export type ref_keywords_refOptionalAttributes = 'keywords_id' | 'rid'
export type ref_keywords_refCreationAttributes = Optional<
  ref_keywords_refAttributes,
  ref_keywords_refOptionalAttributes
>

export class ref_keywords_ref
  extends Model<ref_keywords_refAttributes, ref_keywords_refCreationAttributes>
  implements ref_keywords_refAttributes
{
  declare keywords_id: number
  declare rid: number

  // ref_keywords_ref belongsTo ref_keywords via keywords_id
  declare keyword: ref_keywords
  declare getKeyword: Sequelize.BelongsToGetAssociationMixin<ref_keywords>
  declare setKeyword: Sequelize.BelongsToSetAssociationMixin<ref_keywords, ref_keywordsId>
  declare createKeyword: Sequelize.BelongsToCreateAssociationMixin<ref_keywords>
  // ref_keywords_ref belongsTo ref_ref via rid
  declare rid_ref_ref: ref_ref
  declare getRid_ref_ref: Sequelize.BelongsToGetAssociationMixin<ref_ref>
  declare setRid_ref_ref: Sequelize.BelongsToSetAssociationMixin<ref_ref, ref_refId>
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
