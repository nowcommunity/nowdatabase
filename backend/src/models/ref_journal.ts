import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { ref_ref, ref_refId } from './ref_ref'

export interface ref_journalAttributes {
  journal_id: number
  journal_title?: string
  short_title?: string
  alt_title?: string
  ISSN?: string
}

export type ref_journalPk = 'journal_id'
export type ref_journalId = ref_journal[ref_journalPk]
export type ref_journalOptionalAttributes = 'journal_id' | 'journal_title' | 'short_title' | 'alt_title' | 'ISSN'
export type ref_journalCreationAttributes = Optional<ref_journalAttributes, ref_journalOptionalAttributes>

export class ref_journal
  extends Model<ref_journalAttributes, ref_journalCreationAttributes>
  implements ref_journalAttributes
{
  journal_id!: number
  journal_title?: string
  short_title?: string
  alt_title?: string
  ISSN?: string

  // ref_journal hasMany ref_ref via journal_id
  ref_refs!: ref_ref[]
  getRef_refs!: Sequelize.HasManyGetAssociationsMixin<ref_ref>
  setRef_refs!: Sequelize.HasManySetAssociationsMixin<ref_ref, ref_refId>
  addRef_ref!: Sequelize.HasManyAddAssociationMixin<ref_ref, ref_refId>
  addRef_refs!: Sequelize.HasManyAddAssociationsMixin<ref_ref, ref_refId>
  createRef_ref!: Sequelize.HasManyCreateAssociationMixin<ref_ref>
  removeRef_ref!: Sequelize.HasManyRemoveAssociationMixin<ref_ref, ref_refId>
  removeRef_refs!: Sequelize.HasManyRemoveAssociationsMixin<ref_ref, ref_refId>
  hasRef_ref!: Sequelize.HasManyHasAssociationMixin<ref_ref, ref_refId>
  hasRef_refs!: Sequelize.HasManyHasAssociationsMixin<ref_ref, ref_refId>
  countRef_refs!: Sequelize.HasManyCountAssociationsMixin

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
