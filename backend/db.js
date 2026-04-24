const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || 'artsy_store',
  process.env.MYSQL_USER || 'root',
  process.env.MYSQL_PASSWORD || '',
  {
    host: process.env.MYSQL_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: true,
      },
    },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL Connected Successfully!');
    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('✅ MySQL Models Synced!');
  } catch (error) {
    console.error('❌ Unable to connect to MySQL:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
