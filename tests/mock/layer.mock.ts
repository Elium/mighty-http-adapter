import {IResponse, Response} from "@elium/mighty-js";
import {IServerMock, IServerExpectation} from "./server.mock";
import {XhrLayer} from "../../src/layers/xhr.layer";
import {IHttpRequest, HttpRequest} from "../../src/http.request";


export class LayerMock extends XhrLayer{

  public server: IServerMock;

  constructor(server: IServerMock) {
    super();
    this.server = server;
  }

  protected _query(request: IHttpRequest): Promise<IResponse> {
    const localRequest = new HttpRequest(request);
    return this.server
      .register(localRequest)
      .then((expectation: IServerExpectation) => new Response({data: expectation.data}));
  }
}
