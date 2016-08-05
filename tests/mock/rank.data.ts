import {IRecord, ISchema} from '@elium/mighty-js';
import {IHero} from '@elium/mighty-js/lib/tests/mock/hero.data';

export interface IRank {
  id: number
  name: string
  heroes?: Array<IHero>
}

export interface IRankRecord extends IRank, IRecord {}

export class RankData {
  schema: ISchema = {
    identity: "ranks",
    properties: {
      id: {
        type: "number"
      },
      name: {
        type: "string",
        defaultsTo: "God"
      }
    },
    relations: {
      heroes: {
        type: "array",
        identity: "heroes",
        viaColumn: "rankId"
      }
    }
  };

  db: Array<IRank> = [
    {
      id: 1,
      name: "god"
    },
    {
      id: 2,
      name: "master"
    },
    {
      id: 3,
      name: "emperor"
    }
  ];

  deadpool: {
    name: "awesome"
  }
}
