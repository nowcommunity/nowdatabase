import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { com_people, com_peopleId } from './com_people'
import type { now_br, now_brId } from './now_br'
import type { now_time_update, now_time_updateId } from './now_time_update'
import type { now_tu_bound, now_tu_boundId } from './now_tu_bound'
import type { ref_ref, ref_refId } from './ref_ref'

export interface now_bauAttributes {
  buid: number
  bau_coordinator: string
  bau_authorizer: string
  bid: number
  bau_date?: string
  bau_comment?: string
}

export type now_bauPk = 'buid'
export type now_bauId = now_bau[now_bauPk]
export type now_bauOptionalAttributes = 'buid' | 'bau_coordinator' | 'bau_authorizer' | 'bau_date' | 'bau_comment'
export type now_bauCreationAttributes = Optional<now_bauAttributes, now_bauOptionalAttributes>

export class now_bau extends Model<now_bauAttributes, now_bauCreationAttributes> implements now_bauAttributes {
  buid!: number
  bau_coordinator!: string
  bau_authorizer!: string
  bid!: number
  bau_date?: string
  bau_comment?: string

  // now_bau belongsTo com_people via bau_coordinator
  bau_coordinator_com_person!: com_people
  getBau_coordinator_com_person!: Sequelize.BelongsToGetAssociationMixin<com_people>
  setBau_coordinator_com_person!: Sequelize.BelongsToSetAssociationMixin<com_people, com_peopleId>
  createBau_coordinator_com_person!: Sequelize.BelongsToCreateAssociationMixin<com_people>
  // now_bau belongsTo com_people via bau_authorizer
  bau_authorizer_com_person!: com_people
  getBau_authorizer_com_person!: Sequelize.BelongsToGetAssociationMixin<com_people>
  setBau_authorizer_com_person!: Sequelize.BelongsToSetAssociationMixin<com_people, com_peopleId>
  createBau_authorizer_com_person!: Sequelize.BelongsToCreateAssociationMixin<com_people>
  // now_bau hasMany now_br via buid
  now_brs!: now_br[]
  getNow_brs!: Sequelize.HasManyGetAssociationsMixin<now_br>
  setNow_brs!: Sequelize.HasManySetAssociationsMixin<now_br, now_brId>
  addNow_br!: Sequelize.HasManyAddAssociationMixin<now_br, now_brId>
  addNow_brs!: Sequelize.HasManyAddAssociationsMixin<now_br, now_brId>
  createNow_br!: Sequelize.HasManyCreateAssociationMixin<now_br>
  removeNow_br!: Sequelize.HasManyRemoveAssociationMixin<now_br, now_brId>
  removeNow_brs!: Sequelize.HasManyRemoveAssociationsMixin<now_br, now_brId>
  hasNow_br!: Sequelize.HasManyHasAssociationMixin<now_br, now_brId>
  hasNow_brs!: Sequelize.HasManyHasAssociationsMixin<now_br, now_brId>
  countNow_brs!: Sequelize.HasManyCountAssociationsMixin
  // now_bau hasMany now_time_update via lower_buid
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
  // now_bau hasMany now_time_update via upper_buid
  upper_bu_now_time_updates!: now_time_update[]
  getUpper_bu_now_time_updates!: Sequelize.HasManyGetAssociationsMixin<now_time_update>
  setUpper_bu_now_time_updates!: Sequelize.HasManySetAssociationsMixin<now_time_update, now_time_updateId>
  addUpper_bu_now_time_update!: Sequelize.HasManyAddAssociationMixin<now_time_update, now_time_updateId>
  addUpper_bu_now_time_updates!: Sequelize.HasManyAddAssociationsMixin<now_time_update, now_time_updateId>
  createUpper_bu_now_time_update!: Sequelize.HasManyCreateAssociationMixin<now_time_update>
  removeUpper_bu_now_time_update!: Sequelize.HasManyRemoveAssociationMixin<now_time_update, now_time_updateId>
  removeUpper_bu_now_time_updates!: Sequelize.HasManyRemoveAssociationsMixin<now_time_update, now_time_updateId>
  hasUpper_bu_now_time_update!: Sequelize.HasManyHasAssociationMixin<now_time_update, now_time_updateId>
  hasUpper_bu_now_time_updates!: Sequelize.HasManyHasAssociationsMixin<now_time_update, now_time_updateId>
  countUpper_bu_now_time_updates!: Sequelize.HasManyCountAssociationsMixin
  // now_bau belongsToMany ref_ref via buid and rid
  rid_ref_refs!: ref_ref[]
  getRid_ref_refs!: Sequelize.BelongsToManyGetAssociationsMixin<ref_ref>
  setRid_ref_refs!: Sequelize.BelongsToManySetAssociationsMixin<ref_ref, ref_refId>
  addRid_ref_ref!: Sequelize.BelongsToManyAddAssociationMixin<ref_ref, ref_refId>
  addRid_ref_refs!: Sequelize.BelongsToManyAddAssociationsMixin<ref_ref, ref_refId>
  createRid_ref_ref!: Sequelize.BelongsToManyCreateAssociationMixin<ref_ref>
  removeRid_ref_ref!: Sequelize.BelongsToManyRemoveAssociationMixin<ref_ref, ref_refId>
  removeRid_ref_refs!: Sequelize.BelongsToManyRemoveAssociationsMixin<ref_ref, ref_refId>
  hasRid_ref_ref!: Sequelize.BelongsToManyHasAssociationMixin<ref_ref, ref_refId>
  hasRid_ref_refs!: Sequelize.BelongsToManyHasAssociationsMixin<ref_ref, ref_refId>
  countRid_ref_refs!: Sequelize.BelongsToManyCountAssociationsMixin
  // now_bau belongsTo now_tu_bound via bid
  bid_now_tu_bound!: now_tu_bound
  getBid_now_tu_bound!: Sequelize.BelongsToGetAssociationMixin<now_tu_bound>
  setBid_now_tu_bound!: Sequelize.BelongsToSetAssociationMixin<now_tu_bound, now_tu_boundId>
  createBid_now_tu_bound!: Sequelize.BelongsToCreateAssociationMixin<now_tu_bound>

  static initModel(sequelize: Sequelize.Sequelize): typeof now_bau {
    return now_bau.init(
      {
        buid: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        bau_coordinator: {
          type: DataTypes.STRING(10),
          allowNull: false,
          defaultValue: '',
          references: {
            model: 'com_people',
            key: 'initials',
          },
        },
        bau_authorizer: {
          type: DataTypes.STRING(10),
          allowNull: false,
          defaultValue: '',
          references: {
            model: 'com_people',
            key: 'initials',
          },
        },
        bid: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'now_tu_bound',
            key: 'bid',
          },
        },
        bau_date: {
          type: DataTypes.DATEONLY,
          allowNull: true,
        },
        bau_comment: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'now_bau',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'buid' }],
          },
          {
            name: 'now_test_bau_FKIndex1',
            using: 'BTREE',
            fields: [{ name: 'bid' }],
          },
          {
            name: 'now_test_bau_FKIndex2',
            using: 'BTREE',
            fields: [{ name: 'bau_coordinator' }],
          },
          {
            name: 'now_test_bau_FKIndex3',
            using: 'BTREE',
            fields: [{ name: 'bau_authorizer' }],
          },
        ],
      }
    )
  }
}
