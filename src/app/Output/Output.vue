<template>
  <div :class="bem({})">
    <div :class="bem({ e: 'toolbar' })">
      <div :class="bem({ e: 'toolbar-chunk' })">
        <div :class="bem({ e: 'toolbar-chunk-item' })">
          <UiIconButton
            :icon="mdiReload"
            theme="primary"
            tooltip="Add selection"
            @click="restoreOcrText"
          />
        </div>
        <div :class="bem({ e: 'toolbar-chunk-item' })">
          <UiIconButton
            :icon="mdiTextBoxRemove"
            theme="primary"
            tooltip="Add selection"
            @click="removeUnwantedBreaks"
          />
          <UiIconButton
            :icon="mdiArrowCollapseVertical"
            theme="primary"
            tooltip="Add selection"
            @click="removeDoubleNewLines"
          />
          <UiIconButton
            :icon="mdiWrap"
            theme="primary"
            tooltip="Add selection"
            @click="removeBreakingHyphens"
          />
        </div>
      </div>
    </div>
    <UiTextarea
      v-model="text"
      :class="bem({ e: 'preview' })"
    />
  </div>
</template>

<script lang="ts">
export default { name: 'AppPdfViewer' }
</script>

<script lang="ts" setup>
import { defineBem } from '@/helpers'
import { UiIconButton, UiTextarea } from '@/components'
import { mdiArrowCollapseVertical, mdiReload, mdiTextBoxRemove, mdiWrap } from '@mdi/js'

const text = defineModel<string>('text', { required: true })

const props = defineProps<{
  ocrText: string
}>()

const bem = defineBem('app-output')

const removeUnwantedBreaks = () => {
  text.value = text.value.replace(/([a-zA-ZÀ-ž])(\n)([a-zA-zÀ-ž])/g, '$1 $3')
}

const removeDoubleNewLines = () => {
  text.value = text.value.replace(/\n{2,}/g, '\n')
}

const removeBreakingHyphens = () => {
  text.value = text.value.replace(/([a-zA-ZÀ-ž])(-\n)([a-zA-zÀ-ž])/g, '$1$3')
}

const restoreOcrText = () => {
  text.value = props.ocrText
}
</script>

<style lang="scss">
.app-output {
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

  &__preview {
    flex-grow: 1;
    & textarea {
      font-size: 1.8rem !important;
      height: 100%;
    }
  }
}
</style>
