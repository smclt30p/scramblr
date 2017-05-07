interface BrowserAPI {
    getURIFromLocalFile(filepath: string) : string;
    writeSetting(key: string, value: string) : void
    readSetting(key: string, def: string, callback: (value: any) => void) : void;
}