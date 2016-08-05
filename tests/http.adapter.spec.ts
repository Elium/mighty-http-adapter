import * as chai from 'chai';
import * as _ from 'lodash';
import {HttpAdapter} from '../src/http.adapter';
import {MockLayer} from './mock/mock.layer';
import {IHeroRecord} from '@elium/mighty-js/lib/tests/mock/hero.data';
import {Store} from '@elium/mighty-js';
import {RankData, IRankRecord, IRank} from './mock/rank.data';
import {HeroData, IHero} from './mock/hero.data';

const expect = chai.expect;

const store = new Store();
const heroData = new HeroData();
const rankData = new RankData();
const heroLayer = new MockLayer(_.cloneDeep(heroData.db));
const rankLayer = new MockLayer(_.cloneDeep(rankData.db));
const heroAdapter = new HttpAdapter("", heroLayer);
const rankAdapter = new HttpAdapter("", rankLayer);
store.setup([
  {schema: heroData.schema, adapter: heroAdapter},
  {schema: rankData.schema, adapter: rankAdapter},
]);
const heroResource = store.getResource <IHeroRecord>(heroData.schema.identity);
const rankResource = store.getResource <IRankRecord>(rankData.schema.identity);

beforeEach(() => {
  heroLayer.rows = _.cloneDeep(heroData.db);
  rankLayer.rows = _.cloneDeep(rankData.db);
});

describe("HttpAdapter", () => {
  it("should create a record", (done) => {
    heroAdapter.create(heroResource, {data: heroData.deadpool})
      .then((response) => {
        const hero = response.data;
        Object.keys(_.omit(heroData.deadpool, ["id"])).forEach((key) => {
          expect(hero).to.have.property(key).that.deep.equal(heroData.deadpool[key]);
        });
        done();
      });
  });

  it("should populate a created record with a single related record", (done) => {
    heroAdapter.create(heroResource, {data: heroData.deadpool, populate: ["rank"]})
      .then((response) => {
        const hero = <IHero> response.data;
        expect(hero).to.have.property("rank");
        expect(hero.rank.id).to.equal(hero.rankId);
        expect(hero.rank.id).to.equal(heroData.deadpool["rankId"]);
        done()
      });
  });

  it("should populate a created record with a list of related records", (done) => {
    rankAdapter.create(rankResource, {data: rankData.deadpool, populate: ["heroes"]})
      .then((response) => {
        const rank = <IRank> response.data;
        expect(rank).to.have.property("heroes");
        expect(Array.isArray(rank.heroes)).to.be.true;
        expect(rank.heroes.length).to.equal(0);
        done()
      });
  });

  it("should find a record", (done) => {
    const source = heroData.db[0];
    heroAdapter.findOne(heroResource, {criteria: {id: source.id}})
      .then((response) => {
        const hero = <IHero> response.data;
        Object.keys(source).forEach((key) => {
          expect(hero).to.have.property(key).that.deep.equal(source[key]);
        });
        done();
      });
  });

  it("should populate a found record with a single related record", (done) => {
    const source = heroData.db[0];
    heroAdapter.findOne(heroResource, {criteria: {id: source.id}, populate: ["rank"]})
      .then((response) => {
        const hero = <IHero> response.data;
        expect(hero).to.have.property("rank");
        expect(hero.rank.id).to.equal(hero.rankId);
        expect(hero.rank.id).to.equal(source["rankId"]);
        done();
      });
  });

  it("should populate a found record with a list of related records", (done) => {
    const source = rankData.db[0];
    const matchingHeroes = _.filter(heroData.db, {rankId: source.id});
    rankAdapter.findOne(rankResource, {criteria: {id: source.id}, populate: ["heroes"]})
      .then((response) => {
        const rank = <IRank> response.data;
        expect(rank).to.have.property("heroes");
        expect(Array.isArray(rank.heroes)).to.be.true;
        expect(rank.heroes.length).to.equal(matchingHeroes.length);
        done();
      });
  });

  it("should find a list of records", (done) => {
    const criteria = (hero) => hero.colors.indexOf("red") > -1;
    heroAdapter.find(heroResource, {criteria: criteria})
      .then((response) => {
        const heroes = <Array<IHero>> response.data;
        expect(Array.isArray(heroes)).to.be.true;
        expect(heroes.length).to.be.above(0);
        done();
      });
  });

  it("should populate a found list of records with a single related record", (done) => {
    const criteria = (hero) => hero.colors.indexOf("red") > -1;
    heroAdapter.find(heroResource, {criteria: criteria, populate: ["rank"]})
      .then((response) => {
        const heroes = <Array<IHero>> response.data;
        heroes.forEach((hero) => {
          expect(hero).to.have.property("rank");
          expect(hero.rank.id).to.equal(hero.rankId);
        });
        done();
      });
  });

  it("should populate a found list of records with a list of related records", (done) => {
    rankAdapter.find(rankResource, {criteria: {}, populate: ["heroes"]})
      .then((response) => {
        const ranks = <Array<IRank>> response.data;
        ranks.forEach((rank) => {
          expect(rank).to.have.property("heroes");
          expect(Array.isArray(rank.heroes)).to.be.true;
        });
        done();
      });
  });

  it("should save a record", (done) => {
    const copy = _.cloneDeep(heroData.db[0]);
    copy.name = "Cyclop";
    heroAdapter.save(heroResource, {data: copy})
      .then((response) => {
        const hero = <IHero> response.data;
        expect(hero.name).to.equal(copy.name);
        done();
      });
  });

  it("should populate a saved record with a single related record", (done) => {
    const copy = _.cloneDeep(heroData.db[0]);
    copy.name = "Cyclop";
    heroAdapter.save(heroResource, {data: copy, populate: ["rank"]})
      .then((response) => {
        const hero = <IHero> response.data;
        expect(hero).to.have.property("rank");
        expect(hero.rank.id).to.equal(hero.rankId);
        done();
      });
  });

  it("should populate a saved record with a list of related records", (done) => {
    const copy = _.cloneDeep(rankData.db[0]);
    copy.name = "legend";
    rankAdapter.save(rankResource, {data: copy, populate: ["heroes"]})
      .then((response) => {
        const rank = <IRank> response.data;
        expect(rank).to.have.property("name").that.equal(copy.name);
        expect(rank).to.have.property("heroes");
        expect(Array.isArray(rank.heroes)).to.be.true;
        done();
      });
  });

  it("should delete a record", (done) => {
    const source = heroData.db[0];
    const sourcesLength = heroLayer.rows.length;
    heroAdapter.destroy(heroResource, {criteria: {id: source.id}})
      .then((response) => {
        const hero = <IHero> response.data;
        expect(hero.id).to.equal(source.id);
        expect(heroLayer.rows.length).to.equal(sourcesLength - 1);
        done();
      });
  });

  it("should populate a deleted record with a single related record", (done) => {
    const source = heroData.db[0];
    heroAdapter.destroy(heroResource, {criteria: {id: source.id}, populate: ["rank"]})
      .then((response) => {
        const hero = <IHero> response.data;
        expect(hero).to.have.property("rank");
        expect(hero.rank.id).to.equal(hero.rankId);
        done();
      });
  });

  it("should populate a deleted record with a list of related records", (done) => {
    const source = rankData.db[0];
    rankAdapter.destroy(rankResource, {criteria: {id: source.id}, populate: ["heroes"]})
      .then((response) => {
        const rank = <IRank> response.data;
        expect(rank).to.have.property("id").that.equal(source.id);
        expect(rank).to.have.property("heroes");
        expect(Array.isArray(rank.heroes)).to.be.true;
        done();
      });
  });
});
