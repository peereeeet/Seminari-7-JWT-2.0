import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Evento } from '../../models/evento.model';
import { EventoService } from '../../services/evento.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-evento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './evento.component.html',
  styleUrls: ['./evento.component.css']
})
export class EventoComponent implements OnInit {
  eventos: Evento[] = [];
  users: User[] = [];
  availableUsers: User[] = [];
  selectedUsers: User[] = [];
  newEvent: Evento = { name: '', schedule: [], address: '', participantes: [] };
  dateStr: string = '';
  timeStr: string = '';
  errorMessage = '';
  showDeleteModal = false;
  private pendingDeleteIndex: number | null = null;

  availablePage = 1;
  availablePageSize = 5;
  selectedPage = 1;
  selectedPageSize = 5;

  constructor(
    private eventoService: EventoService,
    private userService: UserService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users as any;
        this.availableUsers = [...this.users];
        this.clampPages();
      }
    });
    this.eventoService.getEventos().subscribe({
      next: (evts) => {
        this.eventos = evts.map(e => ({
          ...e,
          schedule: Array.isArray(e.schedule) ? e.schedule : (e.schedule ? [e.schedule as any] : []),
          participantes: Array.isArray((e as any).participantes) ? (e as any).participantes : ((e as any).participants || [])
        }));
      }
    });
  }

  goHome(): void {
    this.location.back();
  }

  setSchedule(): void {
    this.errorMessage = '';
    if (!this.dateStr || !this.timeStr) {
      this.errorMessage = 'Selecciona fecha y hora.';
      return;
    }
    const slot = `${this.dateStr} ${this.timeStr}`;
    this.newEvent.schedule = [slot];
  }

  clearSchedule(): void {
    this.newEvent.schedule = [];
    this.dateStr = '';
    this.timeStr = '';
  }

  addParticipant(u: User): void {
    if (!u?._id) return;
    this.availableUsers = this.availableUsers.filter(x => x._id !== u._id);
    if (!this.selectedUsers.find(x => x._id === u._id)) this.selectedUsers.push(u);
    this.syncParticipantsIds();
    this.clampPages();
  }

  removeParticipant(u: User): void {
    if (!u?._id) return;
    this.selectedUsers = this.selectedUsers.filter(x => x._id !== u._id);
    if (!this.availableUsers.find(x => x._id === u._id)) {
      this.availableUsers.push(u);
      this.availableUsers.sort((a, b) => a.username.localeCompare(b.username));
    }
    this.syncParticipantsIds();
    this.clampPages();
  }

  private syncParticipantsIds(): void {
    this.newEvent.participantes = this.selectedUsers.map(u => u._id!).filter(Boolean);
  }

  onSubmit(): void {
    this.errorMessage = '';
    if (!this.newEvent.name?.trim()) {
      this.errorMessage = 'El ti­tulo del evento es obligatorio.';
      return;
    }
    if (!this.newEvent.schedule?.length) {
      this.errorMessage = 'Selecciona el horario del evento.';
      return;
    }
    if (!this.newEvent.address?.length) {
      this.errorMessage = 'Selecciona la dirección del evento.';
      return;
    }

    this.eventoService.addEvento(this.newEvent).subscribe({
      next: (created) => {
        const normalized: Evento = {
          ...created,
          schedule: Array.isArray(created.schedule) ? created.schedule : (created.schedule ? [created.schedule as any] : []),
          participantes: Array.isArray((created as any).participantes) ? (created as any).participantes : ((created as any).participants || [])
        };
        this.eventos.push(normalized);
        this.resetForm();
      },
      error: () => this.errorMessage = 'Error al crear el evento. Revisa los datos.'
    });
  }

  openDeleteModal(index: number): void {
    this.pendingDeleteIndex = index;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.pendingDeleteIndex = null;
  }

  confirmarEliminar(): void {
    if (this.pendingDeleteIndex == null) {
      this.closeDeleteModal();
      return;
    }
    const idx = this.pendingDeleteIndex;
    const evt = this.eventos[idx];
    if (!evt?._id) {
      this.closeDeleteModal();
      return;
    }
    this.eventoService.deleteEvento(evt._id).subscribe({
      next: () => {
        this.eventos.splice(idx, 1);
        this.closeDeleteModal();
      },
      error: () => {
        this.errorMessage = 'Error al eliminar el evento.';
        this.closeDeleteModal();
      }
    });
  }

  getScheduleText(e: Evento): string {
    if (Array.isArray(e.schedule) && e.schedule.length) return this.formatSchedule(e.schedule[0]);
    if (typeof (e as any).schedule === 'string') return this.formatSchedule((e as any).schedule);
    return '-';
  }

  formatSchedule(s: string | undefined | null): string {
    if (!s) return '-';
    const sep = s.includes('T') ? 'T' : ' ';
    const [d, t = ''] = s.split(sep);
    const [y, m, d2] = d.split('-');
    const hhmm = t.slice(0,5);
    if (y && m && d2) return `${d2}-${m}-${y}${hhmm ? ' ' + hhmm : ''}`;
    return s;
  }

  getEventAddress(e: any): string {
    return e?.address ?? e?.direccion ?? '-';
  }

  getParticipantsList(e: any): string[] {
    return e?.participantes ?? e?.participants ?? [];
  }

  getParticipantsNames(e: any): string {
    const ids = this.getParticipantsList(e);
    const names = ids.map(p => this.getUserNameById(p)).filter(Boolean);
    return names.length ? names.join(', ') : '-';
  }

  getUserNameById(idOrObj: any): string {
    if (idOrObj && typeof idOrObj === 'object') {
      if (idOrObj.username) return idOrObj.username;
      if (idOrObj._id) {
        const u = this.users.find(x => x._id === idOrObj._id);
        return u ? u.username : idOrObj._id;
      }
    }
    const u = this.users.find(x => x._id === idOrObj);
    return u ? u.username : (idOrObj || '');
  }

  get availableTotalPages(): number {
    return Math.max(1, Math.ceil(this.availableUsers.length / this.availablePageSize));
  }
  get selectedTotalPages(): number {
    return Math.max(1, Math.ceil(this.selectedUsers.length / this.selectedPageSize));
  }

  get availablePageItems(): User[] {
    const start = (this.availablePage - 1) * this.availablePageSize;
    return this.availableUsers.slice(start, start + this.availablePageSize);
  }
  get selectedPageItems(): User[] {
    const start = (this.selectedPage - 1) * this.selectedPageSize;
    return this.selectedUsers.slice(start, start + this.selectedPageSize);
  }

  availablePrevPage(): void {
    if (this.availablePage > 1) this.availablePage--;
  }
  availableNextPage(): void {
    if (this.availablePage < this.availableTotalPages) this.availablePage++;
  }
  setAvailablePageSize(v: string): void {
    const n = parseInt(v, 10) || 5;
    this.availablePageSize = n;
    this.availablePage = 1;
    this.clampPages();
  }

  selectedPrevPage(): void {
    if (this.selectedPage > 1) this.selectedPage--;
  }
  selectedNextPage(): void {
    if (this.selectedPage < this.selectedTotalPages) this.selectedPage++;
  }
  setSelectedPageSize(v: string): void {
    const n = parseInt(v, 10) || 5;
    this.selectedPageSize = n;
    this.selectedPage = 1;
    this.clampPages();
  }

  private clampPages(): void {
    this.availablePage = Math.min(Math.max(1, this.availablePage), this.availableTotalPages);
    this.selectedPage = Math.min(Math.max(1, this.selectedPage), this.selectedTotalPages);
  }

  private resetForm(): void {
    this.newEvent = { name: '', schedule: [], address: '', participantes: [] };
    this.availableUsers = [...this.users];
    this.selectedUsers = [];
    this.dateStr = '';
    this.timeStr = '';
    this.errorMessage = '';
    this.availablePage = 1;
    this.selectedPage = 1;
    this.clampPages();
  }
}