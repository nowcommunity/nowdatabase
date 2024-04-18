import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

import type { ref_field_name } from './ref_field_name'
import type { ref_ref } from './ref_ref'

export class ref_ref_type extends Model<InferAttributes<ref_ref_type>, InferCreationAttributes<ref_ref_type>> {
  declare ref_type_id: CreationOptional<number>
  declare ref_type?: string

  // ref_ref_type hasMany ref_field_name via ref_type_id
  declare ref_field_names?: Sequelize.NonAttribute<ref_field_name[]>
  declare getRef_field_names: Sequelize.HasManyGetAssociationsMixin<ref_field_name>
  declare setRef_field_names: Sequelize.HasManySetAssociationsMixin<ref_field_name, number>
  declare addRef_field_name: Sequelize.HasManyAddAssociationMixin<ref_field_name, number>
  declare addRef_field_names: Sequelize.HasManyAddAssociationsMixin<ref_field_name, number>
  declare createRef_field_name: Sequelize.HasManyCreateAssociationMixin<ref_field_name, 'ref_type_id'>
  declare removeRef_field_name: Sequelize.HasManyRemoveAssociationMixin<ref_field_name, number>
  declare removeRef_field_names: Sequelize.HasManyRemoveAssociationsMixin<ref_field_name, number>
  declare hasRef_field_name: Sequelize.HasManyHasAssociationMixin<ref_field_name, number>
  declare hasRef_field_names: Sequelize.HasManyHasAssociationsMixin<ref_field_name, number>
  declare countRef_field_names: Sequelize.HasManyCountAssociationsMixin
  // ref_ref_type hasMany ref_ref via ref_type_id
  declare ref_refs?: Sequelize.NonAttribute<ref_ref[]>
  declare getRef_refs: Sequelize.HasManyGetAssociationsMixin<ref_ref>
  declare setRef_refs: Sequelize.HasManySetAssociationsMixin<ref_ref, number>
  declare addRef_ref: Sequelize.HasManyAddAssociationMixin<ref_ref, number>
  declare addRef_refs: Sequelize.HasManyAddAssociationsMixin<ref_ref, number>
  declare createRef_ref: Sequelize.HasManyCreateAssociationMixin<ref_ref, 'ref_type_id'>
  declare removeRef_ref: Sequelize.HasManyRemoveAssociationMixin<ref_ref, number>
  declare removeRef_refs: Sequelize.HasManyRemoveAssociationsMixin<ref_ref, number>
  declare hasRef_ref: Sequelize.HasManyHasAssociationMixin<ref_ref, number>
  declare hasRef_refs: Sequelize.HasManyHasAssociationsMixin<ref_ref, number>
  declare countRef_refs: Sequelize.HasManyCountAssociationsMixin

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
