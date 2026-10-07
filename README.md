# AWS UG 可拼装徽章项目

## 当前状态
2026-10-07：用户已确认V0.12轮廓与装配尺寸。下一阶段优先发展数字1的方案2（折带）和方案5（彩窗镶面），不再改变外轮廓。

线上：[方案展示](https://pin.heisei.space/) · [尺寸与组装](https://pin.heisei.space/badge-dimensions.html) · [历史档案](https://pin.heisei.space/design-archive.html)

## AI接手入口
先读[项目规划与协作指南](项目核心规范与Agent协作指南.md)，再读[批准尺寸JSON](specs/approved/house-v012.json)与[母版包说明](specs/approved/README.md)。
新对话必须明确提供这些文件，不会自动读取其他对话记忆。

每枚独立生成。AI图片不能保证精确毫米外形；最终外边界由SVG母版固定，只改变内场。所有图纸仍为非生产文件。

## 已确认母版
- 前后山墙：80 × 80 mm，底边68，板厚5。
- 左右侧墙：69.064197246 × 52 mm，核心底边60，板厚5。
- 屋顶每半片：60.811183182 × 89.906865821 mm，板厚5。
- 底座：100 × 120 mm，5层完全相同纸板，单层1.1，总厚5.5。
- 前后墙外倾5°，侧墙内凹12，屋顶前后/左右每端外延3。

完整精度、顶点与派生尺寸以JSON和SVG为准。网页本地草案与项目批准版本不同；“载入已确认尺寸”可恢复批准值。

## 网站与文件
- index.html：最新五方向、批准轮廓、尺寸摘要、资料导航。
- badge-dimensions.html：SVG参数工作台、3D组装与五层展开，保留独立入口。
- design-archive.html：已有仓库的64张历史原始图，搜索、分类、原图查看。
- specs/approved/：用户原始导出、批准JSON、SVG、AI上传参考PNG。
- designs/number-one/2026-10-07/：最新五方向与完整原始提示词。
- designs/explorations/：此前四轮生图资料，保留原图与记录。
- docs/history/：过时规范与旧展示页快照，不是当前主规范。
- assets/css/project.css、assets/js/project.js：统一网站样式与图库交互。
- output/：测试截图、下载等临时产物，忽略Git提交。

历史方案及参考图根目录路径保留，避免破坏旧链接。云端占位文件未下载时不得覆盖或删除。旧样式、旧脚本和旧生成器仍保留用于追溯；当前站点不依赖未下载的旧展示页样式。

## 生成与验证
```sh
node scripts/export-approved.mjs
node scripts/build-project.mjs
node --test tests/approved-project.test.cjs tests/unified-site.test.cjs tests/badge-dimensions.test.cjs tests/badge-base.test.cjs
python3 -m http.server 4173 --bind 127.0.0.1
```

预览http://127.0.0.1:4173；端口占用时更换。当前静态站点可直接打开HTML，不需要打包或外部CDN。旧scripts/build.mjs可能覆盖页面，未经检查不要运行它。

## 历史生图轮次
[归档清单与下载状态](designs/explorations/README.md)：此前四轮已经移入本地正式归档，但仍为OneDrive占位文件，待恢复下载后再完整发布，不上传空文件。

[数字1五方向](designs/number-one/2026-10-07/README.md)已完整保留原图及提示词，并用于当前网站。

第三方许可在assets/vendor/。实际装配缝、铰链、纸板独立内片固定与制造公差仍需单独验证。
