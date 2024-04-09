<template>
  <UiTextarea
    v-model="modelValue"
    v-bind="props"
    rounded
    dark
  >
  </UiTextarea>
</template>

<script lang="ts" setup>
import { UiTextarea } from '@vuebits/ui'

const modelValue = defineModel<string | null>()

type Props = {
  placeholder?: string | null
  leftIcon?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: null,
  leftIcon: undefined,
})
</script>
