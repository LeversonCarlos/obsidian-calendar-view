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
		console.log('date1', val);
		if (!val)
			val = new Date();
		console.log('date2', val);
		val = new Date(val.toString());
		console.log('date3', val);
		this.Month = {
			Start: new Date(val.getFullYear(), val.getMonth(), 1, 0, 0, 0, 0),
			Finish: new Date(val.getFullYear(), val.getMonth() + 1, 0, 23, 59, 59, 999),
			MonthText: (val.getMonth() + 1).toString().padStart(2, '0'),
			YearText: val.getFullYear().toString(),
		};
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

}

type MonthType = {
	YearText: string;
	MonthText: string;
	Start: Date;
	Finish: Date;
};
