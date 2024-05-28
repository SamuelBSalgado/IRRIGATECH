import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-estado-patio',
  templateUrl: './estado-patio.page.html',
  styleUrls: ['./estado-patio.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EstadoPatioPage {
  selectedOption: string = '';

  constructor() { }

  onRadioChange(event: any) {
    this.selectedOption = event.detail.value;
    console.log('Radio changed to', this.selectedOption);
  }

}
