import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { com_people, com_peopleId } from './com_people'
import type { now_time_unit, now_time_unitId } from './now_time_unit'
import type { now_time_update, now_time_updateId } from './now_time_update'
import type { now_tr, now_trId } from './now_tr'
import type { ref_ref, ref_refId } from './ref_ref'

export interface now_tauAttributes {
  tuid: number
  tau_coordinator: string
  tau_authorizer: string
  tu_name: string
  tau_date?: string
  tau_comment?: string
}

export type now_tauPk = 'tuid'
export type now_tauId = now_tau[now_tauPk]
export type now_tauOptionalAttributes =
  | 'tuid'
  | 'tau_coordinator'
  | 'tau_authorizer'
  | 'tu_name'
  | 'tau_date'
  | 'tau_comment'
export type now_tauCreationAttributes = Optional<now_tauAttributes, now_tauOptionalAttributes>

export class now_tau extends Model<now_tauAttributes, now_tauCreationAttributes> implements now_tauAttributes {
  tuid!: number
  tau_coordinator!: string
  tau_authorizer!: string
  tu_name!: string
  tau_date?: string
  tau_comment?: string

  // now_tau belongsTo com_people via tau_coordinator
  tau_coordinator_com_person!: com_people
  getTau_coordinator_com_person!: Sequelize.BelongsToGetAssociationMixin<com_people>
  setTau_coordinator_com_person!: Sequelize.BelongsToSetAssociationMixin<com_people, com_peopleId>
  createTau_coordinator_com_person!: Sequelize.BelongsToCreateAssociationMixin<com_people>
  // now_tau belongsTo com_people via tau_authorizer
  tau_authorizer_com_person!: com_people
  getTau_authorizer_com_person!: Sequelize.BelongsToGetAssociationMixin<com_people>
  setTau_authorizer_com_person!: Sequelize.BelongsToSetAssociationMixin<com_people, com_peopleId>
  createTau_authorizer_com_person!: Sequelize.BelongsToCreateAssociationMixin<com_people>
  // now_tau hasMany now_time_update via tuid
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
  // now_tau hasMany now_tr via tuid
  now_trs!: now_tr[]
  getNow_trs!: Sequelize.HasManyGetAssociationsMixin<now_tr>
  setNow_trs!: Sequelize.HasManySetAssociationsMixin<now_tr, now_trId>
  addNow_tr!: Sequelize.HasManyAddAssociationMixin<now_tr, now_trId>
  addNow_trs!: Sequelize.HasManyAddAssociationsMixin<now_tr, now_trId>
  createNow_tr!: Sequelize.HasManyCreateAssociationMixin<now_tr>
  removeNow_tr!: Sequelize.HasManyRemoveAssociationMixin<now_tr, now_trId>
  removeNow_trs!: Sequelize.HasManyRemoveAssociationsMixin<now_tr, now_trId>
  hasNow_tr!: Sequelize.HasManyHasAssociationMixin<now_tr, now_trId>
  hasNow_trs!: Sequelize.HasManyHasAssociationsMixin<now_tr, now_trId>
  countNow_trs!: Sequelize.HasManyCountAssociationsMixin
  // now_tau belongsToMany ref_ref via tuid and rid
  rid_ref_ref_now_trs!: ref_ref[]
  getRid_ref_ref_now_trs!: Sequelize.BelongsToManyGetAssociationsMixin<ref_ref>
  setRid_ref_ref_now_trs!: Sequelize.BelongsToManySetAssociationsMixin<ref_ref, ref_refId>
  addRid_ref_ref_now_tr!: Sequelize.BelongsToManyAddAssociationMixin<ref_ref, ref_refId>
  addRid_ref_ref_now_trs!: Sequelize.BelongsToManyAddAssociationsMixin<ref_ref, ref_refId>
  createRid_ref_ref_now_tr!: Sequelize.BelongsToManyCreateAssociationMixin<ref_ref>
  removeRid_ref_ref_now_tr!: Sequelize.BelongsToManyRemoveAssociationMixin<ref_ref, ref_refId>
  removeRid_ref_ref_now_trs!: Sequelize.BelongsToManyRemoveAssociationsMixin<ref_ref, ref_refId>
  hasRid_ref_ref_now_tr!: Sequelize.BelongsToManyHasAssociationMixin<ref_ref, ref_refId>
  hasRid_ref_ref_now_trs!: Sequelize.BelongsToManyHasAssociationsMixin<ref_ref, ref_refId>
  countRid_ref_ref_now_trs!: Sequelize.BelongsToManyCountAssociationsMixin
  // now_tau belongsTo now_time_unit via tu_name
  tu_name_now_time_unit!: now_time_unit
  getTu_name_now_time_unit!: Sequelize.BelongsToGetAssociationMixin<now_time_unit>
  setTu_name_now_time_unit!: Sequelize.BelongsToSetAssociationMixin<now_time_unit, now_time_unitId>
  createTu_name_now_time_unit!: Sequelize.BelongsToCreateAssociationMixin<now_time_unit>

  static initModel(sequelize: Sequelize.Sequelize): typeof now_tau {
    return now_tau.init(
      {
        tuid: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        tau_coordinator: {
          type: DataTypes.STRING(10),
          allowNull: false,
          defaultValue: '',
          references: {
            model: 'com_people',
            key: 'initials',
          },
        },
        tau_authorizer: {
          type: DataTypes.STRING(10),
          allowNull: false,
          defaultValue: '',
          references: {
            model: 'com_people',
            key: 'initials',
          },
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
        tau_date: {
          type: DataTypes.DATEONLY,
          allowNull: true,
        },
        tau_comment: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'now_tau',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'tuid' }],
          },
          {
            name: 'now_test_tau_FKIndex1',
            using: 'BTREE',
            fields: [{ name: 'tu_name' }],
          },
          {
            name: 'now_test_tau_FKIndex2',
            using: 'BTREE',
            fields: [{ name: 'tau_coordinator' }],
          },
          {
            name: 'now_test_tau_FKIndex3',
            using: 'BTREE',
            fields: [{ name: 'tau_authorizer' }],
          },
        ],
      }
    )
  }
}
