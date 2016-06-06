import {IHttpRequest} from "../http.request";
import {IHttpResponse} from "../http.response";

export interface IDataLayer {
  create(request: IHttpRequest): Promise<IHttpResponse>;
  save(request: IHttpRequest): Promise<IHttpResponse>;
  find(request: IHttpRequest): Promise<IHttpResponse>;
  findOne(request: IHttpRequest): Promise<IHttpResponse>;
  destroy(request: IHttpRequest): Promise<IHttpResponse>;
}
