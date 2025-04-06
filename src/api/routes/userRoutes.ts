import { Router } from 'express';
import { getUserById, createUser, updateUser, deleteUser } from '../controllers/userController';

const router = Router();

// Route pour récupérer un utilisateur par ID
router.get('/:id', getUserById);

// Route pour créer un nouvel utilisateur
router.post('/', createUser);

// Route pour mettre à jour un utilisateur
router.put('/:id', updateUser);

// Route pour supprimer un utilisateur
router.delete('/:id', deleteUser);

export default router;