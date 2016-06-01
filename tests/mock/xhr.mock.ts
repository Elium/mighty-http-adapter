import {Xhr} from "../../src/xhr";
import {IXhrRequest, XhrRequest} from "../../src/xhr.request";
import {IResponse, Response} from "@elium/mighty-js";
import {IServerMock, IServerExpectation} from "./server.mock";


export class XhrMock extends Xhr {

  public server: IServerMock;

  constructor(server: IServerMock) {
    super();
    this.server = server;
  }

  public query(request: IXhrRequest): Promise<IResponse> {
    const localRequest = new XhrRequest(request);
    return this.server
      .register(localRequest)
      .then((expectation: IServerExpectation) => {
        return new Response({data: expectation.data});
      });
  }
}
