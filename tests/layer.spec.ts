import * as _ from "lodash";
import * as chai from "chai";
import {MOCKS, IServerExpectation, ServerMock, LayerMock} from "./mock";
import {IHttpRequest, HttpRequest} from "../src/http.request";
import {IResponse} from "@elium/mighty-js";

const expect = chai.expect;
let server: ServerMock;
let layerMock: LayerMock;

beforeEach(() => {
  server = new ServerMock();
  layerMock = new LayerMock(server);

  _.forEach(MOCKS, (mock: IServerExpectation) => {
    server.expect(_.clone(mock));
  });
});

const methods = ["get", "post", "patch", "delete", "put"];

describe("Layer", () => {
  _.forEach(methods, (method) => {
    it(`should ${method} a resource`, (done) => {
      const request: IHttpRequest = new HttpRequest(_.assign({}, {
        url: MOCKS[method].url,
        method: MOCKS[method].method
      }));

      layerMock.get(request)
        .then((response: IResponse) => {
          expect(response).to.not.be.undefined;
          expect(response.data).to.deep.equal(MOCKS[method].data);
          done();
        });
      server.respond(request);
    });
  });
});
