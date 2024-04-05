import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { now_bau, now_bauId } from './now_bau'
import type { now_lau, now_lauId } from './now_lau'
import type { now_proj, now_projId } from './now_proj'
import type { now_proj_people, now_proj_peopleId } from './now_proj_people'
import type { now_reg_coord, now_reg_coordId } from './now_reg_coord'
import type { now_reg_coord_people, now_reg_coord_peopleId } from './now_reg_coord_people'
import type { now_sau, now_sauId } from './now_sau'
import type { now_sp_coord, now_sp_coordId } from './now_sp_coord'
import type { now_sp_coord_people, now_sp_coord_peopleId } from './now_sp_coord_people'
import type { now_strat_coord, now_strat_coordId } from './now_strat_coord'
import type { now_strat_coord_people, now_strat_coord_peopleId } from './now_strat_coord_people'
import type { now_tau, now_tauId } from './now_tau'

export interface com_peopleAttributes {
  initials: string
  first_name?: string
  surname: string
  full_name: string
  format?: string
  email?: string
  user_id?: number
  organization?: string
  country?: string
  password_set?: string
  used_morph?: number
  used_now?: number
  used_gene?: number
}

export type com_peoplePk = 'initials'
export type com_peopleId = com_people[com_peoplePk]
export type com_peopleOptionalAttributes =
  | 'initials'
  | 'first_name'
  | 'surname'
  | 'full_name'
  | 'format'
  | 'email'
  | 'user_id'
  | 'organization'
  | 'country'
  | 'password_set'
  | 'used_morph'
  | 'used_now'
  | 'used_gene'
export type com_peopleCreationAttributes = Optional<com_peopleAttributes, com_peopleOptionalAttributes>

export class com_people
  extends Model<com_peopleAttributes, com_peopleCreationAttributes>
  implements com_peopleAttributes
{
  initials!: string
  first_name?: string
  surname!: string
  full_name!: string
  format?: string
  email?: string
  user_id?: number
  organization?: string
  country?: string
  password_set?: string
  used_morph?: number
  used_now?: number
  used_gene?: number

  // com_people hasMany now_bau via bau_coordinator
  now_baus!: now_bau[]
  getNow_baus!: Sequelize.HasManyGetAssociationsMixin<now_bau>
  setNow_baus!: Sequelize.HasManySetAssociationsMixin<now_bau, now_bauId>
  addNow_bau!: Sequelize.HasManyAddAssociationMixin<now_bau, now_bauId>
  addNow_baus!: Sequelize.HasManyAddAssociationsMixin<now_bau, now_bauId>
  createNow_bau!: Sequelize.HasManyCreateAssociationMixin<now_bau>
  removeNow_bau!: Sequelize.HasManyRemoveAssociationMixin<now_bau, now_bauId>
  removeNow_baus!: Sequelize.HasManyRemoveAssociationsMixin<now_bau, now_bauId>
  hasNow_bau!: Sequelize.HasManyHasAssociationMixin<now_bau, now_bauId>
  hasNow_baus!: Sequelize.HasManyHasAssociationsMixin<now_bau, now_bauId>
  countNow_baus!: Sequelize.HasManyCountAssociationsMixin
  // com_people hasMany now_bau via bau_authorizer
  bau_authorizer_now_baus!: now_bau[]
  getBau_authorizer_now_baus!: Sequelize.HasManyGetAssociationsMixin<now_bau>
  setBau_authorizer_now_baus!: Sequelize.HasManySetAssociationsMixin<now_bau, now_bauId>
  addBau_authorizer_now_bau!: Sequelize.HasManyAddAssociationMixin<now_bau, now_bauId>
  addBau_authorizer_now_baus!: Sequelize.HasManyAddAssociationsMixin<now_bau, now_bauId>
  createBau_authorizer_now_bau!: Sequelize.HasManyCreateAssociationMixin<now_bau>
  removeBau_authorizer_now_bau!: Sequelize.HasManyRemoveAssociationMixin<now_bau, now_bauId>
  removeBau_authorizer_now_baus!: Sequelize.HasManyRemoveAssociationsMixin<now_bau, now_bauId>
  hasBau_authorizer_now_bau!: Sequelize.HasManyHasAssociationMixin<now_bau, now_bauId>
  hasBau_authorizer_now_baus!: Sequelize.HasManyHasAssociationsMixin<now_bau, now_bauId>
  countBau_authorizer_now_baus!: Sequelize.HasManyCountAssociationsMixin
  // com_people hasMany now_lau via lau_coordinator
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
  // com_people hasMany now_lau via lau_authorizer
  lau_authorizer_now_laus!: now_lau[]
  getLau_authorizer_now_laus!: Sequelize.HasManyGetAssociationsMixin<now_lau>
  setLau_authorizer_now_laus!: Sequelize.HasManySetAssociationsMixin<now_lau, now_lauId>
  addLau_authorizer_now_lau!: Sequelize.HasManyAddAssociationMixin<now_lau, now_lauId>
  addLau_authorizer_now_laus!: Sequelize.HasManyAddAssociationsMixin<now_lau, now_lauId>
  createLau_authorizer_now_lau!: Sequelize.HasManyCreateAssociationMixin<now_lau>
  removeLau_authorizer_now_lau!: Sequelize.HasManyRemoveAssociationMixin<now_lau, now_lauId>
  removeLau_authorizer_now_laus!: Sequelize.HasManyRemoveAssociationsMixin<now_lau, now_lauId>
  hasLau_authorizer_now_lau!: Sequelize.HasManyHasAssociationMixin<now_lau, now_lauId>
  hasLau_authorizer_now_laus!: Sequelize.HasManyHasAssociationsMixin<now_lau, now_lauId>
  countLau_authorizer_now_laus!: Sequelize.HasManyCountAssociationsMixin
  // com_people hasMany now_proj via contact
  now_projs!: now_proj[]
  getNow_projs!: Sequelize.HasManyGetAssociationsMixin<now_proj>
  setNow_projs!: Sequelize.HasManySetAssociationsMixin<now_proj, now_projId>
  addNow_proj!: Sequelize.HasManyAddAssociationMixin<now_proj, now_projId>
  addNow_projs!: Sequelize.HasManyAddAssociationsMixin<now_proj, now_projId>
  createNow_proj!: Sequelize.HasManyCreateAssociationMixin<now_proj>
  removeNow_proj!: Sequelize.HasManyRemoveAssociationMixin<now_proj, now_projId>
  removeNow_projs!: Sequelize.HasManyRemoveAssociationsMixin<now_proj, now_projId>
  hasNow_proj!: Sequelize.HasManyHasAssociationMixin<now_proj, now_projId>
  hasNow_projs!: Sequelize.HasManyHasAssociationsMixin<now_proj, now_projId>
  countNow_projs!: Sequelize.HasManyCountAssociationsMixin
  // com_people belongsToMany now_proj via initials and pid
  pid_now_proj_now_proj_people!: now_proj[]
  getPid_now_proj_now_proj_people!: Sequelize.BelongsToManyGetAssociationsMixin<now_proj>
  setPid_now_proj_now_proj_people!: Sequelize.BelongsToManySetAssociationsMixin<now_proj, now_projId>
  addPid_now_proj_now_proj_person!: Sequelize.BelongsToManyAddAssociationMixin<now_proj, now_projId>
  addPid_now_proj_now_proj_people!: Sequelize.BelongsToManyAddAssociationsMixin<now_proj, now_projId>
  createPid_now_proj_now_proj_person!: Sequelize.BelongsToManyCreateAssociationMixin<now_proj>
  removePid_now_proj_now_proj_person!: Sequelize.BelongsToManyRemoveAssociationMixin<now_proj, now_projId>
  removePid_now_proj_now_proj_people!: Sequelize.BelongsToManyRemoveAssociationsMixin<now_proj, now_projId>
  hasPid_now_proj_now_proj_person!: Sequelize.BelongsToManyHasAssociationMixin<now_proj, now_projId>
  hasPid_now_proj_now_proj_people!: Sequelize.BelongsToManyHasAssociationsMixin<now_proj, now_projId>
  countPid_now_proj_now_proj_people!: Sequelize.BelongsToManyCountAssociationsMixin
  // com_people hasMany now_proj_people via initials
  now_proj_people!: now_proj_people[]
  getNow_proj_people!: Sequelize.HasManyGetAssociationsMixin<now_proj_people>
  setNow_proj_people!: Sequelize.HasManySetAssociationsMixin<now_proj_people, now_proj_peopleId>
  addNow_proj_person!: Sequelize.HasManyAddAssociationMixin<now_proj_people, now_proj_peopleId>
  addNow_proj_people!: Sequelize.HasManyAddAssociationsMixin<now_proj_people, now_proj_peopleId>
  createNow_proj_person!: Sequelize.HasManyCreateAssociationMixin<now_proj_people>
  removeNow_proj_person!: Sequelize.HasManyRemoveAssociationMixin<now_proj_people, now_proj_peopleId>
  removeNow_proj_people!: Sequelize.HasManyRemoveAssociationsMixin<now_proj_people, now_proj_peopleId>
  hasNow_proj_person!: Sequelize.HasManyHasAssociationMixin<now_proj_people, now_proj_peopleId>
  hasNow_proj_people!: Sequelize.HasManyHasAssociationsMixin<now_proj_people, now_proj_peopleId>
  countNow_proj_people!: Sequelize.HasManyCountAssociationsMixin
  // com_people belongsToMany now_reg_coord via initials and reg_coord_id
  reg_coord_id_now_reg_coords!: now_reg_coord[]
  getReg_coord_id_now_reg_coords!: Sequelize.BelongsToManyGetAssociationsMixin<now_reg_coord>
  setReg_coord_id_now_reg_coords!: Sequelize.BelongsToManySetAssociationsMixin<now_reg_coord, now_reg_coordId>
  addReg_coord_id_now_reg_coord!: Sequelize.BelongsToManyAddAssociationMixin<now_reg_coord, now_reg_coordId>
  addReg_coord_id_now_reg_coords!: Sequelize.BelongsToManyAddAssociationsMixin<now_reg_coord, now_reg_coordId>
  createReg_coord_id_now_reg_coord!: Sequelize.BelongsToManyCreateAssociationMixin<now_reg_coord>
  removeReg_coord_id_now_reg_coord!: Sequelize.BelongsToManyRemoveAssociationMixin<now_reg_coord, now_reg_coordId>
  removeReg_coord_id_now_reg_coords!: Sequelize.BelongsToManyRemoveAssociationsMixin<now_reg_coord, now_reg_coordId>
  hasReg_coord_id_now_reg_coord!: Sequelize.BelongsToManyHasAssociationMixin<now_reg_coord, now_reg_coordId>
  hasReg_coord_id_now_reg_coords!: Sequelize.BelongsToManyHasAssociationsMixin<now_reg_coord, now_reg_coordId>
  countReg_coord_id_now_reg_coords!: Sequelize.BelongsToManyCountAssociationsMixin
  // com_people hasMany now_reg_coord_people via initials
  now_reg_coord_people!: now_reg_coord_people[]
  getNow_reg_coord_people!: Sequelize.HasManyGetAssociationsMixin<now_reg_coord_people>
  setNow_reg_coord_people!: Sequelize.HasManySetAssociationsMixin<now_reg_coord_people, now_reg_coord_peopleId>
  addNow_reg_coord_person!: Sequelize.HasManyAddAssociationMixin<now_reg_coord_people, now_reg_coord_peopleId>
  addNow_reg_coord_people!: Sequelize.HasManyAddAssociationsMixin<now_reg_coord_people, now_reg_coord_peopleId>
  createNow_reg_coord_person!: Sequelize.HasManyCreateAssociationMixin<now_reg_coord_people>
  removeNow_reg_coord_person!: Sequelize.HasManyRemoveAssociationMixin<now_reg_coord_people, now_reg_coord_peopleId>
  removeNow_reg_coord_people!: Sequelize.HasManyRemoveAssociationsMixin<now_reg_coord_people, now_reg_coord_peopleId>
  hasNow_reg_coord_person!: Sequelize.HasManyHasAssociationMixin<now_reg_coord_people, now_reg_coord_peopleId>
  hasNow_reg_coord_people!: Sequelize.HasManyHasAssociationsMixin<now_reg_coord_people, now_reg_coord_peopleId>
  countNow_reg_coord_people!: Sequelize.HasManyCountAssociationsMixin
  // com_people hasMany now_sau via sau_coordinator
  now_saus!: now_sau[]
  getNow_saus!: Sequelize.HasManyGetAssociationsMixin<now_sau>
  setNow_saus!: Sequelize.HasManySetAssociationsMixin<now_sau, now_sauId>
  addNow_sau!: Sequelize.HasManyAddAssociationMixin<now_sau, now_sauId>
  addNow_saus!: Sequelize.HasManyAddAssociationsMixin<now_sau, now_sauId>
  createNow_sau!: Sequelize.HasManyCreateAssociationMixin<now_sau>
  removeNow_sau!: Sequelize.HasManyRemoveAssociationMixin<now_sau, now_sauId>
  removeNow_saus!: Sequelize.HasManyRemoveAssociationsMixin<now_sau, now_sauId>
  hasNow_sau!: Sequelize.HasManyHasAssociationMixin<now_sau, now_sauId>
  hasNow_saus!: Sequelize.HasManyHasAssociationsMixin<now_sau, now_sauId>
  countNow_saus!: Sequelize.HasManyCountAssociationsMixin
  // com_people hasMany now_sau via sau_authorizer
  sau_authorizer_now_saus!: now_sau[]
  getSau_authorizer_now_saus!: Sequelize.HasManyGetAssociationsMixin<now_sau>
  setSau_authorizer_now_saus!: Sequelize.HasManySetAssociationsMixin<now_sau, now_sauId>
  addSau_authorizer_now_sau!: Sequelize.HasManyAddAssociationMixin<now_sau, now_sauId>
  addSau_authorizer_now_saus!: Sequelize.HasManyAddAssociationsMixin<now_sau, now_sauId>
  createSau_authorizer_now_sau!: Sequelize.HasManyCreateAssociationMixin<now_sau>
  removeSau_authorizer_now_sau!: Sequelize.HasManyRemoveAssociationMixin<now_sau, now_sauId>
  removeSau_authorizer_now_saus!: Sequelize.HasManyRemoveAssociationsMixin<now_sau, now_sauId>
  hasSau_authorizer_now_sau!: Sequelize.HasManyHasAssociationMixin<now_sau, now_sauId>
  hasSau_authorizer_now_saus!: Sequelize.HasManyHasAssociationsMixin<now_sau, now_sauId>
  countSau_authorizer_now_saus!: Sequelize.HasManyCountAssociationsMixin
  // com_people belongsToMany now_sp_coord via initials and sp_coord_id
  sp_coord_id_now_sp_coords!: now_sp_coord[]
  getSp_coord_id_now_sp_coords!: Sequelize.BelongsToManyGetAssociationsMixin<now_sp_coord>
  setSp_coord_id_now_sp_coords!: Sequelize.BelongsToManySetAssociationsMixin<now_sp_coord, now_sp_coordId>
  addSp_coord_id_now_sp_coord!: Sequelize.BelongsToManyAddAssociationMixin<now_sp_coord, now_sp_coordId>
  addSp_coord_id_now_sp_coords!: Sequelize.BelongsToManyAddAssociationsMixin<now_sp_coord, now_sp_coordId>
  createSp_coord_id_now_sp_coord!: Sequelize.BelongsToManyCreateAssociationMixin<now_sp_coord>
  removeSp_coord_id_now_sp_coord!: Sequelize.BelongsToManyRemoveAssociationMixin<now_sp_coord, now_sp_coordId>
  removeSp_coord_id_now_sp_coords!: Sequelize.BelongsToManyRemoveAssociationsMixin<now_sp_coord, now_sp_coordId>
  hasSp_coord_id_now_sp_coord!: Sequelize.BelongsToManyHasAssociationMixin<now_sp_coord, now_sp_coordId>
  hasSp_coord_id_now_sp_coords!: Sequelize.BelongsToManyHasAssociationsMixin<now_sp_coord, now_sp_coordId>
  countSp_coord_id_now_sp_coords!: Sequelize.BelongsToManyCountAssociationsMixin
  // com_people hasMany now_sp_coord_people via initials
  now_sp_coord_people!: now_sp_coord_people[]
  getNow_sp_coord_people!: Sequelize.HasManyGetAssociationsMixin<now_sp_coord_people>
  setNow_sp_coord_people!: Sequelize.HasManySetAssociationsMixin<now_sp_coord_people, now_sp_coord_peopleId>
  addNow_sp_coord_person!: Sequelize.HasManyAddAssociationMixin<now_sp_coord_people, now_sp_coord_peopleId>
  addNow_sp_coord_people!: Sequelize.HasManyAddAssociationsMixin<now_sp_coord_people, now_sp_coord_peopleId>
  createNow_sp_coord_person!: Sequelize.HasManyCreateAssociationMixin<now_sp_coord_people>
  removeNow_sp_coord_person!: Sequelize.HasManyRemoveAssociationMixin<now_sp_coord_people, now_sp_coord_peopleId>
  removeNow_sp_coord_people!: Sequelize.HasManyRemoveAssociationsMixin<now_sp_coord_people, now_sp_coord_peopleId>
  hasNow_sp_coord_person!: Sequelize.HasManyHasAssociationMixin<now_sp_coord_people, now_sp_coord_peopleId>
  hasNow_sp_coord_people!: Sequelize.HasManyHasAssociationsMixin<now_sp_coord_people, now_sp_coord_peopleId>
  countNow_sp_coord_people!: Sequelize.HasManyCountAssociationsMixin
  // com_people belongsToMany now_strat_coord via initials and strat_coord_id
  strat_coord_id_now_strat_coords!: now_strat_coord[]
  getStrat_coord_id_now_strat_coords!: Sequelize.BelongsToManyGetAssociationsMixin<now_strat_coord>
  setStrat_coord_id_now_strat_coords!: Sequelize.BelongsToManySetAssociationsMixin<now_strat_coord, now_strat_coordId>
  addStrat_coord_id_now_strat_coord!: Sequelize.BelongsToManyAddAssociationMixin<now_strat_coord, now_strat_coordId>
  addStrat_coord_id_now_strat_coords!: Sequelize.BelongsToManyAddAssociationsMixin<now_strat_coord, now_strat_coordId>
  createStrat_coord_id_now_strat_coord!: Sequelize.BelongsToManyCreateAssociationMixin<now_strat_coord>
  removeStrat_coord_id_now_strat_coord!: Sequelize.BelongsToManyRemoveAssociationMixin<
    now_strat_coord,
    now_strat_coordId
  >
  removeStrat_coord_id_now_strat_coords!: Sequelize.BelongsToManyRemoveAssociationsMixin<
    now_strat_coord,
    now_strat_coordId
  >
  hasStrat_coord_id_now_strat_coord!: Sequelize.BelongsToManyHasAssociationMixin<now_strat_coord, now_strat_coordId>
  hasStrat_coord_id_now_strat_coords!: Sequelize.BelongsToManyHasAssociationsMixin<now_strat_coord, now_strat_coordId>
  countStrat_coord_id_now_strat_coords!: Sequelize.BelongsToManyCountAssociationsMixin
  // com_people hasMany now_strat_coord_people via initials
  now_strat_coord_people!: now_strat_coord_people[]
  getNow_strat_coord_people!: Sequelize.HasManyGetAssociationsMixin<now_strat_coord_people>
  setNow_strat_coord_people!: Sequelize.HasManySetAssociationsMixin<now_strat_coord_people, now_strat_coord_peopleId>
  addNow_strat_coord_person!: Sequelize.HasManyAddAssociationMixin<now_strat_coord_people, now_strat_coord_peopleId>
  addNow_strat_coord_people!: Sequelize.HasManyAddAssociationsMixin<now_strat_coord_people, now_strat_coord_peopleId>
  createNow_strat_coord_person!: Sequelize.HasManyCreateAssociationMixin<now_strat_coord_people>
  removeNow_strat_coord_person!: Sequelize.HasManyRemoveAssociationMixin<
    now_strat_coord_people,
    now_strat_coord_peopleId
  >
  removeNow_strat_coord_people!: Sequelize.HasManyRemoveAssociationsMixin<
    now_strat_coord_people,
    now_strat_coord_peopleId
  >
  hasNow_strat_coord_person!: Sequelize.HasManyHasAssociationMixin<now_strat_coord_people, now_strat_coord_peopleId>
  hasNow_strat_coord_people!: Sequelize.HasManyHasAssociationsMixin<now_strat_coord_people, now_strat_coord_peopleId>
  countNow_strat_coord_people!: Sequelize.HasManyCountAssociationsMixin
  // com_people hasMany now_tau via tau_coordinator
  now_taus!: now_tau[]
  getNow_taus!: Sequelize.HasManyGetAssociationsMixin<now_tau>
  setNow_taus!: Sequelize.HasManySetAssociationsMixin<now_tau, now_tauId>
  addNow_tau!: Sequelize.HasManyAddAssociationMixin<now_tau, now_tauId>
  addNow_taus!: Sequelize.HasManyAddAssociationsMixin<now_tau, now_tauId>
  createNow_tau!: Sequelize.HasManyCreateAssociationMixin<now_tau>
  removeNow_tau!: Sequelize.HasManyRemoveAssociationMixin<now_tau, now_tauId>
  removeNow_taus!: Sequelize.HasManyRemoveAssociationsMixin<now_tau, now_tauId>
  hasNow_tau!: Sequelize.HasManyHasAssociationMixin<now_tau, now_tauId>
  hasNow_taus!: Sequelize.HasManyHasAssociationsMixin<now_tau, now_tauId>
  countNow_taus!: Sequelize.HasManyCountAssociationsMixin
  // com_people hasMany now_tau via tau_authorizer
  tau_authorizer_now_taus!: now_tau[]
  getTau_authorizer_now_taus!: Sequelize.HasManyGetAssociationsMixin<now_tau>
  setTau_authorizer_now_taus!: Sequelize.HasManySetAssociationsMixin<now_tau, now_tauId>
  addTau_authorizer_now_tau!: Sequelize.HasManyAddAssociationMixin<now_tau, now_tauId>
  addTau_authorizer_now_taus!: Sequelize.HasManyAddAssociationsMixin<now_tau, now_tauId>
  createTau_authorizer_now_tau!: Sequelize.HasManyCreateAssociationMixin<now_tau>
  removeTau_authorizer_now_tau!: Sequelize.HasManyRemoveAssociationMixin<now_tau, now_tauId>
  removeTau_authorizer_now_taus!: Sequelize.HasManyRemoveAssociationsMixin<now_tau, now_tauId>
  hasTau_authorizer_now_tau!: Sequelize.HasManyHasAssociationMixin<now_tau, now_tauId>
  hasTau_authorizer_now_taus!: Sequelize.HasManyHasAssociationsMixin<now_tau, now_tauId>
  countTau_authorizer_now_taus!: Sequelize.HasManyCountAssociationsMixin

  static initModel(sequelize: Sequelize.Sequelize): typeof com_people {
    return com_people.init(
      {
        initials: {
          type: DataTypes.STRING(10),
          allowNull: false,
          defaultValue: '',
          primaryKey: true,
        },
        first_name: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        surname: {
          type: DataTypes.STRING(80),
          allowNull: false,
          defaultValue: '',
        },
        full_name: {
          type: DataTypes.STRING(80),
          allowNull: false,
          defaultValue: '',
        },
        format: {
          type: DataTypes.STRING(1),
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING(120),
          allowNull: true,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        organization: {
          type: DataTypes.STRING(80),
          allowNull: true,
        },
        country: {
          type: DataTypes.STRING(80),
          allowNull: true,
        },
        password_set: {
          type: DataTypes.DATEONLY,
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
      },
      {
        sequelize,
        tableName: 'com_people',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'initials' }],
          },
        ],
      }
    )
  }
}
