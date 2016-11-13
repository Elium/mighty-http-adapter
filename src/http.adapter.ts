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
    return this.dataLayer.create(this._getBaseRequestData(resource, request));
  }

  findOne<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): Promise<IResponse> {
    return this.dataLayer.findOne(this._getBaseRequestData(resource, request));
  }

  find<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): Promise<IResponse> {
    return this.dataLayer.find(this._getBaseRequestData(resource, _.merge(request, {isArray: true})));
  }

  save<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): Promise<IResponse> {
    return this.dataLayer.save(this._getBaseRequestData(resource, request));
  }

  destroy<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): Promise<IResponse> {
    return this.dataLayer.destroy(this._getBaseRequestData(resource, request));
  }

  protected _getBaseRequestData<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): any {
    return _.merge({}, request, {url: request.url || `${this.baseUrl}/${resource.identity}`});
  }
}
