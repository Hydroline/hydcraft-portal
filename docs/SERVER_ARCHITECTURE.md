# 服务端与模块边界

适用于 API、Service、事件处理、Prisma 调用和领域 utils。

## Utils Directory Discipline

- `utils/` 不要长期平铺堆放领域文件；只允许保留极少数真正的顶层稳定入口，默认都应按领域拆进子文件夹，例如 `utils/profile/*`、`utils/community/*`、`utils/links/*`。
- 当某个 util 已明显服务于特定业务域、页面族、或模块契约时，优先新建对应子目录，不要继续把文件散放在 `utils/` 根下。
- 做 utils 重构时，先按领域边界整理目录，再决定是否保留或收缩顶层 re-export 入口；不要为了“先能用”长期保留一堆平铺 shim。

## Event And Side-Effect Boundary

- Service 负责核心数据库操作与数据合法性校验，成功后发事件；异步清理、发信、联动修复等副作用放到 event handler / plugin 层。
- API handler 保持薄层：鉴权、读参、调用 service、返回结果，不在 handler 里堆业务细节。
- 新增业务节点时，先想清楚是否应该补事件，而不是让两个业务模块直接互相调用。
- 定时清理、附件替换清理、OAuth 解绑后的补偿动作，这类后处理逻辑优先挂到 plugin / event 层，而不是塞回主流程事务里。
- 若某个副作用失败，优先记录日志并可重试，不要轻易污染核心成功路径。
