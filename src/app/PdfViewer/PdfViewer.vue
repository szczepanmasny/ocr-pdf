<template>
  <div
    ref="viewerEl"
    :class="bem({})"
  >
    <div :class="bem({ e: 'toolbar' })">
      <div :class="bem({ e: 'toolbar-chunk' })">
        <div :class="bem({ e: 'toolbar-chunk-item' })">
          Page
          <UiInput
            :model-value="currentPage"
            type="number"
            :class="bem({ e: 'pager-input' })"
            :max="pages"
            @update:model-value="renderPage({ page: $event })"
          />
          from {{ pages }}
        </div>
        <div :class="bem({ e: 'toolbar-chunk-item' })">
          <UiIconButton
            :disabled="currentPage <= 1"
            :icon="mdiChevronLeft"
            theme="primary"
            tooltip="Poprzednia strona"
            @click="renderPage({ page: currentPage - 1 })"
          />
          <UiIconButton
            :disabled="currentPage >= pages"
            :icon="mdiChevronRight"
            theme="primary"
            tooltip="Następna strona"
            @click="renderPage({ page: currentPage + 1 })"
          />
        </div>
      </div>
      <div :class="bem({ e: 'toolbar-chunk' })">
        <div :class="bem({ e: 'toolbar-chunk-item' })">
          <UiIconButton
            :icon="mdiArrowExpandAll"
            theme="primary"
            tooltip="Add selection"
            @click="addRectangle"
          />
        </div>
      </div>
      <div :class="bem({ e: 'toolbar-chunk' })">
        <div :class="bem({ e: 'toolbar-chunk-item' })"></div>
      </div>
    </div>
    <div :class="bem({ e: 'preview' })">
      <div :class="bem({ e: 'page-wrapper' })">
        <template
          v-for="i of rectangles.length"
          :key="i"
        >
          <Rectangle v-model="rectangles[i - 1]">
            {{ rectangles[i] }}
          </Rectangle>
        </template>
        <canvas
          ref="canvasEl"
          :class="bem({ e: 'page' })"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default { name: 'AppPdfViewer' }
</script>

<script lang="ts" setup>
import { defineBem } from '@/helpers'
import { UiInput, UiIconButton } from '@/components/Ui'
import { onMounted, ref, watch } from 'vue'
import { PDFDocumentProxy } from 'pdfjs-dist'
import { usePdfjs } from '@/plugins'
import { mdiArrowExpandAll, mdiChevronLeft, mdiChevronRight } from '@mdi/js'
import Rectangle from './Rectangle'
import { RectangleOptions } from '@/models'

const rectangles = defineModel<RectangleOptions[]>('rectangles', { required: true })
const imgSrc = defineModel<string | undefined>('imgSrc')

const props = withDefaults(
  defineProps<{
    pdf?: string | URL | null
    fitParent?: boolean
    name?: string
  }>(),
  {
    pdf: '',
    fitParent: false,
    name: 'Bez tytułu',
    type: null,
  },
)

const bem = defineBem('app-pdf-viewer')

const pdfjs = usePdfjs()

const viewerEl = ref<HTMLElement | null>(null)
const canvasEl = ref<HTMLCanvasElement | null>(null)
const currentPage = ref(1)
const scale = ref(200)
const rotation = ref(0)
const pages = ref(0)
let PdfDoc: PDFDocumentProxy | null = null

type RenderPageParams = {
  page?: number | string | null
  scale?: number | string | null
  fitToViewport?: boolean
}

const renderPage = async (p: RenderPageParams) => {
  if (!PdfDoc || !canvasEl.value) return
  const sanitizedPage = Number(p.page ?? currentPage.value)
  const isPageIncorrect =
    !Number.isInteger(sanitizedPage) || sanitizedPage <= 0 || sanitizedPage > pages.value
  if (isPageIncorrect) return
  currentPage.value = sanitizedPage
  const page = await PdfDoc.getPage(sanitizedPage)

  if (p.fitToViewport) {
    const viewerWidth = (viewerEl.value?.clientWidth ?? 0) - 40
    const scale1Width = page.getViewport({ scale: 1 }).width
    scale.value = ((viewerWidth ?? 0) / scale1Width) * 100
  } else if (p.scale) {
    scale.value = Number(p.scale)
  }

  const viewportParams = {
    scale: scale.value / 100,
    rotation: rotation.value,
  }

  const viewport = page.getViewport(viewportParams)
  const ctx = canvasEl.value.getContext('2d')
  if (!ctx) return
  canvasEl.value.width = viewport.width
  canvasEl.value.height = viewport.height
  canvasEl.value.style.width = viewport.width + 'px'
  canvasEl.value.style.height = viewport.height + 'px'

  const renderContext = {
    canvasContext: ctx,
    viewport: viewport,
  }
  await page.render(renderContext).promise
  imgSrc.value = canvasEl.value.toDataURL()
}

const initDoc = async () => {
  if (!canvasEl.value || !props.pdf) return
  const loadingTask = pdfjs.getDocument(props.pdf)
  PdfDoc = await loadingTask.promise
  pages.value = PdfDoc?.numPages ?? 0
  renderPage({
    page: 1,
    fitToViewport: false,
  })
}

const addRectangle = () => {
  rectangles.value.push({
    top: 0,
    left: 0,
    width: 100,
    height: 100,
  })
}

onMounted(() => {
  initDoc()
})

watch(
  () => props.pdf,
  () => {
    initDoc()
  },
)
</script>

<style lang="scss">
.app-pdf-viewer {
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &__toolbar {
    background-color: $color-primary;
    color: $color-white;
    width: 100%;
    display: flex;
    align-items: center;
    gap: $sp-lg;
    justify-content: space-between;
    padding: $sp-xs;
  }

  &__toolbar-chunk {
    display: flex;
    align-items: center;
    gap: $sp-md;
  }

  &__toolbar-chunk-item {
    display: flex;
    align-items: center;
    gap: $sp-xs;
  }

  &__pager-input {
    width: 6rem;
  }

  &__scale-input {
    width: 6rem;
  }

  &__preview {
    text-align: center;
    flex-grow: 1;
    overflow: auto auto;
    background-color: $color-disabled;
    display: flex;
    align-items: center;
  }

  &__page-wrapper {
    position: relative;
  }
}
</style>
