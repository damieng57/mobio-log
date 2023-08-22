export interface ISettingsConfig {
  quotes: TYPE_QUOTES;
  prefix: string;
  line: string;
  file: string;
}

export type IConfig = 'quotes' | 'prefix' | 'line' | 'file';

export enum TYPE_QUOTES {
  DOUBLE = "\"",
  SINGLE = "'",
  BACKTICK = "`"
}
