import {IJsonSchema, IResource, Resource, IAdapter} from "@elium/mighty-js";
import {RequestLayer} from "../../src/layers/request.layer";
import {IDataLayer} from "../../src/layers/layer";
import {url} from "./server";
import {RestAdapter} from "../../src/rest.adapter";

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

export const layer: IDataLayer = new RequestLayer();
export const adapter: IAdapter = new RestAdapter(url, layer);
export const resource: IResource = new Resource(schema, adapter);
