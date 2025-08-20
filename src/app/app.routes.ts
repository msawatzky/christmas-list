import { Routes } from '@angular/router';
import { FamilyLoginComponent } from './components/family-login/family-login.component';
import { ChristmasListComponent } from './components/christmas-list/christmas-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: FamilyLoginComponent },
  { path: 'list', component: ChristmasListComponent },
  { path: '**', redirectTo: '/login' }
];
