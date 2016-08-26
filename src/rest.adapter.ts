import {IResource, IResponse, IRecord} from '@elium/mighty-js';
import {HttpAdapter} from './http.adapter';
import {IHttpRequest, HttpRequest} from './http.request';

export class RestAdapter extends HttpAdapter {
  
  findOne<R extends IRecord>(resource: IResource<R, this>, request: IHttpRequest): Promise<IResponse> {
    return this._dataLayer.findOne(this._getRequestWithId(resource, request));
  }
  
  save<R extends IRecord>(resource: IResource<R, this>, request: IHttpRequest): Promise<IResponse> {
    return this._dataLayer.save(this._getRequestWithId(resource, request));
  }
  
  destroy<R extends IRecord>(resource: IResource<R, this>, request: IHttpRequest): Promise<IResponse> {
    return this._dataLayer.destroy(this._getRequestWithId(resource, request));
  }
  
  protected _getRequestWithId<R extends IRecord>(resource: IResource<R, this>, request: IHttpRequest) {
    return new HttpRequest({url: `${this._baseUrl}/${resource.identity}/${request.criteria["id"] || request.data.id}`}).merge(request);
  }
}
