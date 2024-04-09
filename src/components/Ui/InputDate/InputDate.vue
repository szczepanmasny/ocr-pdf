<template>
  <UiPopover
    clickable
    :class="bem({})"
  >
    <template #activator="{ on, close }">
      <UiInput
        :model-value="inputDate"
        block
        type="tel"
        :placeholder="placeholder"
        :error="error"
        :left-icon="mdiCalendar"
        :right-icon="modelValue && clearable ? 'close' : undefined"
        :right-icon-clickable="!!modelValue && clearable"
        :class="bem({ e: 'date' })"
        @click-right-icon="date = null"
        v-on="on"
        @input="handleInput($event, close)"
      />
    </template>
    <template #default="{ tooltip }">
      <div :class="bem({ e: 'tooltip' })">
        <UiDatePicker
          v-model="date"
          rounded
          :disable-before="disableBefore"
          :disable-after="disableAfter"
          :class="bem({ e: 'datepicker' })"
          @update:model-value="tooltip.close"
          @select="select($event)"
        />
      </div>
    </template>
  </UiPopover>
</template>

<script lang="ts"></script>

<script lang="ts" setup>
import { DateTime } from 'luxon'
import { mdiCalendar } from '@mdi/js'
import { UiDatePicker } from '@/components/Ui/DatePicker'
import { UiPopover } from '@/components/Ui/Popover'
import { UiInput } from '@/components/Ui/Input'
import { debounce, defineBem } from '@/helpers'
import { computed } from 'vue'

type Emits = {
  select: [date: Date | string | null]
  change: [date: Date | string | null]
  'update:model-value': [date: Date | string | null]
}

type Props = {
  modelValue?: string | null
  clearable?: boolean
  disableBefore?: Date | string | null
  disableAfter?: Date | string | null
  error?: boolean
  format?: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  clearable: false,
  disableBefore: null,
  disableAfter: null,
  error: false,
  format: '',
  placeholder: 'Wybierz datę',
})
const emit = defineEmits<Emits>()

const bem = defineBem('ui-input-date')
const inputDate = computed(() => DateTime.fromISO(props.modelValue || '').toISODate())

const date = computed<Date | string | null>({
  get(): Date | string | null {
    return props.modelValue
  },
  set(value: Date | string | null): void {
    emit('change', value)
    emit('update:model-value', value)
  },
})

const select = (value: Date | string | null): void => {
  emit('select', value)
}

const parseInputToDate = (value: string, close: any) => {
  if (!value) return
  const luxonDate = DateTime.fromISO(value)
  if (!luxonDate.isValid) return
  try {
    date.value = luxonDate.toISODate()
    close()
  } catch {}
}

const handleInput = debounce(
  (value: string, close: any) => {
    parseInputToDate(value, close)
  },
  300,
  false,
)
</script>

<style lang="scss">
.ui-input-date {
  width: 100%;

  &__tooltip {
    padding: $sp-sm;
    width: 40rem;
  }

  &__datepicker {
    margin-bottom: $sp-lg;
  }

  &__quick-select-options-group {
    width: 30rem;
    display: flex;
    flex-wrap: wrap;
  }

  &__quick-select-option {
    font-size: 1.1rem !important;
  }
}
</style>
