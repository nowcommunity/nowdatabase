import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

import type { ref_ref, ref_refId } from './ref_ref'

export class ref_authors extends Model<InferAttributes<ref_authors>, InferCreationAttributes<ref_authors>> {
  declare rid: CreationOptional<number>
  declare field_id: CreationOptional<number>
  declare au_num: CreationOptional<number>
  declare author_surname?: string
  declare author_initials?: string

  // ref_authors belongsTo ref_ref via rid
  declare rid_ref_ref?: Sequelize.NonAttribute<ref_ref>
  declare getRid_ref_ref: Sequelize.BelongsToGetAssociationMixin<ref_ref>
  declare setRid_ref_ref: Sequelize.BelongsToSetAssociationMixin<ref_ref, number>
  declare createRid_ref_ref: Sequelize.BelongsToCreateAssociationMixin<ref_ref>

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
