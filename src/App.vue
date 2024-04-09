<template>
  <div>
    <UiFileUploader @upload="setPdfFile" />
    <FnPdfViewer :pdf="pdfFile" />
    <div style="position: relative">
      <div :class="bem({ e: 'preview' })">
        <canvas
          ref="canvasEl"
          :class="bem({ e: 'page' })"
        />
      </div>
      <div
        v-for="(rect, i) of rectangles"
        :key="i"
        :style="{
          border: '1px solid red',
          position: 'absolute',
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          top: `${rect.top}px`,
          left: `${rect.left}px`,
        }"
      ></div>
    </div>
    <div>
      {{ convertedText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { createWorker } from 'tesseract.js'
import { ref } from 'vue'
import { UiFileUploader, FnPdfViewer } from '@/components'
import { defineBem } from '@/helpers'

type Rectangle = {
  left: number
  top: number
  width: number
  height: number
}

const pdfFile = ref<string | undefined>(undefined)
const convertedText = ref('')
const page = ref(1)
const imgSrc = ref<string | Uint8Array | undefined>(undefined)
const bem = defineBem('app')

const rectangles: Rectangle[] = [
  {
    left: 0,
    top: 0,
    width: 500,
    height: 250,
  },
  {
    left: 500,
    top: 0,
    width: 500,
    height: 250,
  },
]
const setPdfFile = (file: File | FileList) => {
  pdfFile.value = URL.createObjectURL(file as File)
  page.value = 1
}

const getTextFromImage = async () => {
  if (!imgSrc.value) return
  const worker = await createWorker('pol', 1, {
    logger: (m) => console.log(m),
  })
  let tmpText = ''
  for (let i = 0; i < rectangles.length; i++) {
    const {
      data: { text },
    } = await worker.recognize(imgSrc.value, {
      rectangle: rectangles[i],
    })
    tmpText += text
  }
  convertedText.value = tmpText
  await worker.terminate()
}
</script>

<style lang="scss">
@import '@/styles';
</style>
