import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import userRoutes from './routes/userRoutes'; 
import db from './utils/database'; 

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
  .catch((err: Error) => console.error('Database connection failed:', err));

// Routes
app.use('/api/users', userRoutes); // Exemple de route pour les utilisateurs

// Gestion des erreurs 404
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: 'Route not found' });
});

// Gestion des erreurs globales
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});