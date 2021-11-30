module.exports = (sequelize, Sequelize) => {
  const Demo = sequelize.define("demo", {
    serial: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING(1024),
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT
    },
    demoId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    }
  }, {
    timestamps: true,
  })
  return Demo
}