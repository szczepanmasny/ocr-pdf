<template>
  <div
    ref="viewerEl"
    :class="bem({})"
  >
    <div :class="bem({ e: 'toolbar' })">
      <div :class="bem({ e: 'toolbar-chunk' })">
        <div :class="bem({ e: 'toolbar-chunk-item' })">
          Strona
          <UiInput
            :model-value="currentPage"
            type="number"
            :class="bem({ e: 'pager-input' })"
            :max="pages"
            @update:model-value="renderPage({ page: $event })"
          />
          z {{ pages }}
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
          <UiInput
            :model-value="scaleString"
            type="number"
            :class="bem({ e: 'scale-input' })"
            :min="minScale"
            :max="maxScale"
            :step="5"
            @update:model-value="renderPage({ scale: $event })"
          />
          %
        </div>
        <div :class="bem({ e: 'toolbar-chunk-item' })">
          <UiIconButton
            :disabled="scale === minScale"
            :icon="mdiMinus"
            theme="primary"
            tooltip="Pomniejsz"
            @click="renderPage({ scale: prevScale })"
          />
          <UiIconButton
            :disabled="scale === maxScale"
            :icon="mdiPlus"
            theme="primary"
            tooltip="Powiększ"
            @click="renderPage({ scale: nextScale })"
          />
          <UiIconButton
            :icon="mdiArrowExpandAll"
            theme="primary"
            tooltip="Dopasuj do szerokości okna"
            @click="renderPage({ fitToViewport: true })"
          />
        </div>
      </div>
      <div :class="bem({ e: 'toolbar-chunk' })">
        <div :class="bem({ e: 'toolbar-chunk-item' })"></div>
      </div>
    </div>
    <div :class="bem({ e: 'preview' })">
      <canvas
        ref="canvasEl"
        :class="bem({ e: 'page' })"
      />
    </div>
  </div>
</template>

<script lang="ts">
export default { name: 'FnPdfViewer' }
</script>

<script lang="ts" setup>
import { defineBem } from '@/helpers'
import { UiInput, UiIconButton } from '@/components/Ui'
import { computed, onMounted, ref, watch } from 'vue'
import { PDFDocumentProxy } from 'pdfjs-dist'
import { usePdfjs } from '@/plugins'
import { mdiArrowExpandAll, mdiChevronLeft, mdiChevronRight, mdiMinus, mdiPlus } from '@mdi/js'

const bem = defineBem('fn-pdf-viewer')
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
const pdfjs = usePdfjs()

const scaleOptions = [25, 50, 70, 85, 100, 125, 150, 175, 200, 300, 400]

const minScale = scaleOptions[0]
const maxScale = scaleOptions.at(-1)
const prevScale = computed(() => [...scaleOptions].reverse().find((s) => s < scale.value))
const nextScale = computed(() => scaleOptions.find((s) => s > scale.value))

const viewerEl = ref<HTMLElement | null>(null)
const canvasEl = ref<HTMLCanvasElement | null>(null)
const currentPage = ref(1)
const scale = ref(1)
const rotation = ref(0)
const pages = ref(0)
let PdfDoc: PDFDocumentProxy | null = null

const scaleString = computed(() => Math.round(scale.value))

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
}

const initDoc = async () => {
  if (!canvasEl.value || !props.pdf) return
  const loadingTask = pdfjs.getDocument(props.pdf)
  PdfDoc = await loadingTask.promise
  pages.value = PdfDoc.numPages
  renderPage({
    page: 1,
    fitToViewport: true,
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

<style lang="scss" src="./styles.scss" />
