import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { com_people, com_peopleId } from './com_people'
import type { now_loc, now_locId } from './now_loc'
import type { now_lr, now_lrId } from './now_lr'
import type { ref_ref, ref_refId } from './ref_ref'

export interface now_lauAttributes {
  luid: number
  lau_coordinator: string
  lau_authorizer: string
  lid: number
  lau_date?: string
  lau_comment?: string
}

export type now_lauPk = 'luid'
export type now_lauId = now_lau[now_lauPk]
export type now_lauOptionalAttributes =
  | 'luid'
  | 'lau_coordinator'
  | 'lau_authorizer'
  | 'lid'
  | 'lau_date'
  | 'lau_comment'
export type now_lauCreationAttributes = Optional<now_lauAttributes, now_lauOptionalAttributes>

export class now_lau extends Model<now_lauAttributes, now_lauCreationAttributes> implements now_lauAttributes {
  declare luid: number
  declare lau_coordinator: string
  declare lau_authorizer: string
  declare lid: number
  declare lau_date?: string
  declare lau_comment?: string

  // now_lau belongsTo com_people via lau_coordinator
  declare lau_coordinator_com_person: com_people
  declare getLau_coordinator_com_person: Sequelize.BelongsToGetAssociationMixin<com_people>
  declare setLau_coordinator_com_person: Sequelize.BelongsToSetAssociationMixin<com_people, com_peopleId>
  declare createLau_coordinator_com_person: Sequelize.BelongsToCreateAssociationMixin<com_people>
  // now_lau belongsTo com_people via lau_authorizer
  declare lau_authorizer_com_person: com_people
  declare getLau_authorizer_com_person: Sequelize.BelongsToGetAssociationMixin<com_people>
  declare setLau_authorizer_com_person: Sequelize.BelongsToSetAssociationMixin<com_people, com_peopleId>
  declare createLau_authorizer_com_person: Sequelize.BelongsToCreateAssociationMixin<com_people>
  // now_lau hasMany now_lr via luid
  declare now_lrs: now_lr[]
  declare getNow_lrs: Sequelize.HasManyGetAssociationsMixin<now_lr>
  declare setNow_lrs: Sequelize.HasManySetAssociationsMixin<now_lr, now_lrId>
  declare addNow_lr: Sequelize.HasManyAddAssociationMixin<now_lr, now_lrId>
  declare addNow_lrs: Sequelize.HasManyAddAssociationsMixin<now_lr, now_lrId>
  declare createNow_lr: Sequelize.HasManyCreateAssociationMixin<now_lr>
  declare removeNow_lr: Sequelize.HasManyRemoveAssociationMixin<now_lr, now_lrId>
  declare removeNow_lrs: Sequelize.HasManyRemoveAssociationsMixin<now_lr, now_lrId>
  declare hasNow_lr: Sequelize.HasManyHasAssociationMixin<now_lr, now_lrId>
  declare hasNow_lrs: Sequelize.HasManyHasAssociationsMixin<now_lr, now_lrId>
  declare countNow_lrs: Sequelize.HasManyCountAssociationsMixin
  // now_lau belongsToMany ref_ref via luid and rid
  declare rid_ref_ref_now_lrs: ref_ref[]
  declare getRid_ref_ref_now_lrs: Sequelize.BelongsToManyGetAssociationsMixin<ref_ref>
  declare setRid_ref_ref_now_lrs: Sequelize.BelongsToManySetAssociationsMixin<ref_ref, ref_refId>
  declare addRid_ref_ref_now_lr: Sequelize.BelongsToManyAddAssociationMixin<ref_ref, ref_refId>
  declare addRid_ref_ref_now_lrs: Sequelize.BelongsToManyAddAssociationsMixin<ref_ref, ref_refId>
  declare createRid_ref_ref_now_lr: Sequelize.BelongsToManyCreateAssociationMixin<ref_ref>
  declare removeRid_ref_ref_now_lr: Sequelize.BelongsToManyRemoveAssociationMixin<ref_ref, ref_refId>
  declare removeRid_ref_ref_now_lrs: Sequelize.BelongsToManyRemoveAssociationsMixin<ref_ref, ref_refId>
  declare hasRid_ref_ref_now_lr: Sequelize.BelongsToManyHasAssociationMixin<ref_ref, ref_refId>
  declare hasRid_ref_ref_now_lrs: Sequelize.BelongsToManyHasAssociationsMixin<ref_ref, ref_refId>
  declare countRid_ref_ref_now_lrs: Sequelize.BelongsToManyCountAssociationsMixin
  // now_lau belongsTo now_loc via lid
  declare lid_now_loc: now_loc
  declare getLid_now_loc: Sequelize.BelongsToGetAssociationMixin<now_loc>
  declare setLid_now_loc: Sequelize.BelongsToSetAssociationMixin<now_loc, now_locId>
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
