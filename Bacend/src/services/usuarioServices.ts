import { Usuario, IUsuario } from '../models/usuario';
import { generateToken, generateRefreshToken, verifyToken } from '../auth/token';
import bcrypt from 'bcryptjs';

export class UserService {
    async createUser(user: Partial<IUsuario>): Promise<IUsuario | null> {
        try {
          const newUser = new Usuario(user);
          return await newUser.save();
        } catch (error) {
          throw new Error((error as Error).message);
        }
      }
      
    async getAllUsers(): Promise<IUsuario[] | null> {
      return await Usuario.find();
    }

    async getUserById(id: string): Promise<IUsuario | null> {
      return await Usuario.findById(id);
    }

    async getUserByUsername(username: string): Promise<IUsuario | null> {
      return await Usuario.findOne({ username });
    }

    async updateUserById(id: string, userData: Partial<IUsuario>): Promise<IUsuario | null> {
    const user = await Usuario.findById(id);
    if (!user) return null;
    Object.assign(user, userData);
    return user.save();
 }

    async updateUserByUsername(username: string, user: Partial<IUsuario>): Promise<IUsuario | null> {
      
        return await Usuario.findOneAndUpdate({ username }, user, { new: true });
    }

    async deleteUserById(id: string): Promise<IUsuario | null> {

      return await Usuario.findByIdAndDelete(id);
    }

    async deleteUserByUsername(username: string): Promise<IUsuario | null> {
        return await Usuario.findOneAndDelete({ username });
    }

    async loginUser(username: string, password: string): Promise<IUsuario | null> {
      try {
        console.log('loginUser en UserService con:', username, password);
        const User = await Usuario.findOne({ username });
        console.log('Usuario encontrado en loginUser:', User);
        if (!User) {
          return null;
        }
      
        const isPasswordValid = await User.comparePassword(password);
        if (!isPasswordValid) {
          console.log('Contraseña inválida para el usuario:', username);
          return null;
      }
      
      
      return User;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }


}