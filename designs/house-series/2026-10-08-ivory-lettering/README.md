# 米白同色凸字修订

2026-10-08。用户要求 aws、微笑箭头、UG、LEADER 从黑色改成与象牙白内场同系的米白色，只用柔和高光和阴影表现凸起。五枚既定结构及 V0.12 尺寸不变。旧黑字原图、旧 SVG/PNG 均保留在原目录。

使用内置 image generation 工具逐面局部编辑。编辑图只提供文字区域，实际贴图将其文字区域覆盖到原来的固定边界纹理上，不继承生成图对橙色数字、窗或金属结构的轻微漂移。12L 无文字，保持原图；12R 更新。生成图的外缘透明毛边不作为母版，也不进入最终交付外边界。

最终 PNG、SVG 和展开屋顶在本目录。贴图及图库同步这次修订；真实浮雕、制造公差与字形矢量仍待精修。本次只修改本地，未推送发布。

## 导出与验证

`node scripts/export-selected-artwork.mjs --png-session badge-current` 从已打开工作台的 Playwright 会话导出当前 Canvas，再嵌入批准 SVG 路径。仅重建 SVG 可运行 `node scripts/export-selected-artwork.mjs`。`node scripts/build-project.mjs` 更新图库。

文字区域以柔边合成，保留原建筑图案；批准轮廓负责最终裁切。31 项相关自动测试通过。桌面 1440 × 1000、移动端 390 × 844 已检查，五枚图库图片正常加载，无横向溢出，3D 贴图可见。文字区域像素检查未发现纯黑字面；浅灰阴影仍保留。

## 完整实际提示词及来源

### 1

编辑输入：`../2026-10-08-selected/badge-1-texture.png`

编辑输出：`badge-1-ivory-edit.png`

原始生成文件：`/Users/heisei/.codex/generated_images/01a1048f-958b-7ca2-9dad-2f726fe48ab9/exec-38f773c8-50dc-4d4a-b7e0-0fbe1f41fce2.png`

```text
Edit this exact existing badge texture, not a new design. Change ONLY the black lettering aws, its smile arrow, UG and LEADER into warm IVORY / OFF-WHITE raised enamel lettering matching the adjacent ivory badge field. Tone-on-tone blind embossing: letter front faces almost the same ivory color as the background, delicate white upper-left edge highlights and very soft warm gray lower-right cast shadows to express a shallow raised relief. No black ink, no dark metal outline, no silver letter faces, no dark gray letter fronts. All letter strokes and the entire smile arrow must be ivory. Preserve typography, left alignment, scale and positions as closely as possible. Ensure aws remains fully spelled and readable, restore the complete final s if its edge was clipped; keep all text slightly inside the boundary. Preserve EXACTLY the orange numeral1, cobalt blue arch, silver structural thickness, ivory field, outer five-sided contour, view, material and layout. Keep this precise square canvas and full object framing with transparent exterior. No additional ornament, no background, no perspective. This is a precise color/material edit only; shallow relief not giant extruded letters.
```

### 3

编辑输入：`../2026-10-08-selected/badge-3-texture.png`

编辑输出：`badge-3-ivory-edit.png`

原始生成文件：`/Users/heisei/.codex/generated_images/01a1048f-958b-7ca2-9dad-2f726fe48ab9/exec-392c7101-c57a-41a0-91fe-c069d3ceda51.png`

```text
Precise material-only edit of this existing enamel badge texture. Recolor ONLY black aws lettering, its entire smile arrow, UG and LEADER to warm ivory/off-white enamel, the SAME tone as the surrounding ivory field. Subtle tone-on-tone raised lettering: almost identical frontface and background colors, delicate white upper-left highlights and soft warm gray lower-right shadows indicating shallow relief. No black/dark letter faces, no dark outline, no metallic silver typography. Preserve exact shapes, fonts, text size, left alignment and positions. Preserve all orange numeral geometry, cobalt blue recessed planes, silver structural thickness, rim and ivory field, contour and layout. Do not redesign or add objects, do not change orange/blue/silver, no perspective. Same aspect ratio and full-canvas framing as input. Transparent outside the badge only, entire badge interior stays opaque ivory/enamel. Text stays legible only through gentle relief shading, not through contrasting ink. One individual badge surface. Target numeral3: keep orange3 on RIGHT, text on LEFT, two blue horizontal recesses, upper and lower ivory margins. Exact target width69.06419724575645mm byheight52mm, same six-vertex winged side-wall boundary as input; do not change to a gable or ordinary rectangle.
```

### 6

编辑输入：`../2026-10-08-selected/badge-6-texture.png`

编辑输出：`badge-6-ivory-edit.png`

原始生成文件：`/Users/heisei/.codex/generated_images/01a1048f-958b-7ca2-9dad-2f726fe48ab9/exec-fa805d87-69ed-4d89-b144-6d557f93bddf.png`

```text
Precise material-only edit of this existing enamel badge texture. Recolor ONLY black aws lettering, its entire smile arrow, UG and LEADER to warm ivory/off-white enamel, the SAME tone as the surrounding ivory field. Subtle tone-on-tone raised lettering: almost identical frontface and background colors, delicate white upper-left highlights and soft warm gray lower-right shadows indicating shallow relief. No black/dark letter faces, no dark outline, no metallic silver typography. Preserve exact shapes, fonts, text size, left alignment and positions. Preserve all orange numeral geometry, cobalt blue recessed planes, silver structural thickness, rim and ivory field, contour and layout. Do not redesign or add objects, do not change orange/blue/silver, no perspective. Same aspect ratio and full-canvas framing as input. Transparent outside the badge only, entire badge interior stays opaque ivory/enamel. Text stays legible only through gentle relief shading, not through contrasting ink. One individual badge surface. Target numeral6: preserve the orange6 curved mass and upper diagonal, blue underlayer lower-left and blue rectangular horizontal window with short exposed silver right reveal. Gable80x80mm, approved vertices(40,0),(80,40),(74,80),(6,80),(0,40). Ensure the final s in aws is complete and inside the contour, repair any clipped edge without increasing text width. Leave all other artwork unchanged.
```

### 9

编辑输入：`../2026-10-08-selected/badge-9-texture.png`

编辑输出：`badge-9-ivory-edit.png`

原始生成文件：`/Users/heisei/.codex/generated_images/01a1048f-958b-7ca2-9dad-2f726fe48ab9/exec-41117110-1cc0-4dba-9f4f-24fc26ab9667.png`

```text
Precise material-only edit of this existing enamel badge texture. Recolor ONLY black aws lettering, its entire smile arrow, UG and LEADER to warm ivory/off-white enamel, the SAME tone as the surrounding ivory field. Subtle tone-on-tone raised lettering: almost identical frontface and background colors, delicate white upper-left highlights and soft warm gray lower-right shadows indicating shallow relief. No black/dark letter faces, no dark outline, no metallic silver typography. Preserve exact shapes, fonts, text size, left alignment and positions. Preserve all orange numeral geometry, cobalt blue recessed planes, silver structural thickness, rim and ivory field, contour and layout. Do not redesign or add objects, do not change orange/blue/silver, no perspective. Same aspect ratio and full-canvas framing as input. Transparent outside the badge only, entire badge interior stays opaque ivory/enamel. Text stays legible only through gentle relief shading, not through contrasting ink. One individual badge surface. Target numeral9: preserve orange9 on LEFT, blue arch window with partial silver right jamb, blue lowerleft layer, text on RIGHT, top/bottom ivory margins. Exact target69.06419724575645mm wide x52mm high with approved six-vertex side-wall outline as input. Do not change the layout, windows or numeral.
```

### 12R

编辑输入：`../2026-10-08-selected/badge-12R-texture.png`

编辑输出：`badge-12R-ivory-edit.png`

原始生成文件：`/Users/heisei/.codex/generated_images/01a1048f-958b-7ca2-9dad-2f726fe48ab9/exec-eae26cd7-c7d7-4313-acc6-0fba5f235e59.png`

```text
Precise material-only edit of this existing enamel badge texture. Recolor ONLY black aws lettering, its entire smile arrow, UG and LEADER to warm ivory/off-white enamel, the SAME tone as the surrounding ivory field. Subtle tone-on-tone raised lettering: almost identical frontface and background colors, delicate white upper-left highlights and soft warm gray lower-right shadows indicating shallow relief. No black/dark letter faces, no dark outline, no metallic silver typography. Preserve exact shapes, fonts, text size, left alignment and positions. Preserve all orange numeral geometry, cobalt blue recessed planes, silver structural thickness, rim and ivory field, contour and layout. Do not redesign or add objects, do not change orange/blue/silver, no perspective. Same aspect ratio and full-canvas framing as input. Transparent outside the badge only, entire badge interior stays opaque ivory/enamel. Text stays legible only through gentle relief shading, not through contrasting ink. One individual badge surface. This is ONLY the RIGHT rectangle of roof badge12, containing orange numeral2 above and aws/UG/LEADER below. Preserve its tall perfect rectangle60.81118318204309mm wide x89.90686582054276mm tall, blue triangular opening, silver diagonal reveal and all ivory margins. Do not add numeral1 or another panel. Change only black text and smile to the subtle ivory raised lettering.
```
