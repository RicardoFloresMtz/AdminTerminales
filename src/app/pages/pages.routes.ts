import { UsrEjecutivoComponent } from './usr-ejecutivo/usr-ejecutivo.component';
import { UsrSeguridadComponent } from './usr-seguridad/usr-seguridad.component';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';



const pagesRoutes: Routes = [
    {
        path: '', component: PagesComponent,
        children: [
            { path: 'usr_seguridad', component: UsrSeguridadComponent},
            { path: 'usr_ejecutivo', component: UsrEjecutivoComponent}
        ]

    }
];
export class FeatureRoutingModule {}
export const PAGES_ROUTES = RouterModule.forRoot(pagesRoutes, {useHash: true});
// export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);

