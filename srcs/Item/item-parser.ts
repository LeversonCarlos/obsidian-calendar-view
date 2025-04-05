import { App, FrontMatterCache, TFile } from "obsidian";
import { DateModel, ItemModel } from ".";
import { Injector } from "../Injector";
import { SettingsModel } from "../settings";

export class ItemParser {

	public static async Parse(file: TFile | null): Promise<ItemModel | null> {
		if (!file)
			return null;

		const app = Injector.getInstance(App);
		if (!app)
			return null;

		const frontmatter = ItemParser.GetFrontmatter(app, file);
		if (!frontmatter)
			return null;

		const settings = Injector
			?.getInstance(SettingsModel);

		const dates = ItemParser.GetDates(file, frontmatter, settings);
		if (!dates)
			return null;

		const item = new ItemModel();
		item.ID = file.path;
		item.Title = file.basename;
		item.Dates = dates;
		item.Image = await ItemParser.GetImage(app, file, frontmatter, settings);
		return item;
	}

	private static GetFrontmatter(app: App, file: TFile): FrontMatterCache | null {
		const metadata = app
			?.metadataCache
			?.getFileCache(file);
		if (!metadata)
			return null;

		const frontmatter = metadata
			?.frontmatter;
		if (!frontmatter)
			return null;

		return frontmatter;
	}

	private static GetDates(file: TFile, frontMatter: FrontMatterCache, settings: SettingsModel): DateModel[] | null {
		const dates: DateModel[] = [];

		const columnNames = settings
			?.DatesPropertyName;
		if (columnNames == null || columnNames.length == 0)
			return null;

		for (const columnName of columnNames) {
			const columnDates = ItemParser.GetDatesForColumn(file, frontMatter, columnName);
			if (columnDates)
				dates.push(...columnDates);
		}

		if (dates.length === 0)
			return null;

		return dates;
	}

	private static GetDatesForColumn(file: TFile, frontMatter: FrontMatterCache, columnName: string): DateModel[] | null {
		const columnValue = frontMatter[columnName];
		if (!columnValue)
			return null;

		const getDate = (date: Date | string | null | undefined): Date | null => {
			try {
				if (!date)
					return null;
				if (date instanceof Date)
					return date;
				if (typeof date === 'string') {
					const parsedDate = new Date(date);
					if (!isNaN(parsedDate.getTime()))
						return parsedDate;
					return null;
				}
				return null;
			}
			catch (error) { return null; }
		}

		if (Array.isArray(columnValue))
			return columnValue
				.map(d => getDate(d))
				.filter((d): d is Date => d !== null)
				.map(d => DateModel.Create(columnName, d));

		const date = getDate(columnValue);
		if (!date)
			return null;
		return [DateModel.Create(columnName, date)];
	}

	private static async GetImage(app: App, file: TFile, frontMatter: FrontMatterCache, settings: SettingsModel): Promise<string | null> {
		const columnName = settings.ImagePropertyName;
		if (!columnName)
			return null;
		let imagePath = frontMatter[columnName];
		if (imagePath)
			return imagePath;

		const body = await app.vault.read(file);

		const pattern = new RegExp(`^${columnName}::\\s*(.+)$`, 'm');
		const match = body.match(pattern);

		imagePath = match ? match[1].trim() : null;
		if (imagePath)
			return imagePath;

		return null;
	}

}
