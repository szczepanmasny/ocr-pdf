<template>
  <UiCheckbox
    v-model="modelValue"
    v-bind="props"
    rounded
    dark
    color="primary"
    :class="bem({})"
  >
    <slot />
  </UiCheckbox>
</template>

<script lang="ts" setup>
import { UiCheckbox } from '@vuebits/ui'
import { defineBem } from '@/helpers'

const modelValue = defineModel<boolean>({
  required: true,
})

type Props = {
  id: number | string
}

const props = withDefaults(defineProps<Props>(), {})

const bem = defineBem('ui-checkbox')
</script>

<style lang="scss">
.ui-checkbox {
  &__label {
    font-size: 1.6rem;
  }
}
</style>
