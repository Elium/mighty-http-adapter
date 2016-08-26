import {Adapter, IResource, IResponse, IRecord} from '@elium/mighty-js';
import {IHttpRequest, HttpRequest} from './http.request';
import {IDataLayer} from './layer';

export class HttpAdapter extends Adapter {
  protected _dataLayer: IDataLayer;
  protected _baseUrl: string;
  
  constructor(baseURl?: string, dataLayer?: IDataLayer) {
    super();
    this._baseUrl = baseURl || "";
    this._dataLayer = dataLayer;
  }
  
  create<R extends IRecord>(resource: IResource<R, this>, request: IHttpRequest): Promise<IResponse> {
    return this._dataLayer.create(this._getRequest(resource, request));
  }
  
  findOne<R extends IRecord>(resource: IResource<R, this>, request: IHttpRequest): Promise<IResponse> {
    return this._dataLayer.findOne(this._getRequest(resource, request));
  }
  
  find<R extends IRecord>(resource: IResource<R, this>, request: IHttpRequest): Promise<IResponse> {
    return this._dataLayer.find(this._getRequest(resource, request).merge(<IHttpRequest> {isArray: true}));
  }
  
  save<R extends IRecord>(resource: IResource<R, this>, request: IHttpRequest): Promise<IResponse> {
    return this._dataLayer.save(this._getRequest(resource, request));
  }
  
  destroy<R extends IRecord>(resource: IResource<R, this>, request: IHttpRequest): Promise<IResponse> {
    return this._dataLayer.destroy(this._getRequest(resource, request));
  }
  
  protected _getRequest<R extends IRecord>(resource: IResource<R, this>, request: IHttpRequest): HttpRequest {
    return new HttpRequest({url: `${this._baseUrl}/${resource.identity}`}).merge(request);
  }
}
