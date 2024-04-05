import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { ref_field_name, ref_field_nameId } from './ref_field_name'
import type { ref_ref, ref_refId } from './ref_ref'

export interface ref_ref_typeAttributes {
  ref_type_id: number
  ref_type?: string
}

export type ref_ref_typePk = 'ref_type_id'
export type ref_ref_typeId = ref_ref_type[ref_ref_typePk]
export type ref_ref_typeOptionalAttributes = 'ref_type_id' | 'ref_type'
export type ref_ref_typeCreationAttributes = Optional<ref_ref_typeAttributes, ref_ref_typeOptionalAttributes>

export class ref_ref_type
  extends Model<ref_ref_typeAttributes, ref_ref_typeCreationAttributes>
  implements ref_ref_typeAttributes
{
  ref_type_id!: number
  ref_type?: string

  // ref_ref_type hasMany ref_field_name via ref_type_id
  ref_field_names!: ref_field_name[]
  getRef_field_names!: Sequelize.HasManyGetAssociationsMixin<ref_field_name>
  setRef_field_names!: Sequelize.HasManySetAssociationsMixin<ref_field_name, ref_field_nameId>
  addRef_field_name!: Sequelize.HasManyAddAssociationMixin<ref_field_name, ref_field_nameId>
  addRef_field_names!: Sequelize.HasManyAddAssociationsMixin<ref_field_name, ref_field_nameId>
  createRef_field_name!: Sequelize.HasManyCreateAssociationMixin<ref_field_name>
  removeRef_field_name!: Sequelize.HasManyRemoveAssociationMixin<ref_field_name, ref_field_nameId>
  removeRef_field_names!: Sequelize.HasManyRemoveAssociationsMixin<ref_field_name, ref_field_nameId>
  hasRef_field_name!: Sequelize.HasManyHasAssociationMixin<ref_field_name, ref_field_nameId>
  hasRef_field_names!: Sequelize.HasManyHasAssociationsMixin<ref_field_name, ref_field_nameId>
  countRef_field_names!: Sequelize.HasManyCountAssociationsMixin
  // ref_ref_type hasMany ref_ref via ref_type_id
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

  static initModel(sequelize: Sequelize.Sequelize): typeof ref_ref_type {
    return ref_ref_type.init(
      {
        ref_type_id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        ref_type: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'ref_ref_type',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'ref_type_id' }],
          },
        ],
      }
    )
  }
}
