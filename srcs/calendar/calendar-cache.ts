import { App, MarkdownView } from "obsidian";
import { Injector } from "../Injector";

export class CalendarCache {
	private _MonthByID: MonthDict = {};

	public Get(id: string | null): MonthType | null {
		if (!id)
			return null;
		let month = this._MonthByID[id];
		if (!month) {
			month = this.Create(new Date());
			this._MonthByID[id] = month;
		}
		return month;
	}

	private Set(id: string, val: Date): void {
		const month = this.Create(val);
		this._MonthByID[id] = month;
	}

	private Create(val: Date): MonthType {
		return {
			Start: new Date(val.getFullYear(), val.getMonth(), 1, 0, 0, 0, 0),
			Finish: new Date(val.getFullYear(), val.getMonth() + 1, 0, 23, 59, 59, 999),
			MonthText: (val.getMonth() + 1).toString().padStart(2, '0'),
			YearText: val.getFullYear().toString(),
		};
	}

	public NextMonth(id: string | null): void {
		if (!id)
			return;

		let monthType = this.Get(id);
		if (!monthType)
			return;

		let date = monthType.Start;
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		if (month > 11) {
			month = 0;
			year += 1;
		}

		date = new Date(year, month, 1);
		this.Set(id, date);
	}

	public PreviousMonth(id: string | null): void {
		if (!id)
			return;

		let monthType = this.Get(id);
		if (!monthType)
			return;

		let date = monthType.Start;
		let year = date.getFullYear();
		let month = date.getMonth() - 1;
		if (month < 0) {
			month = 11;
			year -= 1;
		}

		date = new Date(year, month, 1);
		this.Set(id, date);
	}

	public static NextMonthCallack(id: string): void {
		Injector
			?.getInstance(CalendarCache)
			?.NextMonth(id);
		Injector
			?.getInstance(App)
			?.workspace
			?.getActiveViewOfType(MarkdownView)
			?.previewMode
			?.rerender(true);
	}

	public static PreviousMonthCallack(id: string): void {
		Injector
			?.getInstance(CalendarCache)
			?.PreviousMonth(id);
		Injector
			?.getInstance(App)
			?.workspace
			?.getActiveViewOfType(MarkdownView)
			?.previewMode
			?.rerender(true);
	}

}

type MonthDict = Record<string, MonthType>;
type MonthType = {
	YearText: string;
	MonthText: string;
	Start: Date;
	Finish: Date;
};
