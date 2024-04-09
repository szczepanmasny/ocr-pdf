<template>
  <UiField
    v-bind="$attrs"
    :id="id"
    :hint="hint"
    :class="bem({})"
    :label="label"
  >
    <template #label>
      <span
        v-if="label"
        :class="bem({ e: 'label' })"
        data-cy="field-label"
      >
        {{ label }}
      </span>
    </template>
    <slot />
  </UiField>
</template>

<script lang="ts" setup>
import { UiField } from '@vuebits/ui'
import { defineBem } from '@/helpers'

withDefaults(
  defineProps<{
    id?: string
    label?: string
    hint?: string
  }>(),
  {
    id: '',
    label: '',
    hint: undefined,
  },
)

const bem = defineBem('ui-field')
</script>

<style lang="scss">
.ui-field {
  &__label {
    font-weight: bold;
  }
}
</style>
