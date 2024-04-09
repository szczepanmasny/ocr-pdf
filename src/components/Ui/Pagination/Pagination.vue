<template>
  <UiPagination
    v-bind="props"
    rounded
  />
</template>

<script lang="ts" setup>
import { UiPagination } from '@vuebits/ui'

type Props = {
  modelValue: number
  pageSize: number
  lastPage: number
}

const props = withDefaults(defineProps<Props>(), {})
</script>
