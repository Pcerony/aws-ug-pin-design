# 下一阶段：3D 组合与工艺精修
2026-10-10 当前任务已变为网页 GPT 重建金属版 9、12 的干净质感，3 V05 和其余已保留版本不动。先读 [当前完整交接](handoff-2026-10-10-metal-quality.md)；下方是历史阶段，不代表尚需重新设计整套系列。新图先评审，不默认同步或发布网站。

最新资产入口：[吉祥物统一尺度版](../designs/house-series/2026-10-08-mascot-scale-fitted/README.md)。1 V07、3 V01、6 V04、9 V03、12 V03。以后动作变化也按约 8.2 mm 小房子主体尺度检查，不再逐面自由放大。


2026-10-08 最新进度：用户授权最新吉祥物整套进入 3D。当前入口：[吉祥物系列](../designs/house-series/2026-10-08-mascot-selected/README.md)。1 V06、3 V01、6 窗内 V03、9 完整圆头 V03、12 俯瞰及躺卧 V02。当前已本地同步，未发布线上；后续先评审组装，不默认继续生图。

1. 在 [V0.12 组合](../badge-dimensions.html?approved=1#model)检查四面墙的外侧阅读方向，以及 12 两半的折叠朝向。
2. 原图保留；内场等比例拟合，边界只用批准 SVG。3/9/屋顶新增的象牙白留白是内场适配，不改变板件尺寸。
3. 继续精修字形、LEADER 与 UG 等宽、珐琅分区及真实浮雕。当前 3D 为平面贴图与批准板厚，不是制造浮雕模型。
4. 接缝、铰链、底座内片固定与材料公差仍需实物试装。生产就绪仍为 false，本地更新未自动发布。

最新文字材质已改为[米白色凸字](../designs/house-series/2026-10-08-ivory-lettering/README.md)：aws、微笑箭头、UG、LEADER 与象牙白内场同系，只用柔和阴影和高光表现起伏。下方历史提示词中的黑字要求已失效，不得用于新修订。当前图库与 3D 贴图使用此版本，原选定构图及批准尺寸不变。

## 历史生图交接（已完成选型）

更新：2026-10-08。用户已授权启动生成，3、6、9、12 首轮独立概念图已归档于 [本轮记录](../designs/house-series/2026-10-08-kahn-enamel/README.md)，待评审与母版精修。先遵循[主规范](../项目核心规范与Agent协作指南.md)和[当前设计语言](design-system-2026-10-08.md)。

最新建筑适配要求：3/9 是侧墙，6 是背墙，蓝色开口应作为相应立面窗而非重复正门；12 是屋顶，使用俯视天窗与屋面体块，不放门洞。此前专属提示词为起点，实际首轮提示词和已知几何偏差见归档，不能把首轮图当作已批准尺寸稿。

## 开始新 AI 对话时

新对话没有本地文件访问或历史记忆时，必须实际附上本说明、设计语言、批准 JSON、目标轮廓参考及数字 1 修订 04；不能只说「按之前的尺寸」。本次文件尚未发布，不假定线上网站包含最新内容。

共同风格参考仅用：`designs/number-one/2026-10-08-kahn-refinement/04-smooth-arch-left-aligned-type.png`。

每次选择一个编号，带上对应 `specs/approved/badge-{id}.svg` 与 `badge-{id}-reference.png`。如果生图服务不接受 SVG，上传参考 PNG，同时提供 JSON 中的准确尺寸和顶点；最终交付仍以 SVG 定边。

## 部件与任务状态

|编号|房屋位置|平面母版 mm|下一步任务|状态|
|---|---|---|---|---|
|1|正面山墙|80 × 80，底边 68|保留 04 为视觉基准；精确文字与圆弧待矢量落实|风格选定，非生产稿|
|3|左侧墙|69.06419724575645 × 52|发展橙色 3 的连续几何体块与少量蓝色开口|待设计|
|6|背面山墙|80 × 80，底边 68|发展橙色 6 的围合与大开口，不是旋转数字 1|待设计|
|9|右侧墙|69.06419724575645 × 52|发展橙色 9 的围合与竖向体块，不是直接翻转成品 6|待设计|
|12|双片折叠屋顶|每片 60.81118318204309 × 89.90686582054276|在两片直角矩形内组织 12 与字标，跨片关系另评审|待设计|

板厚全部 5 mm，仅用于装配；不把它理解为每个内部图案都要凸起 5 mm。3/9 两端三角补片每端 4.532098622878225 mm，核心底边 60 mm，不能简化成矩形。12 双片展开宽 123.62236636408618 mm，中央 2 mm 连接区不是实心珐琅面。

所有顶点以 JSON 的 `badges[].polygons` 和各 SVG 路径为准，不从上表或图片反算。装配外倾、内凹、屋顶外延和五层纸板底座均不变。本轮不设计新的底座图案或铰链。

## 建议执行顺序

1. 先生成 3，验证由山墙转为横向侧墙时是否仍有同系列感。
2. 再生成 6，验证几何圆弧与围合数字，而不是重演数字 1 门洞。
3. 再生成 9，与 3 的侧墙母版、6 的圆弧语言保持关联，但独立处理数字与文字。
4. 最后生成 12，先看双片展开的一枚屋顶设计，再单独检查每片。可以另存 12L/12R 图，但不得改变尺寸、把中央连接区填满或把 12 当成两个编号。

以上是建议顺序和构造起点，不是已批准造型。用户要求批量时可依次执行，仍逐枚独立生成。不要擅自为每枚再跑十个风格，也不把每一张新生成图连锁作为下一枚的唯一参考。

## 共同提示词

实际调用时填写目标编号与尺寸，再追加该编号专属段。提示词描述约束，不保证 AI 精度。

```text
Generate ONE finished collectible AWS UG LEADER enamel badge for numeral
[TARGET NUMBER], viewed straight-on orthographically, complete and uncropped
on white, without props. Do not create a contact sheet or a building model.

Reference A is the selected numeral 1 revision 04: use it ONLY for series
material, palette, simple monumental geometry and polished silver structure.
Reference B is the target badge's approved V0.12 contour: use it for the
immutable boundary. The target outline and target numeral override the
gable outline and numeral 1 visible in reference A. Design ONLY the interior.
Target dimensions and vertices: [COPY FROM APPROVED JSON / TARGET SVG].

Make a clearly readable orange numeral from broad architectural bodies and
simple openings, not ordinary typography pasted onto a facade. Smooth orange,
cobalt-blue and ivory enamel, polished silver structural bands and black
lettering. Few complete geometric shapes, restrained shallow relief, clean
manufactured enamel appearance. Silver arcs must be concentric and smoothly
tangent to straight jambs wherever a round-headed opening is used.

The text stack is aws with smile arrow, then UG, then LEADER. All three share
one left alignment axis. UG remains large. Scale LEADER proportionally so
the full word has the same total visible width as UG; their left and right
edges align. Never horizontally squeeze the letters. Keep all lettering
legible, correctly spelled, clear of the numeral, and inside the contour.

No stone grain, masonry seams, small decorative windows, stairs, pedestal,
tiny corner text, thick double rim, wreath, star, radial ornament, extra
colors, protrusions, perspective, crop or red annotations. Do not copy the
numeral 1 layout literally; translate its design language to this numeral.
```

## 每枚专属提示补充（待试验）

### 3
```text
Target 3 is the approved six-vertex side-wall contour, not a gable and not
a plain rectangle: 69.06419724575645 x 52 mm with a 60 mm core bottom and
the approved triangular end wings. Make numeral 3 unambiguous through two
generous curved architectural bodies joined into one orange structure.
Use a restrained cobalt-blue recessed field and smooth silver transitions.
Do not multiply small windows or imitate a literal house facade.
```

### 6
```text
Target 6 uses the approved 80 x 80 mm gable, clockwise vertices
(40,0),(80,40),(74,80),(6,80),(0,40), bottom width 68 mm.
Build a clearly readable orange 6 with one generous enclosed opening and
a coherent upper stroke. Use the circular enclosure as architectural space,
with restrained blue enamel and polished silver. Do not merely replace
the 1 label or rotate numeral 1's portal; keep the numeral itself structural.
```

### 9
```text
Target 9 uses the approved six-vertex side-wall contour:
69.06419724575645 x 52 mm, core bottom 60 mm, approved triangular end wings.
Build an unambiguous orange 9 from a generous upper enclosure and descending
structural stroke. Adapt text placement to this side-wall shape. Do not
rotate the finished 6 image, because its gable and lettering are not valid
for this target. Keep the same smooth enamel and polished silver language.
```

### 12
```text
Target 12 is ONE folding roof badge with TWO equal right-angle rectangles.
Each is 60.81118318204309 x 89.90686582054276 mm; flat spread width is
123.62236636408618 mm including a 2 mm central connection zone.
Use the approved two-panel contour exactly; leave that central zone unfilled.
Show this single badge flat and unfolded, not a perspective roof model.
Develop a coherent readable orange 12 across the interior composition with
the same silver/blue/ivory language. Keep the text stack intact and clear
of the fold. Do not automatically duplicate the complete 12 or text stack
on both panels. Panel assignment and folded readability require review.
```

## 归档与验收

新产出放 `designs/house-series/日期-kahn-enamel/`（真正开始生成时再建），用 `badge-3-v01-original.png` 等明确编号；12 展开图用 `badge-12-v01-original.png`，半片文件标注 12L/12R。README 记录完整实际提示词、参考输入、工具/对话来源、用户反馈和已知偏差。原图不覆盖，失败尝试也不伪装为通过版本。

逐枚检查：数字正确可读、同族材质、没有新增碎细节、字标左对齐、LEADER 与 UG 等宽、目标轮廓无变形。再把内部 artwork 适配到批准 SVG；不要拉伸完整徽章照片，否则同时扭曲数字与圆弧。

可用 `node scripts/compose-badge.mjs 3 interior.png designs/house-series/日期-kahn-enamel/badge-3-v01.svg` 创建固定边界设计容器。输入应是整理后的内场图，不是未经检查的白背景成品照片；等比例覆盖可能裁掉文字，必须复核。该脚本不会自动修正排版、去除原金属外边或矢量化图案。

生成图通过视觉评审后仍不等于生产就绪。最后复核母版路径、字形、同心圆弧、线宽、浮雕、珐琅分区、铰链与公差。网站同步、提交与发布属于后续单独任务。
