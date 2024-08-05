import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { HomePage } from './home/home.page';
import { EstadoPatioPage } from './estado-patio/estado-patio.page';


export const routes: Routes = [
  {
    path: '',
    component: SplashScreenComponent,
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'estado-patio/:id',
    loadComponent: () => import('./estado-patio/estado-patio.page').then( m => m.EstadoPatioPage)
  },
  {
    path: 'add-device',
    loadComponent: () => import('./add-device/add-device.page').then( m => m.AddDevicePage)
  },
];
