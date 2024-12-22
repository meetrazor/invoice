import { Component } from '@angular/core';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { ToasterMessageService } from '../../services/message/message.service';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [
    ButtonModule,
    InputTextModule,
    RouterModule,
    PasswordModule,
    CardModule,
    ReactiveFormsModule,
    MessageModule,
    CommonModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly alert: ToasterMessageService
  ) {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: CustomValidators.passwordsMatch(
          'password',
          'confirmPassword'
        ),
      }
    );
  }

  submit() {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;
      this.authService
        .register(email, password)
        .subscribe((response: { token: string }) => {
          this.alert.showSuccess('Registration Successfull');
          this.router.navigate(['/login']);
        });
    }
  }

  get confirmPasswordError(): string {
    if (this.registerForm.controls?.['confirmPassword'].errors?.['required']) {
      return 'Confirm Password is required.';
    }
    if (
      this.registerForm.controls?.['confirmPassword'].errors?.[
        'passwordsMismatch'
      ]
    ) {
      return 'Passwords do not match.';
    }
    return '';
  }
}

class CustomValidators {
  static passwordsMatch(
    passwordControlName: string,
    confirmPasswordControlName: string
  ): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get(passwordControlName)?.value;
      const confirmPassword = group.get(confirmPasswordControlName)?.value;

      if (password !== confirmPassword) {
        const confirmPasswordControl = group.get(confirmPasswordControlName);
        confirmPasswordControl?.setErrors({ passwordsMismatch: true });
        return { passwordsMismatch: true };
      } else {
        const confirmPasswordControl = group.get(confirmPasswordControlName);
        if (confirmPasswordControl?.hasError('passwordsMismatch')) {
          confirmPasswordControl.setErrors(null);
        }
        return null;
      }
    };
  }
}
