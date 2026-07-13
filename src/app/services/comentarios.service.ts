import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Comentarios } from '../modelos/comentarios.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ComentariosService {
  private readonly http = inject(HttpClient)
  private readonly urlApi = 'https://jsonplaceholder.typicode.com/comments';

	getComentarios(): Observable<Comentarios[]> {
		return this.http.get<Comentarios[]>(this.urlApi);
	}


}
