<template>
  <RectangleDraggableResizable
    v-if="rectangle"
    draggable
    resizable
    :w="rectangle.width"
    :h="rectangle.height"
    :x="rectangle.left"
    :y="rectangle.top"
    parent
    :z="999"
    :class="bem({})"
    @resize-stop="onRectangleModify"
    @drag-stop="onRectangleModify"
  >
  {{ rectangle }}
  </RectangleDraggableResizable>
</template>

<script lang="ts">
export default { name: 'AppPdfViewerRectangle' }
</script>

<script lang="ts" setup>
import RectangleDraggableResizable from 'vue-draggable-resizable'
import { defineBem } from '@/helpers'
import { RectangleOptions } from '@/models'

const rectangle = defineModel<RectangleOptions>({ required: true })
const bem = defineBem('app-pdf-viewer-rectangle')

const onRectangleModify = (left: number, top: number, width: number, height: number) => {
  rectangle.value = {
    left: left != null ? left : rectangle.value.left,
    top: top != null ? top : rectangle.value.top,
    width: width != null ? width : rectangle.value.width,
    height: height != null ? height : rectangle.value.height,
  }
}
</script>

<style lang="scss">
@import "vue-draggable-resizable/style.css";
</style>
