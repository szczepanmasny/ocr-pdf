<template>
  <UiTooltip
    ref="tooltipElement"
    v-bind="props"
    :class="bem({})"
    @open="onOpen"
    @close="onClose"
  >
    <template #activator="{ on, toggle, isActive }">
      <slot
        name="activator"
        :on="on"
        :toggle="toggle"
        :is-active="isActive"
        :close="close"
      />
    </template>
    <template #default="tooltip">
      <div
        :class="
          bem({
            e: 'tooltip',
            m: size,
          })
        "
        tabindex="0"
      >
        <slot :tooltip="tooltip" />
      </div>
    </template>
  </UiTooltip>
</template>

<script lang="ts" setup>
import { UiTooltip } from '@vuebits/ui'
import { defineBem } from '@/helpers'
import { ref } from 'vue'

type Emits = {
  open: []
  close: []
}

const bem = defineBem('ui-popover')

const emit = defineEmits<Emits>()

type Props = {
  size?: string
  position?: 'top' | 'right' | 'bottom' | 'left'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'custom-size',
  position: 'bottom',
})

const tooltipElement = ref<InstanceType<typeof UiTooltip> | null>(null)

const onOpen = (): void => {
  emit('open')
}
const onClose = (): void => {
  emit('close')
}
const open = (): void => {
  tooltipElement.value?.open()
}
const close = (): void => {
  tooltipElement.value?.close()
}

defineExpose({
  open,
  close,
})
</script>

<style lang="scss">
.ui-popover {
  &__tooltip {
    font-size: 1.5rem;
    border: 0;
    color: $color-text;
    border-radius: $border-radius-main;
    background-color: $color-white;
    box-shadow: $shadow-deep;
    max-height: calc(100vh - #{4 * $sp});
    max-width: calc(100vw - #{4 * $sp});
    display: flex;
    flex-direction: column;
    overflow: hidden;

    &:focus {
      outline: none;
    }

    &--sm {
      width: 20rem;
    }

    &--md {
      width: 30rem;
    }

    &--lg {
      width: 50rem;
    }
  }
}
</style>
