import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

import type { com_people } from './com_people'
import type { now_strat_coord_people } from './now_strat_coord_people'

export class now_strat_coord extends Model<InferAttributes<now_strat_coord>, InferCreationAttributes<now_strat_coord>> {
  declare strat_coord_id: CreationOptional<number>
  declare title: string

  // now_strat_coord belongsToMany com_people via strat_coord_id and initials
  declare initials_com_people_now_strat_coord_people: Sequelize.NonAttribute<com_people[]>
  declare getInitials_com_people_now_strat_coord_people: Sequelize.BelongsToManyGetAssociationsMixin<com_people>
  declare setInitials_com_people_now_strat_coord_people: Sequelize.BelongsToManySetAssociationsMixin<com_people, number>
  declare addInitials_com_people_now_strat_coord_person: Sequelize.BelongsToManyAddAssociationMixin<com_people, number>
  declare addInitials_com_people_now_strat_coord_people: Sequelize.BelongsToManyAddAssociationsMixin<com_people, number>
  declare createInitials_com_people_now_strat_coord_person: Sequelize.BelongsToManyCreateAssociationMixin<
    com_people,
    'strat_coord_id'
  >
  declare removeInitials_com_people_now_strat_coord_person: Sequelize.BelongsToManyRemoveAssociationMixin<
    com_people,
    number
  >
  declare removeInitials_com_people_now_strat_coord_people: Sequelize.BelongsToManyRemoveAssociationsMixin<
    com_people,
    number
  >
  declare hasInitials_com_people_now_strat_coord_person: Sequelize.BelongsToManyHasAssociationMixin<com_people, number>
  declare hasInitials_com_people_now_strat_coord_people: Sequelize.BelongsToManyHasAssociationsMixin<com_people, number>
  declare countInitials_com_people_now_strat_coord_people: Sequelize.BelongsToManyCountAssociationsMixin
  // now_strat_coord hasMany now_strat_coord_people via strat_coord_id
  declare now_strat_coord_people?: Sequelize.NonAttribute<now_strat_coord_people[]>
  declare getNow_strat_coord_people: Sequelize.HasManyGetAssociationsMixin<now_strat_coord_people>
  declare setNow_strat_coord_people: Sequelize.HasManySetAssociationsMixin<now_strat_coord_people, number>
  declare addNow_strat_coord_person: Sequelize.HasManyAddAssociationMixin<now_strat_coord_people, number>
  declare addNow_strat_coord_people: Sequelize.HasManyAddAssociationsMixin<now_strat_coord_people, number>
  declare createNow_strat_coord_person: Sequelize.HasManyCreateAssociationMixin<
    now_strat_coord_people,
    'strat_coord_id'
  >
  declare removeNow_strat_coord_person: Sequelize.HasManyRemoveAssociationMixin<now_strat_coord_people, number>
  declare removeNow_strat_coord_people: Sequelize.HasManyRemoveAssociationsMixin<now_strat_coord_people, number>
  declare hasNow_strat_coord_person: Sequelize.HasManyHasAssociationMixin<now_strat_coord_people, number>
  declare hasNow_strat_coord_people: Sequelize.HasManyHasAssociationsMixin<now_strat_coord_people, number>
  declare countNow_strat_coord_people: Sequelize.HasManyCountAssociationsMixin

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
