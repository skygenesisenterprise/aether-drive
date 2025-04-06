import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel';

// Middleware pour valider les données d'entrée lors de la création ou de la mise à jour d'un utilisateur
export const validateUserData = (req: Request, res: Response, next: NextFunction): void => {
  const { name, email, password } = req.body;

  if (!name || typeof name !== 'string') {
    res.status(400).json({ error: 'Invalid or missing "name"' });
    return;
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({ error: 'Invalid or missing "email"' });
    return;
  }

  if (password && (typeof password !== 'string' || password.length < 6)) {
    res.status(400).json({ error: 'Password must be at least 6 characters long' });
    return;
  }

  next();
};

// Middleware pour vérifier si un utilisateur existe
export const checkUserExists = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Ajouter l'utilisateur trouvé à l'objet `req` pour le rendre disponible dans le contrôleur
    (req as any).user = user;
    next();
  } catch (error) {
    next(error);
  }
};