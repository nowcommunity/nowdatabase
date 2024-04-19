import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { now_bau, now_bauId } from './now_bau'
import type { now_time_unit, now_time_unitId } from './now_time_unit'
import type { now_tur, now_turId } from './now_tur'
import type { ref_ref, ref_refId } from './ref_ref'

export interface now_tu_boundAttributes {
  bid: number
  b_name?: string
  age?: number
  b_comment?: string
}

export type now_tu_boundPk = 'bid'
export type now_tu_boundId = now_tu_bound[now_tu_boundPk]
export type now_tu_boundOptionalAttributes = 'bid' | 'b_name' | 'age' | 'b_comment'
export type now_tu_boundCreationAttributes = Optional<now_tu_boundAttributes, now_tu_boundOptionalAttributes>

export class now_tu_bound
  extends Model<now_tu_boundAttributes, now_tu_boundCreationAttributes>
  implements now_tu_boundAttributes
{
  declare bid: number
  declare b_name?: string
  declare age?: number
  declare b_comment?: string

  // now_tu_bound hasMany now_bau via bid
  declare now_baus: now_bau[]
  declare getNow_baus: Sequelize.HasManyGetAssociationsMixin<now_bau>
  declare setNow_baus: Sequelize.HasManySetAssociationsMixin<now_bau, now_bauId>
  declare addNow_bau: Sequelize.HasManyAddAssociationMixin<now_bau, now_bauId>
  declare addNow_baus: Sequelize.HasManyAddAssociationsMixin<now_bau, now_bauId>
  declare createNow_bau: Sequelize.HasManyCreateAssociationMixin<now_bau>
  declare removeNow_bau: Sequelize.HasManyRemoveAssociationMixin<now_bau, now_bauId>
  declare removeNow_baus: Sequelize.HasManyRemoveAssociationsMixin<now_bau, now_bauId>
  declare hasNow_bau: Sequelize.HasManyHasAssociationMixin<now_bau, now_bauId>
  declare hasNow_baus: Sequelize.HasManyHasAssociationsMixin<now_bau, now_bauId>
  declare countNow_baus: Sequelize.HasManyCountAssociationsMixin
  // now_tu_bound hasMany now_time_unit via up_bnd
  declare now_time_units: now_time_unit[]
  declare getNow_time_units: Sequelize.HasManyGetAssociationsMixin<now_time_unit>
  declare setNow_time_units: Sequelize.HasManySetAssociationsMixin<now_time_unit, now_time_unitId>
  declare addNow_time_unit: Sequelize.HasManyAddAssociationMixin<now_time_unit, now_time_unitId>
  declare addNow_time_units: Sequelize.HasManyAddAssociationsMixin<now_time_unit, now_time_unitId>
  declare createNow_time_unit: Sequelize.HasManyCreateAssociationMixin<now_time_unit>
  declare removeNow_time_unit: Sequelize.HasManyRemoveAssociationMixin<now_time_unit, now_time_unitId>
  declare removeNow_time_units: Sequelize.HasManyRemoveAssociationsMixin<now_time_unit, now_time_unitId>
  declare hasNow_time_unit: Sequelize.HasManyHasAssociationMixin<now_time_unit, now_time_unitId>
  declare hasNow_time_units: Sequelize.HasManyHasAssociationsMixin<now_time_unit, now_time_unitId>
  declare countNow_time_units: Sequelize.HasManyCountAssociationsMixin
  // now_tu_bound hasMany now_time_unit via low_bnd
  declare low_bnd_now_time_units: now_time_unit[]
  declare getLow_bnd_now_time_units: Sequelize.HasManyGetAssociationsMixin<now_time_unit>
  declare setLow_bnd_now_time_units: Sequelize.HasManySetAssociationsMixin<now_time_unit, now_time_unitId>
  declare addLow_bnd_now_time_unit: Sequelize.HasManyAddAssociationMixin<now_time_unit, now_time_unitId>
  declare addLow_bnd_now_time_units: Sequelize.HasManyAddAssociationsMixin<now_time_unit, now_time_unitId>
  declare createLow_bnd_now_time_unit: Sequelize.HasManyCreateAssociationMixin<now_time_unit>
  declare removeLow_bnd_now_time_unit: Sequelize.HasManyRemoveAssociationMixin<now_time_unit, now_time_unitId>
  declare removeLow_bnd_now_time_units: Sequelize.HasManyRemoveAssociationsMixin<now_time_unit, now_time_unitId>
  declare hasLow_bnd_now_time_unit: Sequelize.HasManyHasAssociationMixin<now_time_unit, now_time_unitId>
  declare hasLow_bnd_now_time_units: Sequelize.HasManyHasAssociationsMixin<now_time_unit, now_time_unitId>
  declare countLow_bnd_now_time_units: Sequelize.HasManyCountAssociationsMixin
  // now_tu_bound hasMany now_tur via bid
  declare now_turs: now_tur[]
  declare getNow_turs: Sequelize.HasManyGetAssociationsMixin<now_tur>
  declare setNow_turs: Sequelize.HasManySetAssociationsMixin<now_tur, now_turId>
  declare addNow_tur: Sequelize.HasManyAddAssociationMixin<now_tur, now_turId>
  declare addNow_turs: Sequelize.HasManyAddAssociationsMixin<now_tur, now_turId>
  declare createNow_tur: Sequelize.HasManyCreateAssociationMixin<now_tur>
  declare removeNow_tur: Sequelize.HasManyRemoveAssociationMixin<now_tur, now_turId>
  declare removeNow_turs: Sequelize.HasManyRemoveAssociationsMixin<now_tur, now_turId>
  declare hasNow_tur: Sequelize.HasManyHasAssociationMixin<now_tur, now_turId>
  declare hasNow_turs: Sequelize.HasManyHasAssociationsMixin<now_tur, now_turId>
  declare countNow_turs: Sequelize.HasManyCountAssociationsMixin
  // now_tu_bound belongsToMany ref_ref via bid and rid
  declare rid_ref_ref_now_turs: ref_ref[]
  declare getRid_ref_ref_now_turs: Sequelize.BelongsToManyGetAssociationsMixin<ref_ref>
  declare setRid_ref_ref_now_turs: Sequelize.BelongsToManySetAssociationsMixin<ref_ref, ref_refId>
  declare addRid_ref_ref_now_tur: Sequelize.BelongsToManyAddAssociationMixin<ref_ref, ref_refId>
  declare addRid_ref_ref_now_turs: Sequelize.BelongsToManyAddAssociationsMixin<ref_ref, ref_refId>
  declare createRid_ref_ref_now_tur: Sequelize.BelongsToManyCreateAssociationMixin<ref_ref>
  declare removeRid_ref_ref_now_tur: Sequelize.BelongsToManyRemoveAssociationMixin<ref_ref, ref_refId>
  declare removeRid_ref_ref_now_turs: Sequelize.BelongsToManyRemoveAssociationsMixin<ref_ref, ref_refId>
  declare hasRid_ref_ref_now_tur: Sequelize.BelongsToManyHasAssociationMixin<ref_ref, ref_refId>
  declare hasRid_ref_ref_now_turs: Sequelize.BelongsToManyHasAssociationsMixin<ref_ref, ref_refId>
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
