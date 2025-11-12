import Evento, { IEvento } from '../models/evento';

export const createEvento = async (data: IEvento) => {
  const ev = new Evento(data);
  return await ev.save();
};
/*
export const getAllEventos = async () => {
  return await Evento.find().sort({ createdAt: -1 });
};
*/

//getAllEventos
export const getAllEventos = async () => {
  return await Evento.find();
};


export const getEventoById = async (id: string) => {
  return await Evento.findById(id);
};

export const updateEvento = async (id: string, data: Partial<IEvento>) => {
  return await Evento.findByIdAndUpdate(id, data, { new: true });
}

export const deleteEvento = async (id: string) => {
  return await Evento.deleteOne({ _id: id });
};
