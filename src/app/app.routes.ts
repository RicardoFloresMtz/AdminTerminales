
import { LoginComponent } from './login/login/login.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: '**', component: LoginComponent}
];

export class NavigateRoutingModule {}
export const APP_ROUTES = RouterModule.forRoot(routes, {useHash: true});

