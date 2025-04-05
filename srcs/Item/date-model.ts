export class DateModel {
	public Type: string;
	public Date: Date;

	public static Create(type: string, date: Date): DateModel {
		const dateModel = new DateModel();
		dateModel.Type = type;
		dateModel.Date = date;
		return dateModel;
	}
}
