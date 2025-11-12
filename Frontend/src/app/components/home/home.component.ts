import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { EventoService } from '../../services/evento.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  constructor(
    private userService: UserService,
    private eventoService: EventoService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.userService.getUsers().subscribe(users => {
      this.animateCounter('userCount', users.length);
    });

    this.eventoService.getEventos().subscribe(eventos => {
      this.animateCounter('eventCount', eventos.length);
    });
  }

  animateCounter(elementId: string, target: number): void {
    const element = document.getElementById(elementId);
    if (!element) return;

    let current = 0;
    const increment = target / 50; 
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current).toString();
    }, 30);
  }
}