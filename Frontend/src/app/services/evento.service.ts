import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../models/evento.model';

@Injectable({ providedIn: 'root' })
export class EventoService {
  private apiUrl = 'http://localhost:3000/api/event';

  constructor(private http: HttpClient) {}

  getEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.apiUrl);
  }

  getEventoById(id: string): Observable<Evento> {
    return this.http.get<Evento>(`${this.apiUrl}/${id}`);
  }

  addEvento(newEvent: Evento): Observable<Evento> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const scheduleAsString =
      Array.isArray(newEvent.schedule) ? (newEvent.schedule[0] || '') : (newEvent.schedule as any);
    const payload: any = { ...newEvent, schedule: scheduleAsString, participantes: [...(newEvent.participantes || [])] };
    return this.http.post<Evento>(this.apiUrl, payload, { headers });
  }

  deleteEvento(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}