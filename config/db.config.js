module.exports = {
  HOST: 'localhost',
  USER: 'developer',
  PASSWORD: 'developer',
  DB: 'transaction_demo',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}