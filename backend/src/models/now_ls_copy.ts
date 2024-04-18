import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

export class now_ls_copy extends Model<InferAttributes<now_ls_copy>, InferCreationAttributes<now_ls_copy>> {
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
