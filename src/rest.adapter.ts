import {IResource, IResponse} from "@elium/mighty-js";
import {Observable} from "rxjs/Rx";
import {HttpAdapter} from "./http.adapter";
import {IHttpRequest, HttpRequest} from "./http.request";

export class RestAdapter extends HttpAdapter {

  /**
   * Get all entries matching the specific .
   * @param resource
   * @param request
   * @return {Observable<Array<IResource>>}
   */
  public findOne(resource: IResource, request: IHttpRequest): Observable<IResponse> {
    return this._dataLayer.findOne(this._getRequestWithId(resource, request));
  }


  /**
   * Update the specified
   * @param resource
   * @param request
   * @return {Observable<IResource>}
   */
  public save(resource: IResource, request: IHttpRequest): Observable<IResponse> {
    return this._dataLayer.save(this._getRequestWithId(resource, request));
  }


  /**
   * Remove the specified entry
   * @param resource
   * @param request
   * @return {Observable<IResource>}
   */
  public destroy(resource: IResource, request: IHttpRequest): Observable<IResponse> {
    return this._dataLayer.destroy(this._getRequestWithId(resource, request));
  }

  private _getRequestWithId(resource: IResource, request: IHttpRequest) {
    return new HttpRequest({url: `${this._baseUrl}/${resource.schema.id}/${request.data.id}`}).merge(request);
  }
}
