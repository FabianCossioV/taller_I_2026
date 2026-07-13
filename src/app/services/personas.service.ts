import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface Student {
  ru: number;
  name: string;
  ap: string;
  am: string;
  estado: number;
}
export interface ApiResponse {
  httpHeaders: any;
  httpStatusCode: number;
  message: string;
  otherParams: any;
  data: Student[];
  data2: any;
}
export interface ApiResponseSingle {
  httpHeaders: any;
  httpStatusCode: number;
  message: string;
  otherParams: any;
  data: Student;
  data2: any;
}

@Injectable({
  providedIn: 'root',
})
export class PersonasService {
  private readonly http = inject(HttpClient);

  private readonly urlApi = 'https://tallerweb.uajms.edu.bo';


 //MÉTODO: GET listar a todos los alumnos
  getStudent(): Observable<Student[]> {
    return this.http.get<ApiResponse>(this.urlApi+'/api/student').pipe(map(response => response.data)
    );
  }

 //MÉTODO: GET búsqueda de un solo alumno
  getStudentByRu(ru: number): Observable<Student> {
    return this.http.get<ApiResponseSingle>(this.urlApi+'/api/student/'+ru).pipe(
      map(response => response.data)
    );
  }
 //MÉTODO PUT PARA MODIFICAR
  updateStudent(ru: number, estudiante: Student): Observable<Student> {
    return this.http.put<ApiResponseSingle>(this.urlApi+'/api/student/'+ru, estudiante).pipe(
      map(response => response.data)
    );
  }
  //MÉTODO DELETE PARA ELIMINAR POR RU
  deleteStudent(ru: number): Observable<any> {
    return this.http.delete<ApiResponseSingle>(this.urlApi+'/api/student/'+ru).pipe(
      map(response => response.data)
    );
  }
  //METODO CREAR PARA CREAR ESTUDIANTE
  addStudent(student: Student){
    return this.http.post<Student>(this.urlApi+'/api/student', student);
  }
}
