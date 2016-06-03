import * as _ from "lodash";
import * as chai from "chai";
import {MOCKS, IServerExpectation, ServerMock, schema} from "./mock";
import {IResponse, IResource, Resource, IJsonSchema} from "@elium/mighty-js";
import {IHttpAdapter, HttpAdapter} from "../src/http.adapter";
import {IHttpRequest, HttpRequest} from "../src/http.request";
import {LayerMock} from "./mock/layer.mock";

const expect = chai.expect;
const mockSchema: IJsonSchema = _.cloneDeep(schema);
let resource: IResource;
let server: ServerMock;
let httpMock: LayerMock;
let adapter: IHttpAdapter;

beforeEach(() => {
  server = new ServerMock();
  httpMock = new LayerMock(server);
  adapter = new HttpAdapter(httpMock);
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

describe("Http Adapter", () => {
  _.forEach(methods, (xhrMethod, adapterMethod) => {
    it(`should ${adapterMethod} a resource`, (done) => {
      const request: IHttpRequest = new HttpRequest(_.assign({}, {
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
