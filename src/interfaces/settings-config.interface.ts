export interface ISettingsConfig {
  quotes: TYPE_QUOTES;
  prefix: string;
  line: string;
  file: string;
  position: boolean;
}

export type IConfig = 'quotes' | 'prefix' | 'line' | 'file' | 'position';

export enum TYPE_QUOTES {
  DOUBLE = "\"",
  SINGLE = "'",
  BACKTICK = "`"
}
