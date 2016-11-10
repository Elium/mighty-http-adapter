import * as _ from 'lodash';
import {Adapter, IResource, IResponse, IRecord, IAdapter} from '@elium/mighty-js';
import {IHttpRequest, HttpRequest} from './http.request';
import {IDataLayer} from './layer';

export interface IHttpAdapter extends IAdapter {
  dataLayer: IDataLayer;
  baseUrl: string;
}

export class HttpAdapter extends Adapter implements IHttpAdapter {
  dataLayer: IDataLayer;
  baseUrl: string;

  constructor(baseURl?: string, dataLayer?: IDataLayer) {
    super();
    this.baseUrl = baseURl || "";
    this.dataLayer = dataLayer;
  }

  create<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): Promise<IResponse> {
    return this.dataLayer.create(this._getRequest(resource, request));
  }

  findOne<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): Promise<IResponse> {
    return this.dataLayer.findOne(this._getRequest(resource, request));
  }

  find<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): Promise<IResponse> {
    return this.dataLayer.find(this._getRequest(resource, _.merge(request, {isArray: true})));
  }

  save<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): Promise<IResponse> {
    return this.dataLayer.save(this._getRequest(resource, request));
  }

  destroy<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): Promise<IResponse> {
    return this.dataLayer.destroy(this._getRequest(resource, request));
  }

  protected _getRequest<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): HttpRequest {
    return new HttpRequest(_.merge({url: `${this.baseUrl}/${resource.identity}`}, request));
  }
}
