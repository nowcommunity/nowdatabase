import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

import type { now_bau } from './now_bau'
import type { now_time_unit } from './now_time_unit'
import type { now_tur } from './now_tur'
import type { ref_ref } from './ref_ref'

export class now_tu_bound extends Model<InferAttributes<now_tu_bound>, InferCreationAttributes<now_tu_bound>> {
  declare bid: CreationOptional<number>
  declare b_name?: string
  declare age?: number
  declare b_comment?: string

  // now_tu_bound hasMany now_bau via bid
  declare now_baus?: Sequelize.NonAttribute<now_bau[]>
  declare getNow_baus: Sequelize.HasManyGetAssociationsMixin<now_bau>
  declare setNow_baus: Sequelize.HasManySetAssociationsMixin<now_bau, number>
  declare addNow_bau: Sequelize.HasManyAddAssociationMixin<now_bau, number>
  declare addNow_baus: Sequelize.HasManyAddAssociationsMixin<now_bau, number>
  declare createNow_bau: Sequelize.HasManyCreateAssociationMixin<now_bau, 'bid'>
  declare removeNow_bau: Sequelize.HasManyRemoveAssociationMixin<now_bau, number>
  declare removeNow_baus: Sequelize.HasManyRemoveAssociationsMixin<now_bau, number>
  declare hasNow_bau: Sequelize.HasManyHasAssociationMixin<now_bau, number>
  declare hasNow_baus: Sequelize.HasManyHasAssociationsMixin<now_bau, number>
  declare countNow_baus: Sequelize.HasManyCountAssociationsMixin
  // now_tu_bound hasMany now_time_unit via up_bnd
  declare now_time_units?: Sequelize.NonAttribute<now_time_unit[]>
  declare getNow_time_units: Sequelize.HasManyGetAssociationsMixin<now_time_unit>
  declare setNow_time_units: Sequelize.HasManySetAssociationsMixin<now_time_unit, number>
  declare addNow_time_unit: Sequelize.HasManyAddAssociationMixin<now_time_unit, number>
  declare addNow_time_units: Sequelize.HasManyAddAssociationsMixin<now_time_unit, number>
  declare createNow_time_unit: Sequelize.HasManyCreateAssociationMixin<now_time_unit, 'up_bnd'>
  declare removeNow_time_unit: Sequelize.HasManyRemoveAssociationMixin<now_time_unit, number>
  declare removeNow_time_units: Sequelize.HasManyRemoveAssociationsMixin<now_time_unit, number>
  declare hasNow_time_unit: Sequelize.HasManyHasAssociationMixin<now_time_unit, number>
  declare hasNow_time_units: Sequelize.HasManyHasAssociationsMixin<now_time_unit, number>
  declare countNow_time_units: Sequelize.HasManyCountAssociationsMixin
  // now_tu_bound hasMany now_time_unit via low_bnd
  declare low_bnd_now_time_units?: Sequelize.NonAttribute<now_time_unit[]>
  declare getLow_bnd_now_time_units: Sequelize.HasManyGetAssociationsMixin<now_time_unit>
  declare setLow_bnd_now_time_units: Sequelize.HasManySetAssociationsMixin<now_time_unit, number>
  declare addLow_bnd_now_time_unit: Sequelize.HasManyAddAssociationMixin<now_time_unit, number>
  declare addLow_bnd_now_time_units: Sequelize.HasManyAddAssociationsMixin<now_time_unit, number>
  declare createLow_bnd_now_time_unit: Sequelize.HasManyCreateAssociationMixin<now_time_unit, 'low_bnd'>
  declare removeLow_bnd_now_time_unit: Sequelize.HasManyRemoveAssociationMixin<now_time_unit, number>
  declare removeLow_bnd_now_time_units: Sequelize.HasManyRemoveAssociationsMixin<now_time_unit, number>
  declare hasLow_bnd_now_time_unit: Sequelize.HasManyHasAssociationMixin<now_time_unit, number>
  declare hasLow_bnd_now_time_units: Sequelize.HasManyHasAssociationsMixin<now_time_unit, number>
  declare countLow_bnd_now_time_units: Sequelize.HasManyCountAssociationsMixin
  // now_tu_bound hasMany now_tur via bid
  declare now_turs?: Sequelize.NonAttribute<now_tur[]>
  declare getNow_turs: Sequelize.HasManyGetAssociationsMixin<now_tur>
  declare setNow_turs: Sequelize.HasManySetAssociationsMixin<now_tur, number>
  declare addNow_tur: Sequelize.HasManyAddAssociationMixin<now_tur, number>
  declare addNow_turs: Sequelize.HasManyAddAssociationsMixin<now_tur, number>
  declare createNow_tur: Sequelize.HasManyCreateAssociationMixin<now_tur, 'bid'>
  declare removeNow_tur: Sequelize.HasManyRemoveAssociationMixin<now_tur, number>
  declare removeNow_turs: Sequelize.HasManyRemoveAssociationsMixin<now_tur, number>
  declare hasNow_tur: Sequelize.HasManyHasAssociationMixin<now_tur, number>
  declare hasNow_turs: Sequelize.HasManyHasAssociationsMixin<now_tur, number>
  declare countNow_turs: Sequelize.HasManyCountAssociationsMixin
  // now_tu_bound belongsToMany ref_ref via bid and rid
  declare rid_ref_ref_now_turs: Sequelize.NonAttribute<ref_ref[]>
  declare getRid_ref_ref_now_turs: Sequelize.BelongsToManyGetAssociationsMixin<ref_ref>
  declare setRid_ref_ref_now_turs: Sequelize.BelongsToManySetAssociationsMixin<ref_ref, number>
  declare addRid_ref_ref_now_tur: Sequelize.BelongsToManyAddAssociationMixin<ref_ref, number>
  declare addRid_ref_ref_now_turs: Sequelize.BelongsToManyAddAssociationsMixin<ref_ref, number>
  declare createRid_ref_ref_now_tur: Sequelize.BelongsToManyCreateAssociationMixin<ref_ref, 'bid'>
  declare removeRid_ref_ref_now_tur: Sequelize.BelongsToManyRemoveAssociationMixin<ref_ref, number>
  declare removeRid_ref_ref_now_turs: Sequelize.BelongsToManyRemoveAssociationsMixin<ref_ref, number>
  declare hasRid_ref_ref_now_tur: Sequelize.BelongsToManyHasAssociationMixin<ref_ref, number>
  declare hasRid_ref_ref_now_turs: Sequelize.BelongsToManyHasAssociationsMixin<ref_ref, number>
  declare countRid_ref_ref_now_turs: Sequelize.BelongsToManyCountAssociationsMixin

  static initModel(sequelize: Sequelize.Sequelize): typeof now_tu_bound {
    return now_tu_bound.init(
      {
        bid: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        b_name: {
          type: DataTypes.STRING(150),
          allowNull: true,
        },
        age: {
          type: DataTypes.DOUBLE,
          allowNull: true,
        },
        b_comment: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'now_tu_bound',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'bid' }],
          },
        ],
      }
    )
  }
}
