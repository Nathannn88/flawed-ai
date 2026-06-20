# assets/ —— 皮肤资产目录（为「皮肤化」阶段预留）

本目录当前为空。原型默认 **不加载任何外部美术素材**，全部用纯色占位几何 +
内联生成的 gradientMap 渲染（保证零素材、无报错运行）。

## 如何换肤（drop-in，不改任何渲染逻辑）

1. 把贴图丢进本目录，例如 `ground.png`、`statue.png`、`offering.png`。
2. 打开 `../index.html`，找到 `assetConfig` 对象：
   - 把 `useTextures` 改为 `true`；
   - 在 `textures` 里填路径，例如 `ground: './assets/ground.png'`。
3. 刷新页面即可生效。渲染层只从 `assetConfig` 读取，**无需改动任何渲染代码**。

> 留空的路径会自动回退到对应的纯色占位，因此可以只替换其中几项。
> 色值锚点也集中在 `assetConfig.colors`，改色同样不碰渲染逻辑。
