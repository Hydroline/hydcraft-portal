export interface NewspaperIssue {
	id: string
	number: number
	/** Publication date in YYYY-MM-DD format. */
	publishedAt: string
	/** Smaller front-page image used by galleries and the intro entry. */
	coverSrc?: string
	/** Optional provenance warning for a particular source issue. */
	noteKey?: string
	/** Page images in reading order. The first image is the front page. */
	pages: string[]
}

export interface NewspaperPublication {
	id: string
	/** Translation key shared by all supported locales. */
	titleKey: string
	/** Publication logo, displayed beside its title. */
	logoSrc?: string
	/** Falls back to the localized publication title when omitted. */
	logoAltKey?: string
	descriptionKey?: string
	backgroundSrc?: string
	issues: NewspaperIssue[]
}

/** Real publications only. See docs/NEWSPAPERS.md before adding an issue. */
export const newspaperPublications: NewspaperPublication[] = [
	{
		id: 'central-daily',
		titleKey: 'newspapers.publications.central-daily.title',
		issues: [
			{
				id: 'issue-001',
				number: 1,
				publishedAt: '2021-05-04',
				coverSrc: '/newspapers/central-daily/issue-001/cover.webp',
				pages: [
					'/newspapers/central-daily/issue-001/01.webp',
					'/newspapers/central-daily/issue-001/02.webp',
				],
			},
			{
				id: 'issue-002',
				number: 2,
				noteKey: 'newspapers.sourceNotes.centralIssue2',
				publishedAt: '2021-07-07',
				coverSrc: '/newspapers/central-daily/issue-002/cover.webp',
				pages: [
					'/newspapers/central-daily/issue-002/01.webp',
					'/newspapers/central-daily/issue-002/02.webp',
					'/newspapers/central-daily/issue-002/03.webp',
					'/newspapers/central-daily/issue-002/04.webp',
					'/newspapers/central-daily/issue-002/05.webp',
				],
			},
			{
				id: 'issue-003',
				number: 3,
				publishedAt: '2021-07-07',
				coverSrc: '/newspapers/central-daily/issue-003/cover.webp',
				pages: [
					'/newspapers/central-daily/issue-003/01.webp',
					'/newspapers/central-daily/issue-003/02.webp',
					'/newspapers/central-daily/issue-003/03.webp',
					'/newspapers/central-daily/issue-003/04.webp',
					'/newspapers/central-daily/issue-003/05.webp',
				],
			},
			{
				id: 'issue-004',
				number: 4,
				publishedAt: '2021-08-17',
				coverSrc: '/newspapers/central-daily/issue-004/cover.webp',
				pages: [
					'/newspapers/central-daily/issue-004/01.webp',
					'/newspapers/central-daily/issue-004/02.webp',
					'/newspapers/central-daily/issue-004/03.webp',
					'/newspapers/central-daily/issue-004/04.webp',
					'/newspapers/central-daily/issue-004/05.webp',
					'/newspapers/central-daily/issue-004/06.webp',
					'/newspapers/central-daily/issue-004/07.webp',
					'/newspapers/central-daily/issue-004/08.webp',
				],
			},
			{
				id: 'issue-005',
				number: 5,
				publishedAt: '2021-10-17',
				coverSrc: '/newspapers/central-daily/issue-005/cover.webp',
				pages: [
					'/newspapers/central-daily/issue-005/01.webp',
					'/newspapers/central-daily/issue-005/02.webp',
					'/newspapers/central-daily/issue-005/03.webp',
					'/newspapers/central-daily/issue-005/04.webp',
					'/newspapers/central-daily/issue-005/05.webp',
				],
			},
			{
				id: 'issue-006',
				number: 6,
				publishedAt: '2021-12-13',
				coverSrc: '/newspapers/central-daily/issue-006/cover.webp',
				pages: [
					'/newspapers/central-daily/issue-006/01.webp',
					'/newspapers/central-daily/issue-006/02.webp',
				],
			},
			{
				id: 'issue-007',
				number: 7,
				publishedAt: '2022-02-01',
				coverSrc: '/newspapers/central-daily/issue-007/cover.webp',
				pages: [
					'/newspapers/central-daily/issue-007/01.webp',
					'/newspapers/central-daily/issue-007/02.webp',
					'/newspapers/central-daily/issue-007/03.webp',
					'/newspapers/central-daily/issue-007/04.webp',
					'/newspapers/central-daily/issue-007/05.webp',
					'/newspapers/central-daily/issue-007/06.webp',
					'/newspapers/central-daily/issue-007/07.webp',
					'/newspapers/central-daily/issue-007/08.webp',
					'/newspapers/central-daily/issue-007/09.webp',
					'/newspapers/central-daily/issue-007/10.webp',
					'/newspapers/central-daily/issue-007/11.webp',
				],
			},
			{
				id: 'issue-008',
				number: 8,
				publishedAt: '2022-03-18',
				coverSrc: '/newspapers/central-daily/issue-008/cover.webp',
				pages: [
					'/newspapers/central-daily/issue-008/01.webp',
					'/newspapers/central-daily/issue-008/02.webp',
					'/newspapers/central-daily/issue-008/03.webp',
					'/newspapers/central-daily/issue-008/04.webp',
					'/newspapers/central-daily/issue-008/05.webp',
				],
			},
			{
				id: 'issue-009',
				number: 9,
				publishedAt: '2022-06-03',
				coverSrc: '/newspapers/central-daily/issue-009/cover.webp',
				pages: [
					'/newspapers/central-daily/issue-009/01.webp',
					'/newspapers/central-daily/issue-009/02.webp',
					'/newspapers/central-daily/issue-009/03.webp',
					'/newspapers/central-daily/issue-009/04.webp',
					'/newspapers/central-daily/issue-009/05.webp',
					'/newspapers/central-daily/issue-009/06.webp',
					'/newspapers/central-daily/issue-009/07.webp',
					'/newspapers/central-daily/issue-009/08.webp',
					'/newspapers/central-daily/issue-009/09.webp',
					'/newspapers/central-daily/issue-009/10.webp',
				],
			},
			{
				id: 'issue-010',
				number: 10,
				publishedAt: '2022-07-26',
				coverSrc: '/newspapers/central-daily/issue-010/cover.webp',
				pages: [
					'/newspapers/central-daily/issue-010/01.webp',
					'/newspapers/central-daily/issue-010/02.webp',
					'/newspapers/central-daily/issue-010/03.webp',
					'/newspapers/central-daily/issue-010/04.webp',
					'/newspapers/central-daily/issue-010/05.webp',
					'/newspapers/central-daily/issue-010/06.webp',
					'/newspapers/central-daily/issue-010/07.webp',
					'/newspapers/central-daily/issue-010/08.webp',
					'/newspapers/central-daily/issue-010/09.webp',
					'/newspapers/central-daily/issue-010/10.webp',
					'/newspapers/central-daily/issue-010/11.webp',
					'/newspapers/central-daily/issue-010/12.webp',
				],
			},
			{
				id: 'issue-011',
				number: 11,
				publishedAt: '2022-09-18',
				coverSrc: '/newspapers/central-daily/issue-011/cover.webp',
				pages: [
					'/newspapers/central-daily/issue-011/01.webp',
					'/newspapers/central-daily/issue-011/02.webp',
					'/newspapers/central-daily/issue-011/03.webp',
					'/newspapers/central-daily/issue-011/04.webp',
					'/newspapers/central-daily/issue-011/05.webp',
					'/newspapers/central-daily/issue-011/06.webp',
					'/newspapers/central-daily/issue-011/07.webp',
					'/newspapers/central-daily/issue-011/08.webp',
					'/newspapers/central-daily/issue-011/09.webp',
					'/newspapers/central-daily/issue-011/10.webp',
					'/newspapers/central-daily/issue-011/11.webp',
					'/newspapers/central-daily/issue-011/12.webp',
				],
			},
		],
	},
	{
		id: 'nanbu-gulf-daily',
		titleKey: 'newspapers.publications.nanbu-gulf-daily.title',
		issues: [
			{
				id: 'issue-002',
				number: 2,
				publishedAt: '2021-10-06',
				coverSrc: '/newspapers/nanbu-gulf-daily/issue-002/cover.webp',
				pages: [
					'/newspapers/nanbu-gulf-daily/issue-002/01.webp',
					'/newspapers/nanbu-gulf-daily/issue-002/02.webp',
					'/newspapers/nanbu-gulf-daily/issue-002/03.webp',
					'/newspapers/nanbu-gulf-daily/issue-002/04.webp',
					'/newspapers/nanbu-gulf-daily/issue-002/05.webp',
				],
			},
			{
				id: 'issue-003',
				number: 3,
				publishedAt: '2022-07-21',
				coverSrc: '/newspapers/nanbu-gulf-daily/issue-003/cover.webp',
				pages: [
					'/newspapers/nanbu-gulf-daily/issue-003/01.webp',
					'/newspapers/nanbu-gulf-daily/issue-003/02.webp',
					'/newspapers/nanbu-gulf-daily/issue-003/03.webp',
					'/newspapers/nanbu-gulf-daily/issue-003/04.webp',
					'/newspapers/nanbu-gulf-daily/issue-003/05.webp',
					'/newspapers/nanbu-gulf-daily/issue-003/06.webp',
					'/newspapers/nanbu-gulf-daily/issue-003/07.webp',
					'/newspapers/nanbu-gulf-daily/issue-003/08.webp',
					'/newspapers/nanbu-gulf-daily/issue-003/09.webp',
					'/newspapers/nanbu-gulf-daily/issue-003/10.webp',
					'/newspapers/nanbu-gulf-daily/issue-003/11.webp',
				],
			},
			{
				id: 'issue-004',
				number: 4,
				publishedAt: '2022-07-27',
				coverSrc: '/newspapers/nanbu-gulf-daily/issue-004/cover.webp',
				pages: [
					'/newspapers/nanbu-gulf-daily/issue-004/01.webp',
					'/newspapers/nanbu-gulf-daily/issue-004/02.webp',
					'/newspapers/nanbu-gulf-daily/issue-004/03.webp',
					'/newspapers/nanbu-gulf-daily/issue-004/04.webp',
					'/newspapers/nanbu-gulf-daily/issue-004/05.webp',
					'/newspapers/nanbu-gulf-daily/issue-004/06.webp',
					'/newspapers/nanbu-gulf-daily/issue-004/07.webp',
					'/newspapers/nanbu-gulf-daily/issue-004/08.webp',
				],
			},
		],
	},
	{
		id: 'wenyan',
		titleKey: 'newspapers.publications.wenyan.title',
		issues: [
			{
				id: 'issue-001',
				number: 1,
				publishedAt: '2024-01-01',
				coverSrc: '/newspapers/wenyan/issue-001/cover.webp',
				pages: [
					'/newspapers/wenyan/issue-001/01.webp',
					'/newspapers/wenyan/issue-001/02.webp',
					'/newspapers/wenyan/issue-001/03.webp',
					'/newspapers/wenyan/issue-001/04.webp',
					'/newspapers/wenyan/issue-001/05.webp',
					'/newspapers/wenyan/issue-001/06.webp',
				],
			},
		],
	},
]
