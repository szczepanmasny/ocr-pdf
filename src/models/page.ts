import { RectangleOptions } from './rectangle'

export type PageData = {
  ocrText: string
  text: string
  rectangles?: RectangleOptions[]
}
