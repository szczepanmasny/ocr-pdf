import * as PdfJsLib from 'pdfjs-dist'
import { App, inject } from 'vue'

declare global {
  interface Window {
    pdfjsWorker: any
  }
}

export const pdfjsSymbol = Symbol('pdfjs')

const initPdfJs = () => {
  const pdfjsWorker = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()
  console.log(pdfjsWorker)
  try {
    if (typeof window === 'undefined' || !('Worker' in window)) {
      throw new Error('Web Workers not supported in this environment.')
    }

    PdfJsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker
  } catch (error) {}
}

export const pdfjs = (Vue: App) => {
  initPdfJs()
  Vue.provide(pdfjsSymbol, PdfJsLib)
}

export const usePdfjs = () => {
  const instance = inject<typeof PdfJs>(pdfjsSymbol)
  if (!instance) throw new Error('No pdfjs provided!')

  return instance
}
