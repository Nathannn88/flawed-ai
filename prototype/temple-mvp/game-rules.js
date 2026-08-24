(function attachTempleMvpRules(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.TempleMvpRules = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function createRules() {
  'use strict';

  const CONTENT = (
    typeof module === 'object' && module.exports
      ? require('./content-catalog.js')
      : (typeof globalThis !== 'undefined' ? globalThis.TempleMvpContent : null)
  ) || {
    MATERIALS: [],
    CARRIERS: [],
    ARTWORKS: [],
    getRecipeForMaterials: () => null,
  };

  const CONFIG = Object.freeze({
    dialogueEnergyReward: 1,
    resonanceEnergyCost: 1,
    resonanceMaterialCost: 2,
    formulaRelicChance: 0.2,
    showcaseSlotCount: 3,
  });

  function normalizeEnergy(value) {
    return Number.isInteger(value) && value >= 0 ? value : 0;
  }

  function cloneInventory(inventory) {
    return Array.isArray(inventory) ? inventory.map(item => ({ ...item })) : [];
  }

  function cloneMemoryItems(memoryItems) {
    return Array.isArray(memoryItems) ? memoryItems.map(item => ({
      ...item,
      materialIds: Array.isArray(item.materialIds) ? [...item.materialIds] : item.materialIds,
      sourceMaterials: Array.isArray(item.sourceMaterials)
        ? item.sourceMaterials.map(material => ({ ...material }))
        : item.sourceMaterials,
    })) : [];
  }

  function normalizeRoll(value) {
    if (!Number.isFinite(value)) return 0;
    return Math.min(Math.max(value, 0), 0.999999999);
  }

  function selectArtwork({
    artworks = CONTENT.ARTWORKS,
    seenArtworkIds = [],
    roll = 0,
  } = {}) {
    const safeArtworks = Array.isArray(artworks) ? artworks.filter(Boolean) : [];
    if (!safeArtworks.length) return null;
    const seen = new Set(Array.isArray(seenArtworkIds) ? seenArtworkIds : []);
    const unseen = safeArtworks.filter(artwork => !seen.has(artwork.id));
    const candidates = unseen.length ? unseen : safeArtworks;
    return candidates[Math.floor(normalizeRoll(roll) * candidates.length)] || candidates[0];
  }

  function awardDialogueEnergy(currentEnergy, reply) {
    const energy = normalizeEnergy(currentEnergy);
    const hasReply = typeof reply === 'string' && reply.trim().length > 0;
    const gained = hasReply ? CONFIG.dialogueEnergyReward : 0;
    return { energy: energy + gained, gained };
  }

  function resonateMemory({
    energy,
    inventory,
    selectedMaterialIds,
    resultId,
    roll = 0.5,
    artworkRoll = 0,
    artworkId = null,
    seenArtworkIds = [],
    createdAt = null,
  } = {}) {
    const safeEnergy = normalizeEnergy(energy);
    const safeInventory = cloneInventory(inventory);
    const selectedIds = Array.isArray(selectedMaterialIds) ? [...selectedMaterialIds] : [];

    if (
      selectedIds.length !== CONFIG.resonanceMaterialCost
      || new Set(selectedIds).size !== CONFIG.resonanceMaterialCost
    ) {
      return {
        ok: false,
        code: 'NEED_TWO_MATERIALS',
        energy: safeEnergy,
        inventory: safeInventory,
        resonanceResult: null,
      };
    }

    const selectedItems = selectedIds.map(id => safeInventory.find(item => (
      item && item.id === id && item.kind === 'material'
    )));
    if (selectedItems.some(item => !item)) {
      return {
        ok: false,
        code: 'MATERIAL_NOT_FOUND',
        energy: safeEnergy,
        inventory: safeInventory,
        resonanceResult: null,
      };
    }

    const materialIds = selectedItems.map(item => item.materialId);
    if (materialIds.some(id => !CONTENT.MATERIALS.some(material => material.id === id))) {
      return {
        ok: false,
        code: 'INVALID_MATERIAL',
        energy: safeEnergy,
        inventory: safeInventory,
        resonanceResult: null,
      };
    }

    if (safeEnergy < CONFIG.resonanceEnergyCost) {
      return {
        ok: false,
        code: 'NO_ENERGY',
        energy: safeEnergy,
        inventory: safeInventory,
        resonanceResult: null,
      };
    }

    const selectedArtwork = artworkId
      ? CONTENT.ARTWORKS.find(artwork => artwork.id === artworkId)
      : selectArtwork({
        artworks: CONTENT.ARTWORKS,
        seenArtworkIds,
        roll: artworkRoll,
      });
    if (!selectedArtwork) {
      return {
        ok: false,
        code: 'ARTWORK_NOT_FOUND',
        energy: safeEnergy,
        inventory: safeInventory,
        resonanceResult: null,
      };
    }

    const recipe = CONTENT.getRecipeForMaterials(materialIds);
    const isFormulaRelic = Boolean(recipe) && normalizeRoll(roll) < CONFIG.formulaRelicChance;
    const carrierId = isFormulaRelic
      ? recipe.carrierId
      : 'carrier-unnamed-memory-box';
    const carrier = CONTENT.CARRIERS.find(item => item.id === carrierId);
    if (!carrier) {
      return {
        ok: false,
        code: 'CARRIER_NOT_FOUND',
        energy: safeEnergy,
        inventory: safeInventory,
        resonanceResult: null,
      };
    }

    const selectedSet = new Set(selectedIds);
    const nextInventory = safeInventory.filter(item => !selectedSet.has(item.id));
    const sourceMaterials = selectedItems.map(item => ({ ...item }));
    const resonanceResult = {
      id: resultId,
      kind: 'resonance-result',
      status: 'pending',
      rarity: isFormulaRelic ? 'formula-relic' : 'common',
      carrierId: carrier.id,
      carrierType: carrier.modelType,
      artworkId: selectedArtwork.id,
      materialIds: [...materialIds],
      sourceMaterials,
      recipeId: recipe ? recipe.id : null,
      islandId: recipe ? recipe.islandId : null,
      createdAt,
      displaySlot: null,
    };

    return {
      ok: true,
      code: 'OK',
      energy: safeEnergy - CONFIG.resonanceEnergyCost,
      inventory: nextInventory,
      resonanceResult,
    };
  }

  function finalizeResonance({
    resonanceResult,
    decision,
    energy,
    inventory,
    memoryItems,
    memoryItemId,
  } = {}) {
    const safeEnergy = normalizeEnergy(energy);
    const safeInventory = cloneInventory(inventory);
    const safeMemoryItems = cloneMemoryItems(memoryItems);
    const safeResult = resonanceResult ? {
      ...resonanceResult,
      materialIds: Array.isArray(resonanceResult.materialIds)
        ? [...resonanceResult.materialIds]
        : [],
      sourceMaterials: Array.isArray(resonanceResult.sourceMaterials)
        ? resonanceResult.sourceMaterials.map(item => ({ ...item }))
        : [],
    } : null;

    if (!safeResult) {
      return {
        ok: false,
        code: 'NO_PENDING_RESULT',
        energy: safeEnergy,
        inventory: safeInventory,
        memoryItems: safeMemoryItems,
        resonanceResult: null,
      };
    }
    if (safeResult.status !== 'pending') {
      return {
        ok: false,
        code: 'ALREADY_FINALIZED',
        energy: safeEnergy,
        inventory: safeInventory,
        memoryItems: safeMemoryItems,
        resonanceResult: safeResult,
      };
    }
    if (decision !== 'return' && decision !== 'keep') {
      return {
        ok: false,
        code: 'INVALID_DECISION',
        energy: safeEnergy,
        inventory: safeInventory,
        memoryItems: safeMemoryItems,
        resonanceResult: safeResult,
      };
    }

    if (decision === 'return') {
      const existingIds = new Set(safeInventory.map(item => item.id));
      const restoredMaterials = safeResult.sourceMaterials
        .filter(item => !existingIds.has(item.id))
        .map(item => ({ ...item }));
      return {
        ok: true,
        code: 'RETURNED',
        energy: safeEnergy,
        inventory: [...safeInventory, ...restoredMaterials],
        memoryItems: safeMemoryItems,
        resonanceResult: { ...safeResult, status: 'returned' },
        returnedArtworkId: safeResult.artworkId,
      };
    }

    if (!memoryItemId || safeMemoryItems.some(item => item.id === memoryItemId)) {
      return {
        ok: false,
        code: 'INVALID_MEMORY_ITEM_ID',
        energy: safeEnergy,
        inventory: safeInventory,
        memoryItems: safeMemoryItems,
        resonanceResult: safeResult,
      };
    }

    const memoryItem = {
      ...safeResult,
      id: memoryItemId,
      sourceResultId: safeResult.id,
      kind: 'memory-item',
      status: 'kept',
      displaySlot: null,
    };
    return {
      ok: true,
      code: 'KEPT',
      energy: safeEnergy,
      inventory: safeInventory,
      memoryItems: [...safeMemoryItems, memoryItem],
      resonanceResult: {
        ...safeResult,
        status: 'kept',
        memoryItemId,
      },
      memoryItem,
    };
  }

  function assignShowcaseSlot({
    memoryItems,
    showcaseSlots,
    memoryItemId,
    slotIndex,
  } = {}) {
    const safeMemoryItems = cloneMemoryItems(memoryItems);
    const safeSlots = Array.from(
      { length: CONFIG.showcaseSlotCount },
      (_, index) => (Array.isArray(showcaseSlots) ? showcaseSlots[index] || null : null),
    );
    if (!Number.isInteger(slotIndex) || slotIndex < 0 || slotIndex >= safeSlots.length) {
      return {
        ok: false,
        code: 'INVALID_SHOWCASE_SLOT',
        memoryItems: safeMemoryItems,
        showcaseSlots: safeSlots,
      };
    }
    const selectedIndex = safeMemoryItems.findIndex(item => (
      item.id === memoryItemId && item.kind === 'memory-item' && item.status === 'kept'
    ));
    if (selectedIndex < 0) {
      return {
        ok: false,
        code: 'MEMORY_ITEM_NOT_FOUND',
        memoryItems: safeMemoryItems,
        showcaseSlots: safeSlots,
      };
    }

    const displacedId = safeSlots[slotIndex];
    const nextSlots = safeSlots.map(id => (id === memoryItemId ? null : id));
    nextSlots[slotIndex] = memoryItemId;
    const nextItems = safeMemoryItems.map(item => {
      if (item.id === memoryItemId) return { ...item, displaySlot: slotIndex };
      if (item.id === displacedId) return { ...item, displaySlot: null };
      return item;
    });
    return {
      ok: true,
      code: 'OK',
      memoryItems: nextItems,
      showcaseSlots: nextSlots,
    };
  }

  function removeFromShowcase({
    memoryItems,
    showcaseSlots,
    memoryItemId,
  } = {}) {
    const safeMemoryItems = cloneMemoryItems(memoryItems);
    const safeSlots = Array.from(
      { length: CONFIG.showcaseSlotCount },
      (_, index) => (Array.isArray(showcaseSlots) ? showcaseSlots[index] || null : null),
    );
    const itemIndex = safeMemoryItems.findIndex(item => item.id === memoryItemId);
    if (itemIndex < 0) {
      return {
        ok: false,
        code: 'MEMORY_ITEM_NOT_FOUND',
        memoryItems: safeMemoryItems,
        showcaseSlots: safeSlots,
      };
    }
    return {
      ok: true,
      code: 'OK',
      memoryItems: safeMemoryItems.map(item => (
        item.id === memoryItemId ? { ...item, displaySlot: null } : item
      )),
      showcaseSlots: safeSlots.map(id => (id === memoryItemId ? null : id)),
    };
  }

  return Object.freeze({
    CONFIG,
    awardDialogueEnergy,
    selectArtwork,
    resonateMemory,
    finalizeResonance,
    assignShowcaseSlot,
    removeFromShowcase,
  });
}));
