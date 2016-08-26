import * as chai from 'chai';
import {HttpRequest, IHttpRequest} from '../src/http.request';

const expect = chai.expect;

const requestLike = <IHttpRequest> {
  url: "/hello",
  data: {a: 1},
  criteria: {b: 2},
  method: "PLOP",
  isArray: false,
  headers: {"toto": "tutu"},
  params: {a: "1"}
};

const request = new HttpRequest({});

describe("HttpRequest", () => {
  it(`should merge a HttpRequest like object`, () => {
    const newRequest = request.merge(requestLike);
    ["url", "data", "criteria", "method", "isArray", "headers", "params"].forEach((prop) => {
      expect(newRequest[prop]).to.deep.equal(requestLike[prop]);
    });
  });

  it(`should only merge defined property`, () => {
    const newRequest = request.merge({url: "/hello", params: null});
    expect(newRequest.url).to.equal("/hello");
    expect(newRequest.method).to.deep.equal(request.method);
    expect(newRequest.data).to.equal(request.data);
    expect(newRequest.params).to.deep.equal(request.params);
  });
});
