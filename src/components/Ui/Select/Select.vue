<template>
  <UiSelect
    v-model="modelValue"
    v-bind="props"
    rounded
    dark
    :class="bem({})"
  />
</template>

<script lang="ts" setup>
import { UiSelect } from '@vuebits/ui'
import { defineBem } from '@/helpers'
import type { SelectItem } from '@/models'

const modelValue = defineModel<string | number | null>()

type Props = {
  placeholder?: string | null
  leftIcon?: string
  items: SelectItem[]
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: null,
  leftIcon: undefined,
})

const bem = defineBem('ui-select')
</script>

<style lang="scss">
.ui-select {
  &__input {
    &:hover {
      background-color: $color-dark !important;
    }
  }
}
</style>
