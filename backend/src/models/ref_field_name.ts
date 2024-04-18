import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

import type { ref_ref_type, ref_ref_typeId } from './ref_ref_type'

export class ref_field_name extends Model<InferAttributes<ref_field_name>, InferCreationAttributes<ref_field_name>> {
  declare field_ID: CreationOptional<number>
  declare ref_type_id: CreationOptional<number>
  declare ref_field_name?: string
  declare display?: number
  declare label_x?: number
  declare label_y?: number
  declare field_x?: number
  declare field_y?: number
  declare field_name?: string

  // ref_field_name belongsTo ref_ref_type via ref_type_id
  declare ref_type?: Sequelize.NonAttribute<ref_ref_type>
  declare getRef_type: Sequelize.BelongsToGetAssociationMixin<ref_ref_type>
  declare setRef_type: Sequelize.BelongsToSetAssociationMixin<ref_ref_type, number>
  declare createRef_type: Sequelize.BelongsToCreateAssociationMixin<ref_ref_type>

  static initModel(sequelize: Sequelize.Sequelize): typeof ref_field_name {
    return ref_field_name.init(
      {
        field_ID: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          primaryKey: true,
        },
        ref_type_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          primaryKey: true,
          references: {
            model: 'ref_ref_type',
            key: 'ref_type_id',
          },
        },
        ref_field_name: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        display: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        label_x: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        label_y: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        field_x: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        field_y: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        field_name: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'ref_field_name',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'field_ID' }, { name: 'ref_type_id' }],
          },
          {
            name: 'ref_field_name_FKIndex1',
            using: 'BTREE',
            fields: [{ name: 'ref_type_id' }],
          },
        ],
      }
    )
  }
}
