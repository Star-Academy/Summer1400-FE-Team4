import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { ApiError, ApiService } from './api.service';

describe('ApiError', () => {
    it('should have valid properties 1', () => {
        const error = new ApiError('magic');
        expect(error.message).toBe('magic');
        expect(error.code).toBeUndefined();
    });

    it('should have valid properties 2', () => {
        const error = new ApiError('witchcraft', 403);
        expect(error.message).toBe('witchcraft');
        expect(error.code).toBe(403);
    });
});

describe('ApiService', () => {
    let mockHttp: jasmine.SpyObj<HttpClient>;
    let api: ApiService;

    beforeEach(() => {
        mockHttp = jasmine.createSpyObj('mockHttp', ['get', 'post']);
        api = new ApiService(mockHttp);
    });

    describe('get', () => {
        it('should return identical result', (done: DoneFn) => {
            mockHttp.get.and.returnValue(of(12));

            api.get<number>('/test/12').subscribe((result) => {
                expect(result).toBe(12);
                done();
            }, done.fail);
        });

        it('should return correct ApiError on failure', (done: DoneFn) => {
            mockHttp.get.and.returnValue(
                throwError(
                    new HttpErrorResponse({
                        error: { message: 'failed' },
                        status: 403,
                    })
                )
            );

            api.get<number>('/test/12').subscribe(
                () => done.fail('expected an error'),
                (error) => {
                    expect(error).toBeInstanceOf(ApiError);
                    expect(error.message).toBe('failed');
                    expect(error.code).toBe(403);
                    done();
                }
            );
        });

        it('should call with right URL', () => {
            mockHttp.get.and.returnValue(of(12));

            api.get<number>('/test/12').subscribe();

            expect(mockHttp.get).toHaveBeenCalledOnceWith(
                api.API_URL + '/test/12',
                jasmine.anything()
            );
        });
    });

    describe('post', () => {
        it('should return identical result', (done: DoneFn) => {
            mockHttp.post.and.returnValue(of(12));

            api.post<number>('/test/12', {}).subscribe((result) => {
                expect(result).toBe(12);
                done();
            }, done.fail);
        });

        it('should return correct ApiError on failure', (done: DoneFn) => {
            mockHttp.post.and.returnValue(
                throwError(
                    new HttpErrorResponse({
                        error: { message: 'failed' },
                        status: 403,
                    })
                )
            );

            api.post<number>('/test/12', {}).subscribe(
                () => done.fail('expected an error'),
                (error) => {
                    expect(error).toBeInstanceOf(ApiError);
                    expect(error.message).toBe('failed');
                    expect(error.code).toBe(403);
                    done();
                }
            );
        });

        it('should call with right URL and body', () => {
            mockHttp.post.and.returnValue(of(12));

            api.post<number>('/test/12', { body: 'the body' }).subscribe();

            expect(mockHttp.post).toHaveBeenCalledOnceWith(
                api.API_URL + '/test/12',
                { body: 'the body' },
                jasmine.anything()
            );
        });
    });
});
