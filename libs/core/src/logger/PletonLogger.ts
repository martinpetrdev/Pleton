import chalk from "chalk";
import * as util from "node:util";

export enum LogLevel {
  Info = "info",
  Warning = "warn",
  Error = "error",
}

export class PletonLogger {
  constructor(private readonly component: string) {}

  public info(...args: any[]): void {
    this.log(LogLevel.Info, args);
  }

  private log(level: LogLevel, args: any[]): void {
    console.log(
      `${this.formatLevel(level)} ${chalk.gray(new Date().toLocaleString())} ${chalk.green(`[${this.component}]`)}`,
      ...args.map((arg) =>
        chalk.yellow(typeof arg !== "string" ? util.inspect(arg) : arg),
      ),
    );
  }

  private formatLevel(level: LogLevel) {
    const colors = {
      [LogLevel.Info]: "bgBlue",
      [LogLevel.Warning]: "bgYellow",
      [LogLevel.Error]: "bgRed",
    } as const;

    return (
      chalk.black[colors[level]](` ${level} `) +
      new Array(5 - level.length).fill(" ").join("")
    );
  }
}
