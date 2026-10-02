# 存档扫描流程

适用于存档扫描、artifact 生成和 portal 导入流程。

## Archive Scanner Workflow

- archive 存档扫描项目固定为 `~/code/hydcraft-archive-scanner`，负责只读读取外部世界目录并产出 artifact JSON。
- 扫描外部 Windows 存档时，默认走 WSL 路径，例如 `/mnt/f/Games/Minecraft/Saves/...`；只允许只读检查，不要直接改外部存档内容。
- 标准顺序是：先在 scanner 项目执行 `pnpm build` 与 `pnpm scan ...`，再回到 portal 执行 `pnpm archive:import --server <serverId> --artifact <path>`。
- 若 archive 数据异常，先区分是 scanner 事实提取问题、portal 导入归属问题、还是 portal 展示统计口径问题；不要一上来把症状都归到 scanner。
