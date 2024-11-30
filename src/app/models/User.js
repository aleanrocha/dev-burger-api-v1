import Sequelize, { Model } from 'sequelize'
import bcript from 'bcrypt'

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        admin: Sequelize.BOOLEAN,
      },
      {
        sequelize,
        tableName: 'users',
      },
    )
    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcript.hash(user.password, 10)
      }
    })
    return this
  }

  async checkPassword(password) {
    return bcript.compare(password, this.password_hash)
  }
}

export default User
