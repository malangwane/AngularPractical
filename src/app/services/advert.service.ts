import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Advert } from '../models/advert';

@Injectable({
  providedIn: 'root'
})
export class AdvertService {

  private advertUrl = 'api/adverts';

  constructor(private http: HttpClient) { }

  getAdverts(): Observable<Advert[]> {
    return this.http.get<Advert[]>(this.advertUrl)
      .pipe(
        tap(data => console.log('getAdverts: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  private handleError(err: any): Observable<never> {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }
}
