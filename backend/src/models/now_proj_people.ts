import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

import type { com_people, com_peopleId } from './com_people'
import type { now_proj, now_projId } from './now_proj'

export class now_proj_people extends Model<InferAttributes<now_proj_people>, InferCreationAttributes<now_proj_people>> {
  declare pid: CreationOptional<number>
  declare initials: CreationOptional<string>

  // now_proj_people belongsTo com_people via initials
  declare initials_com_person?: Sequelize.NonAttribute<com_people>
  declare getInitials_com_person: Sequelize.BelongsToGetAssociationMixin<com_people>
  declare setInitials_com_person: Sequelize.BelongsToSetAssociationMixin<com_people, number>
  declare createInitials_com_person: Sequelize.BelongsToCreateAssociationMixin<com_people>
  // now_proj_people belongsTo now_proj via pid
  declare pid_now_proj?: Sequelize.NonAttribute<now_proj>
  declare getPid_now_proj: Sequelize.BelongsToGetAssociationMixin<now_proj>
  declare setPid_now_proj: Sequelize.BelongsToSetAssociationMixin<now_proj, number>
  declare createPid_now_proj: Sequelize.BelongsToCreateAssociationMixin<now_proj>

  static initModel(sequelize: Sequelize.Sequelize): typeof now_proj_people {
    return now_proj_people.init(
      {
        pid: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'now_proj',
            key: 'pid',
          },
        },
        initials: {
          type: DataTypes.STRING(10),
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'com_people',
            key: 'initials',
          },
        },
      },
      {
        sequelize,
        tableName: 'now_proj_people',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'pid' }, { name: 'initials' }],
          },
          {
            name: 'now_test_proj_people_FKIndex1',
            using: 'BTREE',
            fields: [{ name: 'pid' }],
          },
          {
            name: 'now_test_proj_people_FKIndex2',
            using: 'BTREE',
            fields: [{ name: 'initials' }],
          },
        ],
      }
    )
  }
}
