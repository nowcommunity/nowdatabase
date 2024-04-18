import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

import type { now_loc } from './now_loc'
import type { now_ls } from './now_ls'
import type { now_proj } from './now_proj'
import type { now_psr } from './now_psr'
import type { now_sau } from './now_sau'

export class com_species extends Model<InferAttributes<com_species>, InferCreationAttributes<com_species>> {
  declare species_id: CreationOptional<number>
  declare class_name: string
  declare order_name: string
  declare family_name: string
  declare subclass_or_superorder_name?: string
  declare suborder_or_superfamily_name?: string
  declare subfamily_name?: string
  declare genus_name: string
  declare species_name: string
  declare unique_identifier: string
  declare taxonomic_status?: string
  declare common_name?: string
  declare sp_author?: string
  declare strain?: string
  declare gene?: string
  declare taxon_status?: string
  declare diet1?: string
  declare diet2?: string
  declare diet3?: string
  declare diet_description?: string
  declare rel_fib?: string
  declare selectivity?: string
  declare digestion?: string
  declare feedinghab1?: string
  declare feedinghab2?: string
  declare shelterhab1?: string
  declare shelterhab2?: string
  declare locomo1?: string
  declare locomo2?: string
  declare locomo3?: string
  declare hunt_forage?: string
  declare body_mass?: number
  declare brain_mass?: number
  declare sv_length?: string
  declare activity?: string
  declare sd_size?: string
  declare sd_display?: string
  declare tshm?: string
  declare symph_mob?: string
  declare relative_blade_length?: number
  declare tht?: string
  declare crowntype?: string
  declare microwear?: string
  declare horizodonty?: string
  declare cusp_shape?: string
  declare cusp_count_buccal?: string
  declare cusp_count_lingual?: string
  declare loph_count_lon?: string
  declare loph_count_trs?: string
  declare fct_al?: string
  declare fct_ol?: string
  declare fct_sf?: string
  declare fct_ot?: string
  declare fct_cm?: string
  declare mesowear?: string
  declare mw_or_high?: number
  declare mw_or_low?: number
  declare mw_cs_sharp?: number
  declare mw_cs_round?: number
  declare mw_cs_blunt?: number
  declare mw_scale_min?: number
  declare mw_scale_max?: number
  declare mw_value?: number
  declare pop_struc?: string
  declare sp_status?: number
  declare used_morph?: number
  declare used_now?: number
  declare used_gene?: number
  declare sp_comment?: string

  // com_species belongsToMany now_loc via species_id and lid
  declare lid_now_locs: Sequelize.NonAttribute<now_loc[]>
  declare getLid_now_locs: Sequelize.BelongsToManyGetAssociationsMixin<now_loc>
  declare setLid_now_locs: Sequelize.BelongsToManySetAssociationsMixin<now_loc, number>
  declare addLid_now_loc: Sequelize.BelongsToManyAddAssociationMixin<now_loc, number>
  declare addLid_now_locs: Sequelize.BelongsToManyAddAssociationsMixin<now_loc, number>
  declare createLid_now_loc: Sequelize.BelongsToManyCreateAssociationMixin<now_loc, 'species_id'>
  declare removeLid_now_loc: Sequelize.BelongsToManyRemoveAssociationMixin<now_loc, number>
  declare removeLid_now_locs: Sequelize.BelongsToManyRemoveAssociationsMixin<now_loc, number>
  declare hasLid_now_loc: Sequelize.BelongsToManyHasAssociationMixin<now_loc, number>
  declare hasLid_now_locs: Sequelize.BelongsToManyHasAssociationsMixin<now_loc, number>
  declare countLid_now_locs: Sequelize.BelongsToManyCountAssociationsMixin
  // com_species hasMany now_ls via species_id
  declare now_ls?: Sequelize.NonAttribute<now_ls[]>
  declare getNow_ls: Sequelize.HasManyGetAssociationsMixin<now_ls>
  declare setNow_ls: Sequelize.HasManySetAssociationsMixin<now_ls, number>
  declare addNow_l: Sequelize.HasManyAddAssociationMixin<now_ls, number>
  declare addNow_ls: Sequelize.HasManyAddAssociationsMixin<now_ls, number>
  declare createNow_l: Sequelize.HasManyCreateAssociationMixin<now_ls, 'species_id'>
  declare removeNow_l: Sequelize.HasManyRemoveAssociationMixin<now_ls, number>
  declare removeNow_ls: Sequelize.HasManyRemoveAssociationsMixin<now_ls, number>
  declare hasNow_l: Sequelize.HasManyHasAssociationMixin<now_ls, number>
  declare hasNow_ls: Sequelize.HasManyHasAssociationsMixin<now_ls, number>
  declare countNow_ls: Sequelize.HasManyCountAssociationsMixin
  // com_species belongsToMany now_proj via species_id and pid
  declare pid_now_proj_now_psrs: Sequelize.NonAttribute<now_proj[]>
  declare getPid_now_proj_now_psrs: Sequelize.BelongsToManyGetAssociationsMixin<now_proj>
  declare setPid_now_proj_now_psrs: Sequelize.BelongsToManySetAssociationsMixin<now_proj, number>
  declare addPid_now_proj_now_psr: Sequelize.BelongsToManyAddAssociationMixin<now_proj, number>
  declare addPid_now_proj_now_psrs: Sequelize.BelongsToManyAddAssociationsMixin<now_proj, number>
  declare createPid_now_proj_now_psr: Sequelize.BelongsToManyCreateAssociationMixin<now_proj, 'species_id'>
  declare removePid_now_proj_now_psr: Sequelize.BelongsToManyRemoveAssociationMixin<now_proj, number>
  declare removePid_now_proj_now_psrs: Sequelize.BelongsToManyRemoveAssociationsMixin<now_proj, number>
  declare hasPid_now_proj_now_psr: Sequelize.BelongsToManyHasAssociationMixin<now_proj, number>
  declare hasPid_now_proj_now_psrs: Sequelize.BelongsToManyHasAssociationsMixin<now_proj, number>
  declare countPid_now_proj_now_psrs: Sequelize.BelongsToManyCountAssociationsMixin
  // com_species hasMany now_psr via species_id
  declare now_psrs?: Sequelize.NonAttribute<now_psr[]>
  declare getNow_psrs: Sequelize.HasManyGetAssociationsMixin<now_psr>
  declare setNow_psrs: Sequelize.HasManySetAssociationsMixin<now_psr, number>
  declare addNow_psr: Sequelize.HasManyAddAssociationMixin<now_psr, number>
  declare addNow_psrs: Sequelize.HasManyAddAssociationsMixin<now_psr, number>
  declare createNow_psr: Sequelize.HasManyCreateAssociationMixin<now_psr, 'species_id'>
  declare removeNow_psr: Sequelize.HasManyRemoveAssociationMixin<now_psr, number>
  declare removeNow_psrs: Sequelize.HasManyRemoveAssociationsMixin<now_psr, number>
  declare hasNow_psr: Sequelize.HasManyHasAssociationMixin<now_psr, number>
  declare hasNow_psrs: Sequelize.HasManyHasAssociationsMixin<now_psr, number>
  declare countNow_psrs: Sequelize.HasManyCountAssociationsMixin
  // com_species hasMany now_sau via species_id
  declare now_saus?: Sequelize.NonAttribute<now_sau[]>
  declare getNow_saus: Sequelize.HasManyGetAssociationsMixin<now_sau>
  declare setNow_saus: Sequelize.HasManySetAssociationsMixin<now_sau, number>
  declare addNow_sau: Sequelize.HasManyAddAssociationMixin<now_sau, number>
  declare addNow_saus: Sequelize.HasManyAddAssociationsMixin<now_sau, number>
  declare createNow_sau: Sequelize.HasManyCreateAssociationMixin<now_sau, 'species_id'>
  declare removeNow_sau: Sequelize.HasManyRemoveAssociationMixin<now_sau, number>
  declare removeNow_saus: Sequelize.HasManyRemoveAssociationsMixin<now_sau, number>
  declare hasNow_sau: Sequelize.HasManyHasAssociationMixin<now_sau, number>
  declare hasNow_saus: Sequelize.HasManyHasAssociationsMixin<now_sau, number>
  declare countNow_saus: Sequelize.HasManyCountAssociationsMixin

  static initModel(sequelize: Sequelize.Sequelize): typeof com_species {
    return com_species.init(
      {
        species_id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        class_name: {
          type: DataTypes.STRING(30),
          allowNull: false,
          defaultValue: '',
        },
        order_name: {
          type: DataTypes.STRING(30),
          allowNull: false,
          defaultValue: '',
        },
        family_name: {
          type: DataTypes.STRING(30),
          allowNull: false,
          defaultValue: '',
        },
        subclass_or_superorder_name: {
          type: DataTypes.STRING(30),
          allowNull: true,
          defaultValue: '',
        },
        suborder_or_superfamily_name: {
          type: DataTypes.STRING(30),
          allowNull: true,
          defaultValue: '',
        },
        subfamily_name: {
          type: DataTypes.STRING(30),
          allowNull: true,
          defaultValue: '',
        },
        genus_name: {
          type: DataTypes.STRING(30),
          allowNull: false,
          defaultValue: '',
        },
        species_name: {
          type: DataTypes.STRING(30),
          allowNull: false,
          defaultValue: '',
        },
        unique_identifier: {
          type: DataTypes.STRING(50),
          allowNull: false,
          defaultValue: '',
        },
        taxonomic_status: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        common_name: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        sp_author: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        strain: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        gene: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },
        taxon_status: {
          type: DataTypes.STRING(10),
          allowNull: true,
        },
        diet1: {
          type: DataTypes.STRING(1),
          allowNull: true,
        },
        diet2: {
          type: DataTypes.STRING(9),
          allowNull: true,
        },
        diet3: {
          type: DataTypes.STRING(10),
          allowNull: true,
        },
        diet_description: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        rel_fib: {
          type: DataTypes.STRING(1),
          allowNull: true,
        },
        selectivity: {
          type: DataTypes.STRING(1),
          allowNull: true,
        },
        digestion: {
          type: DataTypes.STRING(2),
          allowNull: true,
        },
        feedinghab1: {
          type: DataTypes.STRING(2),
          allowNull: true,
        },
        feedinghab2: {
          type: DataTypes.STRING(8),
          allowNull: true,
        },
        shelterhab1: {
          type: DataTypes.STRING(2),
          allowNull: true,
        },
        shelterhab2: {
          type: DataTypes.STRING(8),
          allowNull: true,
        },
        locomo1: {
          type: DataTypes.STRING(2),
          allowNull: true,
        },
        locomo2: {
          type: DataTypes.STRING(15),
          allowNull: true,
        },
        locomo3: {
          type: DataTypes.STRING(15),
          allowNull: true,
        },
        hunt_forage: {
          type: DataTypes.STRING(8),
          allowNull: true,
        },
        body_mass: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        brain_mass: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        sv_length: {
          type: DataTypes.STRING(7),
          allowNull: true,
        },
        activity: {
          type: DataTypes.STRING(1),
          allowNull: true,
        },
        sd_size: {
          type: DataTypes.STRING(1),
          allowNull: true,
        },
        sd_display: {
          type: DataTypes.STRING(1),
          allowNull: true,
        },
        tshm: {
          type: DataTypes.STRING(3),
          allowNull: true,
        },
        symph_mob: {
          type: DataTypes.STRING(1),
          allowNull: true,
        },
        relative_blade_length: {
          type: DataTypes.DOUBLE,
          allowNull: true,
        },
        tht: {
          type: DataTypes.STRING(3),
          allowNull: true,
        },
        crowntype: {
          type: DataTypes.STRING(6),
          allowNull: true,
        },
        microwear: {
          type: DataTypes.STRING(7),
          allowNull: true,
        },
        horizodonty: {
          type: DataTypes.CHAR(3),
          allowNull: true,
        },
        cusp_shape: {
          type: DataTypes.CHAR(1),
          allowNull: true,
        },
        cusp_count_buccal: {
          type: DataTypes.CHAR(1),
          allowNull: true,
        },
        cusp_count_lingual: {
          type: DataTypes.CHAR(1),
          allowNull: true,
        },
        loph_count_lon: {
          type: DataTypes.CHAR(1),
          allowNull: true,
        },
        loph_count_trs: {
          type: DataTypes.CHAR(1),
          allowNull: true,
        },
        fct_al: {
          type: DataTypes.CHAR(1),
          allowNull: true,
        },
        fct_ol: {
          type: DataTypes.CHAR(1),
          allowNull: true,
        },
        fct_sf: {
          type: DataTypes.CHAR(1),
          allowNull: true,
        },
        fct_ot: {
          type: DataTypes.CHAR(1),
          allowNull: true,
        },
        fct_cm: {
          type: DataTypes.CHAR(1),
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
        pop_struc: {
          type: DataTypes.STRING(3),
          allowNull: true,
        },
        sp_status: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        used_morph: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        used_now: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        used_gene: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        sp_comment: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'com_species',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'species_id' }],
          },
        ],
      }
    )
  }
}
