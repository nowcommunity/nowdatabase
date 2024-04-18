import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

import type { com_people, com_peopleId } from './com_people'
import type { now_loc, now_locId } from './now_loc'
import type { now_lr } from './now_lr'
import type { ref_ref } from './ref_ref'

export class now_lau extends Model<InferAttributes<now_lau>, InferCreationAttributes<now_lau>> {
  declare luid: CreationOptional<number>
  declare lau_coordinator: string
  declare lau_authorizer: string
  declare lid: number
  declare lau_date?: string
  declare lau_comment?: string

  // now_lau belongsTo com_people via lau_coordinator
  declare lau_coordinator_com_person?: Sequelize.NonAttribute<com_people>
  declare getLau_coordinator_com_person: Sequelize.BelongsToGetAssociationMixin<com_people>
  declare setLau_coordinator_com_person: Sequelize.BelongsToSetAssociationMixin<com_people, number>
  declare createLau_coordinator_com_person: Sequelize.BelongsToCreateAssociationMixin<com_people>
  // now_lau belongsTo com_people via lau_authorizer
  declare lau_authorizer_com_person?: Sequelize.NonAttribute<com_people>
  declare getLau_authorizer_com_person: Sequelize.BelongsToGetAssociationMixin<com_people>
  declare setLau_authorizer_com_person: Sequelize.BelongsToSetAssociationMixin<com_people, number>
  declare createLau_authorizer_com_person: Sequelize.BelongsToCreateAssociationMixin<com_people>
  // now_lau hasMany now_lr via luid
  declare now_lrs?: Sequelize.NonAttribute<now_lr[]>
  declare getNow_lrs: Sequelize.HasManyGetAssociationsMixin<now_lr>
  declare setNow_lrs: Sequelize.HasManySetAssociationsMixin<now_lr, number>
  declare addNow_lr: Sequelize.HasManyAddAssociationMixin<now_lr, number>
  declare addNow_lrs: Sequelize.HasManyAddAssociationsMixin<now_lr, number>
  declare createNow_lr: Sequelize.HasManyCreateAssociationMixin<now_lr, 'luid'>
  declare removeNow_lr: Sequelize.HasManyRemoveAssociationMixin<now_lr, number>
  declare removeNow_lrs: Sequelize.HasManyRemoveAssociationsMixin<now_lr, number>
  declare hasNow_lr: Sequelize.HasManyHasAssociationMixin<now_lr, number>
  declare hasNow_lrs: Sequelize.HasManyHasAssociationsMixin<now_lr, number>
  declare countNow_lrs: Sequelize.HasManyCountAssociationsMixin
  // now_lau belongsToMany ref_ref via luid and rid
  declare rid_ref_ref_now_lrs: Sequelize.NonAttribute<ref_ref[]>
  declare getRid_ref_ref_now_lrs: Sequelize.BelongsToManyGetAssociationsMixin<ref_ref>
  declare setRid_ref_ref_now_lrs: Sequelize.BelongsToManySetAssociationsMixin<ref_ref, number>
  declare addRid_ref_ref_now_lr: Sequelize.BelongsToManyAddAssociationMixin<ref_ref, number>
  declare addRid_ref_ref_now_lrs: Sequelize.BelongsToManyAddAssociationsMixin<ref_ref, number>
  declare createRid_ref_ref_now_lr: Sequelize.BelongsToManyCreateAssociationMixin<ref_ref, 'luid'>
  declare removeRid_ref_ref_now_lr: Sequelize.BelongsToManyRemoveAssociationMixin<ref_ref, number>
  declare removeRid_ref_ref_now_lrs: Sequelize.BelongsToManyRemoveAssociationsMixin<ref_ref, number>
  declare hasRid_ref_ref_now_lr: Sequelize.BelongsToManyHasAssociationMixin<ref_ref, number>
  declare hasRid_ref_ref_now_lrs: Sequelize.BelongsToManyHasAssociationsMixin<ref_ref, number>
  declare countRid_ref_ref_now_lrs: Sequelize.BelongsToManyCountAssociationsMixin
  // now_lau belongsTo now_loc via lid
  declare lid_now_loc?: Sequelize.NonAttribute<now_loc>
  declare getLid_now_loc: Sequelize.BelongsToGetAssociationMixin<now_loc>
  declare setLid_now_loc: Sequelize.BelongsToSetAssociationMixin<now_loc, number>
  declare createLid_now_loc: Sequelize.BelongsToCreateAssociationMixin<now_loc>

  static initModel(sequelize: Sequelize.Sequelize): typeof now_lau {
    return now_lau.init(
      {
        luid: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        lau_coordinator: {
          type: DataTypes.STRING(10),
          allowNull: false,
          defaultValue: '',
          references: {
            model: 'com_people',
            key: 'initials',
          },
        },
        lau_authorizer: {
          type: DataTypes.STRING(10),
          allowNull: false,
          defaultValue: '',
          references: {
            model: 'com_people',
            key: 'initials',
          },
        },
        lid: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          references: {
            model: 'now_loc',
            key: 'lid',
          },
        },
        lau_date: {
          type: DataTypes.DATEONLY,
          allowNull: true,
        },
        lau_comment: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'now_lau',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'luid' }],
          },
          {
            name: 'now_test_lau_FKIndex1',
            using: 'BTREE',
            fields: [{ name: 'lid' }],
          },
          {
            name: 'now_test_lau_FKIndex2',
            using: 'BTREE',
            fields: [{ name: 'lau_coordinator' }],
          },
          {
            name: 'now_test_lau_FKIndex3',
            using: 'BTREE',
            fields: [{ name: 'lau_authorizer' }],
          },
        ],
      }
    )
  }
}
