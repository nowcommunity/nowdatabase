import * as Sequelize from 'sequelize'
import { CreationOptional, DataTypes, InferCreationAttributes, InferAttributes, Model } from 'sequelize'

export class com_users extends Model<InferAttributes<com_users>, InferCreationAttributes<com_users>> {
  declare user_id: CreationOptional<number>
  declare user_name?: string
  declare password?: string
  declare last_login?: string
  declare now_user_group?: string
  declare mor_user_group?: string
  declare gen_user_group?: string

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
