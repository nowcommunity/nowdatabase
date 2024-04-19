import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { now_bau, now_bauId } from './now_bau'
import type { now_tau, now_tauId } from './now_tau'
import type { now_time_unit, now_time_unitId } from './now_time_unit'

export interface now_time_updateAttributes {
  time_update_id: number
  tu_name: string
  tuid?: number
  lower_buid?: number
  upper_buid?: number
  coordinator: string
  authorizer: string
  date?: string
  comment?: string
}

export type now_time_updatePk = 'time_update_id'
export type now_time_updateId = now_time_update[now_time_updatePk]
export type now_time_updateOptionalAttributes =
  | 'time_update_id'
  | 'tu_name'
  | 'tuid'
  | 'lower_buid'
  | 'upper_buid'
  | 'coordinator'
  | 'authorizer'
  | 'date'
  | 'comment'
export type now_time_updateCreationAttributes = Optional<now_time_updateAttributes, now_time_updateOptionalAttributes>

export class now_time_update
  extends Model<now_time_updateAttributes, now_time_updateCreationAttributes>
  implements now_time_updateAttributes
{
  declare time_update_id: number
  declare tu_name: string
  declare tuid?: number
  declare lower_buid?: number
  declare upper_buid?: number
  declare coordinator: string
  declare authorizer: string
  declare date?: string
  declare comment?: string

  // now_time_update belongsTo now_bau via lower_buid
  declare lower_bu: now_bau
  declare getLower_bu: Sequelize.BelongsToGetAssociationMixin<now_bau>
  declare setLower_bu: Sequelize.BelongsToSetAssociationMixin<now_bau, now_bauId>
  declare createLower_bu: Sequelize.BelongsToCreateAssociationMixin<now_bau>
  // now_time_update belongsTo now_bau via upper_buid
  declare upper_bu: now_bau
  declare getUpper_bu: Sequelize.BelongsToGetAssociationMixin<now_bau>
  declare setUpper_bu: Sequelize.BelongsToSetAssociationMixin<now_bau, now_bauId>
  declare createUpper_bu: Sequelize.BelongsToCreateAssociationMixin<now_bau>
  // now_time_update belongsTo now_tau via tuid
  declare tu: now_tau
  declare getTu: Sequelize.BelongsToGetAssociationMixin<now_tau>
  declare setTu: Sequelize.BelongsToSetAssociationMixin<now_tau, now_tauId>
  declare createTu: Sequelize.BelongsToCreateAssociationMixin<now_tau>
  // now_time_update belongsTo now_time_unit via tu_name
  declare tu_name_now_time_unit: now_time_unit
  declare getTu_name_now_time_unit: Sequelize.BelongsToGetAssociationMixin<now_time_unit>
  declare setTu_name_now_time_unit: Sequelize.BelongsToSetAssociationMixin<now_time_unit, now_time_unitId>
  declare createTu_name_now_time_unit: Sequelize.BelongsToCreateAssociationMixin<now_time_unit>

  static initModel(sequelize: Sequelize.Sequelize): typeof now_time_update {
    return now_time_update.init(
      {
        time_update_id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        tu_name: {
          type: DataTypes.STRING(100),
          allowNull: false,
          defaultValue: '',
          references: {
            model: 'now_time_unit',
            key: 'tu_name',
          },
        },
        tuid: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'now_tau',
            key: 'tuid',
          },
        },
        lower_buid: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'now_bau',
            key: 'buid',
          },
        },
        upper_buid: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'now_bau',
            key: 'buid',
          },
        },
        coordinator: {
          type: DataTypes.STRING(10),
          allowNull: false,
          defaultValue: '',
        },
        authorizer: {
          type: DataTypes.STRING(10),
          allowNull: false,
          defaultValue: '',
        },
        date: {
          type: DataTypes.DATEONLY,
          allowNull: true,
        },
        comment: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'now_time_update',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'time_update_id' }],
          },
          {
            name: 'now_test_now_test_time_update_FKIndex1',
            using: 'BTREE',
            fields: [{ name: 'tu_name' }],
          },
          {
            name: 'now_test_now_test_time_update_FKIndex2',
            using: 'BTREE',
            fields: [{ name: 'tuid' }],
          },
          {
            name: 'now_test_now_test_time_update_FKIndex3',
            using: 'BTREE',
            fields: [{ name: 'lower_buid' }],
          },
          {
            name: 'now_test_now_test_time_update_FKIndex4',
            using: 'BTREE',
            fields: [{ name: 'upper_buid' }],
          },
        ],
      }
    )
  }
}
