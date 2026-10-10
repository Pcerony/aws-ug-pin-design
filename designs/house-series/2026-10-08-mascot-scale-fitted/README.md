# 固定边界贴图 · 吉祥物尺寸统一

2026-10-08。本轮以 3、9 的吉祥物为实际尺度参照，缩小 1、6、12。当前版本为 1 V07、3 V01、6 V04、9 V03、12 V03。

新原图与比例记录见[尺寸统一记录](../2026-10-08-mascot-scale/README.md)。所有六面贴图均等比例置于批准 V0.12 SVG 内，工程尺寸、UV 朝向和金属边界生成规则未改变；3、9 原图及贴图不变。productionReady 仍为 false。

六个 PNG、六个单面 SVG、一个双片展开屋顶 SVG 由 `node scripts/export-selected-artwork.mjs --png-session badge-current` 导出。manifest.json 记录真实原图来源、裁切及拟合信息。旧吉祥物贴图保留于 ../2026-10-08-mascot-selected/，不覆盖。
