<template>
  <section :class="bem({ m: [`padding-${paddingSize}`] })">
    <h2
      v-if="title"
      :class="bem({ e: 'title' })"
    >
      {{ title }}
    </h2>
    <slot />
  </section>
</template>

<script lang="ts" setup>
import { defineBem } from '@/helpers'

withDefaults(
  defineProps<{
    noPadding?: boolean
    vertical?: boolean
    title?: string
    description?: string
    paddingSize?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  }>(),
  {
    noPadding: false,
    vertical: false,
    title: '',
    description: '',
    paddingSize: 'lg',
  },
)

const bem = defineBem('ui-section')
</script>

<style lang="scss">
.ui-section {
  width: 100%;
  max-width: 140rem;
  padding-left: $sp-md;
  padding-right: $sp-md;
  margin: 0 auto;

  &--padding-none {
    padding-top: 0;
    padding-bottom: 0;
  }
  &--padding-sm {
    padding-top: $sp-sm;
    padding-bottom: $sp-sm;
  }
  &--padding-md {
    padding-top: $sp-md;
    padding-bottom: $sp-md;
  }
  &--padding-lg {
    padding-top: $sp-lg;
    padding-bottom: $sp-lg;
  }
  &--padding-xl {
    padding-top: $sp-xl;
    padding-bottom: $sp-xl;
  }
  &--vertical {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  &__title {
    text-align: center;
    font-size: 3.5rem;
    margin-bottom: $sp-lg;
  }
}
</style>
