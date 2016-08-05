import * as _ from 'lodash';
import {IDataLayer} from '../../src/layer';
import {IHttpRequest} from '../../src/http.request';
import {IHttpResponse, HttpResponse} from '../../src/http.response';
import {MockLayer} from './mock.layer';
import {IHero} from '@elium/mighty-js/lib/tests/mock/hero.data';

export class RankMockLayer<T> extends MockLayer<T> implements IDataLayer {
  public heroes: Array<IHero>;

  constructor(rows: Array<T>, heroes: Array<IHero>) {
    super(rows);
    this.heroes = heroes;
  }

  find(request: IHttpRequest): Promise<IHttpResponse> {
    let rows;
    const parts = request.url.split("/");
    return new Promise((resolve) => {
      // /ranks/:id/heroes
      if (parts.length === 4) {
        rows = _.filter(this.heroes, {rankId: parseInt(`${parts[2]}`)});
      } // /ranks
      else {
        rows = _.filter(this.rows, request.criteria);
      }
      resolve(new HttpResponse({data: _.cloneDeep(rows)}));
    });
  }
}

