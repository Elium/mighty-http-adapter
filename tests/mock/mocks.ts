import {IJsonSchema} from "@elium/mighty-js";
import {IServerExpectation} from "./server.mock";

const HEROES = [
  {
    id: 1,
    name: "superman",
    powers: ["flight", "strength", "x-rays"],
    colors: ["red", "blue", "yellow"]
  },
  {
    id: 2,
    name: "batman",
    powers: ["technology"],
    colors: ["black", "grey"]
  },
  {
    id: 3,
    name: "ironman",
    powers: ["super armor"],
    colors: ["red", "yellow", "white"]
  }
];

export const schema: IJsonSchema = {
  id: "/hero",
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

export interface IMocks {
  get: IServerExpectation
  post: IServerExpectation
  delete: IServerExpectation
  patch: IServerExpectation
  put: IServerExpectation
}

export const MOCKS: IMocks = {
  get: {
    method: "GET",
    url: "/heroes",
    status: 200,
    params: {},
    data: JSON.stringify(HEROES[0])
  },
  post: {
    method: "POST",
    url: "/heroes",
    status: 200,
    params: {},
    data: JSON.stringify(HEROES[0])
  },
  delete: {
    method: "DELETE",
    url: "/heroes",
    status: 200,
    params: {},
    data: JSON.stringify(HEROES[0])
  },
  patch: {
    method: "PATH",
    url: "/heroes",
    status: 200,
    params: {},
    data: JSON.stringify(HEROES[0])
  },
  put: {
    method: "PUT",
    url: "/heroes",
    status: 200,
    params: {},
    data: JSON.stringify(HEROES[0])
  }
};
