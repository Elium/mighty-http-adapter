import {IXhr, Xhr} from "./xhr";
import {IXhrRequest, XhrRequest} from "./xhr.request";
import {XhrFormatter, IXhrFormatter} from "./xhr.formatter";
import {XhrParser, IXhrParser} from "./xhr.parser";
import {IAdapter, Adapter, IResource, IResponse} from "@elium/mighty-js";

export interface IXhrAdapter extends IAdapter {
  formatter: IXhrFormatter;
  parser: IXhrParser;
}

export class XhrAdapter extends Adapter implements IXhrAdapter {
  private _xhr: IXhr;

  public constructor(xhr?: IXhr, formatter?: IXhrFormatter, parser?: IXhrParser) {
    super(formatter, parser);

    this._xhr = xhr ? xhr : new Xhr();

    if (!formatter && !parser) {
      this._formatter = new XhrFormatter();
      this._parser = new XhrParser();
    }
  }


  public get formatter(): IXhrFormatter {
    return <IXhrFormatter> this._formatter;
  }

  public get parser(): IXhrParser {
    return <IXhrParser> this._parser;
  }


  /**
   * Create a new object.
   * @param resource
   * @param request
   * @return {Promise<IResource>}
   */
  public create(resource: IResource, request: IXhrRequest): Promise<IResponse> {
    const localRequest = new XhrRequest(request);
    const formattedRequest = this._formatter.create(resource, localRequest);

    return this._xhr
      .post(<IXhrRequest> formattedRequest)
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
  public find(resource: IResource, request: IXhrRequest): Promise<IResponse> {
    const localRequest = new XhrRequest(request);
    const formattedRequest = this._formatter.find(resource, localRequest);

    return this._xhr
      .get(<IXhrRequest> formattedRequest)
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
  public save(resource: IResource, request: IXhrRequest): Promise<IResponse> {
    const localRequest = new XhrRequest(request);
    const formattedRequest = this._formatter.save(resource, localRequest);

    return this._xhr
      .put(<IXhrRequest> formattedRequest)
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
  public destroy(resource: IResource, request: IXhrRequest): Promise<IResponse> {
    const localRequest = new XhrRequest(request);
    const formattedRequest = this._formatter.destroy(resource, localRequest);

    return this._xhr
      .delete(<IXhrRequest> formattedRequest)
      .then((response: IResponse) => {
        return this._parser.destroy(resource, response);
      });
  }
}
