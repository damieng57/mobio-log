export enum TYPE_OS {
	WINDOWS = "win32",
	LINUX = "linux",
	MAC = "darwin"
  }

export interface IMobioOptions {
	before?: boolean;
	after?: boolean;
}

export enum TYPE_COLORS {
	red = "\\x1b[31m",
	green = "\\x1b[32m",
	yellow = "\\x1b[33m",
	blue = "\\x1b[34m",
	magenta = "\\x1b[35m",
	cyan = "\\x1b[36m",
	reset = "\\x1b[0m",
}