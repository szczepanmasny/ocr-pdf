<template>
  <UiAutocomplete
    v-model="modelValue"
    :left-icon="mdiMagnify"
    v-bind="props"
    rounded
    dark
    :search-delay="external ? 300 : 0"
  >
  </UiAutocomplete>
</template>

<script lang="ts" setup>
import { UiAutocomplete } from '@vuebits/ui'
import { mdiMagnify } from '@mdi/js'
import type { AutocompleteSelectedItem, AutocompleteItem } from '@/models'
const modelValue = defineModel<AutocompleteSelectedItem | null>()

type Props = {
  items: AutocompleteItem[]
  placeholder?: string | null
  loading?: boolean
  external?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: null,
  loading: false,
  external: false,
})
</script>
