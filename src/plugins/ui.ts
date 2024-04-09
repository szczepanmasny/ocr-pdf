import { createUI, useUi } from '@vuebits/ui'
import {
  mdiAlertCircle,
  mdiCheck,
  mdiLoading,
  mdiChevronLeft,
  mdiChevronRight,
  mdiChevronDown,
  mdiChevronUp,
  mdiUpload,
  mdiClose,
  mdiMenu,
} from '@mdi/js'
import type { CustomOptions } from '@vuebits/ui/types/models'

const config: CustomOptions = {
  locale: 'en',
  icons: {
    format: 'js',
    type: 'mdi',
    size: 20,
    viewbox: '0 0 24 24',
    values: {
      error: mdiAlertCircle,
      spinner: mdiLoading,
      check: mdiCheck,
      previous: mdiChevronLeft,
      next: mdiChevronRight,
      expand: mdiChevronDown,
      collapse: mdiChevronUp,
      upload: mdiUpload,
      close: mdiClose,
      menu: mdiMenu,
    },
  },
}

const ui = createUI(config)

export { ui, useUi }
