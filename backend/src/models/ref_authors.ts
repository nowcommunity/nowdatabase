import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { ref_ref, ref_refId } from './ref_ref'

export interface ref_authorsAttributes {
  rid: number
  field_id: number
  au_num: number
  author_surname?: string
  author_initials?: string
}

export type ref_authorsPk = 'rid' | 'field_id' | 'au_num'
export type ref_authorsId = ref_authors[ref_authorsPk]
export type ref_authorsOptionalAttributes = 'rid' | 'field_id' | 'au_num' | 'author_surname' | 'author_initials'
export type ref_authorsCreationAttributes = Optional<ref_authorsAttributes, ref_authorsOptionalAttributes>

export class ref_authors
  extends Model<ref_authorsAttributes, ref_authorsCreationAttributes>
  implements ref_authorsAttributes
{
  rid!: number
  field_id!: number
  au_num!: number
  author_surname?: string
  author_initials?: string

  // ref_authors belongsTo ref_ref via rid
  rid_ref_ref!: ref_ref
  getRid_ref_ref!: Sequelize.BelongsToGetAssociationMixin<ref_ref>
  setRid_ref_ref!: Sequelize.BelongsToSetAssociationMixin<ref_ref, ref_refId>
  createRid_ref_ref!: Sequelize.BelongsToCreateAssociationMixin<ref_ref>

  static initModel(sequelize: Sequelize.Sequelize): typeof ref_authors {
    return ref_authors.init(
      {
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
        field_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          primaryKey: true,
        },
        au_num: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          primaryKey: true,
        },
        author_surname: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        author_initials: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'ref_authors',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'rid' }, { name: 'field_id' }, { name: 'au_num' }],
          },
          {
            name: 'ref_authors_FKIndex1',
            using: 'BTREE',
            fields: [{ name: 'rid' }],
          },
        ],
      }
    )
  }
}
