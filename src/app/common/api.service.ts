import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export class ApiError extends Error {
    constructor(message: string, code?: number) {
        super(message);
    }
}

@Injectable()
export class ApiService {
    API_URL = 'https://songs.code-star.ir/';

    constructor(private http: HttpClient) {}

    get<T>(path: string): Observable<T> {
        return this.http.get<T>(this.API_URL + path).pipe(catchError(this.handleError<T>()));
    }

    post<T>(path: string, body: any): Observable<T> {
        return this.http
            .post<T>(this.API_URL + path, body, {
                headers: { 'Content-Type': 'application/json' },
            })
            .pipe(catchError(this.handleError<T>()));
    }

    handleError<T>() {
        return (error: any): Observable<T> => {
            console.error(error);
            if (error instanceof HttpErrorResponse)
                return throwError(new ApiError(error.error.message, error.status));
            return throwError(new ApiError('مشکل در ارتباط با سرور'));
        };
    }
    public static async sendRequest(url: string, body?: object): Promise<any> {
        const init: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (body) {
            init.method = 'POST';
            init.body = JSON.stringify(body);
        }

        return fetch(url, init).then((res) => {
            if (res.ok) {
                return res.json();
            }

            throw res.json();
        });
    }
}
