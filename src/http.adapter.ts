import * as _ from 'lodash';
import {Adapter, IResource, IResponse, IMap, IResponseData, HasOneRelation, HasManyRelation} from '@elium/mighty-js';
import {IHttpRequest, HttpRequest} from './http.request';
import {IDataLayer} from './layer';

export class HttpAdapter extends Adapter {
  protected _dataLayer: IDataLayer;
  protected _baseUrl: string;

  public constructor(baseURl?: string, dataLayer?: IDataLayer) {
    super();
    this._baseUrl = baseURl || "";
    this._dataLayer = dataLayer;
  }


  public create(resource: IResource<any>, request: IHttpRequest): Promise<IResponse> {
    return this._dataLayer.create(this._getRequest(resource, request))
      .then((response) => this._populate(resource, request, response));
  }


  public findOne(resource: IResource<any>, request: IHttpRequest): Promise<IResponse> {
    return this._dataLayer.findOne(this._getRequest(resource, request))
      .then((response) => this._populate(resource, request, response));
  }


  public find(resource: IResource<any>, request: IHttpRequest): Promise<IResponse> {
    return this._dataLayer.find(this._getRequest(resource, request).merge(<IHttpRequest> {isArray: true}))
      .then((response) => this._populate(resource, request, response));
  }


  public save(resource: IResource<any>, request: IHttpRequest): Promise<IResponse> {
    return this._dataLayer.save(this._getRequest(resource, request))
      .then((response) => this._populate(resource, request, response));
  }


  public destroy(resource: IResource<any>, request: IHttpRequest): Promise<IResponse> {
    return this._dataLayer.destroy(this._getRequest(resource, request))
      .then((response) => this._populate(resource, request, response));
  }


  protected _populate<T>(resource: IResource<any>, request: IHttpRequest, response: IResponse): Promise<IResponse> {
    if (Array.isArray(request.populate) && request.populate.length > 0) {
      const populateFields = _.uniq(request.populate);
      let promises = _.flatten(populateFields.map((field) => {
        if (Array.isArray(response.data)) {
          return (<Array<IMap<any>>> response.data).map((row) => this._populateRow(row, resource, field));
        } else {
          return this._populateRow(response.data, resource, field);
        }
      }));
      return Promise.all(promises).then(() => response);
    } else {
      return Promise.resolve(response);
    }
  }

  protected _populateRow(row: IMap<any>, resource: IResource<any>, field: string): Promise<IMap<any>> {
    if (resource.relations.hasOwnProperty(field)) {
      return this._getRelatedData(row, resource, field)
        .then((fieldData) => row[field] = fieldData);
    } else {
      return Promise.resolve(row);
    }
  }

  protected _getRelatedData(row: IMap<any>, resource: IResource<any>, field: string): Promise<IResponseData> {
    const relation = resource.relations[field];
    if (relation instanceof HasOneRelation) {
      return relation.resource.findOne({criteria: {id: row[relation.joinColumn]}});
    } else if (relation instanceof HasManyRelation) {
      return relation.resource.find({criteria: {[relation.viaColumn]: row["id"]}});
    } else {
      throw new Error(`Unknown relation type ${relation}`);
    }
  }

  private _getRequest(resource: IResource<any>, request: IHttpRequest): HttpRequest {
    return new HttpRequest({url: `${this._baseUrl}/${resource.schema.identity}`}).merge(request);
  }
}
