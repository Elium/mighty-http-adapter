import * as _ from "lodash";
import {IRequest, IMap, Request} from "@elium/mighty-js";

export interface IHttpRequest extends IRequest {
  data?: any;
  url?: string;
  json?: boolean;
  method?: string;
  params?: IMap<string>;
  headers?: IMap<string>;

  merge?(request: IHttpRequest): IHttpRequest;
}

export class HttpRequest extends Request implements IHttpRequest {
  public data: any;
  public url: string;
  public json: boolean;
  public method: string;
  public params: IMap<string>;
  public headers: IMap<string>;

  constructor(config: IHttpRequest) {
    super(config);

    this.url = _.get(config, "url", "");
    this.data = _.get(config, "data", null);
    this.json = _.get(config, "json", true);
    this.method = _.get(config, "method", "UNKNOWN");
    this.params = _.get(config, "params", <IMap<string>> {});
    this.headers = _.get(config, "headers", <IMap<string>> {});
  }

  public merge(request: IHttpRequest): IHttpRequest {
    return new HttpRequest(_.merge(this, request));
  }
}
