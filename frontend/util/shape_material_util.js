const THREE = require('three');

const iMaterial = new THREE.MeshPhongMaterial(
  {
    color: 0x6efc7f,
    transparent: true,
  }
);

const jMaterial = new THREE.MeshPhongMaterial(
  {
    color: 0xfffe97,
    transparent: true
  }
);

const lMaterial = new THREE.MeshPhongMaterial(
  {
    color: 0x71cfff,
    transparent: true
  }
);

const oMaterial = new THREE.MeshPhongMaterial(
  {
    color: 0xd4d473,
    transparent: true
  }
);

const sMaterial = new THREE.MeshPhongMaterial(
  {
    color: 0xf57979,
    transparent: true
  }
);

const tMaterial = new THREE.MeshPhongMaterial(
  {
    color: 0xeca2fc,
    transparent: true
  }
);

const zMaterial = new THREE.MeshPhongMaterial(
  {
    color: 0xbbc6fa,
    transparent: true
  }
);



const iTransparentMaterial = new THREE.MeshPhongMaterial(
  {
    color: 0x6efc7f,
    transparent: true,
    opacity: 0.3,
  }
);

const jTransparentMaterial = new THREE.MeshPhongMaterial(
  {
    color: 0xfffe97,
    transparent: true,
    opacity: 0.3,
  }
);

const lTransparentMaterial = new THREE.MeshPhongMaterial(
  {
    color: 0x71cfff,
    transparent: true,
    opacity: 0.3,
  }
);

const oTransparentMaterial = new THREE.MeshPhongMaterial(
  {
    color: 0xd4d473,
    transparent: true,
    opacity: 0.3,
  }
);

const sTransparentMaterial = new THREE.MeshPhongMaterial(
  {
    color: 0xf57979,
    transparent: true,
    opacity: 0.3,
  }
);

const tTransparentMaterial = new THREE.MeshPhongMaterial(
  {
    color: 0xeca2fc,
    transparent: true,
    opacity: 0.3,
  }
);

const zTransparentMaterial = new THREE.MeshPhongMaterial(
  {
    color: 0xbbc6fa,
    transparent: true,
    opacity: 0.3,
  }
);



const iDeltas =[[-1, 0], [0, 0], [1, 0], [2, 0]]

const iRotateDeltas =[
  [[1, 1], [0, 0], [-1, -1], [-2, -2]],
  [[-1, -1], [0, 0], [1, 1], [2, 2]],
]

const aiIRotateDeltas = [
  [1, 1, 1, 1],
  [1]
]

const jDeltas =[[-1, 0], [0, 0], [1, 0], [1, -1]]

const jRotateDeltas =[
  [[1, 1], [0, 0], [-1, -1], [-2, 0]],
  [[1, -1], [0, 0], [-1, 1], [0, 2]],
  [[-1, -1], [0, 0], [1, 1], [2, 0]],
  [[-1, 1], [0, 0], [1, -1], [0, -2]],
]

const aiJRotateDeltas = [
  [1, 1, -1],
  [1, 1],
  [1, 1, 1],
  [1, 3]
]

const lDeltas =[[-1, -1], [-1, 0], [0, 0], [1, 0]]

const lRotateDeltas =[
  [[0, 2], [1, 1], [0, 0], [-1, -1]],
  [[2, 0], [1, -1], [0, 0], [-1, 1]],
  [[0, -2], [-1, -1], [0, 0], [1, 1]],
  [[-2, 0], [-1, 1], [0, 0], [1, -1]],
]

const aiLRotateDeltas = [
  [1, 2, 2],
  [1, -2],
  [1, 1, 1],
  [1, 1]
]


const oDeltas =[[0, 0], [0, -1], [1, 0], [1, -1]]

const oRotateDeltas =[[[0, 0], [0, 0], [0, 0], [0, 0]]]

const aiORotateDeltas = [
  [1, 1]
]

const sDeltas =[[-1, -1], [0, -1], [0, 0], [1, 0]]

const sRotateDeltas =[
  [[0, 2], [-1, 1], [0, 0], [-1, -1]],
  [[0, -2], [1, -1], [0, 0], [1, 1]]
]

const aiSRotateDeltas = [
  [1, 1, 2],
  [1, -1]
]

const tDeltas =[[-1, 0], [0, 0], [0, -1], [1, 0]]

const tRotateDeltas =[
  [[1, 1], [0, 0], [-1, 1], [-1, -1]],
  [[1, -1], [0, 0], [1, 1], [-1, 1]],
  [[-1, -1], [0, 0], [1, -1], [1, 1]],
  [[-1, 1], [0, 0], [-1, -1], [1, -1]],
]

const aiTRotateDeltas = [
  [1, -1, 1],
  [1, -1],
  [1, 1, 1],
  [1, 2]
]

const zDeltas =[[-1, 0], [0, 0], [0, -1], [1, -1]]

const zRotateDeltas =[
  [[1, -1], [0, 0], [1, 1], [0, 2]],
  [[-1, 1], [0, 0], [-1, -1], [0, -2]],
]

const aiZRotateDeltas = [
  [1, -1, -1],
  [1, 2]
]

export const materials = [
  iMaterial,
  jMaterial,
  lMaterial,
  oMaterial,
  sMaterial,
  tMaterial,
  zMaterial,
]

export const transparentMaterials = [
  iTransparentMaterial,
  jTransparentMaterial,
  lTransparentMaterial,
  oTransparentMaterial,
  sTransparentMaterial,
  tTransparentMaterial,
  zTransparentMaterial,
]

export const deltas = [
  iDeltas,
  jDeltas,
  lDeltas,
  oDeltas,
  sDeltas,
  tDeltas,
  zDeltas,
]

export const rotateDeltas = [
  iRotateDeltas,
  jRotateDeltas,
  lRotateDeltas,
  oRotateDeltas,
  sRotateDeltas,
  tRotateDeltas,
  zRotateDeltas,
]

export const aiRotateDeltas = [
  aiIRotateDeltas,
  aiJRotateDeltas,
  aiLRotateDeltas,
  aiORotateDeltas,
  aiSRotateDeltas,
  aiTRotateDeltas,
  aiZRotateDeltas,
]
