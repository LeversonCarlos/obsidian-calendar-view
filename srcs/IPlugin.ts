import { Plugin } from "obsidian";

export interface IPlugin extends Plugin {
	loadData(): Promise<any>;
	saveData(data: any): Promise<void>;
}
