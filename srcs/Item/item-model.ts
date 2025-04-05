import { DateModel } from ".";

export class ItemModel {
	public ID: string;
	public Title: string;
	public Image: string | null;

	public Dates: DateModel[];
}
