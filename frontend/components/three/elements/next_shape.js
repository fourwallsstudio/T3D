import Shape from './shapes'
import { transparentMaterials } from '../../../util/shape_material_util'

export const NextShape = (idx) => {
  const shape = new Shape(idx)
  const material = transparentMaterials[idx]
  shape.cubes.forEach( c => c.material = material )
  return shape
}
