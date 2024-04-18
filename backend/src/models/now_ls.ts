import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

import type { com_species, com_speciesId } from './com_species'
import type { now_loc, now_locId } from './now_loc'

export class now_ls extends Model<InferAttributes<now_ls>, InferCreationAttributes<now_ls>> {
  declare lid: CreationOptional<number>
  declare species_id: CreationOptional<number>
  declare nis?: number
  declare pct?: number
  declare quad?: number
  declare mni?: number
  declare qua?: string
  declare id_status?: string
  declare orig_entry?: string
  declare source_name?: string
  declare body_mass?: number
  declare mesowear?: string
  declare mw_or_high?: number
  declare mw_or_low?: number
  declare mw_cs_sharp?: number
  declare mw_cs_round?: number
  declare mw_cs_blunt?: number
  declare mw_scale_min?: number
  declare mw_scale_max?: number
  declare mw_value?: number
  declare microwear?: string
  declare dc13_mean?: number
  declare dc13_n?: number
  declare dc13_max?: number
  declare dc13_min?: number
  declare dc13_stdev?: number
  declare do18_mean?: number
  declare do18_n?: number
  declare do18_max?: number
  declare do18_min?: number
  declare do18_stdev?: number

  // now_ls belongsTo com_species via species_id
  declare species?: Sequelize.NonAttribute<com_species>
  declare getSpecies: Sequelize.BelongsToGetAssociationMixin<com_species>
  declare setSpecies: Sequelize.BelongsToSetAssociationMixin<com_species, number>
  declare createSpecies: Sequelize.BelongsToCreateAssociationMixin<com_species>
  // now_ls belongsTo now_loc via lid
  declare lid_now_loc?: Sequelize.NonAttribute<now_loc>
  declare getLid_now_loc: Sequelize.BelongsToGetAssociationMixin<now_loc>
  declare setLid_now_loc: Sequelize.BelongsToSetAssociationMixin<now_loc, number>
  declare createLid_now_loc: Sequelize.BelongsToCreateAssociationMixin<now_loc>

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
