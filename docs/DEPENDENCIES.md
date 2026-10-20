# 项目依赖说明

给接手项目的 agent 查用途和依赖关系。具体版本以 `package.json`、`pnpm-lock.yaml` 为准；当前依赖组合保持现状，不因看到新版本就继续更新。

## 环境与构建

- 使用 pnpm，版本由 `package.json` 的 `packageManager` 指定，GitHub CI 与 CNB 构建配置保持一致。
- Node 版本按 `package.json` 的 `engines`；当前构建使用 Node 24 系列。Nuxt、原生模块的最低 Node 要求也要同时满足。
- Nuxt 4 负责 SSR、路由和构建，Vue 3 与 Vue Router 5 是应用运行时。Vite、Nitro 主要由 Nuxt 管理，不另行安装最新版替换它们。
- TypeScript、`vue-tsc`、`@nuxt/eslint` 与 ESLint 共同组成类型和静态检查链；生产 Build 启用类型检查。Prettier 负责全仓格式化。
- `postinstall` 会执行 `nuxt prepare` 和 Prisma Client 生成；生成 Client 不等于执行数据库迁移。

## 主要库用在哪里

| 依赖                                                              | 用途与关系                                                                                                                                                                               |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@nuxt/ui`、`tailwindcss`、`@tailwindcss/vite`                    | 全站控件和样式。UI 主题在 `app.config.ts`，样式在 `assets/styles/`；Tailwind 主包和 Vite 插件保持同版。UI 还携带 Reka UI、Tiptap 等间接依赖，不能因为业务没有直接 import 就随意删除。    |
| `@iconify-json/lucide`、`@iconify-json/simple-icons`、`nuxt-svgo` | 图标集合与 SVG 组件。Icon 的本地打包列表在 `nuxt.config.ts`，关闭了 API fallback；改图标来源时要核对打包配置。                                                                           |
| `@nuxt/content`                                                   | 解析 `content/` 中的多语言 Markdown、MDC 和 frontmatter；配置入口为 `content.config.ts`、`nuxt.config.ts`，展示组件在 `components/content/`。当前使用 native SQLite connector。          |
| `@nuxtjs/i18n`、`vue-i18n`                                        | 前者处理 Nuxt 的语言路由、语言文件加载，后者提供翻译与 Composer 类型。配置见 `nuxt.config.ts`、`i18n.config.ts`，文案在 `locales/`。                                                     |
| `@nuxtjs/seo`                                                     | 组合安装 sitemap、robots、站点配置等模块。是否启用各功能由 `nuxt.config.ts` 决定；当前关闭了 OG Image、Schema.org 等部分功能。不能只看顶层包名判断实际功能和间接依赖。                   |
| `@nuxt/scripts`、`@nuxtjs/turnstile`、`@microsoft/clarity`        | 脚本集成、人机验证和统计。Turnstile 依赖 Scripts；Clarity 由 `plugins/microsoft-clarity.ts` 使用 Microsoft SDK 初始化。Scripts 已提供 `Window.clarity` 类型，不要再声明为 SDK 对象类型。 |
| `motion-v`、`gsap`                                                | Vue 组件动效、首页滚动与输入控制。修改前看对应 composable 和组件，不要为统一动画库重写现有交互。                                                                                         |
| `three`、`skinview3d`、`skinview-utils`                           | BlueMap、玩家标记、皮肤预览和地图后处理。地图代码位于 `utils/map/bluemap/`、`vendor/bluemap-webapp/v5.3/`；Vite 配置对 Three 做了 dedupe。                                               |
| `vue-picture-cropper`、`cropperjs`                                | 图片上传前的裁剪，入口是 `components/attachment/ImageCropperModal.client.vue`。Vue 封装使用 Cropper 1 的实例、坐标与 Canvas API。                                                        |
| `sharp`、`fast-xml-parser`                                        | 服务端附件图片处理与 SVG 校验，位于 `server/utils/attachment/`。Sharp 负责旋转、元数据、缩放和 WebP 输出；XML 解析器用于 SVG 结构检查。允许的栅格输入为 JPEG、PNG、WebP。                |
| `cos-nodejs-sdk-v5`                                               | 附件对象存储，只在 `server/utils/attachment/cos-storage-adapter.ts` 中调用上传、删除。业务通过附件 runtime/service 使用存储，不直接调用 SDK 或拼接 URL。                                 |
| `prisma`、`@prisma/client`、`@prisma/adapter-pg`、`pg`            | Portal 自身的 PostgreSQL 数据访问。schema 在 `prisma/schema/`，配置在 `prisma.config.ts`，数据库入口在 `server/utils/db/`。                                                              |
| `mysql2`                                                          | AuthMe、LuckPerms 等外部数据库查询与同步，代码在 `server/utils/external-sync/`；与 Portal 自身的 PostgreSQL 分开。                                                                       |
| `h3`                                                              | 服务端请求、Cookie、上传、错误和 `H3Event` 类型，与当前 Nuxt/Nitro 服务端配套使用。                                                                                                      |
| `nodemailer`                                                      | `server/utils/mail/` 中的 SMTP 发送。当前发送文本与 HTML；Nodemailer 10 自带类型，不再安装 `@types/nodemailer`。                                                                         |
| `dotenv`                                                          | Prisma 配置和独立脚本通过 `dotenv/config` 加载环境文件；不要与 Nuxt 自己的 runtimeConfig 边界混淆。                                                                                      |
| `dayjs`、`lunar-typescript`、`@internationalized/date`            | 日期展示、生日与农历转换，以及 UI 日期控件的数据类型。修改日期类型时要看表单与生日计算之间的转换。                                                                                       |
| `chart.js`、`vue-chartjs`                                         | 管理端服务器玩家图表；后者是前者的 Vue 封装，两者版本要兼容。                                                                                                                            |
| `ip2region.js`                                                    | IP 归属地查询，封装在 `server/utils/ip-location/`，数据库位于 `data/ip2region/` 并通过 Nitro serverAssets 打包。                                                                         |
| `@web-alchemy/fonttools`、`emoji-regex`、`fast-glob`              | 自定义 Emoji 字体扫描与构建，见 `build/emoji-font/` 和 [Emoji 字体构建](EMOJI_FONTS.md)。                                                                                                |
| `tsx`、`puppeteer-core`                                           | 前者运行独立 TypeScript 脚本；后者用于浏览器自动化，实际用途看 `scripts/` 中的调用，不是应用浏览器运行时。                                                                               |

## 哪些依赖不能单独动

| 组合                      | 当前约束                                                                                                                                                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Three.js 与皮肤、地图渲染 | 保持 `three 0.156.1`、`@types/three 0.156.0`。`skinview3d 3.4.2` 依赖 0.156 系列，BlueMap 还深度导入 Three 内部模块。不能只改 Three 版本；地图、皮肤、标记、shader 和后处理必须一起考虑，共享同一 runtime。                          |
| Cropper 与 Vue 封装       | 保持 Cropper 1.x；`vue-picture-cropper` 的 peer 要求是 `^1`。Cropper 2 的元素与坐标 API 不能直接替换当前 `getData`、`getCroppedCanvas` 等调用。                                                                                      |
| Nuxt、Nitro 与 H3         | 当前保持 Nuxt 4 / Nitro 2 / H3 1 的组合。不能把显式导入的 H3 单独换成 2.x，否则可能与模块、handler 和事件类型不一致。                                                                                                                |
| TypeScript 与检查工具     | 当前保持 TypeScript 5.9.3。现有 typescript-eslint 链路要求 `<6.1.0`，不能单独换 TypeScript 7；`vue-tsc` 也要一起核对。                                                                                                               |
| Prisma 三件套             | `prisma`、`@prisma/client`、`@prisma/adapter-pg` 保持同一版本，并重新生成 Client。schema 改动另按 [数据库规范](DATABASE.md) 处理，不能用依赖调整代替 migration。                                                                     |
| SEO 组合模块              | 当前保持 SEO 5.x。SEO 6 会连带多个子模块跨主版本并新增模块，不作为普通工具包单独调整。                                                                                                                                               |
| COS SDK 与存储适配层      | 当前保持 SDK 2.x。3.x 更换请求与 XML 实现，涉及签名和实际对象存储行为；需要单独明确需求并验证，不能只凭 `putObject/deleteObject` 方法名相同就替换。旧版内部有固定 XML 解析器与旧 request 依赖，更新顶层 XML 包不会替换这些内部依赖。 |

## 其余调整边界

- 日期、图标、格式化等相对独立的库，可以在任务需要时按现有兼容范围维护；这不代表允许顺手更新整个依赖树。`0.x` 的次版本也可能改变 API。
- Vue/Router、UI/Tailwind、图表封装、原生图片模块、邮件发送和数据库驱动，都要核对调用方及对应运行环境，不能仅凭主版本相同就判断可直接替换。
- 间接依赖优先跟随所属模块处理，不为消除 peer warning 或审计数字而强制跨主版本 override。Nuxt UI 的 Tiptap 核心和扩展需保持兼容，留意锁文件保留旧自动 peer 的情况。
- 现有 Content 依赖链中，`nuxt-component-meta` 给 `unctx` 提供的可选 `unplugin`、`oxc-parser` 存在 peer 范围警告；先核对上游和实际使用路径，不直接改声明压掉警告。
- 依赖的实际验证要看功能：Build 能检查编译与打包，不能证明地图交互、SMTP 投递、对象存储写入或跨平台原生模块已经正常。按 [开发规范](DEVELOPMENT.md) 执行项目要求的检查。
