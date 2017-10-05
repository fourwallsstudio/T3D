const THREE = require('three')

export default class Camera {
  constructor() {
    this.camera = this.createCamera();
    this.cameraDelta = 0;
    this.frontView = true;
    this.angle = 0;
  }

  createCamera() {
    const camera = new THREE.PerspectiveCamera(
      100,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    )

    camera.position.z = 13;
    camera.position.y = 12;
    camera.position.x = 0.5;
    camera.lookAt( new THREE.Vector3(0.5,12,0) )

    return camera
  }


  toggleView(disableGrid) {
    if (this.frontView) {

      this.camera.position.z = 4;
      this.camera.position.y = -2;
      this.camera.lookAt( new THREE.Vector3(0.5, 24, -5) )
      this.angle += 1;
      this.frontView = false;

    } else {

      this.camera.position.z = 13;
      this.camera.position.y = 12;
      this.camera.position.x = 0.5;
      this.camera.lookAt( new THREE.Vector3(0.5,12,0) )
      this.frontView = true;
    }
  }

}
