import {Adapter, IResource, IResponse} from '@elium/mighty-js';
import {IHttpRequest, HttpRequest} from './http.request';
import {Observable} from 'rxjs/Rx';
import {IDataLayer} from './layer';

export class HttpAdapter extends Adapter {
  protected _dataLayer: IDataLayer;
  protected _baseUrl: string;

  public constructor(baseURl?: string, dataLayer?: IDataLayer) {
    super();
    this._baseUrl = baseURl || "";
    this._dataLayer = dataLayer;
  }

  /**
   * Create a new object.
   * @param resource
   * @param request
   * @return {Observable<IResource>}
   */
  public create(resource: IResource<any>, request: IHttpRequest): Observable<IResponse> {
    return this._dataLayer.create(this._getRequest(resource, request));
  }


  /**
   * Get all entries matching the specific .
   * @param resource
   * @param request
   * @return {Observable<Array<IResource>>}
   */
  public findOne(resource: IResource<any>, request: IHttpRequest): Observable<IResponse> {
    return this._dataLayer.findOne(this._getRequest(resource, request));
  }


  /**
   * Get all entries matching the specific .
   * @param resource
   * @param request
   * @return {Observable<Array<IResource>>}
   */
  public find(resource: IResource<any>, request: IHttpRequest): Observable<IResponse> {
    return this._dataLayer.find(this._getRequest(resource, request).merge(<IHttpRequest> {isArray: true}));
  }


  /**
   * Update the specified
   * @param resource
   * @param request
   * @return {Observable<IResource>}
   */
  public save(resource: IResource<any>, request: IHttpRequest): Observable<IResponse> {
    return this._dataLayer.save(this._getRequest(resource, request));
  }


  /**
   * Remove the specified entry
   * @param resource
   * @param request
   * @return {Observable<IResource>}
   */
  public destroy(resource: IResource<any>, request: IHttpRequest): Observable<IResponse> {
    return this._dataLayer.destroy(this._getRequest(resource, request));
  }


  private _getRequest(resource: IResource<any>, request: IHttpRequest): HttpRequest {
    return new HttpRequest({url: `${this._baseUrl}/${resource.schema.id}`}).merge(request);
  }
}
