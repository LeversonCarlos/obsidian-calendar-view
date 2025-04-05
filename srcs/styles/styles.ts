import stylesCss from "../../dist/styles.css";

export class StylesService {

	public static loadStyles(): void {
		const existing = document.getElementById("obsidian-calendar-view-style");
		if (existing)
			existing.remove();

		const style = document.createElement("style");
		style.id = "obsidian-calendar-view-style";
		style.textContent = stylesCss;
		document.head.appendChild(style);
	}

}
