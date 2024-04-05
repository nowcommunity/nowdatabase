import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { com_species, com_speciesId } from './com_species'
import type { now_loc, now_locId } from './now_loc'

export interface now_lsAttributes {
  lid: number
  species_id: number
  nis?: number
  pct?: number
  quad?: number
  mni?: number
  qua?: string
  id_status?: string
  orig_entry?: string
  source_name?: string
  body_mass?: number
  mesowear?: string
  mw_or_high?: number
  mw_or_low?: number
  mw_cs_sharp?: number
  mw_cs_round?: number
  mw_cs_blunt?: number
  mw_scale_min?: number
  mw_scale_max?: number
  mw_value?: number
  microwear?: string
  dc13_mean?: number
  dc13_n?: number
  dc13_max?: number
  dc13_min?: number
  dc13_stdev?: number
  do18_mean?: number
  do18_n?: number
  do18_max?: number
  do18_min?: number
  do18_stdev?: number
}

export type now_lsPk = 'lid' | 'species_id'
export type now_lsId = now_ls[now_lsPk]
export type now_lsOptionalAttributes =
  | 'lid'
  | 'species_id'
  | 'nis'
  | 'pct'
  | 'quad'
  | 'mni'
  | 'qua'
  | 'id_status'
  | 'orig_entry'
  | 'source_name'
  | 'body_mass'
  | 'mesowear'
  | 'mw_or_high'
  | 'mw_or_low'
  | 'mw_cs_sharp'
  | 'mw_cs_round'
  | 'mw_cs_blunt'
  | 'mw_scale_min'
  | 'mw_scale_max'
  | 'mw_value'
  | 'microwear'
  | 'dc13_mean'
  | 'dc13_n'
  | 'dc13_max'
  | 'dc13_min'
  | 'dc13_stdev'
  | 'do18_mean'
  | 'do18_n'
  | 'do18_max'
  | 'do18_min'
  | 'do18_stdev'
export type now_lsCreationAttributes = Optional<now_lsAttributes, now_lsOptionalAttributes>

export class now_ls extends Model<now_lsAttributes, now_lsCreationAttributes> implements now_lsAttributes {
  lid!: number
  species_id!: number
  nis?: number
  pct?: number
  quad?: number
  mni?: number
  qua?: string
  id_status?: string
  orig_entry?: string
  source_name?: string
  body_mass?: number
  mesowear?: string
  mw_or_high?: number
  mw_or_low?: number
  mw_cs_sharp?: number
  mw_cs_round?: number
  mw_cs_blunt?: number
  mw_scale_min?: number
  mw_scale_max?: number
  mw_value?: number
  microwear?: string
  dc13_mean?: number
  dc13_n?: number
  dc13_max?: number
  dc13_min?: number
  dc13_stdev?: number
  do18_mean?: number
  do18_n?: number
  do18_max?: number
  do18_min?: number
  do18_stdev?: number

  // now_ls belongsTo com_species via species_id
  species!: com_species
  getSpecies!: Sequelize.BelongsToGetAssociationMixin<com_species>
  setSpecies!: Sequelize.BelongsToSetAssociationMixin<com_species, com_speciesId>
  createSpecies!: Sequelize.BelongsToCreateAssociationMixin<com_species>
  // now_ls belongsTo now_loc via lid
  lid_now_loc!: now_loc
  getLid_now_loc!: Sequelize.BelongsToGetAssociationMixin<now_loc>
  setLid_now_loc!: Sequelize.BelongsToSetAssociationMixin<now_loc, now_locId>
  createLid_now_loc!: Sequelize.BelongsToCreateAssociationMixin<now_loc>

  static initModel(sequelize: Sequelize.Sequelize): typeof now_ls {
    return now_ls.init(
      {
        lid: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          primaryKey: true,
          references: {
            model: 'now_loc',
            key: 'lid',
          },
        },
        species_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          primaryKey: true,
          references: {
            model: 'com_species',
            key: 'species_id',
          },
        },
        nis: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        pct: {
          type: DataTypes.DOUBLE,
          allowNull: true,
        },
        quad: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        mni: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        qua: {
          type: DataTypes.STRING(1),
          allowNull: true,
        },
        id_status: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        orig_entry: {
          type: DataTypes.STRING(120),
          allowNull: true,
        },
        source_name: {
          type: DataTypes.STRING(120),
          allowNull: true,
        },
        body_mass: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        mesowear: {
          type: DataTypes.CHAR(3),
          allowNull: true,
        },
        mw_or_high: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        mw_or_low: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        mw_cs_sharp: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        mw_cs_round: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        mw_cs_blunt: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        mw_scale_min: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        mw_scale_max: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        mw_value: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        microwear: {
          type: DataTypes.STRING(7),
          allowNull: true,
        },
        dc13_mean: {
          type: DataTypes.DOUBLE,
          allowNull: true,
        },
        dc13_n: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        dc13_max: {
          type: DataTypes.DOUBLE,
          allowNull: true,
        },
        dc13_min: {
          type: DataTypes.DOUBLE,
          allowNull: true,
        },
        dc13_stdev: {
          type: DataTypes.DOUBLE,
          allowNull: true,
        },
        do18_mean: {
          type: DataTypes.DOUBLE,
          allowNull: true,
        },
        do18_n: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        do18_max: {
          type: DataTypes.DOUBLE,
          allowNull: true,
        },
        do18_min: {
          type: DataTypes.DOUBLE,
          allowNull: true,
        },
        do18_stdev: {
          type: DataTypes.DOUBLE,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'now_ls',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'lid' }, { name: 'species_id' }],
          },
          {
            name: 'now_test_ls_FKIndex1',
            using: 'BTREE',
            fields: [{ name: 'species_id' }],
          },
          {
            name: 'now_test_ls_FKIndex2',
            using: 'BTREE',
            fields: [{ name: 'lid' }],
          },
        ],
      }
    )
  }
}
