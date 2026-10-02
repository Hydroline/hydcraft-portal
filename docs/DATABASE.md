# 数据库与迁移规范

适用于 `prisma/schema/`、数据库结构、持久化模型及相关部署脚本。

- 修改 Prisma schema、表、字段、索引或约束时，**必须同时提交对应的 migration**。不能只改 schema、只重新生成 Prisma Client，或依赖开发机的数据库现状让功能看起来可用。
- 创建 migration 前，先从当前系统读取时间，例如运行 `date '+%Y-%m-%d %H:%M:%S %Z'` 和 `date '+%Y%m%d%H%M%S'`。迁移目录使用实际取得的 `YYYYMMDDHHMMSS_描述` 日期前缀，不沿用旧迁移的日期，也不猜测或手算时间。若 Prisma CLI 自动生成目录，仍先读取系统时间，并核对生成的日期前缀。
- 本项目的迁移放在 `prisma/schema/migrations/`，每个目录包含 `migration.sql`。开发时按项目脚本使用 `pnpm db:migrate:dev`，部署时使用 `pnpm db:migrate:deploy`；提交前检查 SQL、schema 与生成目录一致。
- 提交前通过 `git status --short` 和 `git check-ignore` 核对 migration 文件确实进入版本控制；不要让 `.gitignore` 隐藏新迁移。提交中应同时包含 schema 与 migration。
- 本地构建通过不等于目标数据库已有新表。需要验证实际运行环境时，再检查该环境的迁移记录和物理 schema；不要把本地迁移结果当作远端已更新的证据。
