import { color, buttonTheme, buttonGradient } from '@/config'
export type * from '@vuebits/ui/types/components/Autocomplete/models'
export type * from '@vuebits/ui/types/components/Select/models'

export type Color = (typeof color)[number]
export type ButtonTheme = (typeof buttonTheme)[number]
export type ButtonGradient = (typeof buttonGradient)[number]

export type RadioValue = string | number | null

export type RadioItem = {
  name: string | number
  label?: string | null
  disabled?: boolean
}
