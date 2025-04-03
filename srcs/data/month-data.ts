import { App, MarkdownView } from "obsidian";
import { Injector } from "srcs/services";

export class MonthData {

	public constructor() {
		this.Set();
	}

	private _Month: MonthType | null = null;
	public get Month(): MonthType | null {
		return this._Month;
	}
	private set Month(value: MonthType | null) {
		this._Month = value;
	}

	private Set(val: Date | void | null = null): void {
		if (!val)
			val = new Date();
		val = new Date(val.toString());

		this.Month = {
			Start: new Date(val.getFullYear(), val.getMonth(), 1, 0, 0, 0, 0),
			Finish: new Date(val.getFullYear(), val.getMonth() + 1, 0, 23, 59, 59, 999),
			MonthText: (val.getMonth() + 1).toString().padStart(2, '0'),
			YearText: val.getFullYear().toString(),
		};
		console.log('Month', this.Month);
	}

	public NextMonth(): void {
		if (!this.Month) {
			this.Set();
			return;
		}

		let date = this.Month.Start;

		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		if (month > 11) {
			month = 0;
			year += 1;
		}

		date = new Date(year, month, 1);
		this.Set(date);
	}

	public PreviousMonth(): void {
		if (!this.Month) {
			this.Set();
			return;
		}

		let date = this.Month.Start;

		let year = date.getFullYear();
		let month = date.getMonth() - 1;
		if (month < 0) {
			month = 11;
			year -= 1;
		}

		date = new Date(year, month, 1);
		this.Set(date);
	}

	public static NextMonthCallack(id: string): void {
		Injector
			?.getInstance(MonthData)
			?.NextMonth();
		Injector
			?.getInstance(App)
			?.workspace
			?.getActiveViewOfType(MarkdownView)
			?.previewMode
			?.rerender(true);
	}

	public static PreviousMonthCallack(id: string): void {
		Injector
			?.getInstance(MonthData)
			?.PreviousMonth();
		Injector
			?.getInstance(App)
			?.workspace
			?.getActiveViewOfType(MarkdownView)
			?.previewMode
			?.rerender(true);
	}

}

type MonthType = {
	YearText: string;
	MonthText: string;
	Start: Date;
	Finish: Date;
};
