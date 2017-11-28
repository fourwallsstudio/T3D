const THREE = require('three')

export default class Camera {
  constructor() {
    this.camera = this.createCamera();
    this.game = null;
    this.frontView = true;
    this.angle = 0;
    this.cameraDelta = 0;
    this.rotateAniFrame = null;
    this.rotateDisabled = false;
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

    this.rotateDisabled = !this.rotateDisabled;
  }

  rotateCamera = () => {
    const camera = this.camera;
    const evenLevel = this.game.levelStatus % 2 === 0;
    const rotating = evenLevel
                      ? Math.sin(this.cameraDelta) >= 0
                      : Math.sin(this.cameraDelta) <= 0;
    const vectorX = evenLevel ? 0.5 : -0.5;
    const setZ = evenLevel ? -13 : 13;

    if (rotating) {
      this.cameraDelta += 0.05;
      camera.lookAt( new THREE.Vector3(vectorX, 12, 0) )
      camera.position.y = 12;
      camera.position.x = Math.sin(this.cameraDelta) * 13;
      camera.position.z = Math.cos(this.cameraDelta) * 13;

    } else {
      camera.position.set(0.5, 12, setZ)
      camera.lookAt( new THREE.Vector3(0.5, 12, 0) )
      this.stopRotate()
      return;
    }

    this.rotateAniFrame = requestAnimationFrame(this.rotateCamera)
  }

  stopRotate = () => {
    cancelAnimationFrame(this.rotateAniFrame)
    this.rotateAniFrame = null;
    this.game.isPaused = false;
  }
}
