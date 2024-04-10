<template>
  <div :class="bem({})">
    <UiFileUploader @upload="setPdfFile" />
    <div :class="bem({ e: 'columns' })">
      <div :class="bem({ e: 'column' })">
        <PdfViewer
          v-model:rectangles="rectangles"
          v-model:img-src="imgSrc"
          :pdf="pdfFile"
        />
      </div>

      <div :class="bem({ e: 'column' })">
        <UiButton @click="getTextFromImage">ddd</UiButton>
        {{ convertedText }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createWorker } from 'tesseract.js'
import { ref } from 'vue'
import { UiFileUploader, UiButton } from '@/components'
import { defineBem } from '@/helpers'
import PdfViewer from './PdfViewer'
import { RectangleOptions } from '@/models/rectangle'

const pdfFile = ref<string | undefined>(undefined)
const convertedText = ref('')
const page = ref(1)
const imgSrc = ref<string | undefined>(undefined)
const bem = defineBem('app')

const rectangles = ref<RectangleOptions[]>([])
const setPdfFile = (file: File | FileList) => {
  pdfFile.value = URL.createObjectURL(file as File)
  page.value = 1
}

const getTextFromImage = async () => {
  if (!imgSrc.value) return
  const worker = await createWorker('pol')
  let tmpText = ''
  if (!rectangles.value.length) {
    const {
      data: { text },
    } = await worker.recognize(imgSrc.value)
    tmpText = text
  } else {
    for (let i = 0; i < rectangles.value.length; i++) {
      console.log(rectangles.value[i])
      const {
        data: { text },
      } = await worker.recognize(imgSrc.value, {
        rectangle: { ...rectangles.value[i] },
      })
      console.log(text)
      tmpText += text
    }
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
