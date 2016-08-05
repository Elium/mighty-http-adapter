import * as chai from 'chai';
import * as _ from 'lodash';
import {Store} from '@elium/mighty-js';
import {RankData, IRankRecord, IRank} from './mock/rank.data';
import {HeroData} from './mock/hero.data';
import {RestAdapter} from '../src/rest.adapter';
import {MockLayer} from './mock/mock.layer';
import {RankMockLayer} from './mock/rank.mock.layer';

const expect = chai.expect;

const store = new Store();
const heroData = new HeroData();
const rankData = new RankData();
const heroLayer = new MockLayer(_.cloneDeep(heroData.db));
const rankLayer = new RankMockLayer(_.cloneDeep(rankData.db), _.cloneDeep(heroData.db));
const heroAdapter = new RestAdapter("", heroLayer);
const rankAdapter = new RestAdapter("", rankLayer);
store.setup([
  {schema: heroData.schema, adapter: heroAdapter},
  {schema: rankData.schema, adapter: rankAdapter},
]);
const rankResource = store.getResource <IRankRecord>(rankData.schema.identity);

beforeEach(() => {
  heroLayer.rows = _.cloneDeep(heroData.db);
  rankLayer.rows = _.cloneDeep(rankData.db);
  rankLayer.heroes = _.cloneDeep(heroData.db);
});

describe("RestAdapter", () => {
  it("should populate a found record with a list of related records", (done) => {
    const source = rankData.db[0];
    rankAdapter.findOne(rankResource, {criteria: {id: source.id}, populate: ["heroes"]})
      .then((response) => {
        const rank = <IRank> response.data;
        expect(rank).to.have.property("heroes");
        expect(Array.isArray(rank.heroes)).to.be.true;
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
});
