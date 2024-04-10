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
            :model-value="page"
            type="number"
            :class="bem({ e: 'pager-input' })"
            :max="totalPages"
            @update:model-value="renderPage({ page: $event })"
          />
          from {{ totalPages }}
        </div>
        <div :class="bem({ e: 'toolbar-chunk-item' })">
          <UiIconButton
            :disabled="page <= 1"
            :icon="mdiChevronLeft"
            theme="primary"
            tooltip="Poprzednia strona"
            @click="renderPage({ page: page - 1 })"
          />
          <UiIconButton
            :disabled="page >= totalPages"
            :icon="mdiChevronRight"
            theme="primary"
            tooltip="Następna strona"
            @click="renderPage({ page: page + 1 })"
          />
        </div>
      </div>
      <div :class="bem({ e: 'toolbar-chunk' })">
        <div :class="bem({ e: 'toolbar-chunk-item' })">
          <UiIconButton
            :icon="mdiSelectionDrag"
            theme="primary"
            tooltip="Add selection"
            @click="addRectangle"
          />
          <UiIconButton
            :icon="mdiSelectionRemove"
            theme="primary"
            tooltip="Remove all selections"
            @click="removeAllRectangles"
          />
          <UiIconButton
            :icon="mdiReload"
            theme="primary"
            tooltip="Remove all selections"
            @click="useRectanglesTemplate"
          />
        </div>
        <div :class="bem({ e: 'toolbar-chunk-item' })">
          <UiIconButton
            :icon="mdiBookOpenPageVariantOutline"
            theme="primary"
            tooltip="Save template for all pages"
            @click="saveRectanglesForAllPages"
          />
          <UiIconButton
            :icon="mdiPagePrevious"
            theme="primary"
            tooltip="Save template for even pages"
            @click="saveRectanglesForEvenPages"
          />
          <UiIconButton
            :icon="mdiPageNext"
            theme="primary"
            tooltip="Save template for odd pages"
            @click="saveRectanglesForOddPages"
          />
        </div>
      </div>
    </div>
    <div :class="bem({ e: 'preview' })">
      <div :class="bem({ e: 'page-wrapper' })">
        <template v-if="pageData?.rectangles">
          <template
            v-for="i of pageData.rectangles.length"
            :key="i"
          >
            <Rectangle v-model="pageData.rectangles[i - 1]" />
          </template>
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
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { PDFDocumentProxy } from 'pdfjs-dist'
import { usePdfjs } from '@/plugins'
import {
  mdiBookOpenPageVariantOutline,
  mdiChevronLeft,
  mdiChevronRight,
  mdiPageNext,
  mdiPagePrevious,
  mdiReload,
  mdiSelectionDrag,
  mdiSelectionRemove,
} from '@mdi/js'
import Rectangle from './Rectangle'
import { PageData, RectangleOptions } from '@/models'

const pageData = defineModel<PageData>('pageData')
const pages = defineModel<PageData[]>('pages', { required: true })
const imgSrc = defineModel<string | undefined>('imgSrc')
const page = defineModel<number>('page', { required: true })

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

const oddPagesRectangles = ref<RectangleOptions[] | undefined>(undefined)
const evenPagesRectangles = ref<RectangleOptions[] | undefined>(undefined)
const viewerEl = ref<HTMLElement | null>(null)
const canvasEl = ref<HTMLCanvasElement | null>(null)
const rotation = ref(0)

const totalPages = computed(() => pages.value.length)

let PdfDoc: PDFDocumentProxy | null = null

type RenderPageParams = {
  page?: number | string | null
  scale?: number | string | null
}
const useRectanglesTemplate = () => {
  if (pageData.value) {
    pageData.value.rectangles =
      page.value % 2 === 0 ? evenPagesRectangles.value : oddPagesRectangles.value
  }
}

const renderPage = async (p: RenderPageParams) => {
  if (!PdfDoc || !canvasEl.value) return
  const sanitizedPage = Number(p.page ?? page.value)
  const isPageIncorrect =
    !Number.isInteger(sanitizedPage) || sanitizedPage <= 0 || sanitizedPage > totalPages.value
  if (isPageIncorrect) return
  page.value = sanitizedPage
  const pageProxy = await PdfDoc.getPage(sanitizedPage)

  const viewerWidth = (viewerEl.value?.clientWidth ?? 0) - 40
  const scale1Width = pageProxy.getViewport({ scale: 1 }).width
  const scale = ((viewerWidth ?? 0) / scale1Width) * 100

  const viewportParams = {
    scale: scale / 100,
    rotation: rotation.value,
  }

  const viewport = pageProxy.getViewport(viewportParams)
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
  await pageProxy.render(renderContext).promise
  imgSrc.value = canvasEl.value.toDataURL()
  if (!pageData.value?.rectangles) useRectanglesTemplate()
}

const initDoc = async () => {
  if (!canvasEl.value || !props.pdf) return
  const loadingTask = pdfjs.getDocument(props.pdf)
  PdfDoc = await loadingTask.promise
  if (!PdfDoc) return
  pages.value = Array.from(Array(PdfDoc.numPages).keys()).map(() => ({
    text: '',
    ocrText: '',
  }))
  nextTick(() => {
    renderPage({
      page: 1,
    })
  })
}

const addRectangle = () => {
  if (!pageData.value) return
  pageData.value.rectangles = [
    ...(pageData.value.rectangles ?? []),
    {
      top: 100,
      left: 100,
      width: 200,
      height: 200,
    },
  ]
}

const removeAllRectangles = () => {
  if (!pageData.value) return
  pageData.value.rectangles = []
}

const saveRectanglesForEvenPages = () => {
  if (!pageData.value?.rectangles) return
  evenPagesRectangles.value = pageData.value.rectangles.map((r) => ({ ...r }))
}

const saveRectanglesForOddPages = () => {
  if (!pageData.value?.rectangles) return
  oddPagesRectangles.value = pageData.value.rectangles.map((r) => ({ ...r }))
}

const saveRectanglesForAllPages = () => {
  saveRectanglesForEvenPages()
  saveRectanglesForOddPages()
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
  border-radius: $border-radius-main;
  border: set-border($color-primary);

  &__toolbar {
    background-color: $color-primary;
    color: $color-white;
    width: 100%;
    display: flex;
    align-items: center;
    gap: $sp-lg;
    justify-content: space-between;
    padding: $sp-sm;
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
