export interface NewspaperIssue {
	id: string
	number: number
	/** Publication date in YYYY-MM-DD format. */
	publishedAt: string
	/** Page images in reading order. The first image is the front page. */
	pages: string[]
}

export interface NewspaperPublication {
	id: string
	/** Translation key shared by all supported locales. */
	titleKey: string
	descriptionKey?: string
	backgroundSrc?: string
	issues: NewspaperIssue[]
}

/** Real publications only. See docs/NEWSPAPERS.md before adding an issue. */
export const newspaperPublications: NewspaperPublication[] = []
