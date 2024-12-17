import { Component } from '@angular/core';
import { CitasService } from '../../citas.service';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-create-appointment',
  standalone: false,
  templateUrl: './create-appointment.component.html',
  styleUrls: ['./create-appointment.component.css'],
})
export class CreateAppointmentComponent {
  specialties: string[] = [];
  doctors: any[] = [];
  selectedSpecialty: string = '';
  filteredDoctors: any[] = [];
  selectedDoctor: any = null;
  availableDates: string[] = [];
  availableAppointments: any[] = [];
  availableHours: { hour: string, citaId: number }[] = [];
  selectedHour: string = '';
  selectedDate: Date | null = null;
  selectedCitaId: number | null = null;
  isLoading: boolean = true;

  constructor(private citasService: CitasService, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.cargarEspecialidades();
  }

  cargarEspecialidades() {
    this.citasService.obtenerEspecialidades().subscribe(
      (data) => {
        this.specialties = data;
      },
      (error) => {
        console.error('Error al cargar las especialidades:', error);
      }
    );
  }

  filterDoctors() {
    this.citasService.obtenerMedicosPorEspecialidad(this.selectedSpecialty).subscribe(
      (doctors) => {
        this.filteredDoctors = doctors;
        this.selectedDoctor = null;
        this.availableDates = [];
      },
      (error) => {
        console.error('Error al cargar los doctores:', error);
      }
    );
  }

  loadAvailableDates() {
    if (this.selectedDoctor) {
      this.citasService.obtenerCitasPorMedico(this.selectedDoctor.id).subscribe(
        (appointments) => {
          this.availableAppointments = appointments.filter((appointment: any) => appointment.paciente === null);
          this.availableDates = this.availableAppointments.map((appointment: any) => appointment.fecha.split(' ')[0].trim());
          //this.highlightAvailableDates();

          if (this.availableDates.length > 0) {
            const closestDate = this.getClosestDate(this.availableDates);
            this.selectDate(new Date(closestDate)); 
          }

          this.isLoading = false;


        },
        (error) => {
          console.error('Error al cargar las citas disponibles:', error);
          this.isLoading = false;
        }
      );
    }
  }

  getMonthNumber(monthName: string): string {
    const months: { [key: string]: number } = {
      'Enero': 1, 'January': 1,
      'Febrero': 2, 'February': 2,
      'Marzo': 3, 'March': 3,
      'Abril': 4, 'April': 4,
      'Mayo': 5, 'May': 5,
      'Junio': 6, 'June': 6,
      'Julio': 7, 'July': 7,
      'Agosto': 8, 'August': 8,
      'Septiembre': 9, 'September': 9,
      'Octubre': 10, 'October': 10,
      'Noviembre': 11, 'November': 11,
      'Diciembre': 12, 'December': 12,
    };

    return months[monthName]?.toString() || '0';
  }

  selectDate(date: Date | null): void {
    if (!date) {
      console.warn('La fecha seleccionada es null.');
      return;
    }
  
    // Ajusta la hora y guarda la fecha seleccionada
    date.setHours(date.getHours() + 1);
    this.selectedDate = date;
    const selectedDateString = date.toISOString().split('T')[0];
  
    // Filtra las citas disponibles para la fecha seleccionada
    const appointmentsForDate = this.availableAppointments.filter(
      (appointment: any) => appointment.fecha.split(' ')[0] === selectedDateString
    );
  
    // Extrae las horas disponibles con citaId para el desplegable
    this.availableHours = appointmentsForDate.map((appointment: any) => ({
      hour: appointment.fecha.split(' ')[1],
      citaId: appointment.id
    }));

    if (this.availableHours.length > 0) {
      this.selectedHour = this.availableHours[0].hour;
      this.selectedCitaId = this.availableHours[0].citaId;
    }

  }

  confirmAppointment() {
    const userId = this.authService.getId();
    if (!userId) {
      alert('No se ha encontrado el ID de usuario. Asegúrate de estar autenticado.');
      return;
    }

    if (this.selectedDoctor && this.selectedSpecialty && this.selectedHour && this.selectedDate) {
      const selectedDateString = this.selectedDate.toISOString().split('T')[0];

      const selectedAppointment = this.availableHours.find(availableHour => availableHour.hour === this.selectedHour);

      if (!selectedAppointment){
        alert("No se ha podido obtener la id de la cita");
        return;
      }

      const appointmentData = {
        doctorId: this.selectedDoctor.id,
        specialty: this.selectedSpecialty,
        date: `${selectedDateString} ${this.selectedHour}`,
        userId: userId,
        citaId: selectedAppointment.citaId,
      };

      this.citasService.pedirCita(appointmentData, userId).subscribe(
        () => {
          alert(`Cita creada exitosamente para el ${selectedDateString} a las ${this.selectedHour} con ${this.selectedDoctor.nombre}`);
          this.router.navigate(['/appointments']);
          window.location.reload()
        },
        (error) => {
          console.error('Error al pedir la cita:', error);
          alert('Hubo un error al pedir la cita. Por favor, inténtalo de nuevo.');
        }
      );
    } else {
      alert('Por favor, selecciona una hora y fecha antes de confirmar la cita.');
    }
  }

  dateClass = (date: Date): string => {
    // Normaliza la fecha actual
    date.setHours(date.getHours() + 1);
    const dateString = date.toISOString().split('T')[0];
  

    // Compara correctamente y verifica
    const isAvailable = this.availableDates.some((availableDate) => availableDate.trim() === dateString);
  
    // Log para depurar la clase que se devuelve
    if (isAvailable) {
      console.log(`%c highlight-date aplicado a: ${dateString}`, 'color: green; font-weight: bold;');
      return 'highlight-date';
    }
    return '';
  }

  getClosestDate(availableDates: string[]): string {
    const today = new Date().toISOString().split('T')[0]; // Fecha de hoy en formato YYYY-MM-DD
    let closestDate = availableDates[0];

    // Busca la fecha más cercana a hoy
    availableDates.forEach(date => {
      if (new Date(date) >= new Date(today) && new Date(date) < new Date(closestDate)) {
        closestDate = date;
      }
    });

    return closestDate;
  }

}
