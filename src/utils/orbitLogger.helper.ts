import Logger, { LoggerOptions } from '@ptkdev/logger';
import fs, { PathLike } from 'fs';
import path from 'path';
import shell from 'shelljs';

export class OrbitLogger {
    private logger: Logger;
    private context: string;
    private logDir = path.join(__dirname, '../logs/');

    private defaultOptions: LoggerOptions = {
        language: "en",
        colors: true,
        debug: true,
        info: true,
        warning: true,
        error: true,
        sponsor: true,
        write: true,
        type: "log",
        rotate: {
            size: "10M",
            encoding: "utf8",
        },
        path: {
            debug_log: path.join(this.logDir, "debug.log"),
            error_log: path.join(this.logDir, "errors.log"),
        },
    };

    constructor(context: string, options?: LoggerOptions) {
        this.context = context;
        this.logger = new Logger(options || this.defaultOptions);
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
            shell.touch(this.defaultOptions?.path?.debug_log as string);
            shell.touch(this.defaultOptions?.path?.error_log as string);
        }
    }

    debug(message: string, dump?: any, tag?: string) {
        this.logger.debug(`${message}${dump ? '  [DUMP]⏬: ' : ''}`, tag || this.context);
        if (dump) {
            this.logger.debug(JSON.stringify(dump));
            // console.table(dump);
        }
    }

    info(message: string, tag?: string) {
        return this.logger.info(message, tag || this.context);
    }

    warning(message: string, tag?: string) {
        return this.logger.warning(message, tag || this.context);
    }

    error(message: string, tag?: string) {
        return this.logger.error(message, tag || this.context);
    }

    sponsor(message: string, tag?: string) {
        return this.logger.sponsor(message, tag || this.context);
    }

    stackoverflow(message: string, error_string?: string, tag?: string) {
        return this.logger.stackoverflow(message, error_string, tag || this.context);
    }

    docs(message: string, url?: string, tag?: string) {
        return this.logger.docs(message, url, tag || this.context);
    }

}
