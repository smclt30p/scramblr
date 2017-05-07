class Interval {

    private interval: number = 0;
    private counter: number = 0;
    private callback = undefined;
    private time: number = undefined;

    public start(): void {
        this.interval = setInterval(this.callback, this.time);
    };

    public cancel(): void {
        clearInterval(this.interval);
    };

    public ping(): void {
        this.counter = this.counter + 1;
    };

    public getCount(): number {
        return this.counter;
    };

    public setCallback(callback: () => void): void {
        this.callback = callback;
    };

    public setTime(time: number): void {
        this.time = time;
    }

}