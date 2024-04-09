<template>
  <UiDatepicker
    v-model="date"
    rounded
    :disable-before="computedDisableBefore"
    :disable-after="computedDisableAfter"
    v-bind="$attrs"
    highlight-saturdays
    highlight-sundays
    :holidays="holidays"
    :class="bem({})"
    @select="select"
  />
</template>

<script lang="ts" setup>
import { UiDatepicker } from '@vuebits/ui'
import { DateTime } from 'luxon'
import { defineBem } from '@/helpers'
import { computed, ref } from 'vue'

type Emits = {
  (e: 'select', date: Date | string | null): void
  (e: 'change', date: Date | string | null): void
  (e: 'update:model-value', date: Date | string | null): void
}

type Props = {
  modelValue?: Date | string | null
  clearable?: boolean
  disableBefore?: Date | string | null
  disableAfter?: Date | string | null
  error?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  clearable: false,
  disableBefore: null,
  disableAfter: null,
})
const emit = defineEmits<Emits>()

const bem = defineBem('ui-date-picker')
const holidays = ref<Date[]>([])

const getDate = (v: string | Date | null): Date | null => {
  if (typeof v !== 'string') return v
  return DateTime.fromISO(v).toJSDate()
}

const computedDisableBefore = computed<Date | null>(() => getDate(props.disableBefore))
const computedDisableAfter = computed<Date | null>(() => getDate(props.disableAfter))

const date = computed<Date | null>({
  get(): Date | null {
    return getDate(props.modelValue)
  },
  set(value: Date | null): void {
    const formattedDate = value ? DateTime.fromJSDate(value).toISODate() : value
    emit('change', formattedDate)
    emit('update:model-value', formattedDate)
  },
})

const select = (value: Date | string | null): void => {
  emit('select', value)
}
</script>

<style lang="scss">
.ui-date-picker {
  width: 100%;

  &__tooltip {
    padding: $sp-sm;
  }

  &__datepicker {
    margin-bottom: 0;
  }

  &__quick-select-options-group {
    width: 30rem;
    display: flex;
    flex-wrap: wrap;
  }

  &__quick-select-option {
    font-size: 1.1rem !important;
  }
  .ui-datepicker__days-view-date--today {
    color: $color-white;
  }
  input {
    border: none;

    &:focus {
      box-shadow: none;
    }
  }
}
</style>
