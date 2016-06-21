import {Options} from "request";
import {IDataLayer} from "./layer";
import {IHttpRequest} from "../http.request";
import {IHttpResponse, HttpResponse} from "../http.response";
import {IncomingMessage} from "http";

export interface IRequestLayer extends IDataLayer {}

export class RequestLayer implements IRequestLayer {

  constructor() {}

  public find(request: IHttpRequest): Promise<IHttpResponse> {
    const localRequest: IHttpRequest = request.merge(<IHttpRequest> {method: "GET", isArray: true});
    return this._query(localRequest);
  }


  public findOne(request: IHttpRequest): Promise<IHttpResponse> {
    const localRequest: IHttpRequest = request.merge(<IHttpRequest> {method: "GET"});
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

  protected _query(request: IHttpRequest): Promise<IHttpResponse> {
    const options = this._getOptions(request);
    return this._request(request, options);
  }

  private _request(request: IHttpRequest, options: Options): Promise<IHttpResponse> {
    const Request = require("request");
    return new Promise((resolve, reject) => {
      Request(options, (error: any, response: IncomingMessage) => {
        const httpResponse = new HttpResponse();
        if (!error) {
          if (response.statusCode == 200) {
            const data = JSON.parse(response.statusMessage);
            if (request.isArray && !_.isArray(data)) {
              httpResponse.error = new Error("result is not an array, got :" + response.statusMessage);
            } else {
              httpResponse.data = data;
            }
          } else {
            httpResponse.error = new Error(response.statusMessage);
          }
        } else {
          httpResponse.error = new Error(response.statusMessage);
        }

        if (httpResponse.error) {
          reject(httpResponse);
        } else {
          resolve(httpResponse);
        }
      });
    });
  }

  private _getOptions(request: IHttpRequest): Options {
    return {
      json: true,
      url: request.url,
      method: (request.method || "").toUpperCase(),
      headers: request.headers,
      body: request.data,
      qs: request.params
    }
  }
}
