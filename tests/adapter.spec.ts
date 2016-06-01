import * as _ from "lodash";
import * as chai from "chai";
import {MOCKS, IServerExpectation, ServerMock, XhrMock, schema} from "./mock";
import {IXhrRequest, XhrRequest} from "../src/xhr.request";
import {IResponse, IResource, Resource, IJsonSchema} from "@elium/mighty-js";
import {IXhrAdapter, XhrAdapter} from "../src/xhr.adapter";

const expect = chai.expect;
const mockSchema: IJsonSchema = _.cloneDeep(schema);
let resource: IResource;
let server: ServerMock;
let xhr: XhrMock;
let adapter: IXhrAdapter;

beforeEach(() => {
  server = new ServerMock();
  xhr = new XhrMock(server);
  adapter = new XhrAdapter(xhr);
  resource = new Resource(mockSchema, adapter);

  _.forEach(MOCKS, (mock: IServerExpectation) => {
    server.expect(_.clone(mock));
  });
});

const methods = {
  "create": "post",
  "find": "get",
  "save": "put",
  "destroy": "delete"
};

describe("Xhr Adapter", () => {
  _.forEach(methods, (xhrMethod, adapterMethod) => {
    it(`should ${adapterMethod} a resource`, (done) => {
      const request: IXhrRequest = new XhrRequest(_.assign({}, {
        url: MOCKS[xhrMethod].url,
        method: MOCKS[xhrMethod].method
      }));

      adapter[adapterMethod](resource, request)
        .then((response: IResponse) => {
          expect(response).to.not.be.undefined;
          expect(response.data).to.deep.equal(MOCKS[xhrMethod].data);
          done();
        });
      server.respond(request);
    });
  });
});
