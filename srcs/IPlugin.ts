import { App, Plugin } from "obsidian";

export interface IPlugin extends Plugin {
	app: App;

	loadData(): Promise<any>;
	saveData(data: any): Promise<void>;
}
