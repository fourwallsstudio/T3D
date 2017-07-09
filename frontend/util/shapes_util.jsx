var THREE = require('three');

//SHAPES
var geometry = new THREE.BoxGeometry( 1, 1, 1 );

var material = new THREE.MeshPhongMaterial( {
  color: 0x6efc7f,
  transparent: true,
  // opacity: .8,
  // specular: 0x111111,
  // shininess: 100
 } );
var material2 = new THREE.MeshPhongMaterial( {
  color: 0xfffe97,
  transparent: true,
  // opacity: .8
} );
var material3 = new THREE.MeshPhongMaterial( {
  color: 0x71cfff,
  transparent: true,
  // opacity: .8
} );
var material4 = new THREE.MeshPhongMaterial( {
  color: 0xd4d473,
  transparent: true,
  // opacity: .8
} );
var material5 = new THREE.MeshPhongMaterial( {
  color: 0xf57979,
  transparent: true,
  // opacity: .8
} );
var material6 = new THREE.MeshPhongMaterial( {
  color: 0xeca2fc,
  transparent: true,
  // opacity: .8
} );
var material7 = new THREE.MeshPhongMaterial( {
  color: 0xbbc6fa,
  transparent: true,
  // opacity: .8
} );


const createI = () => {
  let i1 = new THREE.Mesh( geometry, material );
  let i2 = new THREE.Mesh( geometry, material );
  let i3 = new THREE.Mesh( geometry, material );
  let i4 = new THREE.Mesh( geometry, material );
  return [ i1, i2, i3, i4 ]
}

const iDeltas =[
  [-1, 0], [0, 0], [1, 0], [2, 0]
]

const iRotateDeltas =[
  [[1, -1], [0, 0], [-1, -1], [-2, -2]],
  [[-1, 1], [0, 0], [1, 1], [2, 2]]
]

const createJ = () => {
  let j1 = new THREE.Mesh( geometry, material2 );
  let j2 = new THREE.Mesh( geometry, material2 );
  let j3 = new THREE.Mesh( geometry, material2 );
  let j4 = new THREE.Mesh( geometry, material2 );
  return [ j1, j2, j3, j4 ]
}

const jDeltas =[
  [-1, 0], [0, 0], [1, 0], [1, -1]
]

const jRotateDeltas =[
  [[1, 1], [0, 0], [-1, -1], [-2, 0]],
  [[1, -1], [0, 0], [-1, 1], [0, 2]],
  [[-1, -1], [0, 0], [1, 1], [2, 0]],
  [[-1, 1], [0, 0], [1, -1], [0, -2]],
]

const createL = () => {
  let l1 = new THREE.Mesh( geometry, material3 );
  let l2 = new THREE.Mesh( geometry, material3 );
  let l3 = new THREE.Mesh( geometry, material3 );
  let l4 = new THREE.Mesh( geometry, material3 );
  return [ l1, l2, l3, l4 ]
}

const lDeltas =[
  [-1, -1], [-1, 0], [0, 0], [1, 0]
]

const lRotateDeltas =[
  [[0, 2], [1, 1], [0, 0], [-1, -1]],
  [[2, 0], [1, -1], [0, 0], [-1, 1]],
  [[0, -2], [-1, -1], [0, 0], [1, 1]],
  [[-2, 0], [-1, 1], [0, 0], [1, -1]],
]

const createO = () => {
  let o1 = new THREE.Mesh( geometry, material4 );
  let o2 = new THREE.Mesh( geometry, material4 );
  let o3 = new THREE.Mesh( geometry, material4 );
  let o4 = new THREE.Mesh( geometry, material4 );
  return [ o1, o2, o3, o4 ]
}

const oDeltas =[
  [0, 0], [1, 0], [0, -1], [1, -1]
]

const oRotateDeltas =[
  [[0, 0], [0, 0], [0, 0], [0, 0]]
]

const createS = () => {
  let s1 = new THREE.Mesh( geometry, material5 );
  let s2 = new THREE.Mesh( geometry, material5 );
  let s3 = new THREE.Mesh( geometry, material5 );
  let s4 = new THREE.Mesh( geometry, material5 );
  return [ s1, s2, s3, s4 ]
}

const sDeltas =[
  [-1, -1], [0, -1], [0, 0], [1, 0]
]

const sRotateDeltas =[
  [[0, 2], [-1, 1], [0, 0], [-1, -1]],
  [[0, -2], [1, -1], [0, 0], [1, 1]]
]

const createT = () => {
  let t1 = new THREE.Mesh( geometry, material6 );
  let t2 = new THREE.Mesh( geometry, material6 );
  let t3 = new THREE.Mesh( geometry, material6 );
  let t4 = new THREE.Mesh( geometry, material6 );
  return [ t1, t2, t3, t4 ]
}

const tDeltas =[
  [-1, 0], [0, 0], [0, -1], [1, 0]
]

const tRotateDeltas =[
  [[1, 1], [0, 0], [-1, 1], [-1, -1]],
  [[1, -1], [0, 0], [1, 1], [-1, 1]],
  [[-1, -1], [0, 0], [1, -1], [1, 1]],
  [[-1, 1], [0, 0], [-1, -1], [1, -1]],
]

const createZ = () => {
  let z1 = new THREE.Mesh( geometry, material7 );
  let z2 = new THREE.Mesh( geometry, material7 );
  let z3 = new THREE.Mesh( geometry, material7 );
  let z4 = new THREE.Mesh( geometry, material7 );
  return [ z1, z2, z3, z4 ]
}

const zDeltas =[
  [-1, 0], [0, 0], [0, -1], [1, -1]
]

const zRotateDeltas =[
  [[1, 1], [0, 0], [-1, 1], [-2, 0]],
  [[-1, -1], [0, 0], [1, -1], [2, 0]]
]

export const shapes = [
  createI,
  createJ,
  createL,
  createO,
  createS,
  createT,
  createZ
]

export const deltas = [
  iDeltas,
  jDeltas,
  lDeltas,
  oDeltas,
  sDeltas,
  tDeltas,
  zDeltas
]

export const rotateDeltas = [
  iRotateDeltas,
  jRotateDeltas,
  lRotateDeltas,
  oRotateDeltas,
  sRotateDeltas,
  tRotateDeltas,
  zRotateDeltas
]
