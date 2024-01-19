import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

  public vistaCrear:boolean = false;
  public vistaModificar:boolean = false;
  public vistaInicial:boolean = true;
  public vistaDetalle:boolean = false;
  public vistaCitaModificar:boolean = false;
  public citas:Cita[] = [];
  public formulario:FormGroup;
  public formularioMod:FormGroup;
  public identificador:Date = new Date;
  public nombre:string = "";
  public apellidos:string = "";
  public dni:string = "";
  public telefono:number = 0;
  public fechaCita:Date = new Date;
  public fechaNacimiento:Date = new Date;
  public observaciones:string = "";


  constructor(private fb: FormBuilder, private cookieService: CookieService) {
    this.fechaCita = new Date;
    this.nombre = '';
    this.apellidos = '';
    this.dni = '';
    this.telefono = 0;
    this.fechaNacimiento = new Date;
    this.observaciones = '';

    this.formulario = this.fb.group({
      fechaCita: ['', Validators.required],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      dni: ['', [Validators.required, this.validarDNI]],
      telefono: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      fechaNacimiento: ['', Validators.required],
      observaciones: ['']
    });
    this.formularioMod = this.fb.group({
      fechaCita: [this.fechaCita, Validators.required],
      nombre: [this.nombre, Validators.required],
      apellidos: [this.apellidos, Validators.required],
      dni: [this.dni, [Validators.required, this.validarDNI]],
      telefono: [this.telefono, [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      fechaNacimiento: [this.fechaNacimiento, Validators.required],
      observaciones: [this.observaciones]
    });
  }

  public crearSeleccionado(){
    this.vistaInicial = false;
    this.vistaDetalle = true;
    this.vistaModificar = false;
    this.vistaCrear = true;
  }

  public modificarSeleccionado(){
    this.getCitas();
    this.vistaInicial = false;
    this.vistaDetalle = true;
    this.vistaCrear = false;
    this.vistaModificar= true;
  }

  public crearCita(cita:any){
    this.getCitas();
    const valoresFormulario = this.formulario.value;
    // Almacena los valores en las variables
    this.fechaCita = valoresFormulario.fechaCita;
    this.nombre = valoresFormulario.nombre;
    this.apellidos = valoresFormulario.apellidos;
    this.dni = valoresFormulario.dni;
    this.telefono = valoresFormulario.telefono;
    this.fechaNacimiento = valoresFormulario.fechaNacimiento;
    this.observaciones = valoresFormulario.observaciones;

    let citaNueva:Cita = new Cita (this.identificador, this.nombre, this.apellidos, this.dni, this.telefono, this.fechaCita, this.fechaNacimiento, this.observaciones);
    this.citas.push(citaNueva);
    const citasJSON = JSON.stringify(this.citas);
    this.cookieService.set('citasCookie', citasJSON);
    this.vistaCrear = false;
    this.vistaDetalle = false;
    this.vistaInicial = true;
  }

  public modCita(cita:any){
    let idObjetivo = cita.target.name;
    let citaAux = this.citas.filter(cita=>cita.identificador == idObjetivo);
    this.identificador = citaAux[0].identificador;
    this.nombre = citaAux[0].nombre;
    this.apellidos = citaAux[0].apellidos
    this.fechaCita = citaAux[0].fechaCita;
    this.telefono = citaAux[0].telefono;
    this.dni = citaAux[0].dni;
    this.fechaNacimiento = citaAux[0].fechaNacimiento;
    this.observaciones = citaAux[0].observaciones;
    this.setValoresUsuario(this.fechaCita, this.nombre, this.apellidos, this.dni, this.telefono, this.fechaNacimiento, this.observaciones);
    this.vistaCrear = false;
    this.vistaModificar = false;
    this.vistaCitaModificar = true;
  }
  setValoresUsuario(
    fechaCita: Date,
    nombre: string,
    apellidos: string,
    dni: string,
    telefono: number,
    fechaNacimiento: Date,
    observaciones: string
  ) {
    this.formularioMod.patchValue({
      fechaCita,
      nombre,
      apellidos,
      dni,
      telefono,
      fechaNacimiento,
      observaciones
    });
  }

  public citaModificada(){
    let citaAux = this.citas.filter(cita=>cita.identificador == this.identificador);
    citaAux[0].nombre = this.nombre;
    citaAux[0].apellidos = this.apellidos;
    citaAux[0].fechaCita = this.fechaCita;
    citaAux[0].telefono = this.telefono;
    citaAux[0].dni = this.dni;
    citaAux[0].fechaNacimiento = this.fechaNacimiento;
    citaAux[0].observaciones = this.observaciones;
    const citasJSON = JSON.stringify(this.citas);
    this.cookieService.set('citasCookie', citasJSON);
    this.vistaCrear = false;
    this.vistaModificar = false;
    this.vistaDetalle = false;
    this.vistaCitaModificar = false;
    this.vistaInicial = true;

    // const valoresFormulario = this.formulario.value;
    // let nombreM = (document.getElementById("nombreM") as HTMLInputElement);
    // citaAux[0].nombre = nombreM.value;
    // let apeM = (document.getElementById("apellidosM") as HTMLInputElement);
    // citaAux[0].apellidos = apeM.value;
    // let fec1M = (document.getElementById("fechaCitaM") as HTMLInputElement);
    // let fAux = new Date (fec1M.value);
    // citaAux[0].fechaCita = fAux;
    // let telefonoM = (document.getElementById("telefonoM") as HTMLInputElement);
    // citaAux[0].telefono = parseInt(telefonoM.value);
    // let dniM = (document.getElementById("dniM") as HTMLInputElement);
    // citaAux[0].dni = dniM.value;
    // let fec2M = (document.getElementById("fechaNacimientoM") as HTMLInputElement);
    // let fAux2 = new Date (fec2M.value);
    // citaAux[0].fechaNacimiento = fAux2;
    // let observacionesM = (document.getElementById("observacionesM") as HTMLInputElement);
    // citaAux[0].observaciones = observacionesM.value;
  }

  public getCitas():Cita[] | null{
    const citasJSON = this.cookieService.get('citasCookie');
    if (!citasJSON) {
      return null;
    }
    this.citas = JSON.parse(citasJSON);
    return this.citas;
  }

  public borrarCita(cita:any){
    let idObjetivo = cita.target.name;
    this.citas = this.citas.filter(cita=>cita.identificador != idObjetivo);
    const citasJSON = JSON.stringify(this.citas);
    this.cookieService.set('citasCookie', citasJSON);
    this.vistaCrear = false;
    this.vistaModificar = false;
    this.vistaDetalle = false;
    this.vistaInicial = true;
  }

  private validarDNI(control: AbstractControl): { [key: string]: any } | null {
    const dniRegex = /^[0-9]{8}[a-zA-Z]$/;

    if (control.value && !dniRegex.test(control.value)) {
      return { 'dniInvalido': true };
    }

    return null;
  }

  campoEsValido(nombreCampo: string): boolean {
    const control = this.formulario.get(nombreCampo);
    if (control) return control.valid || !control.touched;
    else return false;
  }

  // Método para mostrar un mensaje de advertencia si el campo no es válido
  mostrarAdvertencia(nombreCampo: string): boolean {
    const control = this.formulario.get(nombreCampo);
    if(control) return control.invalid && control.touched;
    else return false;
  }

}

export class Cita{
  public identificador:Date = new Date;
  public nombre:string = "";
  public apellidos:string = "";
  public dni:string = "";
  public telefono:number = 0;
  public fechaCita:Date = new Date;
  public fechaNacimiento:Date = new Date;
  public observaciones:string = "";

  constructor(identificador:Date, nombre:string, apellidos:string, dni:string, telefono:number, fechaCita:Date, fechaNacimiento:Date, observaciones:string){
    this.identificador = identificador;
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.dni = dni;
    this.telefono = telefono;
    this.fechaCita = fechaCita;
  }
}
