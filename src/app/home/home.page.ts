import { Component, ViewChild} from '@angular/core';
import { OnInit, OnDestroy } from '@angular/core';
// import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import {IonicModule} from '@ionic/angular'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OverlayEventDetail } from '@ionic/core/components';
import { IonModal } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import mqtt, { MqttClient } from 'mqtt';
// import { connect } from 'mqtt';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePage implements OnInit{
  @ViewChild(IonModal) modal!: IonModal;

  // id: string = "";
  // name: string = "";

  values = {
    id: "",
    name: ""
  }


  devices: Array<{id: string, name: string}> = [];

  private client: MqttClient | null = null;
  // private client = connect('wss://broker.emqx.io:8084/mqtt');

  constructor(private router: Router) {
    // const client = connect('wss://broker.emqx.io:8084/mqtt');
    // this.client = mqtt.connect('wss://broker.emqx.io:8084/mqtt', {
    //   clientId: 'mqttx_eb72f7b9'
    // });

    // this.client.on('connect', () => {
    //   console.log('Conectado al broker en home.page!');

    //   this.client.subscribe('pruebaSerial', (err) => {
    //     if (!err) {
    //       console.log('Suscrito al tema pruebaSerial');
    //     } else {
    //       console.error('Error de suscripción: ', err);
    //     }
    //   });
    // });

    // this.client.on('message', (topic, message) => {
    //   if (topic === 'pruebaSerial' && message.toString() === 'ok') {
    //     this.addDevice(this.values.id, this.values.name);
    //     console.log(`Mensaje recibido del tema ${topic}: ${message.toString()}`);
    //   }
    // });

    // this.client.on('error', (error) => {
    //   console.error('Error de conexión', error);
    // });

    // this.client.on('close', () => {
    //   console.log('conexión cerrada');
    // });
  }

  ngOnInit() {
    // this.initializeClient(); //Creo que debo borrar esto para que no se llame 2 veces la conexión
    this.loadDevices();
    // if (!this.client) {
    //   this.client = mqtt.connect('wss://broker.emqx.io:8084/mqtt', {
    //     clientId: 'mqttx_eb72f7b9'
    //   });

    //   this.client.on('connect', () => {
    //     console.log('Conectado al broker en home.page!');
    //     this.client?.subscribe('pruebaSerial', (err) => {
    //       if (!err) {
    //         console.log('Suscrito al tema pruebaSerial');
    //       } else {
    //         console.error('Error en la suscripción: ', err);
    //       }
    //     });
    //   });

    //   this.client.on('message', (topic, message) => {
    //     if (topic === 'pruebaSerial' && message.toString() === 'ok') {
    //       this.addDevice(this.values.id, this.values.name);
    //       console.log(`Mensaje recibido del tema ${topic}: ${message.toString()}`);
    //     }
    //   });

    //   this.client.on('error', (error) => {
    //     console.log('Conexión cerrada en home.page');
    //   });

    //   this.client.on('close', () => {
    //     console.log('Conexión CERRADA en home.page')
    //   });
    // }
  }

  ionViewWillEnter() {
    this.initializeClient();
  }

  initializeClient() {
    if (!this.client || this.client.disconnected) {
      this.client = mqtt.connect('wss://broker.emqx.io:8084/mqtt', {
        clientId: 'mqttx_eb72f7b9'
      });

      this.client.on('connect', () => {
        console.log('Conectado al broker en home.page!');
        this.client?.subscribe('pruebaSerial', (err) => {
          if (!err) {
            console.log('Suscrito al tema pruebaSerial');
          } else {
            console.error('Error en la suscripción: ', err);
          }
        });
      });
    
      this.client.on('message', (topic, message) => {
        if (topic === 'pruebaSerial' && message.toString() === 'ok') {
          this.addDevice(this.values.id, this.values.name);
          console.log(`Mensaje recibido del tema ${topic}: ${message.toString()}`);
        }
      });
    
      this.client.on('error', (error) => {
        console.log('Conexión cerrada en home.page');
      });
    
      this.client.on('close', () => {
        console.log('Conexión CERRADA en home.page')
      });
    }
  }

  // ngOnDestroy() {
  //   if (this.client) {
  //     this.client.end();
  //   }
  // }

  addDevice(id: string, name: string) {
    this.devices.push({ id, name });
    this.saveDevices();
  }

  saveDevices() {
    localStorage.setItem('devices', JSON.stringify(this.devices));
  }

  loadDevices() {
    const savedDevices = localStorage.getItem('devices');
    if (savedDevices) {
      this.devices = JSON.parse(savedDevices);
    }
  }

  navigateToEstadoPatio() {
    if (this.client) {
      this.client.end();
      this.client = null;
    }
    this.router.navigate(['/estado-patio']);
  }

  // onWillDismiss(event: Event) {
  //   const ev = event as CustomEvent<OverlayEventDetail<string>>;
  //   if (ev.detail.role == 'confirm') {
  //   }
  // }

  cancel() {
    this.modal.dismiss(null, 'cancel');
    this.values.id = "";
    this.values.name = "";
  }

  confirm() {
    if (this.values.id !== "" && this.values.name !== "") {
      this.client?.publish('pruebaSerial', JSON.stringify(this.values));
      
      this.modal.dismiss(this.values, 'confirm');
      console.log(`Id: ${this.values.id}. Name: ${this.values.name}.`);
      this.values.id = "";
      this.values.name = "";
    } else {
      console.error("Error: valores vacíos");
    }
  }
}