import * as _ from "lodash";
import {IAdapter, Adapter, IResource, IResponse} from "@elium/mighty-js";
import {IHttpParser, HttpParser} from "./http.parser";
import {IHttpFormatter, HttpFormatter} from "./http.formatter";
import {IHttpRequest, HttpRequest} from "./http.request";
import {IDataLayer} from "./layers/layer";
import {XhrLayer} from "./layers/xhr.layer";
import {RequestLayer} from "./layers/request.layer";

export interface IHttpAdapter extends IAdapter {
  formatter: IHttpFormatter;
  parser: IHttpParser;
}

export class HttpAdapter extends Adapter implements IHttpAdapter {
  private _dataLayer: IDataLayer;

  public constructor(dataLayer?: IDataLayer, formatter?: IHttpFormatter, parser?: IHttpParser) {
    super(formatter, parser);

    if (_.isObject(dataLayer)) {
      this._dataLayer = dataLayer;
    } else if (!_.isUndefined(XMLHttpRequest)) {
      this._dataLayer = new XhrLayer();
    } else if (!_.isUndefined(process)) {
      this._dataLayer = new RequestLayer();
    }

    if (!formatter) {
      this._formatter = new HttpFormatter();
    }

    if(!parser) {
      this._parser = new HttpParser();
    }
  }


  public get formatter(): IHttpFormatter {
    return <IHttpFormatter> this._formatter;
  }

  public get parser(): IHttpParser {
    return <IHttpParser> this._parser;
  }


  /**
   * Create a new object.
   * @param resource
   * @param request
   * @return {Promise<IResource>}
   */
  public create(resource: IResource, request: IHttpRequest): Promise<IResponse> {
    const localRequest = new HttpRequest(request);
    const formattedRequest = this._formatter.create(resource, localRequest);

    return this._dataLayer
      .post(<IHttpRequest> formattedRequest)
      .then((response: IResponse) => {
        return this._parser.create(resource, response);
      });
  }


  /**
   * Get all entries matching the specific .
   * @param resource
   * @param request
   * @return {Promise<Array<IResource>>}
   */
  public find(resource: IResource, request: IHttpRequest): Promise<IResponse> {
    const localRequest = new HttpRequest(request);
    const formattedRequest = this._formatter.find(resource, localRequest);

    return this._dataLayer
      .get(<IHttpRequest> formattedRequest)
      .then((response: IResponse) => {
        return this._parser.find(resource, response);
      });
  }


  /**
   * Update the specified
   * @param resource
   * @param request
   * @return {Promise<IResource>}
   */
  public save(resource: IResource, request: IHttpRequest): Promise<IResponse> {
    const localRequest = new HttpRequest(request);
    const formattedRequest = this._formatter.save(resource, localRequest);

    return this._dataLayer
      .put(<IHttpRequest> formattedRequest)
      .then((response: IResponse) => {
        return this._parser.save(resource, response);
      });
  }


  /**
   * Remove the specified entry
   * @param resource
   * @param request
   * @return {Promise<IResource>}
   */
  public destroy(resource: IResource, request: IHttpRequest): Promise<IResponse> {
    const localRequest = new HttpRequest(request);
    const formattedRequest = this._formatter.destroy(resource, localRequest);

    return this._dataLayer
      .delete(<IHttpRequest> formattedRequest)
      .then((response: IResponse) => {
        return this._parser.destroy(resource, response);
      });
  }
}