import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { now_loc, now_locId } from './now_loc'
import type { now_tau, now_tauId } from './now_tau'
import type { now_time_update, now_time_updateId } from './now_time_update'
import type { now_tu_bound, now_tu_boundId } from './now_tu_bound'
import type { now_tu_sequence, now_tu_sequenceId } from './now_tu_sequence'

export interface now_time_unitAttributes {
  tu_name: string
  tu_display_name: string
  up_bnd: number
  low_bnd: number
  rank?: string
  sequence: string
  tu_comment?: string
}

export type now_time_unitPk = 'tu_name'
export type now_time_unitId = now_time_unit[now_time_unitPk]
export type now_time_unitOptionalAttributes =
  | 'tu_name'
  | 'tu_display_name'
  | 'up_bnd'
  | 'low_bnd'
  | 'rank'
  | 'sequence'
  | 'tu_comment'
export type now_time_unitCreationAttributes = Optional<now_time_unitAttributes, now_time_unitOptionalAttributes>

export class now_time_unit
  extends Model<now_time_unitAttributes, now_time_unitCreationAttributes>
  implements now_time_unitAttributes
{
  declare tu_name: string
  declare tu_display_name: string
  declare up_bnd: number
  declare low_bnd: number
  declare rank?: string
  declare sequence: string
  declare tu_comment?: string

  // now_time_unit hasMany now_loc via bfa_max
  declare now_locs: now_loc[]
  declare getNow_locs: Sequelize.HasManyGetAssociationsMixin<now_loc>
  declare setNow_locs: Sequelize.HasManySetAssociationsMixin<now_loc, now_locId>
  declare addNow_loc: Sequelize.HasManyAddAssociationMixin<now_loc, now_locId>
  declare addNow_locs: Sequelize.HasManyAddAssociationsMixin<now_loc, now_locId>
  declare createNow_loc: Sequelize.HasManyCreateAssociationMixin<now_loc>
  declare removeNow_loc: Sequelize.HasManyRemoveAssociationMixin<now_loc, now_locId>
  declare removeNow_locs: Sequelize.HasManyRemoveAssociationsMixin<now_loc, now_locId>
  declare hasNow_loc: Sequelize.HasManyHasAssociationMixin<now_loc, now_locId>
  declare hasNow_locs: Sequelize.HasManyHasAssociationsMixin<now_loc, now_locId>
  declare countNow_locs: Sequelize.HasManyCountAssociationsMixin
  // now_time_unit hasMany now_loc via bfa_min
  declare bfa_min_now_locs: now_loc[]
  declare getBfa_min_now_locs: Sequelize.HasManyGetAssociationsMixin<now_loc>
  declare setBfa_min_now_locs: Sequelize.HasManySetAssociationsMixin<now_loc, now_locId>
  declare addBfa_min_now_loc: Sequelize.HasManyAddAssociationMixin<now_loc, now_locId>
  declare addBfa_min_now_locs: Sequelize.HasManyAddAssociationsMixin<now_loc, now_locId>
  declare createBfa_min_now_loc: Sequelize.HasManyCreateAssociationMixin<now_loc>
  declare removeBfa_min_now_loc: Sequelize.HasManyRemoveAssociationMixin<now_loc, now_locId>
  declare removeBfa_min_now_locs: Sequelize.HasManyRemoveAssociationsMixin<now_loc, now_locId>
  declare hasBfa_min_now_loc: Sequelize.HasManyHasAssociationMixin<now_loc, now_locId>
  declare hasBfa_min_now_locs: Sequelize.HasManyHasAssociationsMixin<now_loc, now_locId>
  declare countBfa_min_now_locs: Sequelize.HasManyCountAssociationsMixin
  // now_time_unit hasMany now_tau via tu_name
  declare now_taus: now_tau[]
  declare getNow_taus: Sequelize.HasManyGetAssociationsMixin<now_tau>
  declare setNow_taus: Sequelize.HasManySetAssociationsMixin<now_tau, now_tauId>
  declare addNow_tau: Sequelize.HasManyAddAssociationMixin<now_tau, now_tauId>
  declare addNow_taus: Sequelize.HasManyAddAssociationsMixin<now_tau, now_tauId>
  declare createNow_tau: Sequelize.HasManyCreateAssociationMixin<now_tau>
  declare removeNow_tau: Sequelize.HasManyRemoveAssociationMixin<now_tau, now_tauId>
  declare removeNow_taus: Sequelize.HasManyRemoveAssociationsMixin<now_tau, now_tauId>
  declare hasNow_tau: Sequelize.HasManyHasAssociationMixin<now_tau, now_tauId>
  declare hasNow_taus: Sequelize.HasManyHasAssociationsMixin<now_tau, now_tauId>
  declare countNow_taus: Sequelize.HasManyCountAssociationsMixin
  // now_time_unit hasMany now_time_update via tu_name
  declare now_time_updates: now_time_update[]
  declare getNow_time_updates: Sequelize.HasManyGetAssociationsMixin<now_time_update>
  declare setNow_time_updates: Sequelize.HasManySetAssociationsMixin<now_time_update, now_time_updateId>
  declare addNow_time_update: Sequelize.HasManyAddAssociationMixin<now_time_update, now_time_updateId>
  declare addNow_time_updates: Sequelize.HasManyAddAssociationsMixin<now_time_update, now_time_updateId>
  declare createNow_time_update: Sequelize.HasManyCreateAssociationMixin<now_time_update>
  declare removeNow_time_update: Sequelize.HasManyRemoveAssociationMixin<now_time_update, now_time_updateId>
  declare removeNow_time_updates: Sequelize.HasManyRemoveAssociationsMixin<now_time_update, now_time_updateId>
  declare hasNow_time_update: Sequelize.HasManyHasAssociationMixin<now_time_update, now_time_updateId>
  declare hasNow_time_updates: Sequelize.HasManyHasAssociationsMixin<now_time_update, now_time_updateId>
  declare countNow_time_updates: Sequelize.HasManyCountAssociationsMixin
  // now_time_unit belongsTo now_tu_bound via up_bnd
  declare up_bnd_now_tu_bound: now_tu_bound
  declare getUp_bnd_now_tu_bound: Sequelize.BelongsToGetAssociationMixin<now_tu_bound>
  declare setUp_bnd_now_tu_bound: Sequelize.BelongsToSetAssociationMixin<now_tu_bound, now_tu_boundId>
  declare createUp_bnd_now_tu_bound: Sequelize.BelongsToCreateAssociationMixin<now_tu_bound>
  // now_time_unit belongsTo now_tu_bound via low_bnd
  declare low_bnd_now_tu_bound: now_tu_bound
  declare getLow_bnd_now_tu_bound: Sequelize.BelongsToGetAssociationMixin<now_tu_bound>
  declare setLow_bnd_now_tu_bound: Sequelize.BelongsToSetAssociationMixin<now_tu_bound, now_tu_boundId>
  declare createLow_bnd_now_tu_bound: Sequelize.BelongsToCreateAssociationMixin<now_tu_bound>
  // now_time_unit belongsTo now_tu_sequence via sequence
  declare sequence_now_tu_sequence: now_tu_sequence
  declare getSequence_now_tu_sequence: Sequelize.BelongsToGetAssociationMixin<now_tu_sequence>
  declare setSequence_now_tu_sequence: Sequelize.BelongsToSetAssociationMixin<now_tu_sequence, now_tu_sequenceId>
  declare createSequence_now_tu_sequence: Sequelize.BelongsToCreateAssociationMixin<now_tu_sequence>

  static initModel(sequelize: Sequelize.Sequelize): typeof now_time_unit {
    return now_time_unit.init(
      {
        tu_name: {
          type: DataTypes.STRING(100),
          allowNull: false,
          defaultValue: '',
          primaryKey: true,
        },
        tu_display_name: {
          type: DataTypes.STRING(100),
          allowNull: false,
          defaultValue: '',
        },
        up_bnd: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          references: {
            model: 'now_tu_bound',
            key: 'bid',
          },
        },
        low_bnd: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          references: {
            model: 'now_tu_bound',
            key: 'bid',
          },
        },
        rank: {
          type: DataTypes.STRING(15),
          allowNull: true,
        },
        sequence: {
          type: DataTypes.STRING(30),
          allowNull: false,
          defaultValue: '',
          references: {
            model: 'now_tu_sequence',
            key: 'sequence',
          },
        },
        tu_comment: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'now_time_unit',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'tu_name' }],
          },
          {
            name: 'now_test_time_unit_FKIndex1',
            using: 'BTREE',
            fields: [{ name: 'low_bnd' }],
          },
          {
            name: 'now_test_time_unit_FKIndex2',
            using: 'BTREE',
            fields: [{ name: 'up_bnd' }],
          },
          {
            name: 'now_test_time_unit_FKIndex3',
            using: 'BTREE',
            fields: [{ name: 'sequence' }],
          },
        ],
      }
    )
  }
}
