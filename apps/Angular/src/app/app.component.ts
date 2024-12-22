import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { AuthService } from './services/auth/auth.service';

@Component({
  imports: [RouterModule, ToastModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [AuthService],
})
export class AppComponent {
  title = 'Angular';
}
