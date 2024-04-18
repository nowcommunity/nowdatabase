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
  tu_name!: string
  tu_display_name!: string
  up_bnd!: number
  low_bnd!: number
  rank?: string
  sequence!: string
  tu_comment?: string

  // now_time_unit hasMany now_loc via bfa_max
  now_locs!: now_loc[]
  getNow_locs!: Sequelize.HasManyGetAssociationsMixin<now_loc>
  setNow_locs!: Sequelize.HasManySetAssociationsMixin<now_loc, now_locId>
  addNow_loc!: Sequelize.HasManyAddAssociationMixin<now_loc, now_locId>
  addNow_locs!: Sequelize.HasManyAddAssociationsMixin<now_loc, now_locId>
  createNow_loc!: Sequelize.HasManyCreateAssociationMixin<now_loc>
  removeNow_loc!: Sequelize.HasManyRemoveAssociationMixin<now_loc, now_locId>
  removeNow_locs!: Sequelize.HasManyRemoveAssociationsMixin<now_loc, now_locId>
  hasNow_loc!: Sequelize.HasManyHasAssociationMixin<now_loc, now_locId>
  hasNow_locs!: Sequelize.HasManyHasAssociationsMixin<now_loc, now_locId>
  countNow_locs!: Sequelize.HasManyCountAssociationsMixin
  // now_time_unit hasMany now_loc via bfa_min
  bfa_min_now_locs!: now_loc[]
  getBfa_min_now_locs!: Sequelize.HasManyGetAssociationsMixin<now_loc>
  setBfa_min_now_locs!: Sequelize.HasManySetAssociationsMixin<now_loc, now_locId>
  addBfa_min_now_loc!: Sequelize.HasManyAddAssociationMixin<now_loc, now_locId>
  addBfa_min_now_locs!: Sequelize.HasManyAddAssociationsMixin<now_loc, now_locId>
  createBfa_min_now_loc!: Sequelize.HasManyCreateAssociationMixin<now_loc>
  removeBfa_min_now_loc!: Sequelize.HasManyRemoveAssociationMixin<now_loc, now_locId>
  removeBfa_min_now_locs!: Sequelize.HasManyRemoveAssociationsMixin<now_loc, now_locId>
  hasBfa_min_now_loc!: Sequelize.HasManyHasAssociationMixin<now_loc, now_locId>
  hasBfa_min_now_locs!: Sequelize.HasManyHasAssociationsMixin<now_loc, now_locId>
  countBfa_min_now_locs!: Sequelize.HasManyCountAssociationsMixin
  // now_time_unit hasMany now_tau via tu_name
  now_taus!: now_tau[]
  getNow_taus!: Sequelize.HasManyGetAssociationsMixin<now_tau>
  setNow_taus!: Sequelize.HasManySetAssociationsMixin<now_tau, now_tauId>
  addNow_tau!: Sequelize.HasManyAddAssociationMixin<now_tau, now_tauId>
  addNow_taus!: Sequelize.HasManyAddAssociationsMixin<now_tau, now_tauId>
  createNow_tau!: Sequelize.HasManyCreateAssociationMixin<now_tau>
  removeNow_tau!: Sequelize.HasManyRemoveAssociationMixin<now_tau, now_tauId>
  removeNow_taus!: Sequelize.HasManyRemoveAssociationsMixin<now_tau, now_tauId>
  hasNow_tau!: Sequelize.HasManyHasAssociationMixin<now_tau, now_tauId>
  hasNow_taus!: Sequelize.HasManyHasAssociationsMixin<now_tau, now_tauId>
  countNow_taus!: Sequelize.HasManyCountAssociationsMixin
  // now_time_unit hasMany now_time_update via tu_name
  now_time_updates!: now_time_update[]
  getNow_time_updates!: Sequelize.HasManyGetAssociationsMixin<now_time_update>
  setNow_time_updates!: Sequelize.HasManySetAssociationsMixin<now_time_update, now_time_updateId>
  addNow_time_update!: Sequelize.HasManyAddAssociationMixin<now_time_update, now_time_updateId>
  addNow_time_updates!: Sequelize.HasManyAddAssociationsMixin<now_time_update, now_time_updateId>
  createNow_time_update!: Sequelize.HasManyCreateAssociationMixin<now_time_update>
  removeNow_time_update!: Sequelize.HasManyRemoveAssociationMixin<now_time_update, now_time_updateId>
  removeNow_time_updates!: Sequelize.HasManyRemoveAssociationsMixin<now_time_update, now_time_updateId>
  hasNow_time_update!: Sequelize.HasManyHasAssociationMixin<now_time_update, now_time_updateId>
  hasNow_time_updates!: Sequelize.HasManyHasAssociationsMixin<now_time_update, now_time_updateId>
  countNow_time_updates!: Sequelize.HasManyCountAssociationsMixin
  // now_time_unit belongsTo now_tu_bound via up_bnd
  up_bnd_now_tu_bound!: now_tu_bound
  getUp_bnd_now_tu_bound!: Sequelize.BelongsToGetAssociationMixin<now_tu_bound>
  setUp_bnd_now_tu_bound!: Sequelize.BelongsToSetAssociationMixin<now_tu_bound, now_tu_boundId>
  createUp_bnd_now_tu_bound!: Sequelize.BelongsToCreateAssociationMixin<now_tu_bound>
  // now_time_unit belongsTo now_tu_bound via low_bnd
  low_bnd_now_tu_bound!: now_tu_bound
  getLow_bnd_now_tu_bound!: Sequelize.BelongsToGetAssociationMixin<now_tu_bound>
  setLow_bnd_now_tu_bound!: Sequelize.BelongsToSetAssociationMixin<now_tu_bound, now_tu_boundId>
  createLow_bnd_now_tu_bound!: Sequelize.BelongsToCreateAssociationMixin<now_tu_bound>
  // now_time_unit belongsTo now_tu_sequence via sequence
  sequence_now_tu_sequence!: now_tu_sequence
  getSequence_now_tu_sequence!: Sequelize.BelongsToGetAssociationMixin<now_tu_sequence>
  setSequence_now_tu_sequence!: Sequelize.BelongsToSetAssociationMixin<now_tu_sequence, now_tu_sequenceId>
  createSequence_now_tu_sequence!: Sequelize.BelongsToCreateAssociationMixin<now_tu_sequence>

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
