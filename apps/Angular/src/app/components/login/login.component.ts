import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Message } from 'primeng/message';
import { ToasterMessageService } from '../../services/message/message.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    CheckboxModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    RouterModule,
    CommonModule,
    Message,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly alert: ToasterMessageService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  login() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService
        .login(email, password)
        .subscribe((response: { token: string }) => {
          this.alert.showSuccess('Login Successfull');
          localStorage.setItem('token', response.token);
          this.router.navigate(['/dashboard']);
        });
    }
  }
}
