import {IResource, IResponse, IMap, IResponseData, HasOneRelation, HasManyRelation} from '@elium/mighty-js';
import {HttpAdapter} from './http.adapter';
import {IHttpRequest, HttpRequest} from './http.request';

export class RestAdapter extends HttpAdapter {

  public findOne(resource: IResource<any>, request: IHttpRequest): Promise<IResponse> {
    return this._dataLayer.findOne(this._getRequestWithId(resource, request))
      .then((response) => this._populate(resource, request, response));
  }


  public save(resource: IResource<any>, request: IHttpRequest): Promise<IResponse> {
    return this._dataLayer.save(this._getRequestWithId(resource, request))
      .then((response) => this._populate(resource, request, response));
  }


  public destroy(resource: IResource<any>, request: IHttpRequest): Promise<IResponse> {
    return this._dataLayer.destroy(this._getRequestWithId(resource, request))
      .then((response) => this._populate(resource, request, response));
  }


  protected _getRelatedData(row: IMap<any>, resource: IResource<any>, field: string): Promise<IResponseData> {
    const relation = resource.relations[field];
    if (relation instanceof HasOneRelation) {
      return relation.resource.findOne({criteria: {id: row[relation.joinColumn]}});
    } else if (relation instanceof HasManyRelation) {
      return resource.find(<IHttpRequest> {url: `${this._baseUrl}/${resource.schema.identity}/${row["id"]}/${relation.resource.schema.identity}`});
    } else {
      throw new Error(`Unknown relation type ${relation}`);
    }
  }


  protected _getRequestWithId(resource: IResource<any>, request: IHttpRequest) {
    return new HttpRequest({url: `${this._baseUrl}/${resource.schema.identity}/${request.criteria["id"] || request.data.id}`}).merge(request);
  }
}
