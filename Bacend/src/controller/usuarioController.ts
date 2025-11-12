import { Request, Response } from 'express';
import { IUsuario } from '../models/usuario';
import { UserService } from '../services/usuarioServices';
import { validationResult } from "express-validator";
import { generateToken, verifyToken, generateRefreshToken } from '../auth/token';
import { authenticateToken } from '../auth/middleware';
import { access } from 'fs';
import { Console } from 'console';

const userService = new UserService();

export async function createUser(req: Request, res: Response): Promise<Response> {
  console.log('crear usuario');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { username, gmail, password, birthday } = req.body as IUsuario;
    const newUser: Partial<IUsuario> = { username, gmail, password, birthday };
    const user = await userService.createUser(newUser);

    return res.status(201).json({
      message: 'USUARIO CREADO CON EXITO',
      user
    });
  } catch (error) {
    return res.status(500).json({ error: 'FALLO AL CREAR EL USUARIO' });
  }
  }

  export async function getAllUsers(req: Request, res: Response): Promise<Response> {
  console.log('obtener todos los usuarios');
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(404).json({ message: (error as Error).message });
  }
  }

  export async function getUserById(req: Request, res: Response): Promise<Response> {
  console.log('obtener usuario por id');
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'USUARIO NO ENCONTRADO' });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
  }

  export async function getUserByUsername(req: Request, res: Response): Promise<Response> {
  console.log('obtener usuario por username');
  try {
    const { username } = req.params;
    const user = await userService.getUserByUsername(username);
    if (!user) {
      return res.status(404).json({ message: 'USUARIO NO ENCONTRADO' });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
  }


  export async function updateUserById(req: Request, res: Response): Promise<Response> {
  console.log('actualizar usuario por id');
  try {
    const { id } = req.params;
    const userData: Partial<IUsuario> = req.body;
    const updatedUser = await userService.updateUserById(id, userData);
    console.log('Usuario actualizado:', updatedUser);
    if (!updatedUser) {
      return res.status(404).json({ message: "USUARIO NO ENCONTRADO" });
    }
  
    return res.status(200).json(
     updatedUser
    );
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
  }

  export async function updateUserByUsername(req: Request, res: Response): Promise<Response> {
  try {
    const userData: Partial<IUsuario> = req.body;
    const username = req.params.username;
    const updatedUser = await userService.updateUserByUsername(username, userData);

    if (!updatedUser) {
      return res.status(404).json({ message: "USUARIO NO ENCONTRADO" });
    }

    return res.status(200).json({
      user: updatedUser,
    
    });
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
  }



  export async function deleteUserById(req: Request, res: Response): Promise<Response> {
  console.log('eliminar usuario por id');
  try {
    const { id } = req.params;
    const deletedUser = await userService.deleteUserById(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'USUARIO NO ENCONTRADO' });
    }
    return res.status(200).json(deletedUser);
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
  }


  export async function deleteUserByUsername(req: Request, res: Response): Promise<Response> {
  try {
    const { username } = req.params;
    const deletedUser = await userService.deleteUserByUsername(username);
    if (!deletedUser) {
      return res.status(404).json({ message: 'USUARIO NO ENCONTRADO' });
    }
    return res.status(200).json(deletedUser);
  } catch (error) {
    return res.status(400).json({ message: (error as Error).message });
  }
  }
 

  export async function login(req: Request, res: Response): Promise<Response> {
  try {
    const { username, password } = req.body;
    console.log('login usuario', username, password);
    const User= await userService.loginUser(username, password);
    console.log('Usuario en login:', User);
    if (!User) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }
    // Generar token
    const token = await generateToken(User!, res);
    const refreshToken = await generateRefreshToken(User!, res);
    return res.status(200).json({
      User,
      message: "LOGIN EXITOSO",
      token,
      refreshToken
      
    });
    console.log('token generado:', User, token, refreshToken);
  } catch (error) {
    return res.status(500).json({ error: "Error en el login" });
  }

}
export async function refreshAccessToken(req: Request, res: Response): Promise<Response> {
  try {
    const id = (req as any).user.payload.id;
    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    const newToken = generateToken(user, res);
    return res.status(200).json({
      message: "Nuevo token generado",
      token: newToken
    });
  } catch (error) {
    return res.status(500).json({ error: "Error al generar nuevo token" });
  } 
}
