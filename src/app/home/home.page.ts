import { Component } from '@angular/core';
// import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import {IonicModule} from '@ionic/angular'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePage {
  constructor(private router: Router) {}

  navigateToEstadoPatio() {
    this.router.navigate(['/estado-patio']);
  }
}
