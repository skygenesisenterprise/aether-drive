import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

// Créer une instance Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME || '', // Nom de la base de données
  process.env.DB_USER || '', // Nom d'utilisateur
  process.env.DB_PASSWORD || '', // Mot de passe
  {
    host: process.env.DB_HOST || 'localhost', // Hôte de la base de données
    port: Number(process.env.DB_PORT) || 5432, // Port de la base de données
    dialect: 'postgres', // Type de base de données
    logging: true // Activer les logs SQL
  }
);

// Tester la connexion
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((err: Error) => {
    console.error('Unable to connect to the database:', err);
  });

export default sequelize;