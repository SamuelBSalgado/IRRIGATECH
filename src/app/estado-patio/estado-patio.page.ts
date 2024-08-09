import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonModal } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';

import { ActivatedRoute } from '@angular/router';

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
export class EstadoPatioPage implements OnInit, OnDestroy {
  deviceId: string | null = null;
  device: { id:string; name: string; details?: string } = { id: '', name: '' };
  deviceStatus: string = 'Desconocido';

  @ViewChild('modal') modal: IonModal | undefined;
  
  private client: MqttClient | null = null;
  
  selectedOption: string = '';
  horaInicio: number | null = null;
  horaFinal: number | null = null;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.deviceId = this.route.snapshot.paramMap.get('id');
    this.loadDeviceDetails();

    //Cargar selección de config
    const storedOption = localStorage.getItem('selectedOption');
    if (storedOption) {
      this.selectedOption = storedOption;
    }

    //Cargar horarios guardados
    this.horaInicio = parseInt(localStorage.getItem('horaInicio') || '0', 10);
    this.horaFinal = parseInt(localStorage.getItem('horaFinal') || '0', 10);
    // const storedHoraInicio = localStorage.getItem('horaInicio');
    // const storedHoraFinal = localStorage.getItem('horaFinal');
    // if (storedHoraInicio) {
    //   this.horaInicio = parseInt(storedHoraInicio, 10);
    // }
    // if (storedHoraFinal) {
    //   this.horaFinal = parseInt(storedHoraFinal, 10);
    // }

    if (!this.client) {
      this.client = mqtt.connect('ws://35.206.111.160:8083/mqtt');

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
    // const horaInicio = localStorage.getItem('horaInicio');
    // const horaFinal = localStorage.getItem('horaFinal');
    const selectedValue = event.detail.value;
    if (selectedValue === '2') {
      if (this.horaInicio === null || this.horaFinal === null || this.horaInicio <= 0 || this.horaFinal <= 0) {
        console.log('Riego temporizado no puede seleccionarse sin valores de hora.');
        this.selectedOption = '1';
        localStorage.setItem('selectedOption', this.selectedOption);
        //PUBLICAR selectedOption A BROKER
        console.log('Se publicará al broker (debe ser 1): ', this.selectedOption);
        this.client?.publish('pruebaSerial', this.selectedOption);
        return;
      }
    }
    this.selectedOption = selectedValue;
    console.log('Radio changed to', this.selectedOption);
    localStorage.setItem('selectedOption', this.selectedOption);
    //PUBLICAR selectedOption A BROKER
    console.log('Se mandará al broker (debería ser el seleccionado): ', this.selectedOption);
    this.client?.publish('pruebaSerial', this.selectedOption);
  }

  saveHorarioValues() {
    localStorage.setItem('horaInicio', this.horaInicio?.toString() || '0');
    localStorage.setItem('horaFinal', this.horaFinal?.toString() || '0');

    //validar que los valores de horario no sean 0 o inválidos
    if (this.horaInicio === null || this.horaFinal === null || this.horaInicio <= 0 || this.horaFinal <= 0) {
      this.selectedOption = '1';
      localStorage.setItem('selectedOption', this.selectedOption);
    } else {
      localStorage.setItem('horaInicio', this.horaInicio.toString());
      localStorage.setItem('horaFinal', this.horaFinal.toString());
    }
  }

  closeModal() {
    this.saveHorarioValues();

    if(this.horaInicio === null || this.horaFinal === null || this.horaInicio <= 0 || this.horaFinal <= 0) {
      this.selectedOption = '1';
      localStorage.setItem('selectedOption', this.selectedOption);
    }

    if (this.modal) {
      this.modal.dismiss();
    }
  }

  go_home() {
    this.client?.end();
    this.router.navigate(['/home']);
  }

  loadDeviceDetails() {
    const devices = JSON.parse(localStorage.getItem('devices') || '[]');
    this.device = devices.find((d: any) => d.id === this.deviceId) || {};
  }

  getHumidityStatus(humedad: number): string {
    if (humedad < 2400) {
      console.log('HÚMEDO');
      return 'Húmedo';
    } else {
      console.log('SECO');
      return 'Seco';
    }
  }
}