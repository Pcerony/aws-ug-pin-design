# 屋顶 12 橙色内场修订

最新 V02：2 下方的 aws、微笑箭头、UG、LEADER 已改为同色橙色凸字。下方米白字描述仅记录 V01；当前交付采用 [V02](orange-type-v02.md)。

2026-10-08：12 两半原米白背景全部改为同数字的橙色珐琅，保留蓝色凹面、银色结构及米白凸字。四面墙不变。批准 V0.12 SVG 定边，中央 2 mm 连接区不填色。旧版原图全部保留，本地未发布。

使用内置 image generation 逐半片编辑，输入为 ../2026-10-08-ivory-lettering/badge-12L-texture.png 和 badge-12R-texture.png。右片首次出现透明瑕疵，已再次编辑修复。左片去除透明侧边，等比例拟合，橙色补齐背景。不拉伸数字。

最终资产在本目录：六个板面 PNG、对应固定轮廓 SVG，以及 badge-12-fitted.svg 双片展开图。图库和 3D 已同步。32 项相关测试通过；不代表生产浮雕工程稿。

## 实际提示词

共同提示词：
```text
Precise color-only edit of this existing rectangular enamel roof badge half. Replace ALL ivory/off-white BACKGROUND enamel fields inside the rectangular outer silver rim with the SAME saturated orange enamel hue as the raised numeral. This includes the top, bottom, left and right margins and all ivory negative space. Keep the existing raised orange numeral geometry and its metallic relief edge, cobalt-blue recessed window, exposed silver structural thickness, outer silver rectangular rim, lighting, composition and exact aspect ratio unchanged. Orange background is a lower flat enamel plane, numeral remains raised readable via existing silver relief edge and subtle shading. Do NOT recolor blue or silver. If present, keep aws, smile arrow, UG, LEADER in warm IVORY raised lettering at their exact existing positions; text is the only remaining ivory element, NOT background. No black text, no extra ornaments, no new geometry, no perspective, full rectangle uncropped. Transparent only outside the badge, entire interior opaque. This is one half of approved V0.12 roof, 60.81118318204309 x89.90686582054276mm. Do not change silhouette.
```
左片追加：Target: left half numeral1, no lettering.
右片追加：Target: right half numeral2 with existing ivory aws smile UG LEADER at bottom. Keep those lettering faces IVORY against the new orange background.

右片修复提示词：
```text
Repair only the accidental transparent dark hole in the lower-right orange background, to the right of the ivory lettering. Fill that entire hole and its dark halo with clean smooth orange enamel exactly matching the surrounding orange field. Absolutely no holes or dark artifacts anywhere inside this solid rectangular badge. Entire canvas opaque, full object unchanged, keep numeral2 blue window silver structure and ivory aws UG LEADER exactly unchanged. No transparent background required. This is an orange solid rectangle product texture, not a cutout.
```

导出：node scripts/export-selected-artwork.mjs --png-session badge-current，然后 node scripts/build-project.mjs。
