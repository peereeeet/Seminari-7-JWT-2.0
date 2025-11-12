import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventoComponent } from './evento.component';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EventoService } from '../../services/evento.service';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';

describe('ExperienciaComponent', () => {
  let component: EventoComponent;
  let fixture: ComponentFixture<EventoComponent>;
  let experienciaService: jasmine.SpyObj<EventoService>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const experienciaServiceSpy = jasmine.createSpyObj('ExperienciaService', ['getExperiencias', 'addExperiencia']);
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers']);

    await TestBed.configureTestingModule({
      declarations: [EventoComponent],
      imports: [FormsModule, HttpClientTestingModule],
      providers: [
        { provide: EventoService, useValue: experienciaServiceSpy },
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();

    experienciaService = TestBed.inject(EventoService) as jasmine.SpyObj<EventoService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventoComponent);
    component = fixture.componentInstance;
    component.selectedUsers = []; 
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an empty list of selected participants initially', () => {
    expect(component.selectedUsers).toEqual([]); 
  });

  it('should call getExperiencias on init', () => {
    expect(experienciaService.getEventos).toHaveBeenCalled();
  });

  it('should call getUsers on init', () => {
    expect(userService.getUsers).toHaveBeenCalled();
  });
});
