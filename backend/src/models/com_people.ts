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
  declare initials: string
  declare first_name?: string
  declare surname: string
  declare full_name: string
  declare format?: string
  declare email?: string
  declare user_id?: number
  declare organization?: string
  declare country?: string
  declare password_set?: string
  declare used_morph?: number
  declare used_now?: number
  declare used_gene?: number

  // com_people hasMany now_bau via bau_coordinator
  declare now_baus: now_bau[]
  declare getNow_baus: Sequelize.HasManyGetAssociationsMixin<now_bau>
  declare setNow_baus: Sequelize.HasManySetAssociationsMixin<now_bau, now_bauId>
  declare addNow_bau: Sequelize.HasManyAddAssociationMixin<now_bau, now_bauId>
  declare addNow_baus: Sequelize.HasManyAddAssociationsMixin<now_bau, now_bauId>
  declare createNow_bau: Sequelize.HasManyCreateAssociationMixin<now_bau>
  declare removeNow_bau: Sequelize.HasManyRemoveAssociationMixin<now_bau, now_bauId>
  declare removeNow_baus: Sequelize.HasManyRemoveAssociationsMixin<now_bau, now_bauId>
  declare hasNow_bau: Sequelize.HasManyHasAssociationMixin<now_bau, now_bauId>
  declare hasNow_baus: Sequelize.HasManyHasAssociationsMixin<now_bau, now_bauId>
  declare countNow_baus: Sequelize.HasManyCountAssociationsMixin
  // com_people hasMany now_bau via bau_authorizer
  declare bau_authorizer_now_baus: now_bau[]
  declare getBau_authorizer_now_baus: Sequelize.HasManyGetAssociationsMixin<now_bau>
  declare setBau_authorizer_now_baus: Sequelize.HasManySetAssociationsMixin<now_bau, now_bauId>
  declare addBau_authorizer_now_bau: Sequelize.HasManyAddAssociationMixin<now_bau, now_bauId>
  declare addBau_authorizer_now_baus: Sequelize.HasManyAddAssociationsMixin<now_bau, now_bauId>
  declare createBau_authorizer_now_bau: Sequelize.HasManyCreateAssociationMixin<now_bau>
  declare removeBau_authorizer_now_bau: Sequelize.HasManyRemoveAssociationMixin<now_bau, now_bauId>
  declare removeBau_authorizer_now_baus: Sequelize.HasManyRemoveAssociationsMixin<now_bau, now_bauId>
  declare hasBau_authorizer_now_bau: Sequelize.HasManyHasAssociationMixin<now_bau, now_bauId>
  declare hasBau_authorizer_now_baus: Sequelize.HasManyHasAssociationsMixin<now_bau, now_bauId>
  declare countBau_authorizer_now_baus: Sequelize.HasManyCountAssociationsMixin
  // com_people hasMany now_lau via lau_coordinator
  declare now_laus: now_lau[]
  declare getNow_laus: Sequelize.HasManyGetAssociationsMixin<now_lau>
  declare setNow_laus: Sequelize.HasManySetAssociationsMixin<now_lau, now_lauId>
  declare addNow_lau: Sequelize.HasManyAddAssociationMixin<now_lau, now_lauId>
  declare addNow_laus: Sequelize.HasManyAddAssociationsMixin<now_lau, now_lauId>
  declare createNow_lau: Sequelize.HasManyCreateAssociationMixin<now_lau>
  declare removeNow_lau: Sequelize.HasManyRemoveAssociationMixin<now_lau, now_lauId>
  declare removeNow_laus: Sequelize.HasManyRemoveAssociationsMixin<now_lau, now_lauId>
  declare hasNow_lau: Sequelize.HasManyHasAssociationMixin<now_lau, now_lauId>
  declare hasNow_laus: Sequelize.HasManyHasAssociationsMixin<now_lau, now_lauId>
  declare countNow_laus: Sequelize.HasManyCountAssociationsMixin
  // com_people hasMany now_lau via lau_authorizer
  declare lau_authorizer_now_laus: now_lau[]
  declare getLau_authorizer_now_laus: Sequelize.HasManyGetAssociationsMixin<now_lau>
  declare setLau_authorizer_now_laus: Sequelize.HasManySetAssociationsMixin<now_lau, now_lauId>
  declare addLau_authorizer_now_lau: Sequelize.HasManyAddAssociationMixin<now_lau, now_lauId>
  declare addLau_authorizer_now_laus: Sequelize.HasManyAddAssociationsMixin<now_lau, now_lauId>
  declare createLau_authorizer_now_lau: Sequelize.HasManyCreateAssociationMixin<now_lau>
  declare removeLau_authorizer_now_lau: Sequelize.HasManyRemoveAssociationMixin<now_lau, now_lauId>
  declare removeLau_authorizer_now_laus: Sequelize.HasManyRemoveAssociationsMixin<now_lau, now_lauId>
  declare hasLau_authorizer_now_lau: Sequelize.HasManyHasAssociationMixin<now_lau, now_lauId>
  declare hasLau_authorizer_now_laus: Sequelize.HasManyHasAssociationsMixin<now_lau, now_lauId>
  declare countLau_authorizer_now_laus: Sequelize.HasManyCountAssociationsMixin
  // com_people hasMany now_proj via contact
  declare now_projs: now_proj[]
  declare getNow_projs: Sequelize.HasManyGetAssociationsMixin<now_proj>
  declare setNow_projs: Sequelize.HasManySetAssociationsMixin<now_proj, now_projId>
  declare addNow_proj: Sequelize.HasManyAddAssociationMixin<now_proj, now_projId>
  declare addNow_projs: Sequelize.HasManyAddAssociationsMixin<now_proj, now_projId>
  declare createNow_proj: Sequelize.HasManyCreateAssociationMixin<now_proj>
  declare removeNow_proj: Sequelize.HasManyRemoveAssociationMixin<now_proj, now_projId>
  declare removeNow_projs: Sequelize.HasManyRemoveAssociationsMixin<now_proj, now_projId>
  declare hasNow_proj: Sequelize.HasManyHasAssociationMixin<now_proj, now_projId>
  declare hasNow_projs: Sequelize.HasManyHasAssociationsMixin<now_proj, now_projId>
  declare countNow_projs: Sequelize.HasManyCountAssociationsMixin
  // com_people belongsToMany now_proj via initials and pid
  declare pid_now_proj_now_proj_people: now_proj[]
  declare getPid_now_proj_now_proj_people: Sequelize.BelongsToManyGetAssociationsMixin<now_proj>
  declare setPid_now_proj_now_proj_people: Sequelize.BelongsToManySetAssociationsMixin<now_proj, now_projId>
  declare addPid_now_proj_now_proj_person: Sequelize.BelongsToManyAddAssociationMixin<now_proj, now_projId>
  declare addPid_now_proj_now_proj_people: Sequelize.BelongsToManyAddAssociationsMixin<now_proj, now_projId>
  declare createPid_now_proj_now_proj_person: Sequelize.BelongsToManyCreateAssociationMixin<now_proj>
  declare removePid_now_proj_now_proj_person: Sequelize.BelongsToManyRemoveAssociationMixin<now_proj, now_projId>
  declare removePid_now_proj_now_proj_people: Sequelize.BelongsToManyRemoveAssociationsMixin<now_proj, now_projId>
  declare hasPid_now_proj_now_proj_person: Sequelize.BelongsToManyHasAssociationMixin<now_proj, now_projId>
  declare hasPid_now_proj_now_proj_people: Sequelize.BelongsToManyHasAssociationsMixin<now_proj, now_projId>
  declare countPid_now_proj_now_proj_people: Sequelize.BelongsToManyCountAssociationsMixin
  // com_people hasMany now_proj_people via initials
  declare now_proj_people: now_proj_people[]
  declare getNow_proj_people: Sequelize.HasManyGetAssociationsMixin<now_proj_people>
  declare setNow_proj_people: Sequelize.HasManySetAssociationsMixin<now_proj_people, now_proj_peopleId>
  declare addNow_proj_person: Sequelize.HasManyAddAssociationMixin<now_proj_people, now_proj_peopleId>
  declare addNow_proj_people: Sequelize.HasManyAddAssociationsMixin<now_proj_people, now_proj_peopleId>
  declare createNow_proj_person: Sequelize.HasManyCreateAssociationMixin<now_proj_people>
  declare removeNow_proj_person: Sequelize.HasManyRemoveAssociationMixin<now_proj_people, now_proj_peopleId>
  declare removeNow_proj_people: Sequelize.HasManyRemoveAssociationsMixin<now_proj_people, now_proj_peopleId>
  declare hasNow_proj_person: Sequelize.HasManyHasAssociationMixin<now_proj_people, now_proj_peopleId>
  declare hasNow_proj_people: Sequelize.HasManyHasAssociationsMixin<now_proj_people, now_proj_peopleId>
  declare countNow_proj_people: Sequelize.HasManyCountAssociationsMixin
  // com_people belongsToMany now_reg_coord via initials and reg_coord_id
  declare reg_coord_id_now_reg_coords: now_reg_coord[]
  declare getReg_coord_id_now_reg_coords: Sequelize.BelongsToManyGetAssociationsMixin<now_reg_coord>
  declare setReg_coord_id_now_reg_coords: Sequelize.BelongsToManySetAssociationsMixin<now_reg_coord, now_reg_coordId>
  declare addReg_coord_id_now_reg_coord: Sequelize.BelongsToManyAddAssociationMixin<now_reg_coord, now_reg_coordId>
  declare addReg_coord_id_now_reg_coords: Sequelize.BelongsToManyAddAssociationsMixin<now_reg_coord, now_reg_coordId>
  declare createReg_coord_id_now_reg_coord: Sequelize.BelongsToManyCreateAssociationMixin<now_reg_coord>
  declare removeReg_coord_id_now_reg_coord: Sequelize.BelongsToManyRemoveAssociationMixin<
    now_reg_coord,
    now_reg_coordId
  >
  declare removeReg_coord_id_now_reg_coords: Sequelize.BelongsToManyRemoveAssociationsMixin<
    now_reg_coord,
    now_reg_coordId
  >
  declare hasReg_coord_id_now_reg_coord: Sequelize.BelongsToManyHasAssociationMixin<now_reg_coord, now_reg_coordId>
  declare hasReg_coord_id_now_reg_coords: Sequelize.BelongsToManyHasAssociationsMixin<now_reg_coord, now_reg_coordId>
  declare countReg_coord_id_now_reg_coords: Sequelize.BelongsToManyCountAssociationsMixin
  // com_people hasMany now_reg_coord_people via initials
  declare now_reg_coord_people: now_reg_coord_people[]
  declare getNow_reg_coord_people: Sequelize.HasManyGetAssociationsMixin<now_reg_coord_people>
  declare setNow_reg_coord_people: Sequelize.HasManySetAssociationsMixin<now_reg_coord_people, now_reg_coord_peopleId>
  declare addNow_reg_coord_person: Sequelize.HasManyAddAssociationMixin<now_reg_coord_people, now_reg_coord_peopleId>
  declare addNow_reg_coord_people: Sequelize.HasManyAddAssociationsMixin<now_reg_coord_people, now_reg_coord_peopleId>
  declare createNow_reg_coord_person: Sequelize.HasManyCreateAssociationMixin<now_reg_coord_people>
  declare removeNow_reg_coord_person: Sequelize.HasManyRemoveAssociationMixin<
    now_reg_coord_people,
    now_reg_coord_peopleId
  >
  declare removeNow_reg_coord_people: Sequelize.HasManyRemoveAssociationsMixin<
    now_reg_coord_people,
    now_reg_coord_peopleId
  >
  declare hasNow_reg_coord_person: Sequelize.HasManyHasAssociationMixin<now_reg_coord_people, now_reg_coord_peopleId>
  declare hasNow_reg_coord_people: Sequelize.HasManyHasAssociationsMixin<now_reg_coord_people, now_reg_coord_peopleId>
  declare countNow_reg_coord_people: Sequelize.HasManyCountAssociationsMixin
  // com_people hasMany now_sau via sau_coordinator
  declare now_saus: now_sau[]
  declare getNow_saus: Sequelize.HasManyGetAssociationsMixin<now_sau>
  declare setNow_saus: Sequelize.HasManySetAssociationsMixin<now_sau, now_sauId>
  declare addNow_sau: Sequelize.HasManyAddAssociationMixin<now_sau, now_sauId>
  declare addNow_saus: Sequelize.HasManyAddAssociationsMixin<now_sau, now_sauId>
  declare createNow_sau: Sequelize.HasManyCreateAssociationMixin<now_sau>
  declare removeNow_sau: Sequelize.HasManyRemoveAssociationMixin<now_sau, now_sauId>
  declare removeNow_saus: Sequelize.HasManyRemoveAssociationsMixin<now_sau, now_sauId>
  declare hasNow_sau: Sequelize.HasManyHasAssociationMixin<now_sau, now_sauId>
  declare hasNow_saus: Sequelize.HasManyHasAssociationsMixin<now_sau, now_sauId>
  declare countNow_saus: Sequelize.HasManyCountAssociationsMixin
  // com_people hasMany now_sau via sau_authorizer
  declare sau_authorizer_now_saus: now_sau[]
  declare getSau_authorizer_now_saus: Sequelize.HasManyGetAssociationsMixin<now_sau>
  declare setSau_authorizer_now_saus: Sequelize.HasManySetAssociationsMixin<now_sau, now_sauId>
  declare addSau_authorizer_now_sau: Sequelize.HasManyAddAssociationMixin<now_sau, now_sauId>
  declare addSau_authorizer_now_saus: Sequelize.HasManyAddAssociationsMixin<now_sau, now_sauId>
  declare createSau_authorizer_now_sau: Sequelize.HasManyCreateAssociationMixin<now_sau>
  declare removeSau_authorizer_now_sau: Sequelize.HasManyRemoveAssociationMixin<now_sau, now_sauId>
  declare removeSau_authorizer_now_saus: Sequelize.HasManyRemoveAssociationsMixin<now_sau, now_sauId>
  declare hasSau_authorizer_now_sau: Sequelize.HasManyHasAssociationMixin<now_sau, now_sauId>
  declare hasSau_authorizer_now_saus: Sequelize.HasManyHasAssociationsMixin<now_sau, now_sauId>
  declare countSau_authorizer_now_saus: Sequelize.HasManyCountAssociationsMixin
  // com_people belongsToMany now_sp_coord via initials and sp_coord_id
  declare sp_coord_id_now_sp_coords: now_sp_coord[]
  declare getSp_coord_id_now_sp_coords: Sequelize.BelongsToManyGetAssociationsMixin<now_sp_coord>
  declare setSp_coord_id_now_sp_coords: Sequelize.BelongsToManySetAssociationsMixin<now_sp_coord, now_sp_coordId>
  declare addSp_coord_id_now_sp_coord: Sequelize.BelongsToManyAddAssociationMixin<now_sp_coord, now_sp_coordId>
  declare addSp_coord_id_now_sp_coords: Sequelize.BelongsToManyAddAssociationsMixin<now_sp_coord, now_sp_coordId>
  declare createSp_coord_id_now_sp_coord: Sequelize.BelongsToManyCreateAssociationMixin<now_sp_coord>
  declare removeSp_coord_id_now_sp_coord: Sequelize.BelongsToManyRemoveAssociationMixin<now_sp_coord, now_sp_coordId>
  declare removeSp_coord_id_now_sp_coords: Sequelize.BelongsToManyRemoveAssociationsMixin<now_sp_coord, now_sp_coordId>
  declare hasSp_coord_id_now_sp_coord: Sequelize.BelongsToManyHasAssociationMixin<now_sp_coord, now_sp_coordId>
  declare hasSp_coord_id_now_sp_coords: Sequelize.BelongsToManyHasAssociationsMixin<now_sp_coord, now_sp_coordId>
  declare countSp_coord_id_now_sp_coords: Sequelize.BelongsToManyCountAssociationsMixin
  // com_people hasMany now_sp_coord_people via initials
  declare now_sp_coord_people: now_sp_coord_people[]
  declare getNow_sp_coord_people: Sequelize.HasManyGetAssociationsMixin<now_sp_coord_people>
  declare setNow_sp_coord_people: Sequelize.HasManySetAssociationsMixin<now_sp_coord_people, now_sp_coord_peopleId>
  declare addNow_sp_coord_person: Sequelize.HasManyAddAssociationMixin<now_sp_coord_people, now_sp_coord_peopleId>
  declare addNow_sp_coord_people: Sequelize.HasManyAddAssociationsMixin<now_sp_coord_people, now_sp_coord_peopleId>
  declare createNow_sp_coord_person: Sequelize.HasManyCreateAssociationMixin<now_sp_coord_people>
  declare removeNow_sp_coord_person: Sequelize.HasManyRemoveAssociationMixin<now_sp_coord_people, now_sp_coord_peopleId>
  declare removeNow_sp_coord_people: Sequelize.HasManyRemoveAssociationsMixin<
    now_sp_coord_people,
    now_sp_coord_peopleId
  >
  declare hasNow_sp_coord_person: Sequelize.HasManyHasAssociationMixin<now_sp_coord_people, now_sp_coord_peopleId>
  declare hasNow_sp_coord_people: Sequelize.HasManyHasAssociationsMixin<now_sp_coord_people, now_sp_coord_peopleId>
  declare countNow_sp_coord_people: Sequelize.HasManyCountAssociationsMixin
  // com_people belongsToMany now_strat_coord via initials and strat_coord_id
  declare strat_coord_id_now_strat_coords: now_strat_coord[]
  declare getStrat_coord_id_now_strat_coords: Sequelize.BelongsToManyGetAssociationsMixin<now_strat_coord>
  declare setStrat_coord_id_now_strat_coords: Sequelize.BelongsToManySetAssociationsMixin<
    now_strat_coord,
    now_strat_coordId
  >
  declare addStrat_coord_id_now_strat_coord: Sequelize.BelongsToManyAddAssociationMixin<
    now_strat_coord,
    now_strat_coordId
  >
  declare addStrat_coord_id_now_strat_coords: Sequelize.BelongsToManyAddAssociationsMixin<
    now_strat_coord,
    now_strat_coordId
  >
  declare createStrat_coord_id_now_strat_coord: Sequelize.BelongsToManyCreateAssociationMixin<now_strat_coord>
  declare removeStrat_coord_id_now_strat_coord: Sequelize.BelongsToManyRemoveAssociationMixin<
    now_strat_coord,
    now_strat_coordId
  >
  declare removeStrat_coord_id_now_strat_coords: Sequelize.BelongsToManyRemoveAssociationsMixin<
    now_strat_coord,
    now_strat_coordId
  >
  declare hasStrat_coord_id_now_strat_coord: Sequelize.BelongsToManyHasAssociationMixin<
    now_strat_coord,
    now_strat_coordId
  >
  declare hasStrat_coord_id_now_strat_coords: Sequelize.BelongsToManyHasAssociationsMixin<
    now_strat_coord,
    now_strat_coordId
  >
  declare countStrat_coord_id_now_strat_coords: Sequelize.BelongsToManyCountAssociationsMixin
  // com_people hasMany now_strat_coord_people via initials
  declare now_strat_coord_people: now_strat_coord_people[]
  declare getNow_strat_coord_people: Sequelize.HasManyGetAssociationsMixin<now_strat_coord_people>
  declare setNow_strat_coord_people: Sequelize.HasManySetAssociationsMixin<
    now_strat_coord_people,
    now_strat_coord_peopleId
  >
  declare addNow_strat_coord_person: Sequelize.HasManyAddAssociationMixin<
    now_strat_coord_people,
    now_strat_coord_peopleId
  >
  declare addNow_strat_coord_people: Sequelize.HasManyAddAssociationsMixin<
    now_strat_coord_people,
    now_strat_coord_peopleId
  >
  declare createNow_strat_coord_person: Sequelize.HasManyCreateAssociationMixin<now_strat_coord_people>
  declare removeNow_strat_coord_person: Sequelize.HasManyRemoveAssociationMixin<
    now_strat_coord_people,
    now_strat_coord_peopleId
  >
  declare removeNow_strat_coord_people: Sequelize.HasManyRemoveAssociationsMixin<
    now_strat_coord_people,
    now_strat_coord_peopleId
  >
  declare hasNow_strat_coord_person: Sequelize.HasManyHasAssociationMixin<
    now_strat_coord_people,
    now_strat_coord_peopleId
  >
  declare hasNow_strat_coord_people: Sequelize.HasManyHasAssociationsMixin<
    now_strat_coord_people,
    now_strat_coord_peopleId
  >
  declare countNow_strat_coord_people: Sequelize.HasManyCountAssociationsMixin
  // com_people hasMany now_tau via tau_coordinator
  declare now_taus: now_tau[]
  declare getNow_taus: Sequelize.HasManyGetAssociationsMixin<now_tau>
  declare setNow_taus: Sequelize.HasManySetAssociationsMixin<now_tau, now_tauId>
  declare addNow_tau: Sequelize.HasManyAddAssociationMixin<now_tau, now_tauId>
  declare addNow_taus: Sequelize.HasManyAddAssociationsMixin<now_tau, now_tauId>
  declare createNow_tau: Sequelize.HasManyCreateAssociationMixin<now_tau>
  declare removeNow_tau: Sequelize.HasManyRemoveAssociationMixin<now_tau, now_tauId>
  declare removeNow_taus: Sequelize.HasManyRemoveAssociationsMixin<now_tau, now_tauId>
  declare hasNow_tau: Sequelize.HasManyHasAssociationMixin<now_tau, now_tauId>
  declare hasNow_taus: Sequelize.HasManyHasAssociationsMixin<now_tau, now_tauId>
  declare countNow_taus: Sequelize.HasManyCountAssociationsMixin
  // com_people hasMany now_tau via tau_authorizer
  declare tau_authorizer_now_taus: now_tau[]
  declare getTau_authorizer_now_taus: Sequelize.HasManyGetAssociationsMixin<now_tau>
  declare setTau_authorizer_now_taus: Sequelize.HasManySetAssociationsMixin<now_tau, now_tauId>
  declare addTau_authorizer_now_tau: Sequelize.HasManyAddAssociationMixin<now_tau, now_tauId>
  declare addTau_authorizer_now_taus: Sequelize.HasManyAddAssociationsMixin<now_tau, now_tauId>
  declare createTau_authorizer_now_tau: Sequelize.HasManyCreateAssociationMixin<now_tau>
  declare removeTau_authorizer_now_tau: Sequelize.HasManyRemoveAssociationMixin<now_tau, now_tauId>
  declare removeTau_authorizer_now_taus: Sequelize.HasManyRemoveAssociationsMixin<now_tau, now_tauId>
  declare hasTau_authorizer_now_tau: Sequelize.HasManyHasAssociationMixin<now_tau, now_tauId>
  declare hasTau_authorizer_now_taus: Sequelize.HasManyHasAssociationsMixin<now_tau, now_tauId>
  declare countTau_authorizer_now_taus: Sequelize.HasManyCountAssociationsMixin

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
