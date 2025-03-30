import { ItemModel } from "../models";

export class Cache {
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
			const dateKey = date.Date.toISOString();
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
			const dateKey = date.Date.toISOString();

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

	public Clear(): void {
		this._CacheByID = {};
		this._CacheByDate = {};
	}

}

type CacheItemType = Record<string, ItemModel>;
type CacheListType = Record<string, CacheItemType>;
