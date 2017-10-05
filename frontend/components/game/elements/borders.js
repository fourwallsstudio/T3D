const THREE = require('three');

export default class Borders {
  constructor() {
    this.borders = this.createBorders()
  }

  createBorders() {
    const geometryB = new THREE.PlaneGeometry(0.1, 25);
    const materialB = new THREE.MeshBasicMaterial(
      {
        color: 0xffffff,
        side: THREE.DoubleSide
      }
    );

    const border1 = new THREE.Mesh( geometryB, materialB );
    const border2 = new THREE.Mesh( geometryB, materialB );

    border1.position.set(-6, 12, 0);
    border2.position.set(7, 12, 0);

    return [border1, border2]
  }
}
