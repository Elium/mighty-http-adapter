import {IResponse, Response} from '@elium/mighty-js';

export interface IHttpResponse extends IResponse {}
export class HttpResponse extends Response implements IHttpResponse {}
