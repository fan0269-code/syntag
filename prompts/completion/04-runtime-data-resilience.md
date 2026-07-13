# Prompt 04/08：数据运行时、API 与故障语义

## 目标

让“无数据/数据库不可用/实体不存在/参数错误”成为可区分、可恢复的状态。当前页面把数据库缺失抹平为通用崩溃或“没有结果”，这会误导用户和运维人员。

## 范围

仅修改数据库访问层、实体查询层、`/api/graph`、`/api/search`、加载/错误/空状态以及对应测试。不要新增业务功能、不要改写内容、不要做视觉重设计。

## 必读文件

- `src/lib/db.ts`、`src/lib/api.ts`
- `src/lib/entities/*.ts`、`src/lib/graph-data.ts`、`src/lib/search.ts`
- `src/app/api/graph/route.ts`、`src/app/api/search/route.ts`
- `src/app/error.tsx`、`src/app/not-found.tsx`、`src/app/loading.tsx`
- 现有 API、实体与搜索测试

## 必做行为

1. 定义并统一区分：
   - 参数无效：HTTP 400，说明哪个参数不合法；
   - 实体/已发布学科不存在：HTTP 404；
   - 数据库未配置或暂不可用：HTTP 503，用户侧提示“数据暂不可用”，不得暴露堆栈、连接串或实现细节；
   - 意外服务错误：HTTP 500，记录服务端日志，用户侧给恢复路径。
2. 搜索在数据库不可用时不得显示“没有匹配理论”。它应显示明确的服务暂不可用状态，并保留搜索输入与返回首页/稍后重试路径。
3. 详情页不能把 `DatabaseUnavailableError` 直接交给没有 Header/Footer 的通用错误边界。为可预期的数据故障提供一致的站内错误页，包含回到首页或可用索引的真实链接；真正不存在的 slug 仍应是 404。
4. 首页正式环境不得静默把生产故障伪装成完整的 `sampleGraph`。允许开发演示样例时，必须满足：仅开发环境、界面明确标注为样例/演示、不会被 sitemap 或正式数据统计当作真实内容。更优方案是正式环境显示可理解的服务状态。
5. API cache header 只在成功的内容响应上设置；错误响应不能被长期公共缓存。
6. 为上述四类状态添加测试，尤其包括无 `DATABASE_URL`、未知 discipline、未知 mode、未知 slug、空搜索词和服务不可用搜索。

## 验收方法

- 不配置 `DATABASE_URL` 时：API 返回预期 503，首页/搜索/详情页均可理解且无空白页；浏览器控制台不显示未处理错误。
- 配置并 seed 后：`/api/graph?discipline=education&mode=genealogy`、搜索、一个理论详情页返回真实内容。
- `npm test`、`npm run lint`、`npm run build` 通过。

## 禁止事项

- 不吞掉所有异常后返回空数组或 200；这会再次把服务故障伪装为零结果。
- 不在客户端暴露数据库报错文本或环境变量。

