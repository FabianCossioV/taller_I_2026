import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PersonasService, Student } from './services/personas.service';
import * as bootstrap from 'bootstrap'
import { FormGroup, FormControl, ReactiveFormsModule, } from '@angular/forms';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('proy2');
  private readonly apiService = inject(PersonasService)

  protected listaStudent = signal<Student[]>([])
  @ViewChild('modModal') modalElement!: ElementRef;
  protected alumno =signal<Student | null>(null)

  regForm! : FormGroup
  constructor(){
    this.regForm = new FormGroup({
		ru: new FormControl(''),
		name: new FormControl(''),
		ap: new FormControl(''),
		am: new FormControl(''),
		estado: new FormControl(''),
	})
  }
  ngOnInit():void{
    this.listarAlumnos()
  }
  listarAlumnos():void{
    this.apiService.getStudent().subscribe({
        next: (dat) => {
          this.listaStudent.set(dat)
        },
        error:(err) => {
          console.log('Error al conectar con la API',err)
        }
    })
  }
  buscarEstudiante(ru: number) {
      this.apiService.getStudentByRu(ru).subscribe({
          next: (studentEncontrado) => {
          this.alumno.set(studentEncontrado);
            //asignando a los inputs de form modificar
          this.regForm.patchValue({
            ru: studentEncontrado.ru,
            name: studentEncontrado.name,
            ap: studentEncontrado.ap,
            am: studentEncontrado.am
          });
          console.log('ALumno Encontrado:', studentEncontrado);
          },
          error: (err) => {
          console.error('Error al obtener el estudiante:', err);
          }
      });
    }
  cargarAlumnos(ru:number):void{
		this.buscarEstudiante(ru);
    //console.log("llego ru="+ru)
		if (this.modalElement) {
		  // Pasamos el nativeElement de Angular a Bootstrap
		  const myModal = new bootstrap.Modal(this.modalElement.nativeElement);
		  myModal.show();
		}
	}
  guardarModificacion():void{
        if (this.regForm.invalid) return; //valida el formulario

        //recuepado de los inputs a una variable datosActualizados
       // const datosActualizados = this.regForm.value as Student;
        //const ru = datosActualizados.ru;

          //recuepado de los inputs a una variable datosActualizados
        const datosActualizados:Student = {
          ru: this.regForm.get('ru')?.value,
          name: this.regForm.get('name')?.value,
          ap: this.regForm.get('ap')?.value,
          am: this.regForm.get('am')?.value,
          estado: 1
        }
        const ru = this.regForm.get('ru')?.value

        if (!ru) {
          console.error('No se encontró el RU del estudiante');
          return;
        }

        this.apiService.updateStudent(ru, datosActualizados).subscribe({
          next: (estudianteModificado) => {
          console.log('Estudiante actualizado con éxito:', estudianteModificado);
          this.listarAlumnos()
          this.cerrarModal();
          },
          error: (err) => {
          console.error('Error al actualizar el estudiante:', err);
          }
        });
      }
      cerrarModal() {
            if (this.modalElement) {
              const modalInstance = bootstrap.Modal.getInstance(this.modalElement.nativeElement);
              modalInstance?.hide();
            }
  }
  anadirEstudiante(): void {
    if (this.regForm.invalid) return;
    const nuevoEstudiante: Student = {
      ru: this.regForm.get('ru')?.value,
      name: this.regForm.get('name')?.value,
      ap: this.regForm.get('ap')?.value,
      am: this.regForm.get('am')?.value,
      estado: this.regForm.get('estado')?.value
    };
    this.apiService.addStudent(nuevoEstudiante).subscribe({
      next: (resp) => {
        console.log('Estudiante registrado', resp);
        this.listarAlumnos();
        this.regForm.reset();
      },
      error: (err) => {
        console.error('Error al registrar estudiante', err);
      }
    });
  }
eliminar(ru:number):void{
		this.apiService.deleteStudent(ru).subscribe({
			  next: (estudianteModificado) => {
				console.log('Estudiante actualizado con éxito:', estudianteModificado);

			  },
			  error: (err) => {
				console.error('Error al actualizar el estudiante:', err);
			  }
		});
	}

}//end of class

/*import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PersonasService, Student } from './servicio/personas.service';
import { Validators, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('proy2');
  private readonly apiService = inject(PersonasService)
  protected listaStudent = signal<Student[]>([])
  regForm : FormGroup
  @ViewChild('botoncerrar') botonCerrar!: ElementRef;

  constructor(){
    this.regForm = new FormGroup({
      ru: new FormControl(''),
      name: new FormControl(''),
      ap: new FormControl(''),
      am: new FormControl(''),
    })
  }

  ngOnInit():void{
      this.listarDatos();
  }

  listarDatos(){
    this.apiService.getStudent().subscribe({
        next: (dat) => {
          this.listaStudent.set(dat)
        },
        error:(err) => {
          console.log('Error al conectar con la API',err)
        }
      })
  }
   enviarDatos():void{
    if (this.regForm.invalid) {
      return
    }
      const datoTosave:Student = {
        ru:this.regForm.get('ru')?.value,
        name:this.regForm.get('name')?.value,
        ap:this.regForm.get('ap')?.value,
        am:this.regForm.get('am')?.value,
        estado:1
      }
      this.apiService.crearStudent(datoTosave).subscribe({
        next: (respuestaDelServidor) => {
          console.log('¡Servidor respondió con éxito!', respuestaDelServidor);
          this.listarDatos();
        },
        error: (err) => {
          console.error('Error al hacer el POST:', err);
        }
      });
      this.botonCerrar.nativeElement.click();
      this.regForm.reset();
      //console.log("Guardar datos"+ JSON.stringify(this.regForm.value))
   }

}//end class
*/
/*import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComentariosService } from './services/comentarios.service';
import { Comentarios } from './modelos/comentarios.interface';
import { inject } from '@angular/core';
import { StudentService } from './services/student.service';
import { Student } from './modelos/student.interface';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
//    RouterOutlet,
    ReactiveFormsModule
//    NgClass
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('proy02')
  private readonly apiService = inject(StudentService)
  protected listaEstudiantes = signal<Student[]>([])

    ngOnInit():void{
    this.apiService.getStudent().subscribe({
      next: (dat) => {
        this.listaEstudiantes.set(dat)
      },
      error:(err) => {
        console.log('Error al conectar con la API',err)
      }
    })
  }

}*/
  /*
  protected readonly title = signal('proy02')
  private readonly apiService = inject(ComentariosService)
  protected listaComentarios = signal<Comentarios[]>([])

  ngOnInit():void{
    this.apiService.getComentarios().subscribe({
      next: (dat) => {
        this.listaComentarios.set(dat)
      },
      error:(err) => {
        console.log('Error al conectar con la API',err)
      }
    })
  }
}*/
/* protected readonly title = signal('proy02')


function inject(ComentariosService: typeof ComentariosService) {
  throw new Error('Function not implemented.');
}
  regForm! : FormGroup
  xenviado : boolean = false
  depto: string[] = ['Pando', 'Beni', 'La Paz', 'Santa Cruz', 'Cochabamba', 'Oruro', 'Potosi', 'Chuquisaca', 'Tarija']
  constructor(){
    this.regForm = new FormGroup({
      placa: new FormControl('', [Validators.required, Validators.minLength(4), Validators.pattern('/^[0-89]+$/ ')]),
      color: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      modelo: new FormControl('', [Validators.required, Validators.min(1000), Validators.max(9999)]),
      registrado: new FormControl('', Validators.required),
      departamento: new FormControl('', [Validators.required]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$')
      ])
    })
  }

  get f(){return this.regForm.controls;}

  enviarDatos():void{
    this.xenviado=true;
    if(this.regForm.invalid){
      return
    }
    console.log("Guardando Datos.." + JSON.stringify(this.regForm.value))
  }
}
export interface Movilidad{
  placa: string
  color: string
  modelo: number
  registrado: string
  departamento: string
  email:string
}*/
