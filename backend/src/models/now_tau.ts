import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

import type { com_people, com_peopleId } from './com_people'
import type { now_time_unit, now_time_unitId } from './now_time_unit'
import type { now_time_update } from './now_time_update'
import type { now_tr } from './now_tr'
import type { ref_ref } from './ref_ref'

export class now_tau extends Model<InferAttributes<now_tau>, InferCreationAttributes<now_tau>> {
  declare tuid: CreationOptional<number>
  declare tau_coordinator: string
  declare tau_authorizer: string
  declare tu_name: string
  declare tau_date?: string
  declare tau_comment?: string

  // now_tau belongsTo com_people via tau_coordinator
  declare tau_coordinator_com_person?: Sequelize.NonAttribute<com_people>
  declare getTau_coordinator_com_person: Sequelize.BelongsToGetAssociationMixin<com_people>
  declare setTau_coordinator_com_person: Sequelize.BelongsToSetAssociationMixin<com_people, number>
  declare createTau_coordinator_com_person: Sequelize.BelongsToCreateAssociationMixin<com_people>
  // now_tau belongsTo com_people via tau_authorizer
  declare tau_authorizer_com_person?: Sequelize.NonAttribute<com_people>
  declare getTau_authorizer_com_person: Sequelize.BelongsToGetAssociationMixin<com_people>
  declare setTau_authorizer_com_person: Sequelize.BelongsToSetAssociationMixin<com_people, number>
  declare createTau_authorizer_com_person: Sequelize.BelongsToCreateAssociationMixin<com_people>
  // now_tau hasMany now_time_update via tuid
  declare now_time_updates?: Sequelize.NonAttribute<now_time_update[]>
  declare getNow_time_updates: Sequelize.HasManyGetAssociationsMixin<now_time_update>
  declare setNow_time_updates: Sequelize.HasManySetAssociationsMixin<now_time_update, number>
  declare addNow_time_update: Sequelize.HasManyAddAssociationMixin<now_time_update, number>
  declare addNow_time_updates: Sequelize.HasManyAddAssociationsMixin<now_time_update, number>
  declare createNow_time_update: Sequelize.HasManyCreateAssociationMixin<now_time_update, 'tuid'>
  declare removeNow_time_update: Sequelize.HasManyRemoveAssociationMixin<now_time_update, number>
  declare removeNow_time_updates: Sequelize.HasManyRemoveAssociationsMixin<now_time_update, number>
  declare hasNow_time_update: Sequelize.HasManyHasAssociationMixin<now_time_update, number>
  declare hasNow_time_updates: Sequelize.HasManyHasAssociationsMixin<now_time_update, number>
  declare countNow_time_updates: Sequelize.HasManyCountAssociationsMixin
  // now_tau hasMany now_tr via tuid
  declare now_trs?: Sequelize.NonAttribute<now_tr[]>
  declare getNow_trs: Sequelize.HasManyGetAssociationsMixin<now_tr>
  declare setNow_trs: Sequelize.HasManySetAssociationsMixin<now_tr, number>
  declare addNow_tr: Sequelize.HasManyAddAssociationMixin<now_tr, number>
  declare addNow_trs: Sequelize.HasManyAddAssociationsMixin<now_tr, number>
  declare createNow_tr: Sequelize.HasManyCreateAssociationMixin<now_tr, 'tuid'>
  declare removeNow_tr: Sequelize.HasManyRemoveAssociationMixin<now_tr, number>
  declare removeNow_trs: Sequelize.HasManyRemoveAssociationsMixin<now_tr, number>
  declare hasNow_tr: Sequelize.HasManyHasAssociationMixin<now_tr, number>
  declare hasNow_trs: Sequelize.HasManyHasAssociationsMixin<now_tr, number>
  declare countNow_trs: Sequelize.HasManyCountAssociationsMixin
  // now_tau belongsToMany ref_ref via tuid and rid
  declare rid_ref_ref_now_trs: Sequelize.NonAttribute<ref_ref[]>
  declare getRid_ref_ref_now_trs: Sequelize.BelongsToManyGetAssociationsMixin<ref_ref>
  declare setRid_ref_ref_now_trs: Sequelize.BelongsToManySetAssociationsMixin<ref_ref, number>
  declare addRid_ref_ref_now_tr: Sequelize.BelongsToManyAddAssociationMixin<ref_ref, number>
  declare addRid_ref_ref_now_trs: Sequelize.BelongsToManyAddAssociationsMixin<ref_ref, number>
  declare createRid_ref_ref_now_tr: Sequelize.BelongsToManyCreateAssociationMixin<ref_ref, 'tuid'>
  declare removeRid_ref_ref_now_tr: Sequelize.BelongsToManyRemoveAssociationMixin<ref_ref, number>
  declare removeRid_ref_ref_now_trs: Sequelize.BelongsToManyRemoveAssociationsMixin<ref_ref, number>
  declare hasRid_ref_ref_now_tr: Sequelize.BelongsToManyHasAssociationMixin<ref_ref, number>
  declare hasRid_ref_ref_now_trs: Sequelize.BelongsToManyHasAssociationsMixin<ref_ref, number>
  declare countRid_ref_ref_now_trs: Sequelize.BelongsToManyCountAssociationsMixin
  // now_tau belongsTo now_time_unit via tu_name
  declare tu_name_now_time_unit?: Sequelize.NonAttribute<now_time_unit>
  declare getTu_name_now_time_unit: Sequelize.BelongsToGetAssociationMixin<now_time_unit>
  declare setTu_name_now_time_unit: Sequelize.BelongsToSetAssociationMixin<now_time_unit, number>
  declare createTu_name_now_time_unit: Sequelize.BelongsToCreateAssociationMixin<now_time_unit>

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
