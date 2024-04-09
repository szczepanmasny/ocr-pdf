<template>
  <UiButton
    v-bind="props"
    round
    dark
    :disabled="loading || disabled"
    :class="bem({})"
  >
    <slot />
  </UiButton>
</template>

<script lang="ts" setup>
import { UiButton } from '@vuebits/ui'
import type { Color, ButtonTheme, ButtonGradient } from '@/models'
import { defineBem } from '@/helpers'

type Props = {
  color?: Color
  theme?: ButtonTheme
  gradient?: ButtonGradient
  elevated?: boolean
  round?: boolean
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
  theme: undefined,
  gradient: undefined,
  elevated: false,
  round: false,
  disabled: false,
  loading: false,
})

const bem = defineBem('ui-button')
</script>

<style lang="scss">
.ui-button {
  font-weight: 600;
}
</style>
