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
  find: IServerExpectation
  findOne: IServerExpectation
  create: IServerExpectation
  save: IServerExpectation
  destroy: IServerExpectation
}

export const MOCKS: IMocks = {
  findOne: {
    method: "GET",
    url: "/heroes/1",
    status: 200,
    params: {},
    data: JSON.stringify(HEROES[0])
  },
  find: {
    method: "GET",
    url: "/heroes",
    status: 200,
    params: {},
    data: JSON.stringify([HEROES[0], HEROES[2]])
  },
  create: {
    method: "POST",
    url: "/heroes",
    status: 200,
    params: {},
    data: JSON.stringify(HEROES[0])
  },
  destroy: {
    method: "DELETE",
    url: "/heroes",
    status: 200,
    params: {},
    data: JSON.stringify(HEROES[0])
  },
  save: {
    method: "PUT",
    url: "/heroes",
    status: 200,
    params: {},
    data: JSON.stringify(HEROES[0])
  }
};
