import * as _ from "lodash";
import * as chai from "chai";
import {server} from "./mock/server";
import {IHttpRequest, HttpRequest} from "../src/http.request";
import {adapter, resource} from "./mock/resource";
import {deadpool} from "./mock/data";
import {IHttpResponse} from "../src/http.response";

const expect = chai.expect;
const deadpoolCreateRequest: IHttpRequest = new HttpRequest({data: deadpool});

describe("Adapter", () => {

  before((done) => {
    server.start((error) => {
      if (error) {
        throw error;
      }
      //console.log('Server started at: ' + server.info.uri);
      done();
    });
  });

  after((done) => {
    server.stop({timeout: 0}, () => {
      //console.log("Server stopped");
      done();
    });
  });

  it(`should create a record`, (done) => {
    adapter.create(resource, deadpoolCreateRequest)
      .subscribe((response: IHttpResponse) => {
        checkDeadpool(response.data);
        done()
      });
  });

  it(`should find a record`, (done) => {
    adapter.create(resource, deadpoolCreateRequest)
      .concatMap((response: IHttpResponse) => adapter.findOne(resource, new HttpRequest({criteria: {id: response.data["id"]}})))
      .subscribe((response: IHttpResponse) => {
        checkDeadpool(response.data);
        done();
      });
  });

  it(`should get all records`, (done) => {
    adapter.create(resource, deadpoolCreateRequest)
      .concatMap((response: IHttpResponse) => adapter.find(resource, new HttpRequest({})))
      .subscribe((response: IHttpResponse) => {
        expect(_.isArray(response.data)).to.be.true;
        done();
      });
  });

  it(`should save a record`, (done) => {
    adapter.create(resource, deadpoolCreateRequest)
      .concatMap((response: IHttpResponse) => {
        const hero = response.data;
        return adapter.save(resource, new HttpRequest({data: _.extend(hero, {name: "lifepool"})}));
      })
      .subscribe((response: IHttpResponse) => {
        const hero = response.data;
        expect(hero).not.to.be.undefined;
        expect(hero).to.have.property("name").that.equals("lifepool");
        done();
      });
  });

  it(`should delete a record`, (done) => {
    adapter.create(resource, deadpoolCreateRequest)
      .concatMap((response: IHttpResponse) => adapter.destroy(resource, new HttpRequest({criteria: {id: response.data["id"]}})))
      .concatMap((response: IHttpResponse) => adapter.findOne(resource, new HttpRequest({criteria: {id: response.data["id"]}})))
      .subscribe((response: IHttpResponse) => {
        expect(response.data).to.be.undefined;
        done();
      });
  });
});

function checkDeadpool(hero) {
  expect(hero).not.to.be.undefined;
  expect(hero).to.have.property("id").that.is.not.undefined;
  expect(hero).to.have.property("name").that.deep.equal(deadpool.name);
  expect(hero).to.have.property("colors").that.deep.equal(deadpool.colors);
  expect(hero).to.have.property("powers").that.deep.equal(deadpool.powers);
}
