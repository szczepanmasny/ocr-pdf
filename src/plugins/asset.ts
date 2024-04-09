import { type App, inject } from 'vue'
import { assets } from '@/helpers'

export const assetSymbol = Symbol('asset')

export const asset = (Vue: App) => {
  Vue.provide(assetSymbol, assets)
}

export const useAsset = () => {
  const assetInstance = inject<typeof assets>(assetSymbol)
  if (!assetInstance) throw new Error('No asset provided!')

  return assetInstance
}
