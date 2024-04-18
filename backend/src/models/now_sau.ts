import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { com_people, com_peopleId } from './com_people'
import type { com_species, com_speciesId } from './com_species'
import type { now_sr, now_srId } from './now_sr'
import type { ref_ref, ref_refId } from './ref_ref'

export interface now_sauAttributes {
  suid: number
  sau_coordinator: string
  sau_authorizer: string
  species_id: number
  sau_date?: string
  sau_comment?: string
}

export type now_sauPk = 'suid'
export type now_sauId = now_sau[now_sauPk]
export type now_sauOptionalAttributes =
  | 'suid'
  | 'sau_coordinator'
  | 'sau_authorizer'
  | 'species_id'
  | 'sau_date'
  | 'sau_comment'
export type now_sauCreationAttributes = Optional<now_sauAttributes, now_sauOptionalAttributes>

export class now_sau extends Model<now_sauAttributes, now_sauCreationAttributes> implements now_sauAttributes {
  suid!: number
  sau_coordinator!: string
  sau_authorizer!: string
  species_id!: number
  sau_date?: string
  sau_comment?: string

  // now_sau belongsTo com_people via sau_coordinator
  sau_coordinator_com_person!: com_people
  getSau_coordinator_com_person!: Sequelize.BelongsToGetAssociationMixin<com_people>
  setSau_coordinator_com_person!: Sequelize.BelongsToSetAssociationMixin<com_people, com_peopleId>
  createSau_coordinator_com_person!: Sequelize.BelongsToCreateAssociationMixin<com_people>
  // now_sau belongsTo com_people via sau_authorizer
  sau_authorizer_com_person!: com_people
  getSau_authorizer_com_person!: Sequelize.BelongsToGetAssociationMixin<com_people>
  setSau_authorizer_com_person!: Sequelize.BelongsToSetAssociationMixin<com_people, com_peopleId>
  createSau_authorizer_com_person!: Sequelize.BelongsToCreateAssociationMixin<com_people>
  // now_sau belongsTo com_species via species_id
  species!: com_species
  getSpecies!: Sequelize.BelongsToGetAssociationMixin<com_species>
  setSpecies!: Sequelize.BelongsToSetAssociationMixin<com_species, com_speciesId>
  createSpecies!: Sequelize.BelongsToCreateAssociationMixin<com_species>
  // now_sau hasMany now_sr via suid
  now_srs!: now_sr[]
  getNow_srs!: Sequelize.HasManyGetAssociationsMixin<now_sr>
  setNow_srs!: Sequelize.HasManySetAssociationsMixin<now_sr, now_srId>
  addNow_sr!: Sequelize.HasManyAddAssociationMixin<now_sr, now_srId>
  addNow_srs!: Sequelize.HasManyAddAssociationsMixin<now_sr, now_srId>
  createNow_sr!: Sequelize.HasManyCreateAssociationMixin<now_sr>
  removeNow_sr!: Sequelize.HasManyRemoveAssociationMixin<now_sr, now_srId>
  removeNow_srs!: Sequelize.HasManyRemoveAssociationsMixin<now_sr, now_srId>
  hasNow_sr!: Sequelize.HasManyHasAssociationMixin<now_sr, now_srId>
  hasNow_srs!: Sequelize.HasManyHasAssociationsMixin<now_sr, now_srId>
  countNow_srs!: Sequelize.HasManyCountAssociationsMixin
  // now_sau belongsToMany ref_ref via suid and rid
  rid_ref_ref_now_srs!: ref_ref[]
  getRid_ref_ref_now_srs!: Sequelize.BelongsToManyGetAssociationsMixin<ref_ref>
  setRid_ref_ref_now_srs!: Sequelize.BelongsToManySetAssociationsMixin<ref_ref, ref_refId>
  addRid_ref_ref_now_sr!: Sequelize.BelongsToManyAddAssociationMixin<ref_ref, ref_refId>
  addRid_ref_ref_now_srs!: Sequelize.BelongsToManyAddAssociationsMixin<ref_ref, ref_refId>
  createRid_ref_ref_now_sr!: Sequelize.BelongsToManyCreateAssociationMixin<ref_ref>
  removeRid_ref_ref_now_sr!: Sequelize.BelongsToManyRemoveAssociationMixin<ref_ref, ref_refId>
  removeRid_ref_ref_now_srs!: Sequelize.BelongsToManyRemoveAssociationsMixin<ref_ref, ref_refId>
  hasRid_ref_ref_now_sr!: Sequelize.BelongsToManyHasAssociationMixin<ref_ref, ref_refId>
  hasRid_ref_ref_now_srs!: Sequelize.BelongsToManyHasAssociationsMixin<ref_ref, ref_refId>
  countRid_ref_ref_now_srs!: Sequelize.BelongsToManyCountAssociationsMixin

  static initModel(sequelize: Sequelize.Sequelize): typeof now_sau {
    return now_sau.init(
      {
        suid: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        sau_coordinator: {
          type: DataTypes.STRING(10),
          allowNull: false,
          defaultValue: '',
          references: {
            model: 'com_people',
            key: 'initials',
          },
        },
        sau_authorizer: {
          type: DataTypes.STRING(10),
          allowNull: false,
          defaultValue: '',
          references: {
            model: 'com_people',
            key: 'initials',
          },
        },
        species_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          references: {
            model: 'com_species',
            key: 'species_id',
          },
        },
        sau_date: {
          type: DataTypes.DATEONLY,
          allowNull: true,
        },
        sau_comment: {
          type: DataTypes.STRING(1024),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'now_sau',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'suid' }],
          },
          {
            name: 'now_test_sau_FKIndex1',
            using: 'BTREE',
            fields: [{ name: 'species_id' }],
          },
          {
            name: 'now_test_sau_FKIndex2',
            using: 'BTREE',
            fields: [{ name: 'sau_coordinator' }],
          },
          {
            name: 'now_test_sau_FKIndex3',
            using: 'BTREE',
            fields: [{ name: 'sau_authorizer' }],
          },
        ],
      }
    )
  }
}
