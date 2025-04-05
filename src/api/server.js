import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import userRoutes from './routes/userRoutes.js'; // Exemple de routes utilisateur
import db from './utils/database.js'; // Exemple de connexion à la base de données

// Charger le fichier d'environnement approprié
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });

// Initialiser l'application Express
const app = express();

// Middlewares globaux
app.use(cors()); // Autoriser les requêtes cross-origin
app.use(helmet()); // Sécuriser les en-têtes HTTP
app.use(express.json()); // Parser les requêtes JSON
app.use(express.urlencoded({ extended: true })); // Parser les requêtes URL-encoded

// Connecter à la base de données
db.authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.error('Database connection failed:', err));

// Routes
app.use('/api/users', userRoutes); // Exemple de route pour les utilisateurs

// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});