require('dotenv').config()

module.exports = {
  dialect: 'postgres',
  url: process.env.PG_URL,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
}
