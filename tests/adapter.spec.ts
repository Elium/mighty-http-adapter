import * as chai from 'chai';
import {IHttpRequest, HttpRequest} from '../src/http.request';
import {adapter, resource} from './mock/resource';
import {IHttpResponse} from '../src/http.response';

const expect = chai.expect;
const request: IHttpRequest = new HttpRequest({criteria: {}, data: {}});

const verbs = {
  create: "POST",
  findOne: "GET",
  find: "GET",
  save: "PUT",
  destroy: "DELETE"
};

describe("Adapter", () => {
  it(`should return an Observable of a HttpRespoonse`, () => {
    Object.keys(verbs).forEach((verb) => {
      adapter[verb](resource, request)
        .subscribe((response: IHttpResponse) => {
          const resultRequest = <IHttpRequest> response.data;
          expect(resultRequest.method).to.equal(verbs[verb]);
        });
    });
  });
});
