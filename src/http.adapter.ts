import * as _ from "lodash";
import {Adapter, IResource, IResponse} from "@elium/mighty-js";
import {IHttpRequest, HttpRequest} from "./http.request";
import {IDataLayer} from "./layers/layer";
import {XhrLayer} from "./layers/xhr.layer";
import {RequestLayer} from "./layers/request.layer";
import {Observable} from "rxjs/Rx";

export class HttpAdapter extends Adapter {
  protected _dataLayer: IDataLayer;
  protected _baseUrl: string;

  public constructor(baseURl?: string, dataLayer?: IDataLayer) {
    super();

    this._baseUrl = baseURl || "";

    if (_.isObject(dataLayer)) {
      this._dataLayer = dataLayer;
    } else if (!_.isUndefined(XMLHttpRequest)) {
      this._dataLayer = new XhrLayer();
    } else if (!_.isUndefined(process)) {
      this._dataLayer = new RequestLayer();
    }
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


  private _getRequest(resource: IResource<any>, request: IHttpRequest) {
    return new HttpRequest({url: `${this._baseUrl}/${resource.schema.id}`}).merge(request);
  }
}
