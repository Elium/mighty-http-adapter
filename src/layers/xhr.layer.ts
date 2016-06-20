import * as _ from "lodash";
import {IResponse, IMap} from "@elium/mighty-js";
import {IDataLayer} from "./layer";
import {IHttpRequest, HttpRequest} from "../http.request";
import {IHttpResponse, HttpResponse} from "../http.response";

export interface IXhrLayer extends IDataLayer {}

export class XhrLayer implements IXhrLayer {

  constructor() {}

  public findOne(request: IHttpRequest): Promise<IHttpResponse> {
    const localRequest: IHttpRequest = request.merge(<IHttpRequest> {method: "GET"});
    return this._query(localRequest);
  }

  public find(request: IHttpRequest): Promise<IHttpResponse> {
    const localRequest: IHttpRequest = request.merge(<IHttpRequest> {method: "GET", isArray: true});
    return this._query(localRequest);
  }


  public create(request: IHttpRequest): Promise<IHttpResponse> {
    const localRequest: IHttpRequest = request.merge(<IHttpRequest> {method: "POST"});
    return this._query(localRequest);
  }


  public save(request: IHttpRequest): Promise<IHttpResponse> {
    const localRequest: IHttpRequest = request.merge(<IHttpRequest> {method: "PUT"});
    return this._query(localRequest);
  }


  public destroy(request: IHttpRequest): Promise<IHttpResponse> {
    const localRequest: IHttpRequest = request.merge(<IHttpRequest> {method: "DELETE"});
    return this._query(localRequest);
  }


  /**
   * Query a url with the specified request.
   * @param request
   * @return {Promise}
   */
  protected _query(request: IHttpRequest): Promise<IHttpResponse> {
    const localRequest = new HttpRequest(request);
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      if (!_.isEmpty(localRequest.params)) {
        localRequest.url += this._toQueryString(localRequest.params);
      }

      let data: any = localRequest.data;
      if (localRequest.method.toUpperCase() === "GET") {
        data = null;
      } else {
        localRequest.headers = <IMap<string>> _.extend({}, localRequest.headers, {
          "Content-Type": "application/json"
        });
        data = JSON.stringify(localRequest.data);
      }

      _.forEach(localRequest.headers, (value, key) => xhr.setRequestHeader(key, value));

      xhr.onreadystatechange = () => this._checkResponse(localRequest, xhr, resolve, reject);
      xhr.open(localRequest.method, localRequest.url, true);
      xhr.send(data || null);
    });
  }


  /**
   * Check the response of the request and fullfill the Promise.
   * @param request
   * @param xhr
   * @param resolve
   * @param reject
   * @private
   */
  private _checkResponse(request: IHttpRequest, xhr: XMLHttpRequest, resolve: (value?: IResponse) => void, reject: (reason?: any) => void) {
    if (xhr.readyState === 4) {
      const response = new HttpResponse();
      if (xhr.status === 0 || xhr.status >= 200 && xhr.status < 400) {
        response.data = JSON.parse(xhr.responseText);
        if (request.isArray && !_.isArray(response.data)) {
          response.data = null;
          response.error = new Error("result is not an array, got :" + xhr.responseText);
        }
      } else {
        response.error = new Error(xhr.responseText);
      }
      if (response.error) {
        reject(response);
      } else {
        resolve(response);
      }
    }
  }


  /**
   * Parse a json object and returns a, encoded query string.
   * @param params
   * @return {string}
   * @private
   */
  private _toQueryString(params) {
    const parts: Array<String> = [];
    _.forEach(params, (value: string, key: string) => {
      parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
    });
    return "?" + parts.join("&");
  }
}
