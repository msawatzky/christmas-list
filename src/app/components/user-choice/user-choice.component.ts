import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-choice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-choice.component.html',
  styleUrl: './user-choice.component.css'
})
export class UserChoiceComponent implements OnInit {
  userEmail = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userEmail = user.name;
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  goToMyList() {
    this.router.navigate(['/list']);
  }

  goToViewOthers() {
    this.router.navigate(['/view-others']);
  }

  async signOut() {
    const result = await this.authService.signOut();
    if (result.success) {
      this.router.navigate(['/login']);
    }
  }
}
