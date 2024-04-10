<template>
  <div :class="bem({})">
    <UiFileUploader @upload="setPdfFile" />
    <div
      v-if="pdfFile"
      :class="bem({ e: 'columns' })"
    >
      <PdfViewer
        ref="pdfViewer"
        v-model:pageData="pages[page]"
        v-model:pages="pages"
        v-model:img-src="imgSrc"
        v-model:page="page"
        :pdf="pdfFile"
        :class="bem({ e: 'pdf-viewer' })"
      />

      <div :class="bem({ e: 'actions' })">
        <UiButton
          block
          @click="getTextFromImage"
          >Get text from this page</UiButton
        >
      </div>

      <div
        v-if="pages[page]"
        :class="bem({ e: 'text' })"
      >
        {{ pages[page].text }}
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
import { PageData } from '@/models'

const pdfFile = ref<string | undefined>(undefined)
const page = ref(1)
const imgSrc = ref<string | undefined>(undefined)
const bem = defineBem('app')
const pages = ref<PageData[]>([])
const pdfViewer = ref<InstanceType<typeof PdfViewer> | null>(null)

const setPdfFile = (file: File | FileList) => {
  pdfFile.value = URL.createObjectURL(file as File)
  page.value = 1
}

const getTextFromImage = async () => {
  if (!imgSrc.value) return
  const worker = await createWorker('pol')
  let tmpText: string[] = []
  const rectangles = pages.value[page.value].rectangles
  if (!rectangles?.length) {
    const { data } = await worker.recognize(imgSrc.value)
    tmpText = [data.text]
  } else {
    for (let i = 0; i < rectangles.length; i++) {
      const { data } = await worker.recognize(imgSrc.value, {
        rectangle: { ...rectangles[i] },
      })
      tmpText.push(data.text)
    }
  }
  pages.value[page.value].text = tmpText
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
    width: 50rem;
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
    flex-grow: 1;
  }
}
</style>
