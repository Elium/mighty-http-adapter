import {IResource, IFormatter} from "@elium/mighty-js";
import {IHttpRequest} from "./http.request";

export interface IHttpFormatter extends IFormatter {
  create(resource: IResource, request: IHttpRequest): IHttpRequest;
  find(resource: IResource, request: IHttpRequest): IHttpRequest;
  save(resource: IResource, request: IHttpRequest): IHttpRequest;
  destroy(resource: IResource, request: IHttpRequest): IHttpRequest;
}

export class HttpFormatter implements IHttpFormatter {

  public create(resource: IResource, request: IHttpRequest): IHttpRequest {
    return request;
  }

  public find(resource: IResource, request: IHttpRequest): IHttpRequest {
    return request;
  }

  public save(resource: IResource, request: IHttpRequest): IHttpRequest {
    return request;
  }

  public destroy(resource: IResource, request: IHttpRequest): IHttpRequest {
    return request;
  }
}
