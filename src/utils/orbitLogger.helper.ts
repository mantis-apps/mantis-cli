import Logger, { LoggerOptions } from '@ptkdev/logger';

export class OrbitLogger {
    private logger: Logger;
    private context: string;

    constructor(context: string, options?: LoggerOptions) {
        this.context = context;
        this.logger = new Logger(options);
    }

    debug(message: string, tag?: string) {
        this.logger.debug(message, tag || this.context);
    }

    info(message: string, tag?: string) {
        this.logger.info(message, tag || this.context);
    }

    warning(message: string, tag?: string) {
        this.logger.warning(message, tag || this.context);
    }

    error(message: string, tag?: string) {
        this.logger.error(message, tag || this.context);
    }

    sponsor(message: string, tag?: string) {
        this.logger.sponsor(message, tag || this.context);
    }

    stackoverflow(message: string, error_string?: string, tag?: string) {
        this.logger.stackoverflow(message, error_string, tag || this.context);
    }

    docs(message: string, url?: string, tag?: string) {
        this.logger.docs(message, url, tag || this.context);
    }

}
