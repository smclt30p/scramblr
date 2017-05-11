/// <reference path="Logger.ts"/>
/// <reference path="DocumentManager.ts"/>
///<reference path="YoutubeDOM.ts"/>
///<reference path="ModuleManager.ts"/>

class Extension {

    private spadom: DocumentManager;
    private modulemanager: ModuleManager;
    private modules: Module[];

    public main(): void {

        Logger.info("Scramblr v1.0 loaded!");

        this.spadom = DocumentManager.getInstance();
        this.modulemanager = new ModuleManager();

        this.modules = this.modulemanager.getLoadedModules();

        this.modulemanager.readAllModuleSettings(() => {

            try {

                YouTubeDOM.injectUserInterface();

                for (let i = 0; i < this.modules.length; i++) {
                    this.modules[i].init(this.spadom, YouTubeDOM.getCurrentPage());
                }

                this.spadom.observeContent(() => {

                    for (let i = 0; i < this.modules.length; i++) {
                        this.modules[i].service(this.spadom, YouTubeDOM.getCurrentPage());
                    }

                });

            } catch (e) {
                Logger.error("Unexpected error occurred: " + e.message);
            }

        });


    }
}


new Extension().main();