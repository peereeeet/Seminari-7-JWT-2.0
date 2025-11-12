import { Request, Response } from 'express';
import {
  createEvento,
  getAllEventos,
  getEventoById,
  updateEvento,
  deleteEvento
} from '../services/eventoServices';

export const createEventoHandler = async (req: Request, res: Response) => {
  try {
    const data = await createEvento(req.body);
    res.json(data); // si quieres 201: res.status(201).json(data)
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAlleventoHandler = async (_req: Request, res: Response) => {
  try {
    const data = await getAllEventos();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getEventoByIdHandler = async (req: Request, res: Response) => {
  try {
    const data = await getEventoById(req.params.id);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEventoHandler = async (req: Request, res: Response) => {
  try {
    const data = await updateEvento(req.params.id, req.body);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEventoHandler = async (req: Request, res: Response) => {
  try {
    const data = await deleteEvento(req.params.id);
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
