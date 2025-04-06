import User from '../models/userModel';

interface UserData {
  name: string;
  email: string;
  password?: string;
  [key: string]: any; // Add an index signature to allow additional properties
  [Symbol.toStringTag]?: string; // Add symbol index signature for compatibility
}

const getUserById = async (id: number) => {
  return await User.findByPk(id);
};

const createUser = async (data: UserData) => {
  return await User.create(data);
};

const updateUser = async (id: number, data: Partial<UserData>) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('User not found');
  }
  return await user.update(data);
};

const deleteUser = async (id: number) => {
  const user = await User.findByPk(id);
  if (!user) {
    throw new Error('User not found');
  }
  await user.destroy();
  return user;
};

export default {
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};