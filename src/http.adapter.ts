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
    return this.applyHook('beforeCreate', this._getBaseRequestData(resource, request))
      .then(newRequest => this.dataLayer.create(newRequest))
      .then(response => this.applyHook('afterCreate', response));
  }

  findOne<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): Promise<IResponse> {
    return this.applyHook('beforeFindOne', this._getBaseRequestData(resource, request))
      .then(newRequest => this.dataLayer.findOne(newRequest))
      .then(response => this.applyHook('afterFindOne', response));
  }

  find<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): Promise<IResponse> {
    return this.applyHook('beforeFind', this._getBaseRequestData(resource, _.merge(request, {isArray: true})))
      .then(newRequest => this.dataLayer.find(newRequest))
      .then(response => this.applyHook('afterFind', response));
  }

  save<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): Promise<IResponse> {
    return this.applyHook('beforeSave', this._getBaseRequestData(resource, request))
      .then(newRequest => this.dataLayer.save(newRequest))
      .then(response => this.applyHook('afterSave', response));
  }

  destroy<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): Promise<IResponse> {
    return this.applyHook('beforeDestroy', this._getBaseRequestData(resource, request))
      .then(newRequest => this.dataLayer.destroy(newRequest))
      .then(response => this.applyHook('afterDestroy', response));
  }

  protected _getBaseRequestData<R extends IRecord>(resource: IResource<R>, request: IHttpRequest): any {
    return _.merge({}, request, {url: request.url || `${this.baseUrl}/${resource.identity}`});
  }
}
