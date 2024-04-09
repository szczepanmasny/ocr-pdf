<template>
  <UiTile
    v-bind="props"
    rounded
  >
    <slot />
  </UiTile>
</template>

<script lang="ts" setup>
import { UiTile } from '@vuebits/ui'

type Props = {
  listItem?: boolean
  dark?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  listItem: false,
  dark: false,
})
</script>
