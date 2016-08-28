import {IResponse, Response} from '@elium/mighty-js';

export interface IHttpResponse extends IResponse {
  status: number
}

export class HttpResponse extends Response implements IHttpResponse {
  status: number = 0;
}
