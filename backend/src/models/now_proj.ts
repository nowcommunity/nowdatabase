import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { com_people, com_peopleId } from './com_people'
import type { com_species, com_speciesId } from './com_species'
import type { now_loc, now_locId } from './now_loc'
import type { now_plr, now_plrId } from './now_plr'
import type { now_proj_people, now_proj_peopleId } from './now_proj_people'
import type { now_psr, now_psrId } from './now_psr'

export interface now_projAttributes {
  pid: number
  contact: string
  proj_code?: string
  proj_name?: string
  proj_status?: string
  proj_records?: number
}

export type now_projPk = 'pid'
export type now_projId = now_proj[now_projPk]
export type now_projOptionalAttributes = 'pid' | 'contact' | 'proj_code' | 'proj_name' | 'proj_status' | 'proj_records'
export type now_projCreationAttributes = Optional<now_projAttributes, now_projOptionalAttributes>

export class now_proj extends Model<now_projAttributes, now_projCreationAttributes> implements now_projAttributes {
  declare pid: number
  declare contact: string
  declare proj_code?: string
  declare proj_name?: string
  declare proj_status?: string
  declare proj_records?: number

  // now_proj belongsTo com_people via contact
  declare contact_com_person: com_people
  declare getContact_com_person: Sequelize.BelongsToGetAssociationMixin<com_people>
  declare setContact_com_person: Sequelize.BelongsToSetAssociationMixin<com_people, com_peopleId>
  declare createContact_com_person: Sequelize.BelongsToCreateAssociationMixin<com_people>
  // now_proj belongsToMany com_people via pid and initials
  declare initials_com_people: com_people[]
  declare getInitials_com_people: Sequelize.BelongsToManyGetAssociationsMixin<com_people>
  declare setInitials_com_people: Sequelize.BelongsToManySetAssociationsMixin<com_people, com_peopleId>
  declare addInitials_com_person: Sequelize.BelongsToManyAddAssociationMixin<com_people, com_peopleId>
  declare addInitials_com_people: Sequelize.BelongsToManyAddAssociationsMixin<com_people, com_peopleId>
  declare createInitials_com_person: Sequelize.BelongsToManyCreateAssociationMixin<com_people>
  declare removeInitials_com_person: Sequelize.BelongsToManyRemoveAssociationMixin<com_people, com_peopleId>
  declare removeInitials_com_people: Sequelize.BelongsToManyRemoveAssociationsMixin<com_people, com_peopleId>
  declare hasInitials_com_person: Sequelize.BelongsToManyHasAssociationMixin<com_people, com_peopleId>
  declare hasInitials_com_people: Sequelize.BelongsToManyHasAssociationsMixin<com_people, com_peopleId>
  declare countInitials_com_people: Sequelize.BelongsToManyCountAssociationsMixin
  // now_proj belongsToMany com_species via pid and species_id
  declare species_id_com_species_now_psrs: com_species[]
  declare getSpecies_id_com_species_now_psrs: Sequelize.BelongsToManyGetAssociationsMixin<com_species>
  declare setSpecies_id_com_species_now_psrs: Sequelize.BelongsToManySetAssociationsMixin<com_species, com_speciesId>
  declare addSpecies_id_com_species_now_psr: Sequelize.BelongsToManyAddAssociationMixin<com_species, com_speciesId>
  declare addSpecies_id_com_species_now_psrs: Sequelize.BelongsToManyAddAssociationsMixin<com_species, com_speciesId>
  declare createSpecies_id_com_species_now_psr: Sequelize.BelongsToManyCreateAssociationMixin<com_species>
  declare removeSpecies_id_com_species_now_psr: Sequelize.BelongsToManyRemoveAssociationMixin<
    com_species,
    com_speciesId
  >
  declare removeSpecies_id_com_species_now_psrs: Sequelize.BelongsToManyRemoveAssociationsMixin<
    com_species,
    com_speciesId
  >
  declare hasSpecies_id_com_species_now_psr: Sequelize.BelongsToManyHasAssociationMixin<com_species, com_speciesId>
  declare hasSpecies_id_com_species_now_psrs: Sequelize.BelongsToManyHasAssociationsMixin<com_species, com_speciesId>
  declare countSpecies_id_com_species_now_psrs: Sequelize.BelongsToManyCountAssociationsMixin
  // now_proj belongsToMany now_loc via pid and lid
  declare lid_now_loc_now_plrs: now_loc[]
  declare getLid_now_loc_now_plrs: Sequelize.BelongsToManyGetAssociationsMixin<now_loc>
  declare setLid_now_loc_now_plrs: Sequelize.BelongsToManySetAssociationsMixin<now_loc, now_locId>
  declare addLid_now_loc_now_plr: Sequelize.BelongsToManyAddAssociationMixin<now_loc, now_locId>
  declare addLid_now_loc_now_plrs: Sequelize.BelongsToManyAddAssociationsMixin<now_loc, now_locId>
  declare createLid_now_loc_now_plr: Sequelize.BelongsToManyCreateAssociationMixin<now_loc>
  declare removeLid_now_loc_now_plr: Sequelize.BelongsToManyRemoveAssociationMixin<now_loc, now_locId>
  declare removeLid_now_loc_now_plrs: Sequelize.BelongsToManyRemoveAssociationsMixin<now_loc, now_locId>
  declare hasLid_now_loc_now_plr: Sequelize.BelongsToManyHasAssociationMixin<now_loc, now_locId>
  declare hasLid_now_loc_now_plrs: Sequelize.BelongsToManyHasAssociationsMixin<now_loc, now_locId>
  declare countLid_now_loc_now_plrs: Sequelize.BelongsToManyCountAssociationsMixin
  // now_proj hasMany now_plr via pid
  declare now_plrs: now_plr[]
  declare getNow_plrs: Sequelize.HasManyGetAssociationsMixin<now_plr>
  declare setNow_plrs: Sequelize.HasManySetAssociationsMixin<now_plr, now_plrId>
  declare addNow_plr: Sequelize.HasManyAddAssociationMixin<now_plr, now_plrId>
  declare addNow_plrs: Sequelize.HasManyAddAssociationsMixin<now_plr, now_plrId>
  declare createNow_plr: Sequelize.HasManyCreateAssociationMixin<now_plr>
  declare removeNow_plr: Sequelize.HasManyRemoveAssociationMixin<now_plr, now_plrId>
  declare removeNow_plrs: Sequelize.HasManyRemoveAssociationsMixin<now_plr, now_plrId>
  declare hasNow_plr: Sequelize.HasManyHasAssociationMixin<now_plr, now_plrId>
  declare hasNow_plrs: Sequelize.HasManyHasAssociationsMixin<now_plr, now_plrId>
  declare countNow_plrs: Sequelize.HasManyCountAssociationsMixin
  // now_proj hasMany now_proj_people via pid
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
  // now_proj hasMany now_psr via pid
  declare now_psrs: now_psr[]
  declare getNow_psrs: Sequelize.HasManyGetAssociationsMixin<now_psr>
  declare setNow_psrs: Sequelize.HasManySetAssociationsMixin<now_psr, now_psrId>
  declare addNow_psr: Sequelize.HasManyAddAssociationMixin<now_psr, now_psrId>
  declare addNow_psrs: Sequelize.HasManyAddAssociationsMixin<now_psr, now_psrId>
  declare createNow_psr: Sequelize.HasManyCreateAssociationMixin<now_psr>
  declare removeNow_psr: Sequelize.HasManyRemoveAssociationMixin<now_psr, now_psrId>
  declare removeNow_psrs: Sequelize.HasManyRemoveAssociationsMixin<now_psr, now_psrId>
  declare hasNow_psr: Sequelize.HasManyHasAssociationMixin<now_psr, now_psrId>
  declare hasNow_psrs: Sequelize.HasManyHasAssociationsMixin<now_psr, now_psrId>
  declare countNow_psrs: Sequelize.HasManyCountAssociationsMixin

  static initModel(sequelize: Sequelize.Sequelize): typeof now_proj {
    return now_proj.init(
      {
        pid: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        contact: {
          type: DataTypes.STRING(10),
          allowNull: false,
          defaultValue: '',
          references: {
            model: 'com_people',
            key: 'initials',
          },
        },
        proj_code: {
          type: DataTypes.STRING(10),
          allowNull: true,
        },
        proj_name: {
          type: DataTypes.STRING(80),
          allowNull: true,
        },
        proj_status: {
          type: DataTypes.STRING(10),
          allowNull: true,
        },
        proj_records: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'now_proj',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'pid' }],
          },
          {
            name: 'now_test_proj_FKIndex1',
            using: 'BTREE',
            fields: [{ name: 'contact' }],
          },
        ],
      }
    )
  }
}
