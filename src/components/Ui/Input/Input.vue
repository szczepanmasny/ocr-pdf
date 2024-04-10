<template>
  <UiInput
    v-model="modelValue"
    v-bind="props"
    rounded
    dark
  >
  </UiInput>
</template>

<script lang="ts" setup>
import { UiInput } from '@vuebits/ui'

const modelValue = defineModel<string | number | null>()

type Props = {
  placeholder?: string | null
  leftIcon?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: null,
  leftIcon: undefined,
})
</script>
