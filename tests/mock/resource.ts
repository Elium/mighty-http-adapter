import {IJsonSchema, IResource, Resource, IAdapter, IRecord} from '@elium/mighty-js';
import {RestAdapter} from '../../src/rest.adapter';
import {IDataLayer} from '../../src/layer';
import {MockLayer} from './layer';

export const schema: IJsonSchema = {
  id: "heroes",
  description: "Heroes schema",
  properties: {
    id: {
      type: "number",
      minimum: 1
    },
    name: {type: "string"},
    powers: {
      type: "array",
      items: {type: "string"},
      minItems: 1,
      uniqueItems: true
    }
  }
};

export interface IHeroRecord extends IRecord {
  powers: Array<string>
}

export const layer: IDataLayer = new MockLayer();
export const adapter: IAdapter = new RestAdapter("", layer);
export const resource: IResource<IHeroRecord> = new Resource <IHeroRecord>(schema, adapter);
