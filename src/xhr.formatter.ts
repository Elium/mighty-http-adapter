import {IXhrRequest} from "./xhr.request";
import {IResource, IFormatter} from "@elium/mighty-js";

export interface IXhrFormatter extends IFormatter {
  create(resource: IResource, request: IXhrRequest): IXhrRequest;
  find(resource: IResource, request: IXhrRequest): IXhrRequest;
  save(resource: IResource, request: IXhrRequest): IXhrRequest;
  destroy(resource: IResource, request: IXhrRequest): IXhrRequest;
}

export class XhrFormatter implements IXhrFormatter {

  public create(resource: IResource, request: IXhrRequest): IXhrRequest {
    return request;
  }

  public find(resource: IResource, request: IXhrRequest): IXhrRequest {
    return request;
  }

  public save(resource: IResource, request: IXhrRequest): IXhrRequest {
    return request;
  }

  public destroy(resource: IResource, request: IXhrRequest): IXhrRequest {
    return request;
  }
}
