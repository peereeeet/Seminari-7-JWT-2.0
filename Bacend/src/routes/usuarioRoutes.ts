import { Router } from 'express';
import * as usuarioController from '../controller/usuarioController';
import { authenticateToken, authenticateRefreshToken } from '../auth/middleware';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - username
 *         - gmail
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: ID generado por MongoDB
 *         username:
 *           type: string
 *         gmail:
 *           type: string
 *         password:
 *           type: string
 *         birthday:
 *           type: string
 *           format: date
 *       example:
 *         username: nombreUsuario
 *         gmail: primeraParteCorreo@example.com
 *         password: 123456
 *         birthday: 2000-05-21
 *       securitySchemes:
 *         bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 */

/**
/**
 * @swagger
 * /user/:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 */
router.post('/', usuarioController.createUser);


/**
 * @swagger
 * /user/:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 */
router.get('/', usuarioController.getAllUsers);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Obtener un usuario por su ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 */
router.get('/:id', usuarioController.getUserById);

/**
/**
 * @swagger
 * /user/{username}:
 *   put:
 *     summary: Actualizar un usuario por id
 *     tags: [Usuarios]
 *     security:
 *      -  bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *      
 */
router.put('/:id', authenticateToken, usuarioController.updateUserById);

/**
/**
 * @swagger
 * /user/{username}:
 *   put:
 *     summary: Actualizar un usuario por nombre
 *     tags: [Usuarios]
 *     security:
 *      -  bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *      
 */
router.put('/:username', authenticateToken, usuarioController.updateUserByUsername);


/**
 * @swagger
 * /user/{username}:
 *   delete:
 *     summary: Eliminar un usuario por nombre
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 */
router.delete('/:username', authenticateToken, usuarioController.deleteUserByUsername);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login de usuario
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - password
 *             properties:
 *               user:
 *                 type: string
 *                 example: ejemplo
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login exitoso, retorna un token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: LOGIN EXITOSO
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', usuarioController.login);


/**
 * @swagger
 * /user/refresh:
 *   post:
 *     summary: Refrescar token de acceso
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Token renovado exitosamente, retorna un nuevo token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token renovado correctamente
 *       401:
 *         description: No se pudo refrescar el token (token inválido o expirado)
 */
router.post('/refresh',authenticateRefreshToken, usuarioController.refreshAccessToken);


export default router;
