import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { ref_ref_type, ref_ref_typeId } from './ref_ref_type'

export interface ref_field_nameAttributes {
  field_ID: number
  ref_type_id: number
  ref_field_name?: string
  display?: number
  label_x?: number
  label_y?: number
  field_x?: number
  field_y?: number
  field_name?: string
}

export type ref_field_namePk = 'field_ID' | 'ref_type_id'
export type ref_field_nameId = ref_field_name[ref_field_namePk]
export type ref_field_nameOptionalAttributes =
  | 'field_ID'
  | 'ref_type_id'
  | 'ref_field_name'
  | 'display'
  | 'label_x'
  | 'label_y'
  | 'field_x'
  | 'field_y'
  | 'field_name'
export type ref_field_nameCreationAttributes = Optional<ref_field_nameAttributes, ref_field_nameOptionalAttributes>

export class ref_field_name
  extends Model<ref_field_nameAttributes, ref_field_nameCreationAttributes>
  implements ref_field_nameAttributes
{
  declare field_ID: number
  declare ref_type_id: number
  declare ref_field_name?: string
  declare display?: number
  declare label_x?: number
  declare label_y?: number
  declare field_x?: number
  declare field_y?: number
  declare field_name?: string

  // ref_field_name belongsTo ref_ref_type via ref_type_id
  declare ref_type: ref_ref_type
  declare getRef_type: Sequelize.BelongsToGetAssociationMixin<ref_ref_type>
  declare setRef_type: Sequelize.BelongsToSetAssociationMixin<ref_ref_type, ref_ref_typeId>
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
