import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ChristmasListComponent } from './components/christmas-list/christmas-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'list', component: ChristmasListComponent },
  { path: '**', redirectTo: '/login' }
];
