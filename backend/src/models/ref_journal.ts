import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

import type { ref_ref } from './ref_ref'

export class ref_journal extends Model<InferAttributes<ref_journal>, InferCreationAttributes<ref_journal>> {
  declare journal_id: CreationOptional<number>
  declare journal_title?: string
  declare short_title?: string
  declare alt_title?: string
  declare ISSN?: string

  // ref_journal hasMany ref_ref via journal_id
  declare ref_refs?: Sequelize.NonAttribute<ref_ref[]>
  declare getRef_refs: Sequelize.HasManyGetAssociationsMixin<ref_ref>
  declare setRef_refs: Sequelize.HasManySetAssociationsMixin<ref_ref, number>
  declare addRef_ref: Sequelize.HasManyAddAssociationMixin<ref_ref, number>
  declare addRef_refs: Sequelize.HasManyAddAssociationsMixin<ref_ref, number>
  declare createRef_ref: Sequelize.HasManyCreateAssociationMixin<ref_ref, 'journal_id'>
  declare removeRef_ref: Sequelize.HasManyRemoveAssociationMixin<ref_ref, number>
  declare removeRef_refs: Sequelize.HasManyRemoveAssociationsMixin<ref_ref, number>
  declare hasRef_ref: Sequelize.HasManyHasAssociationMixin<ref_ref, number>
  declare hasRef_refs: Sequelize.HasManyHasAssociationsMixin<ref_ref, number>
  declare countRef_refs: Sequelize.HasManyCountAssociationsMixin

  static initModel(sequelize: Sequelize.Sequelize): typeof ref_journal {
    return ref_journal.init(
      {
        journal_id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        journal_title: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        short_title: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        alt_title: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        ISSN: {
          type: DataTypes.STRING(10),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'ref_journal',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'journal_id' }],
          },
        ],
      }
    )
  }
}
