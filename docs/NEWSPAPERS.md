# 报刊橱内容维护

`/newspapers` 是公开栏目，默认不加入顶部导航。从 `/intro` 的“我们的成果”报刊卡片进入。每种报纸对应一张 PressCard，各期按出版日期倒序排列，点击头版打开该期电子报。

## 放置图片

可以将图片放到 `public/newspapers/<报纸 ID>/<期刊 ID>/`，例如 `public/newspapers/community/issue-001/01.webp`，对应网址为 `/newspapers/community/issue-001/01.webp`。也可以上传到项目现有图片站，在配置中使用完整 HTTPS URL，或通过 `getSiteMediaUrl('newspapers/...')` 生成地址。

每一版单独导出一张高清 WebP、PNG 或 JPEG 图片，建议长边至少 2400px，以便放大阅读。头版作为第一张，其他版面按实际阅读顺序配置。保持报纸原始比例，不需要先裁成卡片大小。头版卡片会从顶部裁切展示，电子报展示完整图片。

## 登记报纸和期刊

编辑 `data/newspapers.ts` 中的 `newspaperPublications`。以下仅说明配置格式，不会作为示例报刊显示在网站上：

```ts
export const newspaperPublications: NewspaperPublication[] = [
	{
		id: 'community',
		titleKey: 'newspapers.publications.community.title',
		descriptionKey: 'newspapers.publications.community.description',
		backgroundSrc: '/newspapers/community/background.webp',
		issues: [
			{
				id: 'issue-001',
				number: 1,
				publishedAt: '2026-11-05',
				pages: [
					'/newspapers/community/issue-001/01.webp',
					'/newspapers/community/issue-001/02.webp',
				],
			},
		],
	},
]
```

在 `locales/{zh-CN,zh-TW,en-US,ja-JP}/content.json` 的 `newspapers.publications.community` 下同步添加 `title` 和 `description` 翻译。`descriptionKey` 和 `backgroundSrc` 可省略。报纸 ID 在整个目录中唯一，期刊 ID 在同一种报纸下唯一，出版日期使用有效的 `YYYY-MM-DD` 日期。不填写页面图片的期刊不会展示。

简介入口随机选取已登记期刊的头版，显示下方贴底、露出四分之三的报纸画面。尚未登记报刊时，入口保留报刊图标，栏目显示空状态。新增或更新资料后重新构建并部署。

## 阅读操作

- 底部工具栏：上一版、下一版、放大、缩小、当前版数 / 总版数。点击倍率恢复适合窗口的大小。
- 桌面：滚轮缩放、放大后拖动、双击切换缩放。键盘左右方向键翻版，`+` / `-` 缩放，`0` 复位，`Esc` 关闭。
- 移动端：原始倍率下左右滑动翻版，双指缩放，放大后单指拖动。首尾版禁用对应翻版操作。
- 翻版时重置缩放，图片加载失败时提供重试。
