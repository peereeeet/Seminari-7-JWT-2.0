import { Router } from 'express';
import * as eventoController from '../controller/eventoController';

const router = Router();


/**
 * @swagger
 * /event:
 *   post:
 *     summary: Crea un nuevo evento
 *     tags: [Eventos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - schedule
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Seminario Node"
 *               schedule:
 *                 type: string
 *                 example: "16:30 - 17:30"
 *               address:
 *                 type: string
 *                 example: "Aula 3, Edificio A"
 *     responses:
 *       201:
 *         description: Evento creado exitosamente
 */
router.post('/', eventoController.createEventoHandler);

/**
 * @swagger
 * /event:
 *   get:
 *     summary: Lista todos los eventos
 *     tags: [Eventos]
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', eventoController.getAlleventoHandler);

/**
 * @swagger
 * /event/{id}:
 *   get:
 *     summary: Obtiene un evento por ID
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evento encontrado
 *       404:
 *         description: No encontrado
 */
router.get('/:id', eventoController.getEventoByIdHandler);

/**
 * @swagger
 * /event/{id}:
 *   put:
 *     summary: Actualiza un evento por ID
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               schedule:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Evento actualizado
 *       404:
 *         description: No encontrado
 */
router.put('/:id', eventoController.updateEventoHandler);

/**
 * @swagger
 * /event/{id}:
 *   delete:
 *     summary: Elimina un evento por ID
 *     tags: [Eventos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evento eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deletedEvento:
 *                   type: object
 *                   description: Datos del evento eliminado
 *       404:
 *         description: No encontrado
 */
router.delete('/:id', eventoController.deleteEventoHandler);

export default router;
