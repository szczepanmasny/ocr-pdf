<template>
  <div :class="bem({})">
    <UiFileUploader @upload="setPdfFile" />
    <div :class="bem({ e: 'columns' })">
      <div :class="bem({ e: 'column' })">
        <PdfViewer
          v-model:rectangles="rectangles"
          :pdf="pdfFile"
        />
      </div>
      <div :class="bem({ e: 'column' })">
        <div style="position: relative">
          <div :class="bem({ e: 'preview' })">
            <canvas
              ref="canvasEl"
              :class="bem({ e: 'page' })"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createWorker } from 'tesseract.js'
import { ref } from 'vue'
import { UiFileUploader } from '@/components'
import { defineBem } from '@/helpers'
import PdfViewer from './PdfViewer'
import { RectangleOptions } from '@/models/rectangle'

const pdfFile = ref<string | undefined>(undefined)
const convertedText = ref('')
const page = ref(1)
const imgSrc = ref<string | Uint8Array | undefined>(undefined)
const bem = defineBem('app')

const rectangles = ref<RectangleOptions[]>([])
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

.app {
  display: flex;
  flex-direction: column;
  padding: $sp-lg;
  gap: $sp-md;

  &__columns {
    display: flex;
    gap: $sp-md;
  }

  &__column {
    width: 30rem;
    flex-grow: 1;
  }
}
</style>
