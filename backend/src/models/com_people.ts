import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

import type { now_bau } from './now_bau'
import type { now_lau } from './now_lau'
import type { now_proj } from './now_proj'
import type { now_proj_people } from './now_proj_people'
import type { now_reg_coord } from './now_reg_coord'
import type { now_reg_coord_people } from './now_reg_coord_people'
import type { now_sau } from './now_sau'
import type { now_sp_coord } from './now_sp_coord'
import type { now_sp_coord_people } from './now_sp_coord_people'
import type { now_strat_coord } from './now_strat_coord'
import type { now_strat_coord_people } from './now_strat_coord_people'
import type { now_tau } from './now_tau'

export class com_people extends Model<InferAttributes<com_people>, InferCreationAttributes<com_people>> {
  declare initials: CreationOptional<string>
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
  declare now_baus?: Sequelize.NonAttribute<now_bau[]>
  declare getNow_baus: Sequelize.HasManyGetAssociationsMixin<now_bau>
  declare setNow_baus: Sequelize.HasManySetAssociationsMixin<now_bau, number>
  declare addNow_bau: Sequelize.HasManyAddAssociationMixin<now_bau, number>
  declare addNow_baus: Sequelize.HasManyAddAssociationsMixin<now_bau, number>
  declare createNow_bau: Sequelize.HasManyCreateAssociationMixin<now_bau, 'bau_coordinator'>
  declare removeNow_bau: Sequelize.HasManyRemoveAssociationMixin<now_bau, number>
  declare removeNow_baus: Sequelize.HasManyRemoveAssociationsMixin<now_bau, number>
  declare hasNow_bau: Sequelize.HasManyHasAssociationMixin<now_bau, number>
  declare hasNow_baus: Sequelize.HasManyHasAssociationsMixin<now_bau, number>
  declare countNow_baus: Sequelize.HasManyCountAssociationsMixin
  // com_people hasMany now_bau via bau_authorizer
  declare bau_authorizer_now_baus?: Sequelize.NonAttribute<now_bau[]>
  declare getBau_authorizer_now_baus: Sequelize.HasManyGetAssociationsMixin<now_bau>
  declare setBau_authorizer_now_baus: Sequelize.HasManySetAssociationsMixin<now_bau, number>
  declare addBau_authorizer_now_bau: Sequelize.HasManyAddAssociationMixin<now_bau, number>
  declare addBau_authorizer_now_baus: Sequelize.HasManyAddAssociationsMixin<now_bau, number>
  declare createBau_authorizer_now_bau: Sequelize.HasManyCreateAssociationMixin<now_bau, 'bau_authorizer'>
  declare removeBau_authorizer_now_bau: Sequelize.HasManyRemoveAssociationMixin<now_bau, number>
  declare removeBau_authorizer_now_baus: Sequelize.HasManyRemoveAssociationsMixin<now_bau, number>
  declare hasBau_authorizer_now_bau: Sequelize.HasManyHasAssociationMixin<now_bau, number>
  declare hasBau_authorizer_now_baus: Sequelize.HasManyHasAssociationsMixin<now_bau, number>
  declare countBau_authorizer_now_baus: Sequelize.HasManyCountAssociationsMixin
  // com_people hasMany now_lau via lau_coordinator
  declare now_laus?: Sequelize.NonAttribute<now_lau[]>
  declare getNow_laus: Sequelize.HasManyGetAssociationsMixin<now_lau>
  declare setNow_laus: Sequelize.HasManySetAssociationsMixin<now_lau, number>
  declare addNow_lau: Sequelize.HasManyAddAssociationMixin<now_lau, number>
  declare addNow_laus: Sequelize.HasManyAddAssociationsMixin<now_lau, number>
  declare createNow_lau: Sequelize.HasManyCreateAssociationMixin<now_lau, 'lau_coordinator'>
  declare removeNow_lau: Sequelize.HasManyRemoveAssociationMixin<now_lau, number>
  declare removeNow_laus: Sequelize.HasManyRemoveAssociationsMixin<now_lau, number>
  declare hasNow_lau: Sequelize.HasManyHasAssociationMixin<now_lau, number>
  declare hasNow_laus: Sequelize.HasManyHasAssociationsMixin<now_lau, number>
  declare countNow_laus: Sequelize.HasManyCountAssociationsMixin
  // com_people hasMany now_lau via lau_authorizer
  declare lau_authorizer_now_laus?: Sequelize.NonAttribute<now_lau[]>
  declare getLau_authorizer_now_laus: Sequelize.HasManyGetAssociationsMixin<now_lau>
  declare setLau_authorizer_now_laus: Sequelize.HasManySetAssociationsMixin<now_lau, number>
  declare addLau_authorizer_now_lau: Sequelize.HasManyAddAssociationMixin<now_lau, number>
  declare addLau_authorizer_now_laus: Sequelize.HasManyAddAssociationsMixin<now_lau, number>
  declare createLau_authorizer_now_lau: Sequelize.HasManyCreateAssociationMixin<now_lau, 'lau_authorizer'>
  declare removeLau_authorizer_now_lau: Sequelize.HasManyRemoveAssociationMixin<now_lau, number>
  declare removeLau_authorizer_now_laus: Sequelize.HasManyRemoveAssociationsMixin<now_lau, number>
  declare hasLau_authorizer_now_lau: Sequelize.HasManyHasAssociationMixin<now_lau, number>
  declare hasLau_authorizer_now_laus: Sequelize.HasManyHasAssociationsMixin<now_lau, number>
  declare countLau_authorizer_now_laus: Sequelize.HasManyCountAssociationsMixin
  // com_people hasMany now_proj via contact
  declare now_projs?: Sequelize.NonAttribute<now_proj[]>
  declare getNow_projs: Sequelize.HasManyGetAssociationsMixin<now_proj>
  declare setNow_projs: Sequelize.HasManySetAssociationsMixin<now_proj, number>
  declare addNow_proj: Sequelize.HasManyAddAssociationMixin<now_proj, number>
  declare addNow_projs: Sequelize.HasManyAddAssociationsMixin<now_proj, number>
  declare createNow_proj: Sequelize.HasManyCreateAssociationMixin<now_proj, 'contact'>
  declare removeNow_proj: Sequelize.HasManyRemoveAssociationMixin<now_proj, number>
  declare removeNow_projs: Sequelize.HasManyRemoveAssociationsMixin<now_proj, number>
  declare hasNow_proj: Sequelize.HasManyHasAssociationMixin<now_proj, number>
  declare hasNow_projs: Sequelize.HasManyHasAssociationsMixin<now_proj, number>
  declare countNow_projs: Sequelize.HasManyCountAssociationsMixin
  // com_people belongsToMany now_proj via initials and pid
  declare pid_now_proj_now_proj_people: Sequelize.NonAttribute<now_proj[]>
  declare getPid_now_proj_now_proj_people: Sequelize.BelongsToManyGetAssociationsMixin<now_proj>
  declare setPid_now_proj_now_proj_people: Sequelize.BelongsToManySetAssociationsMixin<now_proj, number>
  declare addPid_now_proj_now_proj_person: Sequelize.BelongsToManyAddAssociationMixin<now_proj, number>
  declare addPid_now_proj_now_proj_people: Sequelize.BelongsToManyAddAssociationsMixin<now_proj, number>
  declare createPid_now_proj_now_proj_person: Sequelize.BelongsToManyCreateAssociationMixin<now_proj, 'initials'>
  declare removePid_now_proj_now_proj_person: Sequelize.BelongsToManyRemoveAssociationMixin<now_proj, number>
  declare removePid_now_proj_now_proj_people: Sequelize.BelongsToManyRemoveAssociationsMixin<now_proj, number>
  declare hasPid_now_proj_now_proj_person: Sequelize.BelongsToManyHasAssociationMixin<now_proj, number>
  declare hasPid_now_proj_now_proj_people: Sequelize.BelongsToManyHasAssociationsMixin<now_proj, number>
  declare countPid_now_proj_now_proj_people: Sequelize.BelongsToManyCountAssociationsMixin
  // com_people hasMany now_proj_people via initials
  declare now_proj_people?: Sequelize.NonAttribute<now_proj_people[]>
  declare getNow_proj_people: Sequelize.HasManyGetAssociationsMixin<now_proj_people>
  declare setNow_proj_people: Sequelize.HasManySetAssociationsMixin<now_proj_people, number>
  declare addNow_proj_person: Sequelize.HasManyAddAssociationMixin<now_proj_people, number>
  declare addNow_proj_people: Sequelize.HasManyAddAssociationsMixin<now_proj_people, number>
  declare createNow_proj_person: Sequelize.HasManyCreateAssociationMixin<now_proj_people, 'initials'>
  declare removeNow_proj_person: Sequelize.HasManyRemoveAssociationMixin<now_proj_people, number>
  declare removeNow_proj_people: Sequelize.HasManyRemoveAssociationsMixin<now_proj_people, number>
  declare hasNow_proj_person: Sequelize.HasManyHasAssociationMixin<now_proj_people, number>
  declare hasNow_proj_people: Sequelize.HasManyHasAssociationsMixin<now_proj_people, number>
  declare countNow_proj_people: Sequelize.HasManyCountAssociationsMixin
  // com_people belongsToMany now_reg_coord via initials and reg_coord_id
  declare reg_coord_id_now_reg_coords: Sequelize.NonAttribute<now_reg_coord[]>
  declare getReg_coord_id_now_reg_coords: Sequelize.BelongsToManyGetAssociationsMixin<now_reg_coord>
  declare setReg_coord_id_now_reg_coords: Sequelize.BelongsToManySetAssociationsMixin<now_reg_coord, number>
  declare addReg_coord_id_now_reg_coord: Sequelize.BelongsToManyAddAssociationMixin<now_reg_coord, number>
  declare addReg_coord_id_now_reg_coords: Sequelize.BelongsToManyAddAssociationsMixin<now_reg_coord, number>
  declare createReg_coord_id_now_reg_coord: Sequelize.BelongsToManyCreateAssociationMixin<now_reg_coord, 'initials'>
  declare removeReg_coord_id_now_reg_coord: Sequelize.BelongsToManyRemoveAssociationMixin<now_reg_coord, number>
  declare removeReg_coord_id_now_reg_coords: Sequelize.BelongsToManyRemoveAssociationsMixin<now_reg_coord, number>
  declare hasReg_coord_id_now_reg_coord: Sequelize.BelongsToManyHasAssociationMixin<now_reg_coord, number>
  declare hasReg_coord_id_now_reg_coords: Sequelize.BelongsToManyHasAssociationsMixin<now_reg_coord, number>
  declare countReg_coord_id_now_reg_coords: Sequelize.BelongsToManyCountAssociationsMixin
  // com_people hasMany now_reg_coord_people via initials
  declare now_reg_coord_people?: Sequelize.NonAttribute<now_reg_coord_people[]>
  declare getNow_reg_coord_people: Sequelize.HasManyGetAssociationsMixin<now_reg_coord_people>
  declare setNow_reg_coord_people: Sequelize.HasManySetAssociationsMixin<now_reg_coord_people, number>
  declare addNow_reg_coord_person: Sequelize.HasManyAddAssociationMixin<now_reg_coord_people, number>
  declare addNow_reg_coord_people: Sequelize.HasManyAddAssociationsMixin<now_reg_coord_people, number>
  declare createNow_reg_coord_person: Sequelize.HasManyCreateAssociationMixin<now_reg_coord_people, 'initials'>
  declare removeNow_reg_coord_person: Sequelize.HasManyRemoveAssociationMixin<now_reg_coord_people, number>
  declare removeNow_reg_coord_people: Sequelize.HasManyRemoveAssociationsMixin<now_reg_coord_people, number>
  declare hasNow_reg_coord_person: Sequelize.HasManyHasAssociationMixin<now_reg_coord_people, number>
  declare hasNow_reg_coord_people: Sequelize.HasManyHasAssociationsMixin<now_reg_coord_people, number>
  declare countNow_reg_coord_people: Sequelize.HasManyCountAssociationsMixin
  // com_people hasMany now_sau via sau_coordinator
  declare now_saus?: Sequelize.NonAttribute<now_sau[]>
  declare getNow_saus: Sequelize.HasManyGetAssociationsMixin<now_sau>
  declare setNow_saus: Sequelize.HasManySetAssociationsMixin<now_sau, number>
  declare addNow_sau: Sequelize.HasManyAddAssociationMixin<now_sau, number>
  declare addNow_saus: Sequelize.HasManyAddAssociationsMixin<now_sau, number>
  declare createNow_sau: Sequelize.HasManyCreateAssociationMixin<now_sau, 'sau_coordinator'>
  declare removeNow_sau: Sequelize.HasManyRemoveAssociationMixin<now_sau, number>
  declare removeNow_saus: Sequelize.HasManyRemoveAssociationsMixin<now_sau, number>
  declare hasNow_sau: Sequelize.HasManyHasAssociationMixin<now_sau, number>
  declare hasNow_saus: Sequelize.HasManyHasAssociationsMixin<now_sau, number>
  declare countNow_saus: Sequelize.HasManyCountAssociationsMixin
  // com_people hasMany now_sau via sau_authorizer
  declare sau_authorizer_now_saus?: Sequelize.NonAttribute<now_sau[]>
  declare getSau_authorizer_now_saus: Sequelize.HasManyGetAssociationsMixin<now_sau>
  declare setSau_authorizer_now_saus: Sequelize.HasManySetAssociationsMixin<now_sau, number>
  declare addSau_authorizer_now_sau: Sequelize.HasManyAddAssociationMixin<now_sau, number>
  declare addSau_authorizer_now_saus: Sequelize.HasManyAddAssociationsMixin<now_sau, number>
  declare createSau_authorizer_now_sau: Sequelize.HasManyCreateAssociationMixin<now_sau, 'sau_authorizer'>
  declare removeSau_authorizer_now_sau: Sequelize.HasManyRemoveAssociationMixin<now_sau, number>
  declare removeSau_authorizer_now_saus: Sequelize.HasManyRemoveAssociationsMixin<now_sau, number>
  declare hasSau_authorizer_now_sau: Sequelize.HasManyHasAssociationMixin<now_sau, number>
  declare hasSau_authorizer_now_saus: Sequelize.HasManyHasAssociationsMixin<now_sau, number>
  declare countSau_authorizer_now_saus: Sequelize.HasManyCountAssociationsMixin
  // com_people belongsToMany now_sp_coord via initials and sp_coord_id
  declare sp_coord_id_now_sp_coords: Sequelize.NonAttribute<now_sp_coord[]>
  declare getSp_coord_id_now_sp_coords: Sequelize.BelongsToManyGetAssociationsMixin<now_sp_coord>
  declare setSp_coord_id_now_sp_coords: Sequelize.BelongsToManySetAssociationsMixin<now_sp_coord, number>
  declare addSp_coord_id_now_sp_coord: Sequelize.BelongsToManyAddAssociationMixin<now_sp_coord, number>
  declare addSp_coord_id_now_sp_coords: Sequelize.BelongsToManyAddAssociationsMixin<now_sp_coord, number>
  declare createSp_coord_id_now_sp_coord: Sequelize.BelongsToManyCreateAssociationMixin<now_sp_coord, 'initials'>
  declare removeSp_coord_id_now_sp_coord: Sequelize.BelongsToManyRemoveAssociationMixin<now_sp_coord, number>
  declare removeSp_coord_id_now_sp_coords: Sequelize.BelongsToManyRemoveAssociationsMixin<now_sp_coord, number>
  declare hasSp_coord_id_now_sp_coord: Sequelize.BelongsToManyHasAssociationMixin<now_sp_coord, number>
  declare hasSp_coord_id_now_sp_coords: Sequelize.BelongsToManyHasAssociationsMixin<now_sp_coord, number>
  declare countSp_coord_id_now_sp_coords: Sequelize.BelongsToManyCountAssociationsMixin
  // com_people hasMany now_sp_coord_people via initials
  declare now_sp_coord_people?: Sequelize.NonAttribute<now_sp_coord_people[]>
  declare getNow_sp_coord_people: Sequelize.HasManyGetAssociationsMixin<now_sp_coord_people>
  declare setNow_sp_coord_people: Sequelize.HasManySetAssociationsMixin<now_sp_coord_people, number>
  declare addNow_sp_coord_person: Sequelize.HasManyAddAssociationMixin<now_sp_coord_people, number>
  declare addNow_sp_coord_people: Sequelize.HasManyAddAssociationsMixin<now_sp_coord_people, number>
  declare createNow_sp_coord_person: Sequelize.HasManyCreateAssociationMixin<now_sp_coord_people, 'initials'>
  declare removeNow_sp_coord_person: Sequelize.HasManyRemoveAssociationMixin<now_sp_coord_people, number>
  declare removeNow_sp_coord_people: Sequelize.HasManyRemoveAssociationsMixin<now_sp_coord_people, number>
  declare hasNow_sp_coord_person: Sequelize.HasManyHasAssociationMixin<now_sp_coord_people, number>
  declare hasNow_sp_coord_people: Sequelize.HasManyHasAssociationsMixin<now_sp_coord_people, number>
  declare countNow_sp_coord_people: Sequelize.HasManyCountAssociationsMixin
  // com_people belongsToMany now_strat_coord via initials and strat_coord_id
  declare strat_coord_id_now_strat_coords: Sequelize.NonAttribute<now_strat_coord[]>
  declare getStrat_coord_id_now_strat_coords: Sequelize.BelongsToManyGetAssociationsMixin<now_strat_coord>
  declare setStrat_coord_id_now_strat_coords: Sequelize.BelongsToManySetAssociationsMixin<now_strat_coord, number>
  declare addStrat_coord_id_now_strat_coord: Sequelize.BelongsToManyAddAssociationMixin<now_strat_coord, number>
  declare addStrat_coord_id_now_strat_coords: Sequelize.BelongsToManyAddAssociationsMixin<now_strat_coord, number>
  declare createStrat_coord_id_now_strat_coord: Sequelize.BelongsToManyCreateAssociationMixin<
    now_strat_coord,
    'initials'
  >
  declare removeStrat_coord_id_now_strat_coord: Sequelize.BelongsToManyRemoveAssociationMixin<now_strat_coord, number>
  declare removeStrat_coord_id_now_strat_coords: Sequelize.BelongsToManyRemoveAssociationsMixin<now_strat_coord, number>
  declare hasStrat_coord_id_now_strat_coord: Sequelize.BelongsToManyHasAssociationMixin<now_strat_coord, number>
  declare hasStrat_coord_id_now_strat_coords: Sequelize.BelongsToManyHasAssociationsMixin<now_strat_coord, number>
  declare countStrat_coord_id_now_strat_coords: Sequelize.BelongsToManyCountAssociationsMixin
  // com_people hasMany now_strat_coord_people via initials
  declare now_strat_coord_people?: Sequelize.NonAttribute<now_strat_coord_people[]>
  declare getNow_strat_coord_people: Sequelize.HasManyGetAssociationsMixin<now_strat_coord_people>
  declare setNow_strat_coord_people: Sequelize.HasManySetAssociationsMixin<now_strat_coord_people, number>
  declare addNow_strat_coord_person: Sequelize.HasManyAddAssociationMixin<now_strat_coord_people, number>
  declare addNow_strat_coord_people: Sequelize.HasManyAddAssociationsMixin<now_strat_coord_people, number>
  declare createNow_strat_coord_person: Sequelize.HasManyCreateAssociationMixin<now_strat_coord_people, 'initials'>
  declare removeNow_strat_coord_person: Sequelize.HasManyRemoveAssociationMixin<now_strat_coord_people, number>
  declare removeNow_strat_coord_people: Sequelize.HasManyRemoveAssociationsMixin<now_strat_coord_people, number>
  declare hasNow_strat_coord_person: Sequelize.HasManyHasAssociationMixin<now_strat_coord_people, number>
  declare hasNow_strat_coord_people: Sequelize.HasManyHasAssociationsMixin<now_strat_coord_people, number>
  declare countNow_strat_coord_people: Sequelize.HasManyCountAssociationsMixin
  // com_people hasMany now_tau via tau_coordinator
  declare now_taus?: Sequelize.NonAttribute<now_tau[]>
  declare getNow_taus: Sequelize.HasManyGetAssociationsMixin<now_tau>
  declare setNow_taus: Sequelize.HasManySetAssociationsMixin<now_tau, number>
  declare addNow_tau: Sequelize.HasManyAddAssociationMixin<now_tau, number>
  declare addNow_taus: Sequelize.HasManyAddAssociationsMixin<now_tau, number>
  declare createNow_tau: Sequelize.HasManyCreateAssociationMixin<now_tau, 'tau_coordinator'>
  declare removeNow_tau: Sequelize.HasManyRemoveAssociationMixin<now_tau, number>
  declare removeNow_taus: Sequelize.HasManyRemoveAssociationsMixin<now_tau, number>
  declare hasNow_tau: Sequelize.HasManyHasAssociationMixin<now_tau, number>
  declare hasNow_taus: Sequelize.HasManyHasAssociationsMixin<now_tau, number>
  declare countNow_taus: Sequelize.HasManyCountAssociationsMixin
  // com_people hasMany now_tau via tau_authorizer
  declare tau_authorizer_now_taus?: Sequelize.NonAttribute<now_tau[]>
  declare getTau_authorizer_now_taus: Sequelize.HasManyGetAssociationsMixin<now_tau>
  declare setTau_authorizer_now_taus: Sequelize.HasManySetAssociationsMixin<now_tau, number>
  declare addTau_authorizer_now_tau: Sequelize.HasManyAddAssociationMixin<now_tau, number>
  declare addTau_authorizer_now_taus: Sequelize.HasManyAddAssociationsMixin<now_tau, number>
  declare createTau_authorizer_now_tau: Sequelize.HasManyCreateAssociationMixin<now_tau, 'tau_authorizer'>
  declare removeTau_authorizer_now_tau: Sequelize.HasManyRemoveAssociationMixin<now_tau, number>
  declare removeTau_authorizer_now_taus: Sequelize.HasManyRemoveAssociationsMixin<now_tau, number>
  declare hasTau_authorizer_now_tau: Sequelize.HasManyHasAssociationMixin<now_tau, number>
  declare hasTau_authorizer_now_taus: Sequelize.HasManyHasAssociationsMixin<now_tau, number>
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
