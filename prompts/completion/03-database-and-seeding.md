# Prompt 03/08：数据库准备、迁移与幂等灌入

## 目标

将 Prompt 02 已验证的内容语料以可重复、可回滚理解的方式写入 PostgreSQL，使真实页面不再依赖首页样例图。此步骤的关键是“数据真实存在且关系完整”，不是只让 Prisma 命令退出 0。

## 先决条件与停机规则

- 先读 `.env.example`、`prisma.config.ts`、`prisma/schema.prisma`、`prisma/migrations/`、`prisma/seed.ts` 和 Prompt 02 产物。
- 先检查 `DATABASE_URL` 是否配置，但绝对不要打印其值。
- 若连接串缺失、无法连接或用户未授权使用生产库：完成静态 preflight、记录清晰阻塞，然后停止在“等待数据库配置”；不得创建猜测的 Supabase 项目、不得修改他人数据库、不得假称已 seed。
- 如果连接的是共享/生产数据库，先询问用户确认环境和备份策略；不要执行 `prisma migrate reset`。

## 实施要求

1. 保持 `prisma/seed.ts` 作为持久化适配层，内容事实来自 `src/data/seed-content.ts`；在写入前调用静态语料验证，验证失败时终止且不写库。
2. 使用 slug 与复合唯一键 upsert 所有实体和关系：discipline、field、theory、scholar、work、topic、concept、framework、谱系、理论—学者、理论—著作、主题—理论、核验记录等。禁止依赖随机顺序或临时 ID。
3. 将所有已发布记录的 `status`、`publishedAt`、`updatedAt` 处理为明确、可审计的值。不要给未核验资料伪造发布时间。
4. 一期公开学科必须与实际语料一致：
   - 若语料只覆盖 Education/Sociology，则只将这两个学科及其字段标为已发布；
   - Psychology/Management 未有可验证语料时，不得写入空壳“已发布”记录。
5. 在安全的已配置数据库上按顺序运行迁移、seed、seed 第二次；第二次必须成功，且记录关键行数不会翻倍。
6. 写最小的数据库集成核验（脚本或测试）：确认 12 个主理论、关系引用、L1 来源、图谱关系和搜索所需字段可查询。该核验可以被环境变量保护，但不可替代静态测试。

## 建议命令（按项目实际脚本修正）

```bash
npm test
npm run db:migrate
npm run db:seed
npm run db:seed
```

如果项目脚本实际使用 `npx prisma migrate deploy` 或 `npx prisma db seed`，应说明原因并使用正确命令；不得为方便改写迁移历史。

## 验收标准

- 无数据库时：明确报告“静态语料验证通过，数据库灌入待配置”，不做虚假成功声明。
- 有数据库时：迁移成功、连续两次 seed 成功、关键数量与关系查询均匹配语料。
- 不使用 destructive reset；不泄露任何凭证。

