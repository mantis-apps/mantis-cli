import { OrbitLogger } from "../utils/orbitLogger.helper";

export const startAction = async () => {
    // Logic for the action
    const matarLogger = new OrbitLogger('DSN');

    matarLogger.info('Hello World !');
};


