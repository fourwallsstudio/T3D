const THREE = require('three');

export default class Light {
  constructor() {
    this.light = this.createLights()
  }

  createLights() {
    const light1 = new THREE.AmbientLight(0xffffff, 0.1)
    const light2 = new THREE.PointLight(0xffffff, .8, 100)
    const light3 = new THREE.PointLight(0xffffff, .8, 100)
    const light4 = new THREE.PointLight(0xffffff, .4, 100)
    const light5 = new THREE.PointLight(0xffffff, .4, 100)
    light2.position.set( 0, 6, 10 )
    light3.position.set( 0, 6, -10 )
    light4.position.set( 16, 24, 10 )
    light5.position.set( -16, 24, -10 )

    return [light1, light2, light3, light4, light5]
  }
}
