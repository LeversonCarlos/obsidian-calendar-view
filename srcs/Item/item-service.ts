import { App, TAbstractFile, TFile } from "obsidian";
import { ItemCache, ItemParser } from ".";
import { Injector } from "../Injector";

export class ItemService {

	public static OnCreate(file: TAbstractFile) {
		if (file instanceof TFile && file.extension === 'md') {
			ItemService.addCache(file);
		}
	};

	public static OnModify(file: TAbstractFile) {
		if (file instanceof TFile && file.extension === 'md') {
			ItemService.removeCache(file);
			ItemService.addCache(file);
		}
	};

	public static OnDelete(file: TAbstractFile) {
		if (file instanceof TFile && file.extension === 'md') {
			ItemService.removeCache(file);
		}
	};

	public static async LoadFiles() {
		Injector
			?.getInstance(ItemCache)
			?.Clear();

		const files = Injector
			?.getInstance(App)
			?.vault
			?.getMarkdownFiles();
		if (!files || files.length === 0)
			return;

		for (const item of files)
			await this.addCache(item);
	}

	private static async addCache(file: TFile) {
		if (!file)
			return;
		const item = await ItemParser.Parse(file);
		if (!item)
			return;
		Injector
			?.getInstance(ItemCache)
			?.Add(item);
	}

	private static removeCache(file: TAbstractFile) {
		if (!file)
			return;
		Injector
			?.getInstance(ItemCache)
			?.Remove(file.path);
	}

}
