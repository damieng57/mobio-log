import { EColors } from "./extension.interface";

export interface ISettingsConfig {
  quotes: TYPE_QUOTES;
  prefix: string;
  line: string;
  file: string;
  position: boolean;
  colorEnable: boolean;
  color: EColors;
}

export type IConfig = 'quotes' | 'prefix' | 'line' | 'file' | 'position' | 'color' | 'colorEnable';

export enum TYPE_QUOTES {
  DOUBLE = "\"",
  SINGLE = "'",
  BACKTICK = "`"
}
