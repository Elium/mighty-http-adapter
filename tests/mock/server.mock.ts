import * as _ from "lodash";
import {IMap} from "@elium/mighty-js";
import {IHttpRequest} from "../../src/http.request";

export interface IServerExpectation {
  method: string
  url: string
  data: any
  params?: IMap<any>
  status?: number
  promise?: Promise<IServerExpectation>
  resolve?: (value?: IServerExpectation | PromiseLike<IServerExpectation>) => void
  reject?: (reason?: any) => void
}

export interface IServerMock {
  expect(expectation: IServerExpectation)
  register(request: IHttpRequest): Promise<IServerExpectation>
  respond(expectation: IServerExpectation)
}

export class ServerMock {
  public expectations: Array<IServerExpectation>;

  constructor() {
    this.expectations = [];
  }

  public expect(expectation: IServerExpectation) {
    this.expectations.push(expectation);
  }

  public register(request: IHttpRequest): Promise<IServerExpectation> {
    const expectation: IServerExpectation = this._findExpectation(request);
    if (expectation) {
      expectation.promise = new Promise((resolve, reject) => {
        expectation.resolve = resolve;
        expectation.reject = reject;
      });
      return expectation.promise;
    } else {
      throw Error("could not find any suitable expectation");
    }
  }

  public respond(request: IHttpRequest) {
    const expectation: IServerExpectation = this._findExpectation(request);
    if (expectation) {
      expectation.resolve(expectation);
    } else {
      throw Error("could not find any suitable expectation");
    }
  }

  private _findExpectation(request: IHttpRequest): IServerExpectation {
    return _.find(this.expectations, {
      method: request.method,
      url: request.url,
      params: request.params
    });
  }
}
