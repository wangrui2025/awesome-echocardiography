# Awesome Echocardiography 全站排版、间距与年月日标准

`src/styles/tokens.css` 是本站可执行设计值的唯一来源；`global.css` 及五种页面组件实际消费它。标准只约束本仓库，其他站点保留自己的字级、字体和视觉风格。当前实施、正式 CI、合并与发布证据集中在 [PR #39](https://github.com/wangrui2025/awesome-echocardiography/pull/39)。

## 读者与页面角色

Web expression: APPLY_LIGHT — 帮助研究者在已有领域入口、论文目录、数据集介绍、研究地图和指标解释之间连续阅读；沿用现有标题、段落、导航、论文条目及 KaTeX 公式结构，用一致的字号层级、行距、阅读宽度和日期降低切换成本；不改变目录内容、科研主张、顺序、CPU 参考语义或代码可用性标签。验收使用全部页面的真实计算值和桌面/手机渲染。

## 本站角色表

| 项目 | 规则 |
| --- | --- |
| 正文与普通界面字体 | Inter / 系统无衬线；源码文字使用系统等宽 |
| 基本字级 | meta 12px，caption 14px，body 16px，subheading 18px，lead 20px，card 22px，stat 24px |
| 显示角色 | hero / page / section / callout / metric / map 使用在 owner 中声明的响应式 clamp；同一角色由所有对应页面复用 |
| 字重 | normal 400、medium 500、semibold 600、bold 700；`strong`/`b` 明确使用 bold，避免浏览器相对粗体累加 |
| 行高 | display 1.05、heading 1.3、compact 1.5、body 1.65、reading 1.75 |
| 间距 | 4px 根单位，有限档 2/4/8/12/16/20/24/32/40/48/56/64/72/80/96/128/160px；正负对齐均引用同一尺度 |
| 宽度 | site 67.5rem、title 57.5rem、reading-wide 52rem、reading 48rem、lead 40rem、note 32rem；页面左右留白由同一间距单位生成 |
| 日期 | `calendarDate` 在现有 PaperCard 展示边界输出中文 `YYYY年M月D日` 或英文 `YYYY-MM-DD`，年月/年保持已知精度；ISO 数据与 `datetime` 原值保持，不进行时区转换 |

KaTeX 的数学字体、基线、脚标、公式内嵌几何保持由 KaTeX 管理。外层公式字号缩放明确放在本站 token owner；公式阅读容器的普通 padding/margin 接入本站尺度。指标表在手机上保留局部横向滚动，不允许整页溢出。研究地图连接线和网格列的结构尺寸不作为正文阅读间距。

## 实际覆盖

从构建输出动态枚举全部 HTML，目前为中文/英文各 6 页：首页、Papers、Map、Metrics、CAMUS 和 EchoNet-Dynamic，共 12 页。新增独立页面也必须实际加载和消费同一 owner；仅添加 CSS 文件或在文档中写规则不能通过。

## 验收标准

1. `npm run build` 保留 Astro type-check/build，先运行日期和缺陷坏例，再检查全部源样式与所有生成 HTML 的真实 CSS 依赖。
2. `npm run test:browser` 对所有实际生成 HTML 使用 Chromium/WebKit，桌面 1440×900 和手机 440×956 CSS px。检查实际字体、字级、行高、横向溢出、已存在的核验日期、语言切换和数学公式数量。
3. 在实际 body、正文 section 和 main 上改变字体、字号、行高、间距根单位、站点宽度，等待浏览器布局后检查属性变化，并完整恢复；公共页头的正常不能代替正文证据。
4. 检查包含遗漏共享样式和普通 `calc(18px)` / 正负混合硬编码间距的坏例；原始日期、机器时间戳、文件标识保持不变。只渲染年或年月的材料不得补造日期。
5. 保留 CPU Reference Metrics 独立 CI 和冻结审计；任何科学变化均不属于本次排版工作。Vercel same-repository Preview secret 条件及主分支生产发布来源保持。
6. 合并前检查当前 head/base、正式 CI、Preview 和代表性截图；合并后读回 main SHA、生产 provider 身份与真实页面。

## 工程归属

现有 `ci.yml` 的 build job 增加本站浏览器验收并固定兼容的 Ubuntu 24.04；reference-metrics job 独立保留。浏览器报告绑定 `${github.sha}`，保存 3 天。`deploy.yml` 继续只把已授权来源交给 Vercel，未增加第二个部署平台。

本地 build 与测试发现结果只证明本地候选；正式浏览器、合并和 Production 结果须从 PR 的最新记录读取，不能用历史绿色结果替代。

Feature-level goals and protected semantics: [Intent](../intent/README.md). This file retains its existing ownership and history.
