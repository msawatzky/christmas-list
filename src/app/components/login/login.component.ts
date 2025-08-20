import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>{{ isSignUp ? 'Sign Up' : 'Sign In' }}</h2>
        
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              [(ngModel)]="email" 
              required 
              email
              class="form-control"
              placeholder="Enter your email">
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              [(ngModel)]="password" 
              required 
              minlength="6"
              class="form-control"
              placeholder="Enter your password">
          </div>
          
          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
          
          <button type="submit" [disabled]="loading || !loginForm.valid" class="btn-primary">
            {{ loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In') }}
          </button>
        </form>
        
        <div class="toggle-form">
          <button type="button" (click)="toggleForm()" class="btn-link">
            {{ isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    
    .login-card {
      background: white;
      padding: 2rem;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    
    h2 {
      text-align: center;
      color: #333;
      margin-bottom: 2rem;
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #555;
      font-weight: 500;
    }
    
    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }
    
    .form-control:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
    }
    
    .btn-primary {
      width: 100%;
      padding: 0.75rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    
    .btn-primary:hover:not(:disabled) {
      background: #5a6fd8;
    }
    
    .btn-primary:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    
    .btn-link {
      background: none;
      border: none;
      color: #667eea;
      cursor: pointer;
      text-decoration: underline;
      font-size: 0.9rem;
    }
    
    .btn-link:hover {
      color: #5a6fd8;
    }
    
    .error-message {
      color: #e74c3c;
      margin-bottom: 1rem;
      text-align: center;
      font-size: 0.9rem;
    }
    
    .toggle-form {
      text-align: center;
      margin-top: 1rem;
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  isSignUp = false;
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onSubmit() {
    this.loading = true;
    this.errorMessage = '';

    try {
      let result;
      if (this.isSignUp) {
        result = await this.authService.signUp(this.email, this.password);
      } else {
        result = await this.authService.signIn(this.email, this.password);
      }

      if (result.success) {
        this.router.navigate(['/list']);
      } else {
        this.errorMessage = result.error || 'An error occurred';
      }
    } catch (error: any) {
      this.errorMessage = error.message || 'An error occurred';
    } finally {
      this.loading = false;
    }
  }

  toggleForm() {
    this.isSignUp = !this.isSignUp;
    this.errorMessage = '';
  }
}
