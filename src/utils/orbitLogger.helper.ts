import Logger, { LoggerOptions } from '@ptkdev/logger';

export class OrbitLogger {
    private logger: Logger;
    private context: string;

    constructor(context: string, options?: LoggerOptions) {
        this.context = context;
        this.logger = new Logger(options);
    }

    debug(message: string, dump?: any, tag?: string) {
        this.logger.debug(`${message}${dump? '  [DUMP]⏬: ': ''}`, tag || this.context);
        if (dump) {
            console.table(dump);
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
