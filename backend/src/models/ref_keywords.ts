import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { ref_keywords_ref, ref_keywords_refId } from './ref_keywords_ref'
import type { ref_ref, ref_refId } from './ref_ref'

export interface ref_keywordsAttributes {
  keywords_id: number
  keyword: string
}

export type ref_keywordsPk = 'keywords_id'
export type ref_keywordsId = ref_keywords[ref_keywordsPk]
export type ref_keywordsOptionalAttributes = 'keywords_id' | 'keyword'
export type ref_keywordsCreationAttributes = Optional<ref_keywordsAttributes, ref_keywordsOptionalAttributes>

export class ref_keywords
  extends Model<ref_keywordsAttributes, ref_keywordsCreationAttributes>
  implements ref_keywordsAttributes
{
  keywords_id!: number
  keyword!: string

  // ref_keywords hasMany ref_keywords_ref via keywords_id
  ref_keywords_refs!: ref_keywords_ref[]
  getRef_keywords_refs!: Sequelize.HasManyGetAssociationsMixin<ref_keywords_ref>
  setRef_keywords_refs!: Sequelize.HasManySetAssociationsMixin<ref_keywords_ref, ref_keywords_refId>
  addRef_keywords_ref!: Sequelize.HasManyAddAssociationMixin<ref_keywords_ref, ref_keywords_refId>
  addRef_keywords_refs!: Sequelize.HasManyAddAssociationsMixin<ref_keywords_ref, ref_keywords_refId>
  createRef_keywords_ref!: Sequelize.HasManyCreateAssociationMixin<ref_keywords_ref>
  removeRef_keywords_ref!: Sequelize.HasManyRemoveAssociationMixin<ref_keywords_ref, ref_keywords_refId>
  removeRef_keywords_refs!: Sequelize.HasManyRemoveAssociationsMixin<ref_keywords_ref, ref_keywords_refId>
  hasRef_keywords_ref!: Sequelize.HasManyHasAssociationMixin<ref_keywords_ref, ref_keywords_refId>
  hasRef_keywords_refs!: Sequelize.HasManyHasAssociationsMixin<ref_keywords_ref, ref_keywords_refId>
  countRef_keywords_refs!: Sequelize.HasManyCountAssociationsMixin
  // ref_keywords belongsToMany ref_ref via keywords_id and rid
  rid_ref_ref_ref_keywords_refs!: ref_ref[]
  getRid_ref_ref_ref_keywords_refs!: Sequelize.BelongsToManyGetAssociationsMixin<ref_ref>
  setRid_ref_ref_ref_keywords_refs!: Sequelize.BelongsToManySetAssociationsMixin<ref_ref, ref_refId>
  addRid_ref_ref_ref_keywords_ref!: Sequelize.BelongsToManyAddAssociationMixin<ref_ref, ref_refId>
  addRid_ref_ref_ref_keywords_refs!: Sequelize.BelongsToManyAddAssociationsMixin<ref_ref, ref_refId>
  createRid_ref_ref_ref_keywords_ref!: Sequelize.BelongsToManyCreateAssociationMixin<ref_ref>
  removeRid_ref_ref_ref_keywords_ref!: Sequelize.BelongsToManyRemoveAssociationMixin<ref_ref, ref_refId>
  removeRid_ref_ref_ref_keywords_refs!: Sequelize.BelongsToManyRemoveAssociationsMixin<ref_ref, ref_refId>
  hasRid_ref_ref_ref_keywords_ref!: Sequelize.BelongsToManyHasAssociationMixin<ref_ref, ref_refId>
  hasRid_ref_ref_ref_keywords_refs!: Sequelize.BelongsToManyHasAssociationsMixin<ref_ref, ref_refId>
  countRid_ref_ref_ref_keywords_refs!: Sequelize.BelongsToManyCountAssociationsMixin

  static initModel(sequelize: Sequelize.Sequelize): typeof ref_keywords {
    return ref_keywords.init(
      {
        keywords_id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        keyword: {
          type: DataTypes.STRING(50),
          allowNull: false,
          defaultValue: '',
        },
      },
      {
        sequelize,
        tableName: 'ref_keywords',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'keywords_id' }],
          },
        ],
      }
    )
  }
}
