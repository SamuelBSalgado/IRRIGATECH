import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

// import * as mqtt from 'mqtt';
import mqtt, { MqttClient } from 'mqtt';

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

  private client: MqttClient;
  public message: string = 'Prueba 29 de JULIO';

  constructor(private router: Router) {
    this.client = mqtt.connect('wss://broker.emqx.io:8084/mqtt', {
      clientId: 'mqttx_eb72f7b9'
    });

    this.client.on('connect', () => {
      console.log('Conectado al broker en estado-patio!');

      this.client.subscribe('pruebaSerial', (err) => {
        if (!err) {
          console.log('Suscrito al tema pruebaSerial');
        } else {
          console.error('Error de suscripción: ', err);
        }
      });
    });

    this.client.on('message', (topic, message) => {
      console.log(`Mensaje recibido del tema ${topic}: ${message.toString()}`);
    });

    this.client.on('error', (error) => {
      console.error('Error de conexión', error);
    });

    this.client.on('close', () => {
      console.log('conexión cerrada');
    });
  }

  onRadioChange(event: any) {
    this.selectedOption = event.detail.value;
    console.log('Radio changed to', this.selectedOption);
  }

  go_home() {
    this.router.navigate(['/home']);
  }

  sendMessage() {
    if (this.message.trim() !== '') {
      this.client.publish('pruebaSerial', this.message);
      console.log(`Mensaje enviado: ${this.message}`);
      // this.message = '';
    } else {
      console.error('El mensaje está vacío');
    }
  }

}