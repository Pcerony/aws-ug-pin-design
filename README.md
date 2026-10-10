# AWS UG 可拼装徽章项目

## 当前状态
2026-10-10：视觉设计阶段性完成。金属版展示采用 1 V03、3 V05、6 V01，以及新评审的 [9 V02 / 12 V02](designs/house-series/2026-10-10-metal-clean-rebuild/README.md)。首页与 3D 金属贴图已更新；拼块版橙色 Leader、绿色 Speaker、紫色 Volunteer 保留现有版本。用户已要求将当前网站同步到 GitHub。尺寸与装配仍以 V0.12 为准，视觉完成不等于制造批准。以下是历史阶段记录。

最新网站使用[吉祥物统一尺度版](designs/house-series/2026-10-08-mascot-scale-fitted/README.md)：以 3、9 为大小基准，缩小 1、6、12；保留 1 落地、6 搭窗台、12 左俯瞰及右躺卧。批准尺寸不变。下方是此前更新记录。

当前本地图库与 3D 使用[吉祥物系列](designs/house-series/2026-10-08-mascot-selected/README.md)：1 V06、3 V01、6 仅窗内吉祥物 V03、9 完整圆头 V03、12 俯瞰与躺卧 V02。墙面米白凸字、屋顶橙色背景与凸字不变。批准尺寸不变，旧版保留；此次未推送发布。

2026-10-08：1、3、6、9、12 五枚视觉方案均已选定，进入固定边界适配与 3D 组装评审。12 采用左 C 的 1、右 D 的 2 合并版。V0.12 轮廓与装配尺寸仍保持 2026-10-07 批准值。

视觉基准：[数字 1 修订 04](designs/number-one/2026-10-08-kahn-refinement/04-smooth-arch-left-aligned-type.png)。这是选定的风格方向，不是精确轮廓或生产工程稿。

当前五枚来源及适配见[选定系列](designs/house-series/2026-10-08-selected/README.md)。六个板面已等比例提取内场并按批准 SVG 限定边界；12 的两半仍属于一枚徽章。文字矢量、浮雕及制造工艺尚未定稿。

最新图库与 3D 使用[米白凸字版本](designs/house-series/2026-10-08-ivory-lettering/README.md)：所有黑色文字及微笑箭头改为同系米白色，用浅阴影和高光表现凸起。其余图案与尺寸不变，旧版原图保留。

[当前设计 3D 组合](badge-dimensions.html?approved=1#model)：使用批准尺寸，不覆盖浏览器中已有草案。可切换贴图/素模、观察方向、分解和下插。本次更新本地网站，未自动推送 GitHub。

线上：[方案展示](https://pin.heisei.space/) · [尺寸与组装](https://pin.heisei.space/badge-dimensions.html) · [历史档案](https://pin.heisei.space/design-archive.html)

## AI接手入口
先读[项目规划与协作指南](项目核心规范与Agent协作指南.md)、[批准尺寸JSON](specs/approved/house-v012.json)与[母版包说明](specs/approved/README.md)，再读[当前设计语言](docs/design-system-2026-10-08.md)和[下一阶段生图交接](docs/next-stage-generation.md)。
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
- index.html：本地已同步五枚选定系列，历史方向保留；线上状态与本地修改分开管理。
- badge-dimensions.html：SVG参数工作台、3D组装与五层展开，保留独立入口。
- design-archive.html：已有仓库的64张历史原始图，搜索、分类、原图查看。
- specs/approved/：用户原始导出、批准JSON、SVG、AI上传参考PNG。
- designs/number-one/2026-10-08-kahn-refinement/：当前数字 1 视觉基准与四次局部修订，原图均保留。
- designs/number-one/2026-10-07*/、2026-10-08-architects/：历史探索和原始提示词；方案 2/5 仅为早期偏好。
- docs/design-system-2026-10-08.md：当前系列配色、材质、数字结构与排版规则。
- docs/next-stage-generation.md：当前 3D 评审与工艺任务，历史生图提示词保留追溯。
- designs/house-series/2026-10-08-selected/：当前清单、固定边界 SVG、六面 PNG 贴图与适配记录。
- designs/explorations/：此前四轮生图资料，保留原图与记录。
- docs/history/：过时规范与旧展示页快照，不是当前主规范。
- assets/css/project.css、assets/js/project.js：统一网站样式与图库交互。
- output/：测试截图、下载等临时产物，忽略Git提交。

历史方案及参考图根目录路径保留，避免破坏旧链接。云端占位文件未下载时不得覆盖或删除。旧样式、旧脚本和旧生成器仍保留用于追溯；当前站点不依赖未下载的旧展示页样式。

## 生成与验证
```sh
node scripts/export-approved.mjs
node scripts/export-selected-artwork.mjs
node scripts/build-project.mjs
node --test tests/approved-project.test.cjs tests/unified-site.test.cjs tests/badge-dimensions.test.cjs tests/badge-base.test.cjs
python3 -m http.server 4173 --bind 127.0.0.1
```

预览http://127.0.0.1:4173；端口占用时更换。当前静态站点可直接打开HTML，不需要打包或外部CDN。旧scripts/build.mjs可能覆盖页面，未经检查不要运行它。

## 历史生图轮次
[归档清单与下载状态](designs/explorations/README.md)：此前四轮已经移入本地正式归档，但仍为OneDrive占位文件，待恢复下载后再完整发布，不上传空文件。

[数字1五方向](designs/number-one/2026-10-07/README.md)已完整保留原图及提示词。之后的[十位建筑师探索](designs/number-one/2026-10-08-architects/README.md)中，用户选择 06 康几何继续简化，最终以[修订 04](designs/number-one/2026-10-08-kahn-refinement/README.md)进入系列开发。历史提示词中的小窗、阶梯、石纹、短底脚、文字最小字高和无参考图规则不再覆盖当前规范。

第三方许可在assets/vendor/。实际装配缝、铰链、纸板独立内片固定与制造公差仍需单独验证。
