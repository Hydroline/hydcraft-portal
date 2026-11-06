# 页面媒体资源

## 目录边界

`assets/media/` 集中保存会随页面内容持续增删的图片、视频等媒体源文件，整个目录使用 Git LFS。保留有意义的业务子目录，不把不相关的素材平铺到根目录。

当前目录包括 `routes-map/`、`routes-system/`、`meetups/`、`material/`、`livelihood/`、`homepage/`、`content/timeline/` 和 `minecraft-gallery/`。以后新增报刊等页面媒体时，可在这里增加相应目录，自动继承 LFS 规则，无需逐个扩展名配置。

`assets/resources/` 继续保存品牌、图标、占位图、个人资料等现有共享资源，不自动纳入 LFS。LFS 只改变 Git 的存储方式，不改变 Nuxt 的资源处理：当前直接 import 的媒体继续由 Nuxt 打包，已有图片站 URL 继续使用原地址。COS 自动上传、内容哈希 URL 和可配置图片域名属于后续独立步骤。

## 新增与修改素材

- 新增或替换的栅格图片尽量使用 WebP，报刊、截图等文字密集内容优先考虑无损 WebP，保证文字可读性。不要只修改扩展名，转换后检查实际格式、尺寸和画面。
- 为保留必要的格式能力可以使用其他格式，例如 SVG 矢量图。视频继续使用合适的视频格式，不套用图片格式要求。不为统一格式批量重编码已有素材。
- 页面专用媒体放进 `assets/media/` 对应的业务目录，保留可读的文件名。不要在 `assets/resources/` 或 `public/` 额外保留同一份展示素材，原始资料若需独立归档应明确说明。
- 修改目录或文件名时同步检查 import、数据配置和文档引用，不能只移动文件。LFS 规则覆盖整个 `assets/media/`，无需为每次新增媒体修改配置。
- Markdown 中的 `timeline/...` 等短路径通过 `components/content/utils/content-image.ts` 解析；映射器同时扫描共享内容资源和 `assets/media/content/`，迁移内容图片时必须一并检查 glob 与路径归一化规则，不能只检查直接 import 或 Build。

后续 agent 调整媒体前必须先阅读本文。保持共享资源与页面媒体的边界，不擅自取消 LFS、改写旧历史，或把指针当作图片交给构建和上传工具。本轮已完成的是目录整理、LFS 和同步流程，不能将其视为 COS 发布、图片域名配置或远端验收已经完成。

## 本地使用

macOS 首次安装：

```sh
brew install git-lfs
```

在当前仓库初始化并还原媒体：

```sh
git lfs install --local
git lfs pull
```

Windows 或 Linux 开发者同样需要安装 Git LFS。安装后仍然用普通的 `git add`、`git commit` 和 `git push`；图片保留正常文件名和原目录，不手动编辑 LFS 指针，也不把它们当作真实媒体上传。全新克隆后可在仓库中执行上述初始化和拉取命令，已有克隆也用这两个命令补齐媒体。

没有安装 LFS 时仍可编辑普通代码，但媒体可能只是包含对象哈希和大小的文本指针。页面预览、媒体编辑和 Build 不保证可用，必须先恢复真实文件。LFS 使用托管平台的独立存储和下载配额，历史版本仍占存储，不等于自动清理旧图片。

指定页面媒体的旧目录历史已通过 `git lfs migrate import` 迁入 LFS，相关 `v2` 提交 SHA 已改变，无关分支不在本轮改写范围。新旧路径的历史媒体均纳入迁移，不能只迁移当前 `assets/media/` 而遗漏旧 `assets/resources/` 路径。

已有克隆应先保存未提交和未推送的工作，再按新远端历史重新同步，推荐重新克隆。不要直接合并迁移前的旧历史。旧分支、fork、PR 引用和本地 reflog 可能仍保留原 Git 对象，迁移不代表所有副本立即释放磁盘空间；LFS 存储仍保存媒体历史版本。

检查本地状态：

```sh
git lfs ls-files
git lfs fsck --objects HEAD
```

## 配置归属

LFS 跟随 Git remote 使用 GitHub / CNB 自带的 LFS 存储，使用对应平台的 Git 认证，不需要在本地 `.env` 增加 LFS 服务地址、桶名或 COS 密钥，也不需要自行部署 LFS 服务。当前仓库不设置自定义 `.lfsconfig`，GitHub 和 CNB 分别保存自己的 LFS 对象副本。

- GitHub Actions 使用现有仓库变量 `CNB_REPOSITORY_SLUG` 和 Secret `CNB_TOKEN` 同步到 CNB。Deploy 工作流触发 CNB 构建时还使用现有的 `CNB_API_TOKEN`。
- CNB 在 checkout 时使用平台提供的仓库读取认证取得自己的 LFS 对象，现有部署配置继续通过密钥仓库导入。
- COS 自动上传尚未实现，现阶段不需要为了 LFS 给 GitHub、CNB 或本地新增 COS 环境变量。后续确定由哪一侧执行上传后，只给实际执行方配置所需权限和密钥；图片公共域名与 COS 私密凭据分别管理。

## GitHub 到 CNB

GitHub 是源仓库。目标仍由 GitHub Actions 仓库变量 `CNB_REPOSITORY_SLUG` 指定，格式为 CNB 的完整仓库路径，不带域名。`CNB_TOKEN` 沿用现有仓库写入密钥，并需要能上传目标仓库的 LFS 对象，不在仓库中存放令牌。

CI、Deploy 和单独的 Sync CNB 工作流共用 `.github/scripts/sync-cnb.sh`：

1. checkout GitHub 的 `v2`，开启 `lfs: true`。同步需要完整 Git 历史。
2. 从 GitHub 获取当前提交可达的全部 LFS 对象。
3. 将对象上传到指定 CNB 仓库自己的 LFS 存储。
4. 上传成功后，以带远端版本校验的方式更新 CNB 的 `v2` 分支，不同步其他分支或标签。

凭据通过临时 askpass 脚本从环境读取，不写入远端 URL。远端分支在同步期间发生变化时停止同步，避免覆盖并发更新。临时 remote 和脚本会在退出时清理。

GitHub Actions 中手动运行 **Sync CNB** 可以单独同步代码和 LFS，不触发网站部署，也不需要 COS 配置。它始终同步 `v2`，运行时应选择可信的 `v2` 工作流版本。Deploy 工作流则在同步成功后继续触发 CNB 部署。

CNB 构建显式开启 `git.lfs`，安装 LFS 客户端并执行 `git lfs pull` 和对象校验，确认真实媒体就绪后才运行 Nuxt Build。CNB 从自己的仓库取得对象，不依赖在构建阶段访问 GitHub LFS。

首次远端验收需要确认 GitHub 和 CNB 的 LFS 配额、目标仓库及令牌权限，运行一次 Sync CNB，检查 CNB 的 `v2` 提交和媒体是否完整，再单独进行构建验收。仅本地 Build 通过不能证明跨平台同步已通过。
