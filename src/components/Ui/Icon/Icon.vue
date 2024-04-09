<template>
  <UiIcon :name="path" />
</template>

<script lang="ts" setup>
import { UiIcon } from '@vuebits/ui'

type Props = {
  path: string
}

withDefaults(defineProps<Props>(), {})
</script>
