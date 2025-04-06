import { Request, Response, NextFunction } from 'express';
import userService from '../services/userService';

// Récupérer un utilisateur par ID
export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await userService.getUserById(Number(req.params.id));
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    next(error); // Passe l'erreur au middleware de gestion des erreurs
  }
};

// Mettre à jour un utilisateur
export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email } = req.body;
    const updatedUser = await userService.updateUser(Number(req.params.id), { name, email });
    if (!updatedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error); // Passe l'erreur au middleware de gestion des erreurs
  }
};

// Supprimer un utilisateur
export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deletedUser = await userService.deleteUser(Number(req.params.id));
    if (!deletedUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error); // Passe l'erreur au middleware de gestion des erreurs
  }
};