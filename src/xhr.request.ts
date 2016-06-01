import * as _ from "lodash";
import {IRequest, IMap, Request} from "@elium/mighty-js";

export const DataTypes = {
  text: "text/plain",
  json: "application/json"
};
export const ContentTypes = DataTypes;

export type DataType = "text/plain" | "application/json";
export type ContentType = DataType;

export interface IXhrRequest extends IRequest {
  url?: string;
  json?: boolean;
  method?: string;
  params?: IMap<string>;
  headers?: IMap<string>;

  merge?(request: IXhrRequest): IXhrRequest;
}

export class XhrRequest extends Request implements IXhrRequest {
  public url: string;
  public json: boolean;
  public method: string;
  public params: IMap<string>;
  public headers: IMap<string>;

  constructor(config: IXhrRequest) {
    super(config);

    this.url = _.get(config, "url", "");
    this.json = _.get(config, "json", true);
    this.method = _.get(config, "method", "UNKNOWN");
    this.params = _.get(config, "params", <IMap<string>> {});
    this.headers = _.get(config, "headers", <IMap<string>> {});
  }

  public merge(request: IXhrRequest): IXhrRequest {
    return new XhrRequest(_.merge(this, request));
  }
}
