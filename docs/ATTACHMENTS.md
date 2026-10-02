# 附件与草稿生命周期

适用于附件存储、伙伴草稿以及需要清理的临时资源。

## Partner Drafts

- 在伙伴/支持鸣谢创建流程中，允许“先落一条真实记录，再上传媒体”。
- 这是刻意保留的行为，不要擅自改回“必须先完整保存再上传”。
- 但后续必须补自动清理机制，避免留下悬空或半成品伙伴记录。

## Attachment URL Policy

- 附件公开 URL 不要在业务代码里手写 `baseUrl + objectKey`。
- 统一通过 `server/utils/attachment/runtime.ts` 提供的公开 URL 方法生成。
- 如果以后要切换 COS / S3 兼容实现，优先改存储抽象层，不要在业务模块里分叉协议。

## Attachment Storage Boundary

- 当前附件存储实现虽然基于 COS，但约束应按 S3-compatible / object storage 抽象理解，不要把业务规则绑定在某一家厂商 SDK 上。
- 不要在业务模块里直接 new COS、手写 SDK 参数、或自行拼接对象存储公开地址。
- 附件上传、删除、公开 URL、bucket profile 选择，统一走 `server/utils/attachment` 抽象层，不要绕过 runtime / service / storage-adapter。
- 如果未来切换到 S3 兼容实现，优先改 `storage-adapter` 与 runtime profile 映射，不要改业务 service / API handler。
- `publicAssets` 与 `privateUploads` 的 bucket / profile 语义不可在业务代码里混用；是否公开由 profile 与 visibility 决定，不靠调用方临时约定。
- 业务层只消费 `objectKey`、attachment id、public URL 结果，不关心底层厂商字段命名。

## Draft And Cleanup Lifecycle

- 允许存在草稿、待上传、待替换、待清理这类中间态，但必须同时设计对应的过期回收或替换清理机制。
- 新增“先落库后补媒体”或“先生成记录再补关联”的流程时，要同时考虑悬空记录、过期附件、孤儿资源的清理策略。
- 如果一个功能会生成临时 token、临时附件、临时申请单、临时注册记录，默认需要先回答：谁来清、何时清、失败后如何补偿。
