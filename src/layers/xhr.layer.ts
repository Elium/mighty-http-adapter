import * as _ from "lodash";
import {IResponse, Response, IMap} from "@elium/mighty-js";
import {IDataLayer} from "./layer";
import {IHttpRequest, HttpRequest} from "../http.request";
import {IHttpResponse} from "../http.response";

export interface IXhrLayer extends IDataLayer {}

export class XhrLayer implements IXhrLayer {

  constructor() {}

  /**
   * GET shortcut
   * @param request
   * @return {Promise}
   */
  public get(request: IHttpRequest): Promise<IHttpResponse> {
    const localRequest: IHttpRequest = request.merge(<IHttpRequest> {method: "GET"});
    return this.query(localRequest);
  }


  /**
   * POST shortcut
   * @param request
   * @return {Promise}
   */
  public post(request: IHttpRequest): Promise<IHttpResponse> {
    const localRequest: IHttpRequest = request.merge(<IHttpRequest> {method: "POST"});
    return this.query(localRequest);
  }


  /**
   * PUT shortcut
   * @param request
   * @return {Promise}
   */
  public put(request: IHttpRequest): Promise<IHttpResponse> {
    const localRequest: IHttpRequest = request.merge(<IHttpRequest> {method: "PUT"});
    return this.query(localRequest);
  }


  /**
   * PATCH shortcut
   * @param request
   * @return {Promise}
   */
  public patch(request: IHttpRequest): Promise<IHttpResponse> {
    const localRequest: IHttpRequest = request.merge(<IHttpRequest> {method: "PATCH"});
    return this.query(localRequest);
  }


  /**
   * DELETE shortcut
   * @param request
   * @return {Promise}
   */
  public delete(request: IHttpRequest): Promise<IHttpResponse> {
    const localRequest: IHttpRequest = request.merge(<IHttpRequest> {method: "DELETE"});
    return this.query(localRequest);
  }


  /**
   * Query a url with the specified request.
   * @param request
   * @return {Promise}
   */
  public query(request: IHttpRequest): Promise<IHttpResponse> {
    const localRequest = new HttpRequest(request);
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => this._checkResponse(xhr, resolve);

      if (!_.isEmpty(localRequest.params)) {
        localRequest.url += this._toQueryString(localRequest.params);
      }

      xhr.open(localRequest.method, localRequest.url, true);

      let data: any = localRequest.data;
      if (localRequest.method.toUpperCase() === "GET") {
        data = null;
      } else if (localRequest.json) {
        localRequest.headers = <IMap<string>> _.extend({}, localRequest.headers, {
          "Content-Type": "application/json"
        });
        data = JSON.stringify(localRequest.data);
      }

      _.forEach(localRequest.headers, (value, key) => xhr.setRequestHeader(key, value));

      xhr.send(data || null);
    });
  }


  /**
   * Check the response of the request and fullfill the Promise.
   * @param xhr
   * @param resolve
   * @private
   */
  private _checkResponse(xhr: XMLHttpRequest, resolve: (value?: IResponse) => void) {
    if (xhr.readyState === 4) {
      let result = {data: {}, error: null};
      if (xhr.status === 0 || xhr.status >= 200 && xhr.status < 400) {
        result.data = JSON.parse(xhr.responseText);
      } else {
        result.error = new Error(xhr.responseText);
      }
      resolve(new Response(result));
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
