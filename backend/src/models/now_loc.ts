import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { com_mlist, com_mlistId } from './com_mlist'
import type { com_species, com_speciesId } from './com_species'
import type { now_coll_meth, now_coll_methId } from './now_coll_meth'
import type { now_lau, now_lauId } from './now_lau'
import type { now_ls, now_lsId } from './now_ls'
import type { now_mus, now_musId } from './now_mus'
import type { now_plr, now_plrId } from './now_plr'
import type { now_proj, now_projId } from './now_proj'
import type { now_ss, now_ssId } from './now_ss'
import type { now_syn_loc, now_syn_locId } from './now_syn_loc'
import type { now_time_unit, now_time_unitId } from './now_time_unit'

export interface now_locAttributes {
  lid: number
  bfa_max?: string
  bfa_min?: string
  loc_name: string
  date_meth: string
  max_age: number
  min_age: number
  bfa_max_abs?: string
  bfa_min_abs?: string
  frac_max?: string
  frac_min?: string
  chron?: string
  age_comm?: string
  basin?: string
  subbasin?: string
  dms_lat?: string
  dms_long?: string
  dec_lat: number
  dec_long: number
  approx_coord?: number
  altitude?: number
  country?: string
  state?: string
  county?: string
  site_area?: string
  gen_loc?: string
  plate?: string
  loc_detail?: string
  lgroup?: string
  formation?: string
  member?: string
  bed?: string
  datum_plane?: string
  tos?: number
  bos?: number
  rock_type?: string
  rt_adj?: string
  lith_comm?: string
  depo_context1?: string
  depo_context2?: string
  depo_context3?: string
  depo_context4?: string
  depo_comm?: string
  sed_env_1?: string
  sed_env_2?: string
  event_circum?: string
  se_comm?: string
  climate_type?: string
  biome?: string
  v_ht?: string
  v_struct?: string
  v_envi_det?: string
  disturb?: string
  nutrients?: string
  water?: string
  seasonality?: string
  seas_intens?: string
  pri_prod?: string
  moisture?: string
  temperature?: string
  assem_fm?: string
  transport?: string
  trans_mod?: string
  weath_trmp?: string
  pt_conc?: string
  size_type?: string
  vert_pres?: string
  plant_pres?: string
  invert_pres?: string
  time_rep?: string
  appr_num_spm?: number
  num_spm?: number
  true_quant?: string
  complete?: string
  num_quad?: number
  taph_comm?: string
  tax_comm?: string
  loc_status?: number
  estimate_precip?: number
  estimate_temp?: number
  estimate_npp?: number
  pers_woody_cover?: number
  pers_pollen_ap?: number
  pers_pollen_nap?: number
  pers_pollen_other?: number
  hominin_skeletal_remains: number
  bipedal_footprints: number
  stone_tool_technology: number
  stone_tool_cut_marks_on_bones: number
  technological_mode_1?: number
  technological_mode_2?: number
  technological_mode_3?: number
  cultural_stage_1?: string
  cultural_stage_2?: string
  cultural_stage_3?: string
  regional_culture_1?: string
  regional_culture_2?: string
  regional_culture_3?: string
}

export type now_locPk = 'lid'
export type now_locId = now_loc[now_locPk]
export type now_locOptionalAttributes =
  | 'lid'
  | 'bfa_max'
  | 'bfa_min'
  | 'loc_name'
  | 'date_meth'
  | 'max_age'
  | 'min_age'
  | 'bfa_max_abs'
  | 'bfa_min_abs'
  | 'frac_max'
  | 'frac_min'
  | 'chron'
  | 'age_comm'
  | 'basin'
  | 'subbasin'
  | 'dms_lat'
  | 'dms_long'
  | 'dec_lat'
  | 'dec_long'
  | 'approx_coord'
  | 'altitude'
  | 'country'
  | 'state'
  | 'county'
  | 'site_area'
  | 'gen_loc'
  | 'plate'
  | 'loc_detail'
  | 'lgroup'
  | 'formation'
  | 'member'
  | 'bed'
  | 'datum_plane'
  | 'tos'
  | 'bos'
  | 'rock_type'
  | 'rt_adj'
  | 'lith_comm'
  | 'depo_context1'
  | 'depo_context2'
  | 'depo_context3'
  | 'depo_context4'
  | 'depo_comm'
  | 'sed_env_1'
  | 'sed_env_2'
  | 'event_circum'
  | 'se_comm'
  | 'climate_type'
  | 'biome'
  | 'v_ht'
  | 'v_struct'
  | 'v_envi_det'
  | 'disturb'
  | 'nutrients'
  | 'water'
  | 'seasonality'
  | 'seas_intens'
  | 'pri_prod'
  | 'moisture'
  | 'temperature'
  | 'assem_fm'
  | 'transport'
  | 'trans_mod'
  | 'weath_trmp'
  | 'pt_conc'
  | 'size_type'
  | 'vert_pres'
  | 'plant_pres'
  | 'invert_pres'
  | 'time_rep'
  | 'appr_num_spm'
  | 'num_spm'
  | 'true_quant'
  | 'complete'
  | 'num_quad'
  | 'taph_comm'
  | 'tax_comm'
  | 'loc_status'
  | 'estimate_precip'
  | 'estimate_temp'
  | 'estimate_npp'
  | 'pers_woody_cover'
  | 'pers_pollen_ap'
  | 'pers_pollen_nap'
  | 'pers_pollen_other'
  | 'hominin_skeletal_remains'
  | 'bipedal_footprints'
  | 'stone_tool_technology'
  | 'stone_tool_cut_marks_on_bones'
  | 'technological_mode_1'
  | 'technological_mode_2'
  | 'technological_mode_3'
  | 'cultural_stage_1'
  | 'cultural_stage_2'
  | 'cultural_stage_3'
  | 'regional_culture_1'
  | 'regional_culture_2'
  | 'regional_culture_3'
export type now_locCreationAttributes = Optional<now_locAttributes, now_locOptionalAttributes>

export class now_loc extends Model<now_locAttributes, now_locCreationAttributes> implements now_locAttributes {
  lid!: number
  bfa_max?: string
  bfa_min?: string
  loc_name!: string
  date_meth!: string
  max_age!: number
  min_age!: number
  bfa_max_abs?: string
  bfa_min_abs?: string
  frac_max?: string
  frac_min?: string
  chron?: string
  age_comm?: string
  basin?: string
  subbasin?: string
  dms_lat?: string
  dms_long?: string
  dec_lat!: number
  dec_long!: number
  approx_coord?: number
  altitude?: number
  country?: string
  state?: string
  county?: string
  site_area?: string
  gen_loc?: string
  plate?: string
  loc_detail?: string
  lgroup?: string
  formation?: string
  member?: string
  bed?: string
  datum_plane?: string
  tos?: number
  bos?: number
  rock_type?: string
  rt_adj?: string
  lith_comm?: string
  depo_context1?: string
  depo_context2?: string
  depo_context3?: string
  depo_context4?: string
  depo_comm?: string
  sed_env_1?: string
  sed_env_2?: string
  event_circum?: string
  se_comm?: string
  climate_type?: string
  biome?: string
  v_ht?: string
  v_struct?: string
  v_envi_det?: string
  disturb?: string
  nutrients?: string
  water?: string
  seasonality?: string
  seas_intens?: string
  pri_prod?: string
  moisture?: string
  temperature?: string
  assem_fm?: string
  transport?: string
  trans_mod?: string
  weath_trmp?: string
  pt_conc?: string
  size_type?: string
  vert_pres?: string
  plant_pres?: string
  invert_pres?: string
  time_rep?: string
  appr_num_spm?: number
  num_spm?: number
  true_quant?: string
  complete?: string
  num_quad?: number
  taph_comm?: string
  tax_comm?: string
  loc_status?: number
  estimate_precip?: number
  estimate_temp?: number
  estimate_npp?: number
  pers_woody_cover?: number
  pers_pollen_ap?: number
  pers_pollen_nap?: number
  pers_pollen_other?: number
  hominin_skeletal_remains!: number
  bipedal_footprints!: number
  stone_tool_technology!: number
  stone_tool_cut_marks_on_bones!: number
  technological_mode_1?: number
  technological_mode_2?: number
  technological_mode_3?: number
  cultural_stage_1?: string
  cultural_stage_2?: string
  cultural_stage_3?: string
  regional_culture_1?: string
  regional_culture_2?: string
  regional_culture_3?: string

  // now_loc belongsToMany com_mlist via lid and museum
  museum_com_mlists!: com_mlist[]
  getMuseum_com_mlists!: Sequelize.BelongsToManyGetAssociationsMixin<com_mlist>
  setMuseum_com_mlists!: Sequelize.BelongsToManySetAssociationsMixin<com_mlist, com_mlistId>
  addMuseum_com_mlist!: Sequelize.BelongsToManyAddAssociationMixin<com_mlist, com_mlistId>
  addMuseum_com_mlists!: Sequelize.BelongsToManyAddAssociationsMixin<com_mlist, com_mlistId>
  createMuseum_com_mlist!: Sequelize.BelongsToManyCreateAssociationMixin<com_mlist>
  removeMuseum_com_mlist!: Sequelize.BelongsToManyRemoveAssociationMixin<com_mlist, com_mlistId>
  removeMuseum_com_mlists!: Sequelize.BelongsToManyRemoveAssociationsMixin<com_mlist, com_mlistId>
  hasMuseum_com_mlist!: Sequelize.BelongsToManyHasAssociationMixin<com_mlist, com_mlistId>
  hasMuseum_com_mlists!: Sequelize.BelongsToManyHasAssociationsMixin<com_mlist, com_mlistId>
  countMuseum_com_mlists!: Sequelize.BelongsToManyCountAssociationsMixin
  // now_loc belongsToMany com_species via lid and species_id
  species_id_com_species!: com_species[]
  getSpecies_id_com_species!: Sequelize.BelongsToManyGetAssociationsMixin<com_species>
  setSpecies_id_com_species!: Sequelize.BelongsToManySetAssociationsMixin<com_species, com_speciesId>
  addSpecies_id_com_specy!: Sequelize.BelongsToManyAddAssociationMixin<com_species, com_speciesId>
  addSpecies_id_com_species!: Sequelize.BelongsToManyAddAssociationsMixin<com_species, com_speciesId>
  createSpecies_id_com_specy!: Sequelize.BelongsToManyCreateAssociationMixin<com_species>
  removeSpecies_id_com_specy!: Sequelize.BelongsToManyRemoveAssociationMixin<com_species, com_speciesId>
  removeSpecies_id_com_species!: Sequelize.BelongsToManyRemoveAssociationsMixin<com_species, com_speciesId>
  hasSpecies_id_com_specy!: Sequelize.BelongsToManyHasAssociationMixin<com_species, com_speciesId>
  hasSpecies_id_com_species!: Sequelize.BelongsToManyHasAssociationsMixin<com_species, com_speciesId>
  countSpecies_id_com_species!: Sequelize.BelongsToManyCountAssociationsMixin
  // now_loc hasMany now_coll_meth via lid
  now_coll_meths!: now_coll_meth[]
  getNow_coll_meths!: Sequelize.HasManyGetAssociationsMixin<now_coll_meth>
  setNow_coll_meths!: Sequelize.HasManySetAssociationsMixin<now_coll_meth, now_coll_methId>
  addNow_coll_meth!: Sequelize.HasManyAddAssociationMixin<now_coll_meth, now_coll_methId>
  addNow_coll_meths!: Sequelize.HasManyAddAssociationsMixin<now_coll_meth, now_coll_methId>
  createNow_coll_meth!: Sequelize.HasManyCreateAssociationMixin<now_coll_meth>
  removeNow_coll_meth!: Sequelize.HasManyRemoveAssociationMixin<now_coll_meth, now_coll_methId>
  removeNow_coll_meths!: Sequelize.HasManyRemoveAssociationsMixin<now_coll_meth, now_coll_methId>
  hasNow_coll_meth!: Sequelize.HasManyHasAssociationMixin<now_coll_meth, now_coll_methId>
  hasNow_coll_meths!: Sequelize.HasManyHasAssociationsMixin<now_coll_meth, now_coll_methId>
  countNow_coll_meths!: Sequelize.HasManyCountAssociationsMixin
  // now_loc hasMany now_lau via lid
  now_laus!: now_lau[]
  getNow_laus!: Sequelize.HasManyGetAssociationsMixin<now_lau>
  setNow_laus!: Sequelize.HasManySetAssociationsMixin<now_lau, now_lauId>
  addNow_lau!: Sequelize.HasManyAddAssociationMixin<now_lau, now_lauId>
  addNow_laus!: Sequelize.HasManyAddAssociationsMixin<now_lau, now_lauId>
  createNow_lau!: Sequelize.HasManyCreateAssociationMixin<now_lau>
  removeNow_lau!: Sequelize.HasManyRemoveAssociationMixin<now_lau, now_lauId>
  removeNow_laus!: Sequelize.HasManyRemoveAssociationsMixin<now_lau, now_lauId>
  hasNow_lau!: Sequelize.HasManyHasAssociationMixin<now_lau, now_lauId>
  hasNow_laus!: Sequelize.HasManyHasAssociationsMixin<now_lau, now_lauId>
  countNow_laus!: Sequelize.HasManyCountAssociationsMixin
  // now_loc hasMany now_ls via lid
  now_ls!: now_ls[]
  getNow_ls!: Sequelize.HasManyGetAssociationsMixin<now_ls>
  setNow_ls!: Sequelize.HasManySetAssociationsMixin<now_ls, now_lsId>
  addNow_l!: Sequelize.HasManyAddAssociationMixin<now_ls, now_lsId>
  addNow_ls!: Sequelize.HasManyAddAssociationsMixin<now_ls, now_lsId>
  createNow_l!: Sequelize.HasManyCreateAssociationMixin<now_ls>
  removeNow_l!: Sequelize.HasManyRemoveAssociationMixin<now_ls, now_lsId>
  removeNow_ls!: Sequelize.HasManyRemoveAssociationsMixin<now_ls, now_lsId>
  hasNow_l!: Sequelize.HasManyHasAssociationMixin<now_ls, now_lsId>
  hasNow_ls!: Sequelize.HasManyHasAssociationsMixin<now_ls, now_lsId>
  countNow_ls!: Sequelize.HasManyCountAssociationsMixin
  // now_loc hasMany now_mus via lid
  now_mus!: now_mus[]
  getNow_mus!: Sequelize.HasManyGetAssociationsMixin<now_mus>
  setNow_mus!: Sequelize.HasManySetAssociationsMixin<now_mus, now_musId>
  addNow_mu!: Sequelize.HasManyAddAssociationMixin<now_mus, now_musId>
  addNow_mus!: Sequelize.HasManyAddAssociationsMixin<now_mus, now_musId>
  createNow_mu!: Sequelize.HasManyCreateAssociationMixin<now_mus>
  removeNow_mu!: Sequelize.HasManyRemoveAssociationMixin<now_mus, now_musId>
  removeNow_mus!: Sequelize.HasManyRemoveAssociationsMixin<now_mus, now_musId>
  hasNow_mu!: Sequelize.HasManyHasAssociationMixin<now_mus, now_musId>
  hasNow_mus!: Sequelize.HasManyHasAssociationsMixin<now_mus, now_musId>
  countNow_mus!: Sequelize.HasManyCountAssociationsMixin
  // now_loc hasMany now_plr via lid
  now_plrs!: now_plr[]
  getNow_plrs!: Sequelize.HasManyGetAssociationsMixin<now_plr>
  setNow_plrs!: Sequelize.HasManySetAssociationsMixin<now_plr, now_plrId>
  addNow_plr!: Sequelize.HasManyAddAssociationMixin<now_plr, now_plrId>
  addNow_plrs!: Sequelize.HasManyAddAssociationsMixin<now_plr, now_plrId>
  createNow_plr!: Sequelize.HasManyCreateAssociationMixin<now_plr>
  removeNow_plr!: Sequelize.HasManyRemoveAssociationMixin<now_plr, now_plrId>
  removeNow_plrs!: Sequelize.HasManyRemoveAssociationsMixin<now_plr, now_plrId>
  hasNow_plr!: Sequelize.HasManyHasAssociationMixin<now_plr, now_plrId>
  hasNow_plrs!: Sequelize.HasManyHasAssociationsMixin<now_plr, now_plrId>
  countNow_plrs!: Sequelize.HasManyCountAssociationsMixin
  // now_loc belongsToMany now_proj via lid and pid
  pid_now_projs!: now_proj[]
  getPid_now_projs!: Sequelize.BelongsToManyGetAssociationsMixin<now_proj>
  setPid_now_projs!: Sequelize.BelongsToManySetAssociationsMixin<now_proj, now_projId>
  addPid_now_proj!: Sequelize.BelongsToManyAddAssociationMixin<now_proj, now_projId>
  addPid_now_projs!: Sequelize.BelongsToManyAddAssociationsMixin<now_proj, now_projId>
  createPid_now_proj!: Sequelize.BelongsToManyCreateAssociationMixin<now_proj>
  removePid_now_proj!: Sequelize.BelongsToManyRemoveAssociationMixin<now_proj, now_projId>
  removePid_now_projs!: Sequelize.BelongsToManyRemoveAssociationsMixin<now_proj, now_projId>
  hasPid_now_proj!: Sequelize.BelongsToManyHasAssociationMixin<now_proj, now_projId>
  hasPid_now_projs!: Sequelize.BelongsToManyHasAssociationsMixin<now_proj, now_projId>
  countPid_now_projs!: Sequelize.BelongsToManyCountAssociationsMixin
  // now_loc hasMany now_ss via lid
  now_sses!: now_ss[]
  getNow_sses!: Sequelize.HasManyGetAssociationsMixin<now_ss>
  setNow_sses!: Sequelize.HasManySetAssociationsMixin<now_ss, now_ssId>
  addNow_ss!: Sequelize.HasManyAddAssociationMixin<now_ss, now_ssId>
  addNow_sses!: Sequelize.HasManyAddAssociationsMixin<now_ss, now_ssId>
  createNow_ss!: Sequelize.HasManyCreateAssociationMixin<now_ss>
  removeNow_ss!: Sequelize.HasManyRemoveAssociationMixin<now_ss, now_ssId>
  removeNow_sses!: Sequelize.HasManyRemoveAssociationsMixin<now_ss, now_ssId>
  hasNow_ss!: Sequelize.HasManyHasAssociationMixin<now_ss, now_ssId>
  hasNow_sses!: Sequelize.HasManyHasAssociationsMixin<now_ss, now_ssId>
  countNow_sses!: Sequelize.HasManyCountAssociationsMixin
  // now_loc hasMany now_syn_loc via lid
  now_syn_locs!: now_syn_loc[]
  getNow_syn_locs!: Sequelize.HasManyGetAssociationsMixin<now_syn_loc>
  setNow_syn_locs!: Sequelize.HasManySetAssociationsMixin<now_syn_loc, now_syn_locId>
  addNow_syn_loc!: Sequelize.HasManyAddAssociationMixin<now_syn_loc, now_syn_locId>
  addNow_syn_locs!: Sequelize.HasManyAddAssociationsMixin<now_syn_loc, now_syn_locId>
  createNow_syn_loc!: Sequelize.HasManyCreateAssociationMixin<now_syn_loc>
  removeNow_syn_loc!: Sequelize.HasManyRemoveAssociationMixin<now_syn_loc, now_syn_locId>
  removeNow_syn_locs!: Sequelize.HasManyRemoveAssociationsMixin<now_syn_loc, now_syn_locId>
  hasNow_syn_loc!: Sequelize.HasManyHasAssociationMixin<now_syn_loc, now_syn_locId>
  hasNow_syn_locs!: Sequelize.HasManyHasAssociationsMixin<now_syn_loc, now_syn_locId>
  countNow_syn_locs!: Sequelize.HasManyCountAssociationsMixin
  // now_loc belongsTo now_time_unit via bfa_max
  bfa_max_now_time_unit!: now_time_unit
  getBfa_max_now_time_unit!: Sequelize.BelongsToGetAssociationMixin<now_time_unit>
  setBfa_max_now_time_unit!: Sequelize.BelongsToSetAssociationMixin<now_time_unit, now_time_unitId>
  createBfa_max_now_time_unit!: Sequelize.BelongsToCreateAssociationMixin<now_time_unit>
  // now_loc belongsTo now_time_unit via bfa_min
  bfa_min_now_time_unit!: now_time_unit
  getBfa_min_now_time_unit!: Sequelize.BelongsToGetAssociationMixin<now_time_unit>
  setBfa_min_now_time_unit!: Sequelize.BelongsToSetAssociationMixin<now_time_unit, now_time_unitId>
  createBfa_min_now_time_unit!: Sequelize.BelongsToCreateAssociationMixin<now_time_unit>

  static initModel(sequelize: Sequelize.Sequelize): typeof now_loc {
    return now_loc.init(
      {
        lid: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        bfa_max: {
          type: DataTypes.STRING(30),
          allowNull: true,
          references: {
            model: 'now_time_unit',
            key: 'tu_name',
          },
        },
        bfa_min: {
          type: DataTypes.STRING(30),
          allowNull: true,
          references: {
            model: 'now_time_unit',
            key: 'tu_name',
          },
        },
        loc_name: {
          type: DataTypes.STRING(30),
          allowNull: false,
          defaultValue: '',
        },
        date_meth: {
          type: DataTypes.STRING(9),
          allowNull: false,
          defaultValue: '',
        },
        max_age: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          defaultValue: 0,
        },
        min_age: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          defaultValue: 0,
        },
        bfa_max_abs: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },
        bfa_min_abs: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },
        frac_max: {
          type: DataTypes.STRING(9),
          allowNull: true,
        },
        frac_min: {
          type: DataTypes.STRING(9),
          allowNull: true,
        },
        chron: {
          type: DataTypes.STRING(40),
          allowNull: true,
        },
        age_comm: {
          type: DataTypes.STRING(120),
          allowNull: true,
        },
        basin: {
          type: DataTypes.STRING(120),
          allowNull: true,
        },
        subbasin: {
          type: DataTypes.STRING(120),
          allowNull: true,
        },
        dms_lat: {
          type: DataTypes.STRING(14),
          allowNull: true,
        },
        dms_long: {
          type: DataTypes.STRING(14),
          allowNull: true,
        },
        dec_lat: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          defaultValue: 0,
        },
        dec_long: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          defaultValue: 0,
        },
        approx_coord: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        altitude: {
          type: DataTypes.SMALLINT,
          allowNull: true,
        },
        country: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        state: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        county: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        site_area: {
          type: DataTypes.STRING(10),
          allowNull: true,
        },
        gen_loc: {
          type: DataTypes.STRING(1),
          allowNull: true,
        },
        plate: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        loc_detail: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        lgroup: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },
        formation: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },
        member: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },
        bed: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },
        datum_plane: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        tos: {
          type: DataTypes.DOUBLE,
          allowNull: true,
        },
        bos: {
          type: DataTypes.DOUBLE,
          allowNull: true,
        },
        rock_type: {
          type: DataTypes.STRING(15),
          allowNull: true,
        },
        rt_adj: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },
        lith_comm: {
          type: DataTypes.STRING(120),
          allowNull: true,
        },
        depo_context1: {
          type: DataTypes.STRING(10),
          allowNull: true,
        },
        depo_context2: {
          type: DataTypes.STRING(10),
          allowNull: true,
        },
        depo_context3: {
          type: DataTypes.STRING(10),
          allowNull: true,
        },
        depo_context4: {
          type: DataTypes.STRING(10),
          allowNull: true,
        },
        depo_comm: {
          type: DataTypes.STRING(120),
          allowNull: true,
        },
        sed_env_1: {
          type: DataTypes.STRING(13),
          allowNull: true,
        },
        sed_env_2: {
          type: DataTypes.STRING(15),
          allowNull: true,
        },
        event_circum: {
          type: DataTypes.STRING(15),
          allowNull: true,
        },
        se_comm: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        climate_type: {
          type: DataTypes.STRING(15),
          allowNull: true,
        },
        biome: {
          type: DataTypes.STRING(15),
          allowNull: true,
        },
        v_ht: {
          type: DataTypes.STRING(4),
          allowNull: true,
        },
        v_struct: {
          type: DataTypes.STRING(9),
          allowNull: true,
        },
        v_envi_det: {
          type: DataTypes.STRING(80),
          allowNull: true,
        },
        disturb: {
          type: DataTypes.STRING(16),
          allowNull: true,
        },
        nutrients: {
          type: DataTypes.STRING(7),
          allowNull: true,
        },
        water: {
          type: DataTypes.STRING(8),
          allowNull: true,
        },
        seasonality: {
          type: DataTypes.STRING(16),
          allowNull: true,
        },
        seas_intens: {
          type: DataTypes.STRING(3),
          allowNull: true,
        },
        pri_prod: {
          type: DataTypes.STRING(4),
          allowNull: true,
        },
        moisture: {
          type: DataTypes.STRING(3),
          allowNull: true,
        },
        temperature: {
          type: DataTypes.STRING(4),
          allowNull: true,
        },
        assem_fm: {
          type: DataTypes.STRING(12),
          allowNull: true,
        },
        transport: {
          type: DataTypes.STRING(15),
          allowNull: true,
        },
        trans_mod: {
          type: DataTypes.STRING(9),
          allowNull: true,
        },
        weath_trmp: {
          type: DataTypes.STRING(9),
          allowNull: true,
        },
        pt_conc: {
          type: DataTypes.STRING(14),
          allowNull: true,
        },
        size_type: {
          type: DataTypes.STRING(5),
          allowNull: true,
        },
        vert_pres: {
          type: DataTypes.STRING(12),
          allowNull: true,
        },
        plant_pres: {
          type: DataTypes.STRING(12),
          allowNull: true,
        },
        invert_pres: {
          type: DataTypes.STRING(12),
          allowNull: true,
        },
        time_rep: {
          type: DataTypes.STRING(9),
          allowNull: true,
        },
        appr_num_spm: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        num_spm: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        true_quant: {
          type: DataTypes.STRING(1),
          allowNull: true,
        },
        complete: {
          type: DataTypes.STRING(1),
          allowNull: true,
        },
        num_quad: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        taph_comm: {
          type: DataTypes.STRING(120),
          allowNull: true,
        },
        tax_comm: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        loc_status: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        estimate_precip: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        estimate_temp: {
          type: DataTypes.DECIMAL(4, 1),
          allowNull: true,
        },
        estimate_npp: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        pers_woody_cover: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        pers_pollen_ap: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        pers_pollen_nap: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        pers_pollen_other: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        hominin_skeletal_remains: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: 0,
        },
        bipedal_footprints: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: 0,
        },
        stone_tool_technology: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: 0,
        },
        stone_tool_cut_marks_on_bones: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: 0,
        },
        technological_mode_1: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        technological_mode_2: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        technological_mode_3: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        cultural_stage_1: {
          type: DataTypes.STRING(64),
          allowNull: true,
        },
        cultural_stage_2: {
          type: DataTypes.STRING(64),
          allowNull: true,
        },
        cultural_stage_3: {
          type: DataTypes.STRING(64),
          allowNull: true,
        },
        regional_culture_1: {
          type: DataTypes.STRING(64),
          allowNull: true,
        },
        regional_culture_2: {
          type: DataTypes.STRING(64),
          allowNull: true,
        },
        regional_culture_3: {
          type: DataTypes.STRING(64),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'now_loc',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'lid' }],
          },
          {
            name: 'now_test_loc_FKIndex1',
            using: 'BTREE',
            fields: [{ name: 'bfa_max' }],
          },
          {
            name: 'now_test_loc_FKIndex2',
            using: 'BTREE',
            fields: [{ name: 'bfa_min' }],
          },
        ],
      }
    )
  }
}
