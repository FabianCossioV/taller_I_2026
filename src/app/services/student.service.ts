//actualizacion de studenservices a personalservices
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Student } from '../modelos/student.interface';
import { ApiResponse } from '../modelos/apiresponse.interface';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
    private readonly xhttp = inject(HttpClient)
    private readonly xurlApi = 'https://tallerweb.uajms.edu.bo';

    getStudent(): Observable<Student[]> {
        return this.xhttp.get<ApiResponse>(this.xurlApi+'/api/student').pipe(map(res => res.data));
    }
}
