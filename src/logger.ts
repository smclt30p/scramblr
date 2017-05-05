class Logger {

    public static verboseLogging: boolean = true;

    public static error(data: string): void {
        console.error("[%c ERROR %c] " + data, "color: red", "color:black");
    }

    public static info(data: string): void {
        console.info("[%c INFO %c] " + data, "color: blue", "color:black");
    }

    public static verbose(data: string): void {
        if (!this.verboseLogging) return;
        console.log("[%c VERBOSE %c] " + data, "color: purple", "color:black");
    }

}