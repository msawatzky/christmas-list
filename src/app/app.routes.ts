import { Routes } from '@angular/router';
import { FamilyLoginComponent } from './components/family-login/family-login.component';
import { ChristmasListComponent } from './components/christmas-list/christmas-list.component';
import { UserChoiceComponent } from './components/user-choice/user-choice.component';
import { ViewOthersComponent } from './components/view-others/view-others.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: FamilyLoginComponent },
  { path: 'choice', component: UserChoiceComponent },
  { path: 'list', component: ChristmasListComponent },
  { path: 'view-others', component: ViewOthersComponent },
  { path: '**', redirectTo: '/login' }
];
