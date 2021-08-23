import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export class ApiError extends Error {
    constructor(message: string, public code?: number) {
        super(message);
    }
}

@Injectable()
export class ApiService {
    API_URL = 'https://songs.code-star.ir/' as const;

    constructor(private http: HttpClient) {}

    get<T>(path: string): Observable<T> {
        return this.http
            .get<T>(this.API_URL + path, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control':
                        'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
                    Pragma: 'no-cache',
                    Expires: '0',
                },
            })
            .pipe(catchError(this.handleError<T>()));
    }

    post<T>(path: string, body: any): Observable<T> {
        return this.http
            .post<T>(this.API_URL + path, body, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control':
                        'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
                    Pragma: 'no-cache',
                    Expires: '0',
                },
            })
            .pipe(catchError(this.handleError<T>()));
    }

    private handleError<T>() {
        return (error: any): Observable<T> => {
            console.error(error);
            if (error instanceof HttpErrorResponse && error.status)
                return throwError(new ApiError(error.error.message, error.status));
            return throwError(new ApiError('اشکال در برقراری ارتباط با سرور', undefined));
        };
    }
}
