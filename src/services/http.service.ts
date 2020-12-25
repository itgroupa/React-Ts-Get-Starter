import Axios, { AxiosResponse } from 'axios';
import { Observable, from, of } from 'rxjs';
import { mergeMap } from 'rxjs/internal/operators';

type paramType = { [key: string]: string | number } | null;

class HttpClient {
    private basePath: string;

    public static Build = (baseUri: string): HttpClient => {
      const client = new HttpClient();
      client.basePath = baseUri;
      return client;
    }

    public getRequest = <T>(uri: string, urlParams: paramType = null): Observable<T | null> => {
      const requestUri = `${this.basePath}${uri}${this.GetUriParams(urlParams)}`;
      return from(Axios.get(requestUri, {
        headers: {
          Pragma: 'no-cache',
        },
      }))
        .pipe(
          mergeMap((data: AxiosResponse<T>) => {
            if (!data.data) { return of(null); }
            return of(data.data);
          }),
        );
    }

    public getRequestArray =
        <T>(uri: string, paramName: string, params: string[]): Observable<T | null> => {
          const requestUri = `${this.basePath}${uri}${this.GetUriParamsArray(paramName, params)}`;
          return from(Axios.get(requestUri, {
            headers: {
              Pragma: 'no-cache',
            },
          }))
            .pipe(
              mergeMap((data: AxiosResponse<T>) => {
                if (!data.data) { return of(null); }
                return of(data.data);
              }),
            );
        }

    public postRequest = <TInput, TOutput>(uri: string, obj: TInput |
            null, urlParams: paramType = null): Observable<TOutput | null> => {
      const requestUri = `${this.basePath}${uri}${this.GetUriParams(urlParams)}`;
      return from(Axios.post(requestUri, obj, {
        headers: {
          Pragma: 'no-cache',
        },
      }))
        .pipe(
          mergeMap((data: AxiosResponse<TOutput>) => {
            if (!data.data) { return of(null); }
            return of(data.data);
          }),
        );
    }

    public putRequest = <TInput, TOutput>(uri: string, obj: TInput |
        null, urlParams: paramType = null): Observable<TOutput | null> => {
      const requestUri = `${this.basePath}${uri}${this.GetUriParams(urlParams)}`;
      return from(Axios.put(requestUri, obj, {
        headers: {
          Pragma: 'no-cache',
        },
      }))
        .pipe(
          mergeMap((data: AxiosResponse<TOutput>) => {
            if (!data.data) { return of(null); }
            return of(data.data);
          }),
        );
    }

    public putFileRequest = <TOutput>(uri: string, data: FormData,
                                      urlParams: paramType = null): Observable<TOutput> => {
      const requestUri = `${this.basePath}${uri}${this.GetUriParams(urlParams)}`;
      return from(Axios.put(requestUri, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Pragma: 'no-cache',
        },
      }))
        .pipe(
          mergeMap((answer: AxiosResponse<TOutput>) => {
            if (!answer.data) { return of(null); }
            return of(answer.data);
          }),
        );
    }

    public deleteRequest = <TInput, TOutput>(uri: string, obj: TInput |
        null, urlParams: paramType = null): Observable<TOutput | null> => {
      const requestUri = `${this.basePath}${uri}${this.GetUriParams(urlParams)}`;
      return from(Axios.delete(requestUri, {
        headers: {
          Pragma: 'no-cache',
        },
      }))
        .pipe(
          mergeMap((data: AxiosResponse<TOutput>) => {
            if (!data.data) { return of(null); }
            return of(data.data);
          }),
        );
    }

    private GetUriParams = (urlParams: paramType): string => {
      if (!urlParams) {
        return '';
      }
      let str = '?';
      Object.keys(urlParams).forEach((key) => {
        str += `${key}=${urlParams[key]}&`;
      });
      return str.substr(0, str.length - 1);
    }

    private GetUriParamsArray = (paramName: string, params: string[]): string => {
      if (!paramName || !params || params.length === 0) {
        return '';
      }
      let str = '?';
      params.forEach((val) => {
        str += `${paramName}=${val}&`;
      });
      return str.substr(0, str.length - 1);
    }
}

export default HttpClient;
