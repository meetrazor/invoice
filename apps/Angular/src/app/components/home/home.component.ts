import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule, ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  sidebarVisible = false;

  authService = inject(AuthService);

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
  logout() {
    this.authService.logout();
  }
}
