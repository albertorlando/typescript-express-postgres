import { Sequelize } from 'sequelize-typescript';
import User from './users.model';

export const sequelize = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.POSTGRES_PATH,
    dialect: 'postgres',
    pool: {
      min: 0,
      max: 30,
      idle: 10000,
      acquire: 30000,
    },
  }
);

sequelize.addModels([User]);

sequelize.authenticate().catch((err: Error) => {
  console.error('Unable to connect to the database:', err);
});
