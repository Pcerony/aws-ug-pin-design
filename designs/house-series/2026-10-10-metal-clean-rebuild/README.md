# 9 / 12 金属质感重建

状态：2026-10-10 视觉阶段完成。四个独立网页对话生成并保存 9 V01/V02、12 V01/V02；用户认可 9 V02，随后接受 12 V02 并要求同步网站与 GitHub。当前首页和 3D 金属版使用 9 V02 / 12 V02，1、3、6 与拼块版未变。批准尺寸未改，仍非生产规格。下方生成过程及待评审措辞保留为历史。

## 本轮实际交付

用户后续评审：9 V02 基本认可，不大需要修复，保留且不再生成。12 V01 的银色饰条高光/阴影不均匀，仍显脏，明确不通过。下一次仅重建 12，重点减少碎反射和断续黑边，使银色带面及倒角的高光、接触阴影连续均匀；不改变布局或批准几何。新的独立网页对话使用早期 12 只约束布局、已认可 9 V02 只约束材质，轮廓 PNG 与原角色约束几何/身份，不上传被否定的 12 V01。

12 V02 已实际生成并下载为 [均匀银条修复候选](badge-12-v02-even-silver.png)，来源 https://chatgpt.com/c/6aca2fc9-2420-83e8-8873-529e86bd2701 。实际全文 `prompt-12-v02.txt`，网页证据 `badge-12-v02-web-proof.png`。原尺寸目视检查：宽外框灰斑与角部强烈黑白反射减少，1 竖银条和 2 斜银条的带面更加连续；2 底部细边仍有局部亮暗变化，不能宣称全边缘已完美均匀。布局/两角色动作保留，字宽与角色毫米尺度仍未精确落实。待用户评审；网站、其他徽章及批准规格没有改动。

|图稿|文件|网页来源|检查结果|
|---|---|---|---|
|9 V01|[原图](badge-9-v01-clean-rebuild.png)|https://chatgpt.com/c/6aca29f0-b0f4-83ec-b7ce-1457f455e172|银框更洁净，但字标偏大、蓝色偏饱和；保留失败记录，不进入网站|
|9 V02|[原图](badge-9-v02-clean-balanced.png)|https://chatgpt.com/c/6aca2ac5-bdec-83ee-b3d8-27a06d78835a|新对话重新上传相同早期参考，未上传 V01；蓝色降低饱和、字标收紧、完整 9 与两角色动作保留；待用户评审|
|12 V01|[原图](badge-12-v01-clean-rebuild.png)|https://chatgpt.com/c/6aca2a17-0d44-83ee-a206-a6591ead738a|完整双矩形、橙色底与凸字、左俯瞰右躺卧、宽银框保留；珐琅平面及 2 曲线较干净；待用户评审|

实际提交全文分别归档于 `prompt-9-v01.txt`、`prompt-9-v02.txt`、`prompt-12-v01.txt`，对应 `*-web-proof.png` 为网页生成证据截图。下方原有提示词是准备稿，不是本轮逐字提交稿。

已按原尺寸目视检查三个下载 PNG。它们仍是视觉候选，不是制造稿：LEADER 可见宽度仍超过 UG，吉祥物的 8.2 mm 目标也不能视为已精确落实；9 V02 的字标比首稿紧凑，但尚非精确排版认证。生成外形未替代批准 SVG，12 中央间距亦未作毫米精度认证。没有进行降噪、锐化或程序叠框。

## 用户要求

- 3 保留，不再修改；1、6 不在本轮范围。
- 9 的宽银框脏污、噪点感明显，需要重新生成。
- 12 的橙色成色、银框曲线和高光质量不合格，需要重新生成。
- 内容和已选布局保持不变；禁止转成拼块风格。
- 浏览器/电脑常规操作已获自主授权；本轮浏览器与电脑工具已连接，已完成真实上传、网页生成和下载。

## 方法

每枚开启独立网页 GPT 对话。不得把本次被否定的图片作为修图底片，也不得把下一张修订接在上一张劣化修订上。重新生成完整物件，而不是降噪、锐化或继续局部补丁。

参考输入分工：批准 SVG/PNG 只约束几何；早期选定图只用于内容位置和吉祥物动作；干净的 1 金属基准只用于材质。原始吉祥物素材约束身份细节。文字位置与大小用文字说明落实，不上传最新劣化图。

布局参考候选：
- 9：`../2026-10-08-mascot-series/badge-9-mascot-v03-complete-loop-clean-rim.png`
- 12：`../2026-10-08-mascot-series/badge-12-mascot-v02-overhead-reclining.png`
- 材质基准：`../2026-10-09-metal-engraved-rim/badge-1-v03-original-metal.png`
- 轮廓：`../../../specs/approved/badge-9.svg` 与 `badge-12.svg`，及对应 reference PNG。

上传前必须目视检查这些输入。不要把参考照片的轮廓当作批准尺寸。

## 9 提示词

```text
Create a NEW pristine manufactured metal-and-enamel numeral 9 badge from scratch. Do not retouch, denoise or imitate the surface artifacts of a previously generated image.

Reference roles: the target contour is geometry only; the earlier numeral 9 image is composition and mascot poses only; numeral 1 is polished metal/enamel quality only. Rebuild all material surfaces and edge geometry cleanly. Do not inherit grain, scratches, tarnish, mottling, irregular reflections or blurry lettering from any reference.

Keep the selected orange 9 on the left, its complete upper loop, architectural blue recesses, existing silver exposed thickness, original small house mascot poses, and ivory text field on the right. Do not add seams, tile divisions, thick plastic blocks or a new architecture. Use the selected restrained, lower-saturation blue, not green or electric cobalt. Mascot body width about 8.2 mm; preserve the original orange house identity, chimney, face, limbs and proportions.

Approved flat contour: 69.06419724575645 mm wide, 52 mm high. Vertices in mm: (4.532098622878225,0), (64.53209862287822,0), (69.06419724575645,0.19787569922922899), (64.53209862287822,52), (4.532098622878225,52), (0,0.19787569922922899). Do not turn it into a gable or an arbitrary hexagon.

One continuous broad polished SILVER rim, engraved cleanly with BUILD TOGETHER, AWS USER GROUP and COMMUNITY LEADERS. Engraving must be shallow and crisp; the surrounding silver must remain unblemished. Not brushed, weathered, hammered, matte grey or dark dirty metal. Use long smooth studio reflections with restrained highlights, no glitter or micro-speckle texture. Curves are analytically smooth, consistent radii, tangent joins, no waviness or jagged doubled edges. Orange and ivory enamel are even, glossy and clean.

aws with smile arrow, UG and LEADER form ONE compact ivory raised text group, centered within the right ivory blank field, internally left-aligned. Use the latest balanced 9 size: a little larger than the previous half-size trial, still clearly secondary to the numeral. LEADER is scaled proportionally to UG's visible width. No black letter faces, no artificial dark outline.

Front-facing orthographic studio product image, full badge visible with a modest white margin, no perspective, props or annotations. High-resolution clean product render, restrained shallow relief that can be manufactured as a badge, not a deep room. No grain, noise, distressed texture, oversharpened halos, stone, puzzle seams or extra borders. Render only this single 9 badge.
```

## 12 提示词

```text
Create a NEW pristine manufactured metal-and-enamel folding ROOF badge numbered 12 from scratch. This is a complete fresh reconstruction, not another image-editing pass over a degraded render.

Reference roles: approved target contour is geometry only; the earlier 12 image supplies numeral layout and mascot poses only; selected numeral 1 supplies clean polished metal/enamel material quality only. Do not reproduce the earlier image's surface, noise, highlights or incorrect borders.

ONE badge shown flat and unfolded: two equal perfect rectangular panels. Each panel is 60.81118318204309 mm wide by 89.90686582054276 mm high. Separation is 2 mm, total spread 123.62236636408618 mm. Equal panel sizes, straight parallel edges, square corners, no taper, gable, warped outline or perspective. Left panel contains the selected architectural 1; right panel contains the selected geometric 2. Preserve numeral layout and the blue openings. Background on BOTH panels is the SAME orange enamel as the numerals, with relief defined through subtle light and shadow.

Left mascot preserves the selected overhead roof/skylight view and original action. Right mascot is the same orange house character reclining comfortably on the roof in the selected pose. Do not replace either with a front-facing person standing in a door. Mascot body width about 8.2 mm on each panel; original house silhouette, chimney, face, hands and shoes remain consistent. No enlarged characters.

Add one broad continuous polished silver rim around each panel, with shallow clean engraving BUILD TOGETHER / AWS USER GROUP / COMMUNITY LEADERS, correctly spelled. Rebuild silver from clean smooth surfaces: broad coherent softbox highlights, no tarnish, smudges, scratches, mottled grey, grain, pitting, glitter or chaotic reflection stripes. Internal silver structure expresses the selected exposed thickness, not an extra decorative ring. Numeral 2 curves are smooth and tangent, with crisp consistent edge radii; do not use dull swollen curves or wavy multiple outlines.

Orange is rich, clean, even glossy enamel, not rust, brown, yellow mottling or textured paint. Blue is the selected restrained lower-saturation blue, not green. Keep small aws plus smile arrow / UG / LEADER as a compact orange raised group below the 2, aligned left and secondary to the numeral; LEADER matches UG's width by proportional scaling. No ivory or black letter faces on the orange roof. Preserve its selected placement and the room for the reclining mascot.

Front-facing orthographic white-background studio product render. Full unfolded badge visible, no crop, props or room-like depth. Manufacture-like shallow relief; no puzzle joints, plastic blocks, stone grain, jagged edges, sharpening halos or annotations. Prioritize pristine material quality and clean geometry over excessive reflection detail. Generate only this single unfolded 12 badge.
```

## 验收与替换门槛

先逐枚看完整构图，再看原尺寸下的 2 圆弧、宽银框、刻字、数字转折和珐琅平面。未达到干净金属基准时不进入网站，不把失败稿称为已通过。AI 外轮廓仍非精度保证，最终边界由 V0.12 SVG 定义，禁止改变规格或拉伸数字与圆弧。旧图、失败稿和拼块分支全部保留；未经用户另行要求不发布。
