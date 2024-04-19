import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface now_ls_copyAttributes {
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

export type now_ls_copyOptionalAttributes =
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
export type now_ls_copyCreationAttributes = Optional<now_ls_copyAttributes, now_ls_copyOptionalAttributes>

export class now_ls_copy
  extends Model<now_ls_copyAttributes, now_ls_copyCreationAttributes>
  implements now_ls_copyAttributes
{
  declare lid: number
  declare species_id: number
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

  static initModel(sequelize: Sequelize.Sequelize): typeof now_ls_copy {
    return now_ls_copy.init(
      {
        lid: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        species_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
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
        tableName: 'now_ls_copy',
        timestamps: false,
      }
    )
  }
}
