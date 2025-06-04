const { Sequelize, DataTypes } = require("sequelize");

// 👇 Add your MySQL password inside the quotes here
const sequelize = new Sequelize("agri_platform", "root", "Tiger", {
  host: "localhost",
  dialect: "mysql",
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./User")(sequelize, DataTypes);

module.exports = db;
