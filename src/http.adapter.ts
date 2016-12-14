import * as _ from 'lodash';
import {Adapter, IResource, IResponse, IRecord, IAdapter, IHookable, IHook} from '@elium/mighty-js';
import {IHttpRequest} from './http.request';
import {IDataLayer} from './layer';
import {hookable} from '@elium/mighty-js/utils/hook';

export interface IHttpAdapter extends IAdapter {
  dataLayer: IDataLayer;
  baseUrl: string;
}

@hookable
export class HttpAdapter extends Adapter implements IHttpAdapter, IHookable {
  dataLayer: IDataLayer;
  baseUrl: string;

  constructor(baseURl?: string, dataLayer?: IDataLayer) {
    super();
    this.baseUrl = baseURl || "";
    this.dataLayer = dataLayer;
  }

  addHook: (hook: IHook) => void;
  removeHook: (name: string) => void;
  applyHook: <I, O>(name: string, input: I) => Promise<I | O>;

  create<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): Promise<IResponse> {
    return this._getBaseRequestData(resource, request)
      .then(baseRequest => this.applyHook('beforeCreate', baseRequest))
      .then(newRequest => this.dataLayer.create(newRequest))
      .then(response => this.applyHook('afterCreate', response));
  }

  findOne<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): Promise<IResponse> {
    return this._getBaseRequestData(resource, request)
      .then(baseRequest => this.applyHook('beforeFindOne', baseRequest))
      .then(newRequest => this.dataLayer.findOne(newRequest))
      .then(response => this.applyHook('afterFindOne', response));
  }

  find<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): Promise<IResponse> {
    return this._getBaseRequestData(resource, _.merge(request, {isArray: true}))
      .then(baseRequest => this.applyHook('beforeFind', baseRequest))
      .then(newRequest => this.dataLayer.find(newRequest))
      .then(response => this.applyHook('afterFind', response));
  }

  save<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): Promise<IResponse> {
    return this._getBaseRequestData(resource, request)
      .then(baseRequest => this.applyHook('beforeSave', baseRequest))
      .then(newRequest => this.dataLayer.save(newRequest))
      .then(response => this.applyHook('afterSave', response));
  }

  destroy<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): Promise<IResponse> {
    return this._getBaseRequestData(resource, request)
      .then(baseRequest => this.applyHook('beforeDestroy', baseRequest))
      .then(newRequest => this.dataLayer.destroy(newRequest))
      .then(response => this.applyHook('afterDestroy', response));
  }

  protected _getBaseRequestData<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): Promise<IHttpRequest> {
    return this.applyHook('beforeRequest', request)
      .then((newRequest: IHttpRequest) => {
        return _.merge({}, newRequest, {url: newRequest.url || `${this.baseUrl}/${resource.identity}`})
      });
  }
}
