import { App, FrontMatterCache, TFile } from "obsidian";
import { DateModel, ItemModel } from "srcs/models";
import { Injector } from ".";

export class Parser {

	public static async Parse(file: TFile | null): Promise<ItemModel | null> {
		if (!file)
			return null;

		const app = Injector.getInstance(App);
		if (!app)
			return null;

		const frontmatter = Parser.GetFrontmatter(app, file);
		if (!frontmatter)
			return null;

		const dates = Parser.GetDates(file, frontmatter);
		if (!dates)
			return null;

		const item = new ItemModel();
		item.ID = file.path;
		item.Title = file.basename;
		item.Dates = dates;
		item.Image = await Parser.GetImage(app, file, frontmatter);
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

	private static GetDates(file: TFile, frontMatter: FrontMatterCache): DateModel[] | null {
		const dates: DateModel[] = [];

		const columnNames = ['Compra', 'Publicação', 'Leitura'];
		for (const columnName of columnNames) {
			const columnDates = Parser.GetDatesForColumn(file, frontMatter, columnName);
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

	private static async GetImage(app: App, file: TFile, frontMatter: FrontMatterCache): Promise<string | null> {
		let imagePath = frontMatter['Capa'];
		if (imagePath)
			return imagePath;

		const body = await app.vault.read(file);

		const match = body.match(/^Capa::\s*(.+)$/m);
		imagePath = match ? match[1].trim() : null;
		if (imagePath)
			return imagePath;

		return null;
	}

}
