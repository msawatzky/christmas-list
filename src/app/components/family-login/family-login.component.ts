import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, FamilyUser } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-family-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>🎄 Welcome to Our Christmas List!</h2>
        <p class="subtitle">Choose who you are to get started</p>
        
        <div class="family-members">
          <div 
            *ngFor="let member of familyMembers" 
            class="member-card"
            (click)="selectUser(member.id)">
            <div class="avatar">{{ member.avatar }}</div>
            <div class="member-info">
              <h3>{{ member.name }}</h3>
            </div>
            <div class="select-arrow">→</div>
          </div>
        </div>
        
        <div class="footer">
          <p>Share this app with your family! 🎁</p>
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
      background: linear-gradient(135deg, #f8f9fa 0%, #e8f4f8 50%, #f0f8ff 100%);
      padding: 20px;
    }
    
    .login-card {
      background: white;
      padding: 1rem;
      border-radius: 15px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 500px;
      text-align: center;
    }
    
    h2 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
      font-size: 1.75rem;
    }
    
    .subtitle {
      color: #666;
      margin-bottom: 2rem;
      font-size: 1.1rem;
    }
    
    .family-members {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    
    .member-card {
      display: flex;
      align-items: center;
      padding: 0.5rem;
      border: 2px solid #e8f4f8;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.3s ease;
      background: #f8f9fa;
    }
    
    .member-card:hover {
      border-color: #3498db;
      background: #e3f2fd;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(52, 152, 219, 0.2);
    }
    
    .avatar {
      font-size: 2.5rem;
      margin-right: 1rem;
      width: 60px;
      text-align: center;
    }
    
    .member-info {
      flex: 1;
      text-align: left;
    }
    
    .member-info h3 {
      margin: 0;
      color: #2c3e50;
      font-size: 1.2rem;
      font-weight: 600;
    }
    

    
    .select-arrow {
      font-size: 1.5rem;
      color: #3498db;
      font-weight: bold;
      opacity: 0.7;
      transition: all 0.3s ease;
    }
    
    .member-card:hover .select-arrow {
      opacity: 1;
      transform: translateX(5px);
    }
    
    .footer {
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #e8f4f8;
    }
    
    .footer p {
      color: #666;
      font-size: 0.9rem;
      margin: 0;
    }
    
    @media (max-width: 480px) {
      .login-card {
        padding: 1.5rem;
      }
      
      h2 {
        font-size: 1.5rem;
      }
      
      .member-card {
        padding: 0.75rem;
      }
      
      .avatar {
        font-size: 2rem;
        width: 50px;
      }
      
      .member-info h3 {
        font-size: 1.1rem;
      }
    }
  `]
})
export class FamilyLoginComponent {
  familyMembers: FamilyUser[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.familyMembers = this.authService.getFamilyMembers();
  }

  selectUser(userId: string) {
    const result = this.authService.signIn(userId);
    if (result.success) {
      this.router.navigate(['/choice']);
    }
  }
}
