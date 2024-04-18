import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

import type { now_bau, now_bauId } from './now_bau'
import type { now_tau, now_tauId } from './now_tau'
import type { now_time_unit, now_time_unitId } from './now_time_unit'

export class now_time_update extends Model<InferAttributes<now_time_update>, InferCreationAttributes<now_time_update>> {
  declare time_update_id: CreationOptional<number>
  declare tu_name: string
  declare tuid?: number
  declare lower_buid?: number
  declare upper_buid?: number
  declare coordinator: string
  declare authorizer: string
  declare date?: string
  declare comment?: string

  // now_time_update belongsTo now_bau via lower_buid
  declare lower_bu?: Sequelize.NonAttribute<now_bau>
  declare getLower_bu: Sequelize.BelongsToGetAssociationMixin<now_bau>
  declare setLower_bu: Sequelize.BelongsToSetAssociationMixin<now_bau, number>
  declare createLower_bu: Sequelize.BelongsToCreateAssociationMixin<now_bau>
  // now_time_update belongsTo now_bau via upper_buid
  declare upper_bu?: Sequelize.NonAttribute<now_bau>
  declare getUpper_bu: Sequelize.BelongsToGetAssociationMixin<now_bau>
  declare setUpper_bu: Sequelize.BelongsToSetAssociationMixin<now_bau, number>
  declare createUpper_bu: Sequelize.BelongsToCreateAssociationMixin<now_bau>
  // now_time_update belongsTo now_tau via tuid
  declare tu?: Sequelize.NonAttribute<now_tau>
  declare getTu: Sequelize.BelongsToGetAssociationMixin<now_tau>
  declare setTu: Sequelize.BelongsToSetAssociationMixin<now_tau, number>
  declare createTu: Sequelize.BelongsToCreateAssociationMixin<now_tau>
  // now_time_update belongsTo now_time_unit via tu_name
  declare tu_name_now_time_unit?: Sequelize.NonAttribute<now_time_unit>
  declare getTu_name_now_time_unit: Sequelize.BelongsToGetAssociationMixin<now_time_unit>
  declare setTu_name_now_time_unit: Sequelize.BelongsToSetAssociationMixin<now_time_unit, number>
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
