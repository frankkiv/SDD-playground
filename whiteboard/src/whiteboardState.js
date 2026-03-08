// Data structures and state management for the whiteboard

let nextId = 1
export function genId() {
  return 'obj-' + (nextId++)
}

let nextLayerId = 1
export function genLayerId() {
  return 'layer-' + (nextLayerId++)
}

export function createLayer(name) {
  return { id: genLayerId(), name, visible: true }
}

export function createInitialState() {
  const layer = createLayer('圖層 1')
  return {
    layers: [layer],
    activeLayerId: layer.id,
    objects: [], // all drawing objects, each has a layerId
  }
}

// Serialize state for save/sync
export function serializeState(state) {
  return {
    layers: state.layers,
    activeLayerId: state.activeLayerId,
    objects: state.objects,
  }
}

// Deserialize state from JSON
export function deserializeState(data) {
  // Reset ID counters to avoid collisions
  const maxObjId = data.objects.reduce((max, o) => {
    const n = parseInt(o.id?.split('-')[1] || '0', 10)
    return n > max ? n : max
  }, 0)
  const maxLayerId = data.layers.reduce((max, l) => {
    const n = parseInt(l.id?.split('-')[1] || '0', 10)
    return n > max ? n : max
  }, 0)
  nextId = maxObjId + 1
  nextLayerId = maxLayerId + 1

  return {
    layers: data.layers,
    activeLayerId: data.activeLayerId,
    objects: data.objects,
  }
}
