import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface com_usersAttributes {
  user_id: number
  user_name?: string
  password?: string
  last_login?: string
  now_user_group?: string
  mor_user_group?: string
  gen_user_group?: string
}

export type com_usersPk = 'user_id'
export type com_usersId = com_users[com_usersPk]
export type com_usersOptionalAttributes =
  | 'user_id'
  | 'user_name'
  | 'password'
  | 'last_login'
  | 'now_user_group'
  | 'mor_user_group'
  | 'gen_user_group'
export type com_usersCreationAttributes = Optional<com_usersAttributes, com_usersOptionalAttributes>

export class com_users extends Model<com_usersAttributes, com_usersCreationAttributes> implements com_usersAttributes {
  user_id!: number
  user_name?: string
  password?: string
  last_login?: string
  now_user_group?: string
  mor_user_group?: string
  gen_user_group?: string

  static initModel(sequelize: Sequelize.Sequelize): typeof com_users {
    return com_users.init(
      {
        user_id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        user_name: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        password: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        last_login: {
          type: DataTypes.DATEONLY,
          allowNull: true,
        },
        now_user_group: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },
        mor_user_group: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },
        gen_user_group: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'com_users',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'user_id' }],
          },
        ],
      }
    )
  }
}
