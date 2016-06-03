import {IParser, Parser} from "@elium/mighty-js";

export interface IHttpParser extends IParser {}

export class HttpParser extends Parser implements IHttpParser {}
