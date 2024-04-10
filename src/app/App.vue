<template>
  <div :class="bem({})">
    <UiFileUploader @upload="setPdfFile" />
    {{ page }}
    <div :class="bem({ e: 'columns' })">
      <PdfViewer
        v-model:rectangles="rectangles"
        v-model:img-src="imgSrc"
        v-model:text="text"
        v-model:page="page"
        :pdf="pdfFile"
        :class="bem({ e: 'pdf-viewer' })"
      />

      <div :class="bem({ e: 'actions' })">
        <UiButton
          block
          @click="getTextFromImage"
          >Get text</UiButton
        >
      </div>

      <div :class="bem({ e: 'text' })">
        {{ text }}
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
const text = ref<string[][]>([])
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
  let tmpText: string[] = []
  if (!rectangles.value.length) {
    const { data } = await worker.recognize(imgSrc.value)
    tmpText = [data.text]
  } else {
    for (let i = 0; i < rectangles.value.length; i++) {
      const { data } = await worker.recognize(imgSrc.value, {
        rectangle: { ...rectangles.value[i] },
      })
      tmpText.push(data.text)
    }
  }
  text.value[page.value] = tmpText
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

  &__pdf-viewer {
    min-width: 50rem;
    max-width: 100%;
    flex-grow: 1;
  }

  &__actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 15rem;
    gap: $sp-sm;
  }

  &__text {
    width: 50rem;
    max-width: 100%;
  }
}
</style>
