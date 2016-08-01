import {IRequest, IMap, Request} from '@elium/mighty-js';
import * as _ from "lodash";

export interface IHttpRequest extends IRequest {
  data?: any;
  url?: string;
  method?: string;
  isArray?: boolean;
  params?: IMap<string>;
  headers?: IMap<string>;
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
    config = config || {};

    this.url = config.url;
    this.data = config.data;
    this.method = config.method || "UNKNOWN";
    this.isArray = config.isArray === true;
    this.params = config.params || <IMap<string>> {};
    this.headers = config.headers || <IMap<string>> {};
  }

  public merge(request: IHttpRequest): HttpRequest {
    return new HttpRequest(_.merge({}, this, request));
  }
}
