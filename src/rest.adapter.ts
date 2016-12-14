import * as _ from 'lodash';
import {IResource, IResponse, IRecord} from '@elium/mighty-js';
import {HttpAdapter} from './http.adapter';
import {IHttpRequest, HttpRequest} from './http.request';

export class RestAdapter extends HttpAdapter {

  findOne<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): Promise<IResponse> {
    return this._getRequestWithId(resource, request)
      .then(baseRequest => this.applyHook('beforeFindOne', baseRequest))
      .then(newRequest => this.dataLayer.findOne(newRequest))
      .then(response => this.applyHook('afterFindOne', response));
  }

  save<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): Promise<IResponse> {
    return this._getRequestWithId(resource, request)
      .then(baseRequest => this.applyHook('beforeSave', baseRequest))
      .then(newRequest => this.dataLayer.save(newRequest))
      .then(response => this.applyHook('afterSave', response));
  }

  destroy<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): Promise<IResponse> {
    return this._getRequestWithId(resource, request)
      .then(baseRequest => this.applyHook('beforeDestroy', baseRequest))
      .then(newRequest => this.dataLayer.destroy(newRequest))
      .then(response => this.applyHook('afterDestroy', response));
  }

  protected _getRequestWithId<R extends IRecord>(resource: IResource<R>, request: IHttpRequest) {
    return this.applyHook('beforeRequest', request)
      .then((newRequest: IHttpRequest) => {
        const id = _.get(newRequest, 'criteria.id', null) || _.get(newRequest, 'data.id', "");
        return _.merge({}, newRequest, {url: newRequest.url || `${this.baseUrl}/${resource.identity}/${id}`});
      });
  }
}
