import {IParser, Parser} from "@elium/mighty-js";

export interface IXhrParser extends IParser {}

export class XhrParser extends Parser implements IXhrParser {}
