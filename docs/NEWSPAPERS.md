# 报刊橱内容维护

`/server/newspapers` 是服况下的公开栏目，从 `/server` 的报刊卡片或服况子导航进入。每种报纸对应一张 PressCard，各期按出版日期倒序排列，点击头版打开该期电子报。

## 放置图片

先阅读 [页面媒体资源](MEDIA.md)。报刊图片统一放在 `assets/media/newspapers/<报纸 ID>/<期刊 ID>/`，例如 `assets/media/newspapers/community/issue-001/01.webp`，整个目录随项目使用 Git LFS，不在 `public/` 保留副本。`data/newspapers.ts` 通过 `getNewspaperImageUrl('community/issue-001/01.webp')` 取得构建后的图片地址，开发环境使用本地图片，配置媒体 CDN 地址的生产构建由统一媒体插件生成 COS 哈希地址。合并到 `v2` 后，现有 Deploy 流程自动增量上传报刊图片，无需手工上传。

每一版尽量单独导出一张高清 WebP 图片，文字密集的版面优先无损 WebP，建议长边至少 2400px，以便放大阅读。头版作为第一张，其他版面按实际阅读顺序配置。保持报纸原始比例，不需要先裁成卡片大小。头版卡片会从顶部裁切展示，电子报展示完整图片。

当前已接入三套报纸，共 15 期、107 版：氢气中央日报第 1 至 11 期、南部湾日报第 2 至 4 期、文眼第 1 期。正文使用无损 WebP，长边为 2400px，另有长边 640px 的 `cover.webp` 供列表和服况入口使用，避免浏览列表时加载正文大图。原始 PDF 保留在下载目录，不放进网站。转换前的 PNG 备份在本地 `tmp/newspapers-source-png/`，由 Git 忽略，不随网站部署。

`氢气中央日报 第二期.pdf` 的报头印为第三期。按资料提供者确认，保留第二期文件名对应的期数，并通过 `noteKey` 显示原件差异。日期优先采用报头上的公历日期，仅在缺少公历日期时按确认的氢气纪年规则换算。第六期报头公历为 2021-12-13，优先于相差一天的氢气纪年日期。南部湾日报第三、四期分别采用报头的 2022-07-21、2022-07-27，不使用 PDF 创建时间。

### 无损 WebP 转换工具

网站优先使用无损 WebP，保留文字边缘、颜色、分辨率和透明度。使用项目已有 Sharp，无需安装新依赖：

```powershell
# 预览体积变化，并核对转换前后的像素，不写文件
pnpm newspapers:webp assets/media/newspapers

# 将新的 PNG/JPEG 转成同名 WebP，原文件保留
pnpm newspapers:webp --write assets/media/newspapers
```

工具递归读取静态 8-bit PNG/JPEG，以 `lossless: true, effort: 6` 编码，保留元数据，逐像素核对 RGBA 数据和宽高。不会覆盖已有 WebP，也不会删除源文件。PNG/JPEG 同名导致目标冲突时停止。JPEG 转 WebP 保留 JPEG 当前解码的像素，不能恢复 JPEG 原先已丢失的细节。

转换完成后，将 `data/newspapers.ts` 的正文和 `coverSrc` 的 `getNewspaperImageUrl()` 参数改为 `.webp`，把原图移到 `tmp/` 等本地备份目录，避免两套图片都被部署。只有新的 PNG/JPEG 需要转换，已经转换完成的目录可直接使用现有 WebP。

本批次 107 个版面和 15 张缩略图由 139.89 MiB PNG 转为 86.15 MiB WebP，体积减少 38.41%，宽高和解码后的像素保持一致。照片较多的版面仍然保留全部细节，没有额外降低画质。

### PNG 无损压缩工具（保留 PNG 时使用）

使用项目已有 Sharp，无需安装新依赖：

```powershell
# 预览预计节省的大小，不改文件
pnpm newspapers:optimize assets/media/newspapers

# 核对像素后原位替换，也可以指定单张 PNG 或多个目录
pnpm newspapers:optimize --write assets/media/newspapers
```

工具递归处理静态 8-bit PNG，尝试两种无损过滤策略、最高压缩级别，保留元数据，不缩放、不做调色板量化。替换前逐像素核对解码后的 RGBA 数据和宽高，只有完全一致且体积更小时才通过临时文件替换，失败时停止并报出文件。忽略符号链接，拒绝动画及高位深图片，默认只预览结果。

PDF 转成固定分辨率的 PNG 属于栅格化；640px 缩略图属于缩小采样。这两步与之后保持像素不变的 PNG 无损压缩不同。包含大量照片的版面即使无损压缩后仍可能较大，工具不会为了体积而降低颜色或细节。

## 登记报纸和期刊

编辑 `data/newspapers.ts` 中的 `newspaperPublications`。以下仅说明配置格式，不会作为示例报刊显示在网站上：

```ts
export const newspaperPublications: NewspaperPublication[] = [
	{
		id: 'community',
		titleKey: 'newspapers.publications.community.title',
		logoSrc: getNewspaperImageUrl('community/logo.png'),
		descriptionKey: 'newspapers.publications.community.description',
		backgroundSrc: getNewspaperImageUrl('community/background.webp'),
		issues: [
			{
				id: 'issue-001',
				number: 1,
				publishedAt: '2026-11-05',
				pages: [
					getNewspaperImageUrl('community/issue-001/01.webp'),
					getNewspaperImageUrl('community/issue-001/02.webp'),
				],
			},
		],
	},
]
```

在 `locales/{zh-CN,zh-TW,en-US,ja-JP}/content.json` 的 `newspapers.publications.community` 下同步添加 `title` 和 `description` 翻译。`descriptionKey` 和 `backgroundSrc` 可省略。报纸 ID 在整个目录中唯一，期刊 ID 在同一种报纸下唯一，出版日期使用有效的 `YYYY-MM-DD` 日期。不填写页面图片的期刊不会展示。

`logoSrc` 配置报纸 Logo，与标题并排展示，沿用铁路卡片的 64px 高度和原始比例。`logoAltKey` 可指定本地化替代文字，省略时使用报纸名称。`descriptionKey` 对应的简介显示在 Logo / 标题下方。这些字段均可选，后续补充真实 Logo 和简介即可显示，无需修改组件。

期刊可填写 `coverSrc` 指向独立头版缩略图，不填写时使用正文第一版。`noteKey` 可指向四种语言中同步维护的来源说明，用于保留原始资料中的编号等差异。

服况入口随机选取已登记期刊的头版，显示下方贴底、露出四分之三的报纸画面。尚未登记报刊时，入口保留报刊图标，栏目显示空状态。新增或更新资料后重新构建并部署。

## 阅读操作

- 底部工具栏：上一版、下一版、放大、缩小、当前版数 / 总版数。点击倍率恢复适合窗口的大小。
- 桌面：滚轮缩放、放大后拖动、双击切换缩放。键盘左右方向键翻版，`+` / `-` 缩放，`0` 复位，`Esc` 关闭。
- 移动端：原始倍率下左右滑动翻版，双指缩放，放大后单指拖动。首尾版禁用对应翻版操作。
- 翻版时重置缩放，图片加载失败时提供重试。
- 上一版、下一版使用按方向滑动与淡入淡出，图片加载完成后入场。按钮、键盘和双击缩放使用平滑动画，拖动、滚轮和双指操作即时响应。系统启用减少动态效果时关闭这些动画。
