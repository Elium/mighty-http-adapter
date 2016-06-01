import * as _ from "lodash";
import * as chai from "chai";
import {MOCKS, IServerExpectation, ServerMock, XhrMock} from "./mock";
import {IXhrRequest, XhrRequest} from "../src/xhr.request";
import {IResponse} from "@elium/mighty-js";

const expect = chai.expect;
let server: ServerMock;
let xhr: XhrMock;

beforeEach(() => {
  server = new ServerMock();
  xhr = new XhrMock(server);

  _.forEach(MOCKS, (mock: IServerExpectation) => {
    server.expect(_.clone(mock));
  });
});

const methods = ["get", "post", "patch", "delete", "put"];

describe("Xhr", () => {
  _.forEach(methods, (method) => {
    it(`should ${method} a resource`, (done) => {
      const request: IXhrRequest = new XhrRequest(_.assign({}, {
        url: MOCKS[method].url,
        method: MOCKS[method].method
      }));

      xhr.get(request)
        .then((response: IResponse) => {
          expect(response).to.not.be.undefined;
          expect(response.data).to.deep.equal(MOCKS[method].data);
          done();
        });
      server.respond(request);
    });
  });
});
