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
  pid!: number
  contact!: string
  proj_code?: string
  proj_name?: string
  proj_status?: string
  proj_records?: number

  // now_proj belongsTo com_people via contact
  contact_com_person!: com_people
  getContact_com_person!: Sequelize.BelongsToGetAssociationMixin<com_people>
  setContact_com_person!: Sequelize.BelongsToSetAssociationMixin<com_people, com_peopleId>
  createContact_com_person!: Sequelize.BelongsToCreateAssociationMixin<com_people>
  // now_proj belongsToMany com_people via pid and initials
  initials_com_people!: com_people[]
  getInitials_com_people!: Sequelize.BelongsToManyGetAssociationsMixin<com_people>
  setInitials_com_people!: Sequelize.BelongsToManySetAssociationsMixin<com_people, com_peopleId>
  addInitials_com_person!: Sequelize.BelongsToManyAddAssociationMixin<com_people, com_peopleId>
  addInitials_com_people!: Sequelize.BelongsToManyAddAssociationsMixin<com_people, com_peopleId>
  createInitials_com_person!: Sequelize.BelongsToManyCreateAssociationMixin<com_people>
  removeInitials_com_person!: Sequelize.BelongsToManyRemoveAssociationMixin<com_people, com_peopleId>
  removeInitials_com_people!: Sequelize.BelongsToManyRemoveAssociationsMixin<com_people, com_peopleId>
  hasInitials_com_person!: Sequelize.BelongsToManyHasAssociationMixin<com_people, com_peopleId>
  hasInitials_com_people!: Sequelize.BelongsToManyHasAssociationsMixin<com_people, com_peopleId>
  countInitials_com_people!: Sequelize.BelongsToManyCountAssociationsMixin
  // now_proj belongsToMany com_species via pid and species_id
  species_id_com_species_now_psrs!: com_species[]
  getSpecies_id_com_species_now_psrs!: Sequelize.BelongsToManyGetAssociationsMixin<com_species>
  setSpecies_id_com_species_now_psrs!: Sequelize.BelongsToManySetAssociationsMixin<com_species, com_speciesId>
  addSpecies_id_com_species_now_psr!: Sequelize.BelongsToManyAddAssociationMixin<com_species, com_speciesId>
  addSpecies_id_com_species_now_psrs!: Sequelize.BelongsToManyAddAssociationsMixin<com_species, com_speciesId>
  createSpecies_id_com_species_now_psr!: Sequelize.BelongsToManyCreateAssociationMixin<com_species>
  removeSpecies_id_com_species_now_psr!: Sequelize.BelongsToManyRemoveAssociationMixin<com_species, com_speciesId>
  removeSpecies_id_com_species_now_psrs!: Sequelize.BelongsToManyRemoveAssociationsMixin<com_species, com_speciesId>
  hasSpecies_id_com_species_now_psr!: Sequelize.BelongsToManyHasAssociationMixin<com_species, com_speciesId>
  hasSpecies_id_com_species_now_psrs!: Sequelize.BelongsToManyHasAssociationsMixin<com_species, com_speciesId>
  countSpecies_id_com_species_now_psrs!: Sequelize.BelongsToManyCountAssociationsMixin
  // now_proj belongsToMany now_loc via pid and lid
  lid_now_loc_now_plrs!: now_loc[]
  getLid_now_loc_now_plrs!: Sequelize.BelongsToManyGetAssociationsMixin<now_loc>
  setLid_now_loc_now_plrs!: Sequelize.BelongsToManySetAssociationsMixin<now_loc, now_locId>
  addLid_now_loc_now_plr!: Sequelize.BelongsToManyAddAssociationMixin<now_loc, now_locId>
  addLid_now_loc_now_plrs!: Sequelize.BelongsToManyAddAssociationsMixin<now_loc, now_locId>
  createLid_now_loc_now_plr!: Sequelize.BelongsToManyCreateAssociationMixin<now_loc>
  removeLid_now_loc_now_plr!: Sequelize.BelongsToManyRemoveAssociationMixin<now_loc, now_locId>
  removeLid_now_loc_now_plrs!: Sequelize.BelongsToManyRemoveAssociationsMixin<now_loc, now_locId>
  hasLid_now_loc_now_plr!: Sequelize.BelongsToManyHasAssociationMixin<now_loc, now_locId>
  hasLid_now_loc_now_plrs!: Sequelize.BelongsToManyHasAssociationsMixin<now_loc, now_locId>
  countLid_now_loc_now_plrs!: Sequelize.BelongsToManyCountAssociationsMixin
  // now_proj hasMany now_plr via pid
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
  // now_proj hasMany now_proj_people via pid
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
  // now_proj hasMany now_psr via pid
  now_psrs!: now_psr[]
  getNow_psrs!: Sequelize.HasManyGetAssociationsMixin<now_psr>
  setNow_psrs!: Sequelize.HasManySetAssociationsMixin<now_psr, now_psrId>
  addNow_psr!: Sequelize.HasManyAddAssociationMixin<now_psr, now_psrId>
  addNow_psrs!: Sequelize.HasManyAddAssociationsMixin<now_psr, now_psrId>
  createNow_psr!: Sequelize.HasManyCreateAssociationMixin<now_psr>
  removeNow_psr!: Sequelize.HasManyRemoveAssociationMixin<now_psr, now_psrId>
  removeNow_psrs!: Sequelize.HasManyRemoveAssociationsMixin<now_psr, now_psrId>
  hasNow_psr!: Sequelize.HasManyHasAssociationMixin<now_psr, now_psrId>
  hasNow_psrs!: Sequelize.HasManyHasAssociationsMixin<now_psr, now_psrId>
  countNow_psrs!: Sequelize.HasManyCountAssociationsMixin

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
