import * as chai from 'chai';
import * as _ from 'lodash';
import {HttpAdapter} from '../src/http.adapter';
import {MockLayer} from './mock/mock.layer';
import {HeroData, IHero} from './mock/hero.data';
import {HttpRequest} from '../src/http.request';

const expect = chai.expect;
const heroData = new HeroData();
const heroLayer = new MockLayer(_.cloneDeep(heroData.db));

beforeEach(() => {
  heroLayer.rows = _.cloneDeep(heroData.db);
});

describe("HttpAdapter", () => {
  it("should create a record", (done) => {
    heroLayer.create({data: heroData.deadpool})
      .then((response) => {
        const hero = response.data;
        Object.keys(_.omit(heroData.deadpool, ["id"])).forEach((key) => {
          expect(hero).to.have.property(key).that.deep.equal(heroData.deadpool[key]);
        });
        done();
      });
  });

  it("should find a record", (done) => {
    const source = heroData.db[0];
    heroLayer.findOne({criteria: {id: source.id}})
      .then((response) => {
        const hero = <IHero> response.data;
        Object.keys(source).forEach((key) => {
          expect(hero).to.have.property(key).that.deep.equal(source[key]);
        });
        done();
      });
  });

  it("should find a list of records", (done) => {
    const criteria = (hero) => hero.colors.indexOf("red") > -1;
    heroLayer.find({criteria: criteria})
      .then((response) => {
        const heroes = <Array<IHero>> response.data;
        expect(Array.isArray(heroes)).to.be.true;
        expect(heroes.length).to.be.above(0);
        done();
      });
  });

  it("should save a record", (done) => {
    const copy = _.cloneDeep(heroData.db[0]);
    copy.name = "Cyclop";
    heroLayer.save({data: copy})
      .then((response) => {
        const hero = <IHero> response.data;
        expect(hero.name).to.equal(copy.name);
        done();
      });
  });

  it("should delete a record", (done) => {
    const source = heroData.db[0];
    const sourcesLength = heroLayer.rows.length;
    heroLayer.destroy({criteria: {id: source.id}})
      .then((response) => {
        const hero = <IHero> response.data;
        expect(hero.id).to.equal(source.id);
        expect(heroLayer.rows.length).to.equal(sourcesLength - 1);
        done();
      });
  });
});
