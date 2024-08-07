import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

import { ActivatedRoute } from '@angular/router';

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
export class EstadoPatioPage implements OnInit, OnDestroy{
  deviceId: string | null = null;
  device: { id:string; name: string; details?: string } = { id: '', name: '' };
  deviceStatus: string = 'Desconocido';
  
  selectedOption: string = '';

  private client: MqttClient | null = null;
  public message: string = 'Prueba 29 de JULIO';

  constructor(private router: Router, private route: ActivatedRoute) {
    // this.client = mqtt.connect('wss://broker.emqx.io:8084/mqtt', {
    //   clientId: 'mqttx_eb72f7b9'
    // });

    // this.client.on('connect', () => {
    //   console.log('Conectado al broker en estado-patio!');

    //   this.client.subscribe('pruebaSerial', (err) => {
    //     if (!err) {
    //       console.log('Suscrito al tema pruebaSerial');
    //     } else {
    //       console.error('Error de suscripción: ', err);
    //     }
    //   });
    // });

    // this.client.on('message', (topic, message) => {
    //   console.log(`Mensaje recibido del tema ${topic}: ${message.toString()}`);
    // });

    // this.client.on('error', (error) => {
    //   console.error('Error de conexión', error);
    // });

    // this.client.on('close', () => {
    //   console.log('conexión cerrada');
    // });
  }

  ngOnInit() {
    this.deviceId = this.route.snapshot.paramMap.get('id');
    this.loadDeviceDetails();
    // this.loadDeviceStatus();

    if (!this.client) {
      this.client = mqtt.connect('wss://broker.emqx.io:8084/mqtt', {
        clientId: 'mqttx_eb72f7b9'
      });

      this.client.on('connect', () => {
        console.log('Conectado al broker en estado-patio!');
        this.client?.subscribe('pruebaSerial', (err) => {
          if (!err) {
            console.log('Suscrito al tema pruebaSerial');
          } else {
            console.error('Error de suscripción', err);
          }
        });
      });

      this.client.on('message', (topic, message) => {
        console.log(`Mensaje recibido del tema ${topic}: ${message.toString()}`);
        const humedad = JSON.parse(message.toString()).humedad;
        this.deviceStatus = this.getHumidityStatus(humedad);
        // this.handle_humidity(message.toString());
      });

      this.client.on('error', (error) => {
        console.error('Error de conexión', error);
      });

      this.client.on('close', () => {
        console.log('Conexión cerrada en estado-patio');
      });
    }
  }

  ngOnDestroy() {
    if (this.client) {
      this.client.end();
    }
  }

  onRadioChange(event: any) {
    this.selectedOption = event.detail.value;
    console.log('Radio changed to', this.selectedOption);
  }

  go_home() {
    this.client?.end();
    this.router.navigate(['/home']);
  }

  sendMessage() {
    if (this.message.trim() !== '') {
      this.client?.publish('pruebaSerial', this.message);
      console.log(`Mensaje enviado: ${this.message}`);
      // this.message = '';
    } else {
      console.error('El mensaje está vacío');
    }
  }

  loadDeviceDetails() {
    const devices = JSON.parse(localStorage.getItem('devices') || '[]');
    this.device = devices.find((d: any) => d.id === this.deviceId) || {};
  }

  // loadDeviceStatus() {
  //   this.deviceStatus = 'Húmedo';
  // }

  getHumidityStatus(humedad: number): string {
    if (humedad < 2400) {
      console.log('SECO');
      return 'Seco';
    } else {
      console.log('HÚMEDO')
      return 'Húmedo';
    }
  }
}