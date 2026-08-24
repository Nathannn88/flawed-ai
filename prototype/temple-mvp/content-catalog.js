(function attachTempleMvpContent(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.TempleMvpContent = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function createContentCatalog() {
  'use strict';

  const ISLANDS = Object.freeze([
    { id: 'visual', label: '视觉', accent: '#72a69a' },
    { id: 'performance', label: '表演', accent: '#c67755' },
    { id: 'literature', label: '文学', accent: '#7a708b' },
    { id: 'design', label: '设计与应用', accent: '#c59a55' },
  ]);

  const MATERIALS = Object.freeze([
    { id: 'iris-berry', label: '虹膜浆果', islandId: 'visual', color: '#668f85' },
    { id: 'mirror-salt', label: '镜盐', islandId: 'visual', color: '#b9d2c8' },
    { id: 'wheat-bread', label: '麦穗面包', islandId: 'performance', color: '#c99055' },
    { id: 'echo-shell', label: '回声贝', islandId: 'performance', color: '#b96951' },
    { id: 'ink-seed', label: '墨籽', islandId: 'literature', color: '#504858' },
    { id: 'thread-leaf', label: '线叶', islandId: 'literature', color: '#82926f' },
    { id: 'joinery-wood', label: '榫木', islandId: 'design', color: '#8f674a' },
    { id: 'glaze-clay', label: '釉土', islandId: 'design', color: '#b88265' },
  ]);

  const RECIPES = Object.freeze([
    {
      id: 'recipe-kaleidoscope-fruit',
      islandId: 'visual',
      materialIds: Object.freeze(['iris-berry', 'mirror-salt']),
      carrierId: 'carrier-kaleidoscope-fruit',
    },
    {
      id: 'recipe-bread-record',
      islandId: 'performance',
      materialIds: Object.freeze(['wheat-bread', 'echo-shell']),
      carrierId: 'carrier-bread-record',
    },
    {
      id: 'recipe-seed-book',
      islandId: 'literature',
      materialIds: Object.freeze(['ink-seed', 'thread-leaf']),
      carrierId: 'carrier-seed-book',
    },
    {
      id: 'recipe-moon-lamp',
      islandId: 'design',
      materialIds: Object.freeze(['joinery-wood', 'glaze-clay']),
      carrierId: 'carrier-moon-lamp',
    },
  ]);

  const CARRIERS = Object.freeze([
    {
      id: 'carrier-unnamed-memory-box',
      label: '无名记忆匣',
      rarity: 'common',
      islandId: null,
      modelType: 'memory-box',
      summary: '釉色、缝隙光和铭纹会随材料与艺术内容变化的标准记忆载体。',
    },
    {
      id: 'carrier-kaleidoscope-fruit',
      label: '万花筒果实',
      rarity: 'formula-relic',
      islandId: 'visual',
      modelType: 'kaleidoscope-fruit',
      summary: '花瓣镜片包裹三层错位色环，背面保留种蒂和结构接缝。',
    },
    {
      id: 'carrier-bread-record',
      label: '面包唱片',
      rarity: 'formula-relic',
      islandId: 'performance',
      modelType: 'bread-record',
      summary: '烘烤纹路形成唱片沟槽，回声贝化为唱臂与唱针。',
    },
    {
      id: 'carrier-seed-book',
      label: '翻页种子书',
      rarity: 'formula-relic',
      islandId: 'literature',
      modelType: 'seed-book',
      summary: '墨籽成为书脊核心，线叶展开为悬浮书页和根系缝线。',
    },
    {
      id: 'carrier-moon-lamp',
      label: '榫卯月灯',
      rarity: 'formula-relic',
      islandId: 'design',
      modelType: 'moon-lamp',
      summary: '无钉榫木框围合釉土灯胆，四面显露不同插接关系。',
    },
  ]);

  const ARTWORKS = Object.freeze([
    {
      id: 'art-return-shadow',
      category: '行为艺术',
      title: '《把影子还给黄昏》',
      prototypeFictional: true,
      accent: '#917a9e',
      summary: '一名表演者沿着退潮线行走，把脚边的影子一次次描回沙面。',
      perception: '先看动作如何改变时间，再想“归还”究竟发生在谁身上。',
    },
    {
      id: 'art-keep-wind',
      category: '行为艺术',
      title: '《为陌生人守一夜风》',
      prototypeFictional: true,
      accent: '#788d89',
      summary: '表演者在无人相识的港口替迟归者举着一面会记录风向的布。',
      perception: '注意等待、重复和照料如何成为作品的一部分。',
    },
    {
      id: 'art-tidal-library',
      category: '建筑艺术',
      title: '《会呼吸的潮汐图书馆》',
      prototypeFictional: true,
      accent: '#5e8f92',
      summary: '建筑的木墙会随潮水升降开合，书页只在退潮后被阳光照亮。',
      perception: '比较建筑作为容器与作为时间装置的两种理解。',
    },
    {
      id: 'art-rain-theatre',
      category: '建筑艺术',
      title: '《只在雨中出现的剧场》',
      prototypeFictional: true,
      accent: '#7182a0',
      summary: '屋顶收集雨水形成透明幕布，雨停以后舞台也随之消失。',
      perception: '观察天气怎样成为空间边界，而不只是背景。',
    },
    {
      id: 'art-seven-ebbs',
      category: '音乐',
      title: '《七次退潮》',
      prototypeFictional: true,
      accent: '#b87758',
      summary: '七个短句以不同速度退回同一个低音，留下越来越长的停顿。',
      perception: '先用身体感受重复和空白，再辨认旋律是否真的返回原点。',
      audioPattern: Object.freeze([220, 277, 247, 196, 220, 165, 147]),
    },
    {
      id: 'art-cup-island',
      category: '音乐',
      title: '《岛屿在杯中回响》',
      prototypeFictional: true,
      accent: '#c08a58',
      summary: '陶杯、木桌与海风被录成三个距离不同的回声层。',
      perception: '分辨声音的材质、距离和记忆感，而不是寻找唯一旋律。',
      audioPattern: Object.freeze([196, 294, 233, 330, 247, 196]),
    },
    {
      id: 'art-blue-door-nap',
      category: '图画',
      title: '《蓝色门后的午睡》',
      prototypeFictional: true,
      accent: '#557c9b',
      summary: '一扇过分蓝的门切开暖灰房间，门后只露出一截正在呼吸的毯子。',
      perception: '先看冷暖色如何分配注意，再判断画外发生了什么。',
    },
    {
      id: 'art-tide-garden',
      category: '图画',
      title: '《潮线花园》',
      prototypeFictional: true,
      accent: '#6f9b7b',
      summary: '植物的轮廓沿旧潮线排列，每一次涨潮都会擦去一部分颜色。',
      perception: '关注缺失的颜色是否也能构成画面。',
    },
    {
      id: 'art-mapless-fifth-island',
      category: '小说',
      title: '《没有地图的第五座岛》',
      prototypeFictional: true,
      accent: '#6f657f',
      summary: '航海者每天醒来都能记住一条新路，却再也画不出完整海岸。',
      perception: '阅读记忆怎样代替地图，以及遗漏是否也是一种方向。',
    },
    {
      id: 'art-letter-unborn-lighthouse',
      category: '小说',
      title: '《写给未出生灯塔的信》',
      prototypeFictional: true,
      accent: '#8b6f78',
      summary: '一封信不断修改收件人，直到它开始描述一座尚未建造的灯塔。',
      perception: '留意称呼、期待和空间如何在文字中彼此生成。',
    },
    {
      id: 'art-rain-chair',
      category: '设计／工艺',
      title: '《为雨声设计的椅子》',
      prototypeFictional: true,
      accent: '#8b795d',
      summary: '椅背的薄木片把不同方向的雨滴导向三种音高。',
      perception: '判断使用、材料与声音何时共同成为设计。',
    },
    {
      id: 'art-sunset-bowl',
      category: '设计／工艺',
      title: '《装得下晚霞的碗》',
      prototypeFictional: true,
      accent: '#b5745e',
      summary: '碗内釉色只有在低角度光线下才连成完整的暖色带。',
      perception: '旋转器物，观察功能之外的观看条件。',
    },
  ]);

  function getRecipeForMaterials(materialIds) {
    if (!Array.isArray(materialIds) || materialIds.length !== 2) return null;
    const key = [...new Set(materialIds)].sort().join('|');
    if (key.split('|').length !== 2) return null;
    return RECIPES.find(recipe => [...recipe.materialIds].sort().join('|') === key) || null;
  }

  function findById(items, id) {
    return items.find(item => item.id === id) || null;
  }

  return Object.freeze({
    ISLANDS,
    MATERIALS,
    RECIPES,
    CARRIERS,
    ARTWORKS,
    getRecipeForMaterials,
    getIsland: id => findById(ISLANDS, id),
    getMaterial: id => findById(MATERIALS, id),
    getCarrier: id => findById(CARRIERS, id),
    getArtwork: id => findById(ARTWORKS, id),
  });
}));
