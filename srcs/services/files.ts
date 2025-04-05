import { App, TAbstractFile, TFile } from "obsidian";
import { ItemParser } from "srcs/Item";
import { Injector } from ".";
import { ItemsData } from "../data";

export class Files {

	public static OnCreate(file: TAbstractFile) {
		if (file instanceof TFile && file.extension === 'md') {
			Files.addCache(file);
		}
	};

	public static OnModify(file: TAbstractFile) {
		if (file instanceof TFile && file.extension === 'md') {
			Files.removeCache(file);
			Files.addCache(file);
		}
	};

	public static OnDelete(file: TAbstractFile) {
		if (file instanceof TFile && file.extension === 'md') {
			Files.removeCache(file);
		}
	};

	public static async LoadFiles() {
		Injector
			?.getInstance(ItemsData)
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
		const item = await Parser.Parse(file);
		if (!item)
			return;
		Injector
			?.getInstance(ItemsData)
			?.Add(item);
	}

	private static removeCache(file: TAbstractFile) {
		if (!file)
			return;
		Injector
			?.getInstance(ItemsData)
			?.Remove(file.path);
	}

}
