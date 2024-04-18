import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import type { com_people, com_peopleId } from './com_people'
import type { now_strat_coord_people, now_strat_coord_peopleId } from './now_strat_coord_people'

export interface now_strat_coordAttributes {
  strat_coord_id: number
  title: string
}

export type now_strat_coordPk = 'strat_coord_id'
export type now_strat_coordId = now_strat_coord[now_strat_coordPk]
export type now_strat_coordOptionalAttributes = 'strat_coord_id' | 'title'
export type now_strat_coordCreationAttributes = Optional<now_strat_coordAttributes, now_strat_coordOptionalAttributes>

export class now_strat_coord
  extends Model<now_strat_coordAttributes, now_strat_coordCreationAttributes>
  implements now_strat_coordAttributes
{
  strat_coord_id!: number
  title!: string

  // now_strat_coord belongsToMany com_people via strat_coord_id and initials
  initials_com_people_now_strat_coord_people!: com_people[]
  getInitials_com_people_now_strat_coord_people!: Sequelize.BelongsToManyGetAssociationsMixin<com_people>
  setInitials_com_people_now_strat_coord_people!: Sequelize.BelongsToManySetAssociationsMixin<com_people, com_peopleId>
  addInitials_com_people_now_strat_coord_person!: Sequelize.BelongsToManyAddAssociationMixin<com_people, com_peopleId>
  addInitials_com_people_now_strat_coord_people!: Sequelize.BelongsToManyAddAssociationsMixin<com_people, com_peopleId>
  createInitials_com_people_now_strat_coord_person!: Sequelize.BelongsToManyCreateAssociationMixin<com_people>
  removeInitials_com_people_now_strat_coord_person!: Sequelize.BelongsToManyRemoveAssociationMixin<
    com_people,
    com_peopleId
  >
  removeInitials_com_people_now_strat_coord_people!: Sequelize.BelongsToManyRemoveAssociationsMixin<
    com_people,
    com_peopleId
  >
  hasInitials_com_people_now_strat_coord_person!: Sequelize.BelongsToManyHasAssociationMixin<com_people, com_peopleId>
  hasInitials_com_people_now_strat_coord_people!: Sequelize.BelongsToManyHasAssociationsMixin<com_people, com_peopleId>
  countInitials_com_people_now_strat_coord_people!: Sequelize.BelongsToManyCountAssociationsMixin
  // now_strat_coord hasMany now_strat_coord_people via strat_coord_id
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

  static initModel(sequelize: Sequelize.Sequelize): typeof now_strat_coord {
    return now_strat_coord.init(
      {
        strat_coord_id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING(80),
          allowNull: false,
          defaultValue: '',
        },
      },
      {
        sequelize,
        tableName: 'now_strat_coord',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'strat_coord_id' }],
          },
        ],
      }
    )
  }
}
