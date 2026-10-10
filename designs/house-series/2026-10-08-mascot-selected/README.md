# 吉祥物系列 · 固定边界与 3D 评审

2026-10-08：用户授权当前整套进入网站 3D。仅本地同步，未发布到 GitHub。

| 面 | 当前原图 |
|---|---|
| 1 | 2026-10-08-facade-fit/badge-1-v06-lower-arch-clean-sides.png |
| 3 | 2026-10-08-mascot-series/badge-3-mascot-v01.png |
| 6 | 2026-10-08-mascot-series/badge-6-mascot-v03-window-only.png |
| 9 | 2026-10-08-mascot-series/badge-9-mascot-v03-complete-loop-clean-rim.png |
| 12 两半 | 2026-10-08-mascot-series/badge-12-mascot-v02-overhead-reclining.png |

原图目录前缀为 `designs/house-series/`。详细来源、取样边界与等比例拟合见 manifest.json。

每个板面包含 RGBA PNG 与嵌入贴图的 SVG。屋顶另有含 2 mm 连接间隔的双片展开 SVG。最终外边界以 specs/approved/house-v012.json 为准，不改实体尺寸。内部图案等比例缩放，边缘以同色内场延续，仅绘制批准边界单框。旧原图及历史交付保留。

墙面米白凸字，屋顶背景和凸字橙色。6 不保留左下坐姿吉祥物；9 保留完整圆头；12 左侧俯瞰、右侧躺卧。贴图中的厚度不等于可制造浮雕，productionReady 仍为 false。

重新导出：已加载尺寸工作台的会话运行 `node scripts/export-selected-artwork.mjs --png-session badge-current`。
