import * as _ from 'lodash';
import {IResource, IResponse, IRecord} from '@elium/mighty-js';
import {HttpAdapter} from './http.adapter';
import {IHttpRequest, HttpRequest} from './http.request';

export class RestAdapter extends HttpAdapter {

  findOne<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): Promise<IResponse> {
    return this.dataLayer.findOne(this._getRequestWithId(resource, request));
  }

  save<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): Promise<IResponse> {
    return this.dataLayer.save(this._getRequestWithId(resource, request));
  }

  destroy<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): Promise<IResponse> {
    return this.dataLayer.destroy(this._getRequestWithId(resource, request));
  }

  protected _getRequestWithId<R extends IRecord>(resource: IResource<R>, request: IHttpRequest) {
    const id = _.get(request, 'criteria.id', null) || _.get(request, 'data.id', "");
    return _.merge({}, request, {url: request.url || `${this.baseUrl}/${resource.identity}/${id}`});
  }
}
