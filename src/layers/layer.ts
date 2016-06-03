import {IHttpRequest} from "../http.request";
import {IHttpResponse} from "../http.response";

export interface IDataLayer {
  get(request: IHttpRequest): Promise<IHttpResponse>;
  post(request: IHttpRequest): Promise<IHttpResponse>;
  put(request: IHttpRequest): Promise<IHttpResponse>;
  patch(request: IHttpRequest): Promise<IHttpResponse>;
  delete(request: IHttpRequest): Promise<IHttpResponse>;
  query(request: IHttpRequest): Promise<IHttpResponse>;
}
