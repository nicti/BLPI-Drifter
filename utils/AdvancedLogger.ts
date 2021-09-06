import simpleLogger, {Logger, STANDARD_LEVELS} from 'simple-node-logger'

export default class AdvancedLogger {

    private chatLog: Logger|null = null;
    private appLog: Logger|null = null;


    constructor() {
        this.chatLog = simpleLogger.createSimpleFileLogger('./logs/chat.log');
        this.appLog = simpleLogger.createSimpleFileLogger('./logs/app.log');
    }

    public logChat(msg: string, level: STANDARD_LEVELS = 'info') {
        this.chatLog?.log(level, msg)
    }

    public logApp(level: STANDARD_LEVELS, msg: string) {
        this.appLog?.log(level, msg);
    }

    public fatal(msg: string) {
        this.logApp('fatal', msg);
    }

    public error(msg: string) {
        this.logApp('error', msg);
    }

    public warn(msg: string) {
        this.logApp('warn', msg);
    }

    public info(msg: string) {
        this.logApp('info', msg);
    }

    public debug(msg: string) {
        this.logApp('debug', msg);
    }



}