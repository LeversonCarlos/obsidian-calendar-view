import { ItemModel } from "../Item";

export class ItemsData {
	private _CacheByID: CacheItemType = {};
	private _CacheByDate: CacheListType = {};

	public Add(item: ItemModel[] | ItemModel | null): void {
		if (!item)
			return;
		if (Array.isArray(item)) {
			for (const i of item)
				this.Add_Item(i);
			return;
		}
		this.Add_Item(item);
	}

	private Add_Item(item: ItemModel): void {
		this._CacheByID[item.ID] = item;

		for (const date of item.Dates) {
			const dateKey = ItemsData.GetIsoString(date.Date);
			if (!this._CacheByDate[dateKey]) {
				this._CacheByDate[dateKey] = {};
			}
			this._CacheByDate[dateKey][item.ID] = item;
		}
	}

	public Remove(id: string | null): void {
		if (!id)
			return;

		const itemCache = this._CacheByID[id];
		if (!itemCache)
			return;

		for (const date of itemCache.Dates) {
			const dateKey = ItemsData.GetIsoString(date.Date);

			const dateCache = this._CacheByDate[dateKey];
			if (!dateCache)
				continue;
			delete dateCache[itemCache.ID];

			if (Object.keys(dateCache).length === 0) {
				delete this._CacheByDate[dateKey];
			}
		}

		delete this._CacheByID[itemCache.ID];
	}

	public GetByID(id: string | null): ItemModel | null {
		if (!id)
			return null;
		const item = this._CacheByID[id];
		if (!item)
			return null;
		return item;
	}

	public GetByDate(date: Date | null): ItemModel[] {
		if (!date)
			return [];
		const dateKey = ItemsData.GetIsoString(date);
		const itemCache = this._CacheByDate[dateKey];
		if (!itemCache)
			return [];
		const items = Object.values(itemCache);
		if (!items)
			return [];
		return items;
	}

	public GetByInterval(initialDate: Date | null, finalDate: Date | null): CacheListType | null {
		if (!initialDate || !finalDate)
			return null;

		const initialKey = ItemsData.GetIsoString(initialDate);
		const finalKey = ItemsData.GetIsoString(finalDate);
		const result: CacheListType = {};

		for (const dateKey in this._CacheByDate) {
			if (dateKey < initialKey || dateKey > finalKey)
				continue;
			const itemCache = this._CacheByDate[dateKey];
			if (itemCache) {
				result[dateKey] = itemCache;
			}
		}

		return result;
	}

	public Clear(): void {
		this._CacheByID = {};
		this._CacheByDate = {};
	}

	public Log(): void {
		console.log("CacheByID:", this._CacheByID);
		console.log("CacheByDate:", this._CacheByDate);
	}

	public static GetIsoString(date: Date | null): string {
		if (!date)
			return "";
		return date.toISOString().substring(0, 10);
	}

}

type CacheItemType = Record<string, ItemModel>;
type CacheListType = Record<string, CacheItemType>;
