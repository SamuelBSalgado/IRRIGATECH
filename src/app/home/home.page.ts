import { Component, viewChild, ViewChild } from '@angular/core';
// import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import {IonicModule} from '@ionic/angular'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OverlayEventDetail } from '@ionic/core/components';
import { IonModal } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePage {
  @ViewChild(IonModal) modal!: IonModal;

  id: string = "";
  name: string = "";

  constructor(private router: Router) {}

  navigateToEstadoPatio() {
    this.router.navigate(['/estado-patio']);
  }

  // onWillDismiss(event: Event) {
  //   const ev = event as CustomEvent<OverlayEventDetail<string>>;
  //   if (ev.detail.role == 'confirm') {
  //   }
  // }

  cancel() {
    this.modal.dismiss(null, 'cancel');
    this.id = "";
    this.name = "";
  }

  confirm() {
    if (this.id !== "" && this.name !== "") {
      this.modal.dismiss(this.id, 'confirm');
      console.log('Valores después de dismiss:', this.id, this.name);
      this.id = "";
      this.name = "";
    } else {
      console.error("Error: valores vacíos");
    }
  }
}
