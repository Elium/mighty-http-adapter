import * as _ from 'lodash';
import {IResource, IResponse, IRecord} from '@elium/mighty-js';
import {HttpAdapter} from './http.adapter';
import {IHttpRequest, HttpRequest} from './http.request';

export class RestAdapter extends HttpAdapter {

  findOne<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): Promise<IResponse> {
    return this.applyHook('beforeFindOne', this._getRequestWithId(resource, request))
      .then(newRequest => this.dataLayer.findOne(newRequest))
      .then(response => this.applyHook('afterFindOne', response));
  }

  save<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): Promise<IResponse> {
    return this.applyHook('beforeSave', this._getRequestWithId(resource, request))
      .then(newRequest => this.dataLayer.save(newRequest))
      .then(response => this.applyHook('afterSave', response));
  }

  destroy<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): Promise<IResponse> {
    return this.applyHook('beforeDestroy', this._getRequestWithId(resource, request))
      .then(newRequest => this.dataLayer.destroy(newRequest))
      .then(response => this.applyHook('afterDestroy', response));
  }

  protected _getRequestWithId<R extends IRecord>(resource: IResource<R>, request: IHttpRequest) {
    const id = _.get(request, 'criteria.id', null) || _.get(request, 'data.id', "");
    return _.merge({}, request, {url: request.url || `${this.baseUrl}/${resource.identity}/${id}`});
  }
}
