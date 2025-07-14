import chalk from "chalk";

// Utility untuk logging dengan berbagai level
export class Logger {
  static info(message: string, ...args: any[]) {
    console.log(
      chalk.blue.bold("[INFO]") +
        chalk.white(` ${new Date().toLocaleTimeString()} - ${message}`),
      ...args
    );
  }

  static success(message: string, ...args: any[]) {
    console.log(
      chalk.green.bold("[SUCCESS]") +
        chalk.white(` ${new Date().toLocaleTimeString()} - ${message}`),
      ...args
    );
  }

  static warn(message: string, ...args: any[]) {
    console.warn(
      chalk.yellow.bold("[WARN]") +
        chalk.white(` ${new Date().toLocaleTimeString()} - ${message}`),
      ...args
    );
  }

  static error(message: string, ...args: any[]) {
    console.error(
      chalk.red.bold("[ERROR]") +
        chalk.white(` ${new Date().toLocaleTimeString()} - ${message}`),
      ...args
    );
  }

  static debug(message: string, ...args: any[]) {
    if (process.env.NODE_ENV === "development") {
      console.log(
        chalk.gray.bold("[DEBUG]") +
          chalk.gray(` ${new Date().toLocaleTimeString()} - ${message}`),
        ...args
      );
    }
  }

  static server(message: string, port?: number) {
    console.log(
      chalk.cyan.bold("🚀 [SERVER]") +
        chalk.white(` ${message}`) +
        (port ? chalk.green.bold(` on port ${port}`) : "")
    );
  }

  static database(message: string, ...args: any[]) {
    console.log(
      chalk.magenta.bold("💾 [DB]") +
        chalk.white(` ${new Date().toLocaleTimeString()} - ${message}`),
      ...args
    );
  }

  static request(
    method: string,
    path: string,
    status: number,
    duration: number,
    ip: string
  ) {
    // Color coding berdasarkan status code
    let statusColor;
    if (status >= 500) {
      statusColor = chalk.red.bold;
    } else if (status >= 400) {
      statusColor = chalk.yellow.bold;
    } else if (status >= 300) {
      statusColor = chalk.cyan.bold;
    } else {
      statusColor = chalk.green.bold;
    }

    // Color coding berdasarkan method
    let methodColor;
    switch (method) {
      case "GET":
        methodColor = chalk.blue;
        break;
      case "POST":
        methodColor = chalk.green;
        break;
      case "PUT":
        methodColor = chalk.yellow;
        break;
      case "DELETE":
        methodColor = chalk.red;
        break;
      default:
        methodColor = chalk.gray;
    }

    console.log(
      chalk.gray(`[${new Date().toLocaleTimeString()}]`) +
        " " +
        methodColor.bold(method.padEnd(6)) +
        chalk.white(path.padEnd(30)) +
        statusColor(status.toString().padEnd(5)) +
        chalk.magenta(`${duration}ms`.padEnd(8)) +
        chalk.gray(`${ip}`)
    );
  }

  static middleware(name: string, message: string) {
    console.log(
      chalk.cyan.bold(`[${name.toUpperCase()}]`) + chalk.white(` ${message}`)
    );
  }
}
