# 金属珐琅版：嵌字宽银框
2026-10-10 评审更新：用户认为 3 V05 可以，保留。9 V06 银框质感脏、12 V04 成色和边框曲线质量不合格，需要重新生成；两图仅继续保留在旧网站及历史记录，不作为新一轮材质参考。1 V03、6 V01 不动。见 [当前交接](../../../docs/handoff-2026-10-10-metal-quality.md)。


2026-10-09。按用户纠正后的要求，在网页 ChatGPT 实际逐枚生图，不是网站程序叠加银框。保留金属珐琅语言，不继承拼块版材质或拼缝。待用户评审，未远程发布。

## 当前网站选用

最新修订：1 V03 已获用户认可，不再改动。3 V05 将字标适度放大、紧凑成组并在留白区居中；9 V06 将字标适度放大并居中。12 V04 在新对话中按原屋顶布局、1 V03金属风格及批准轮廓生成，并修正两处框刻字拼写。三枚已下载、目视核验并同步本地3D，待用户评审。历史稿保留，积木分支不改。

|徽章|文件|
|---|---|
|1|badge-1-v03-original-metal.png|
|3|badge-3-v05-balanced-type.png|
|6|badge-6-v01-original.png|
|9|badge-9-v06-balanced-type.png|
|12 两半片|badge-12-v04-metal-correct-lettering.png|

其余生成图保留为过程记录，不用于当前贴图。用户指出 1 V02 被积木参考干扰，因此 1 V03 在全新网页对话中只上传原金属 B-V02 和批准轮廓，不上传任何积木图片，恢复连续抛光银色和珐琅风格。3 V03、9 V04 将上一版内场字标再次按宽高50%的目标缩小，外框刻字不缩。实际生成字宽为近似值，仍需矢量精修。

## 生图约束

- 各枚原版锁定布局、数字、开口及吉祥物动作；拼块图仅参考宽框与沿边刻字，批准轮廓图仅参考几何；1 的 B-V02 仅作为平滑金属与柔和低饱和蓝色参考。
- 宽抛光银色外框向内留位，嵌入 BUILD TOGETHER、AWS USER GROUP、COMMUNITY LEADERS，文字沿边转向。
- 内场 aws、微笑箭头、UG、LEADER 的目标为原版宽高各50%，仍左对齐。LEADER 目标与 UG 等宽。生成结果为近似，不宣称已达到精确字宽或制造要求。
- 保留橙色珐琅、柔和蓝色、米白色浅凸字；12 背景和字标均橙色。连续银色曲线、干净高光，禁止石纹、颗粒、碎高光、拼块缝及新台阶。
- 保持小吉祥物原动作与约8.2mm房身目标，屋顶左俯瞰、右躺卧。

## 来源

- 1 当前修正：https://chatgpt.com/c/6ac8ce81-5044-83e8-a480-5ac52fc3b1ee
- 1 历史：https://chatgpt.com/c/6ac8c2d3-4460-83e8-92a1-b76b8ad8a6d7
- 3：https://chatgpt.com/c/6ac8c369-47b4-83e8-8e53-f3c8f8cb71d8
- 6：https://chatgpt.com/c/6ac8c3e1-a560-83ec-9bbb-e34da8915b7b
- 9：https://chatgpt.com/c/6ac8c456-2d64-83e8-87f1-cd8309a4396d
- 12 当前：https://chatgpt.com/c/6ac8d46b-95cc-83e8-822f-09c46f108293
- 12 历史：https://chatgpt.com/c/6ac8c4c3-5078-83ee-808d-d92e51c1fe1d

## 网站适配与验证

`assets/js/badge-artwork.js` 的 metal 使用本目录生成图，保留图片中的实体银框，无程序画框。metalOriginal 保留此前图片，puzzle 独立不变。内场统一等比例适配，并由 V0.12 批准路径裁切；生成外形与精确路径仍有差异，贴图不是生产工程稿，productionReady 仍为 false。尺寸 JSON 未修改。

本地入口：http://127.0.0.1:4173/badge-dimensions.html?approved=1&revision=engraved-metal#model

10 项贴图回归测试通过，浏览器六面加载、三方案切换成功，无控制台错误。组合截图：`3d-engraved-metal.jpg`。

最新文字平衡与屋顶修订入口：http://127.0.0.1:4173/badge-dimensions.html?approved=1&revision=type-balance-roof#model

本轮 10 项贴图回归测试通过；Chrome 已核验六面加载、组合视图和 3 的紧凑字标，未捕获控制台错误。最新组合截图：`3d-balanced-roof.jpg`。3、9 的当前字号以 V05/V06 为准，不再机械沿用早期统一减半要求。
