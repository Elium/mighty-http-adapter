import * as Request from "request";
import {Options} from "request";
import {IDataLayer} from "./layer";
import {IHttpRequest} from "../http.request";
import {IHttpResponse, HttpResponse} from "../http.response";
import {IncomingMessage} from "http";

export interface IRequestLayer extends IDataLayer {}

export class RequestLayer implements IRequestLayer {

  constructor() {}
  
  public get(request: IHttpRequest): Promise<IHttpResponse> {
    const localRequest: IHttpRequest = request.merge(<IHttpRequest> {method: "GET"});
    return this.query(localRequest);
  }


  public post(request: IHttpRequest): Promise<IHttpResponse> {
    const localRequest: IHttpRequest = request.merge(<IHttpRequest> {method: "POST"});
    return this.query(localRequest);
  }


  public put(request: IHttpRequest): Promise<IHttpResponse> {
    const localRequest: IHttpRequest = request.merge(<IHttpRequest> {method: "PUT"});
    return this.query(localRequest);
  }


  public patch(request: IHttpRequest): Promise<IHttpResponse> {
    const localRequest: IHttpRequest = request.merge(<IHttpRequest> {method: "PATCH"});
    return this.query(localRequest);
  }


  public delete(request: IHttpRequest): Promise<IHttpResponse> {
    const localRequest: IHttpRequest = request.merge(<IHttpRequest> {method: "DELETE"});
    return this.query(localRequest);
  }


  public query(request: IHttpRequest): Promise<IHttpResponse> {
    const options = this._getOptions(request);
    return this._request(options)
      .then(
        (response: IncomingMessage) => new HttpResponse({data: this._getData(request, response)}),
        (response: IncomingMessage) => new HttpResponse({error: new Error(response.statusMessage)})
      );
  }

  private _request(options: Options): Promise<IncomingMessage> {
    return new Promise((resolve, reject) => {
      Request(options, (error: any, response: IncomingMessage) => {
        if (!error) {
          if (response.statusCode == 200) {
            resolve(response);
          } else {
            reject(response)
          }
        } else {
          reject(response);
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

  private _getData(request: IHttpRequest, response: IncomingMessage): any {
    return request.json ? JSON.parse(response.statusMessage) : response.statusMessage;
  }
}
