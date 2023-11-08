import { TYPE_COLORS } from "./extension.interface";

export interface ISettingsConfig {
  quotes: TYPE_QUOTES;
  prefix: string;
  line: string;
  file: string;
  position: boolean;
  semicolon: string;
  colorEnable: boolean;
  color: TYPE_COLORS;
}

export type IConfig = 'quotes' | 'prefix' | 'line' | 'file' | 'position' | 'color' | 'colorEnable' | 'semicolon';

export enum TYPE_QUOTES {
  DOUBLE = "\"",
  SINGLE = "'",
  BACKTICK = "`"
}
