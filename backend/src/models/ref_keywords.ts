import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

import type { ref_keywords_ref } from './ref_keywords_ref'
import type { ref_ref } from './ref_ref'

export class ref_keywords extends Model<InferAttributes<ref_keywords>, InferCreationAttributes<ref_keywords>> {
  declare keywords_id: CreationOptional<number>
  declare keyword: string

  // ref_keywords hasMany ref_keywords_ref via keywords_id
  declare ref_keywords_refs?: Sequelize.NonAttribute<ref_keywords_ref[]>
  declare getRef_keywords_refs: Sequelize.HasManyGetAssociationsMixin<ref_keywords_ref>
  declare setRef_keywords_refs: Sequelize.HasManySetAssociationsMixin<ref_keywords_ref, number>
  declare addRef_keywords_ref: Sequelize.HasManyAddAssociationMixin<ref_keywords_ref, number>
  declare addRef_keywords_refs: Sequelize.HasManyAddAssociationsMixin<ref_keywords_ref, number>
  declare createRef_keywords_ref: Sequelize.HasManyCreateAssociationMixin<ref_keywords_ref, 'keywords_id'>
  declare removeRef_keywords_ref: Sequelize.HasManyRemoveAssociationMixin<ref_keywords_ref, number>
  declare removeRef_keywords_refs: Sequelize.HasManyRemoveAssociationsMixin<ref_keywords_ref, number>
  declare hasRef_keywords_ref: Sequelize.HasManyHasAssociationMixin<ref_keywords_ref, number>
  declare hasRef_keywords_refs: Sequelize.HasManyHasAssociationsMixin<ref_keywords_ref, number>
  declare countRef_keywords_refs: Sequelize.HasManyCountAssociationsMixin
  // ref_keywords belongsToMany ref_ref via keywords_id and rid
  declare rid_ref_ref_ref_keywords_refs: Sequelize.NonAttribute<ref_ref[]>
  declare getRid_ref_ref_ref_keywords_refs: Sequelize.BelongsToManyGetAssociationsMixin<ref_ref>
  declare setRid_ref_ref_ref_keywords_refs: Sequelize.BelongsToManySetAssociationsMixin<ref_ref, number>
  declare addRid_ref_ref_ref_keywords_ref: Sequelize.BelongsToManyAddAssociationMixin<ref_ref, number>
  declare addRid_ref_ref_ref_keywords_refs: Sequelize.BelongsToManyAddAssociationsMixin<ref_ref, number>
  declare createRid_ref_ref_ref_keywords_ref: Sequelize.BelongsToManyCreateAssociationMixin<ref_ref, 'keywords_id'>
  declare removeRid_ref_ref_ref_keywords_ref: Sequelize.BelongsToManyRemoveAssociationMixin<ref_ref, number>
  declare removeRid_ref_ref_ref_keywords_refs: Sequelize.BelongsToManyRemoveAssociationsMixin<ref_ref, number>
  declare hasRid_ref_ref_ref_keywords_ref: Sequelize.BelongsToManyHasAssociationMixin<ref_ref, number>
  declare hasRid_ref_ref_ref_keywords_refs: Sequelize.BelongsToManyHasAssociationsMixin<ref_ref, number>
  declare countRid_ref_ref_ref_keywords_refs: Sequelize.BelongsToManyCountAssociationsMixin

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
