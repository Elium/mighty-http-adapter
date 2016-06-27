import * as _ from "lodash";
import {IRequest, IMap, Request} from "@elium/mighty-js";

export interface IHttpRequest extends IRequest {
  data?: any;
  url?: string;
  method?: string;
  isArray?: boolean;
  params?: IMap<string>;
  headers?: IMap<string>;

  merge?(request: IHttpRequest): IHttpRequest;
}

export class HttpRequest extends Request implements IHttpRequest {
  public data: any;
  public url: string;
  public method: string;
  public isArray: boolean;
  public params: IMap<string>;
  public headers: IMap<string>;

  constructor(config: IHttpRequest) {
    super(config);

    this.url = _.get(config, "url", undefined);
    this.data = _.get(config, "data", undefined);
    this.method = _.get(config, "method", "UNKNOWN");
    this.isArray = _.get(config, "isArray", false);
    this.params = _.get(config, "params", <IMap<string>> {});
    this.headers = _.get(config, "headers", <IMap<string>> {});
  }

  public merge(request: IHttpRequest): IHttpRequest {
    return new HttpRequest(_.merge(this, request));
  }
}
