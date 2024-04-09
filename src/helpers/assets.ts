export const assets = (filename: string, placeholder?: string) => {
  const svg = import.meta.glob('/assets/**/*.svg', { eager: true }) as any
  const png = import.meta.glob('/assets/**/*.png', { eager: true }) as any
  const modules = {
    ...svg,
    ...png,
  }
  return modules[`/assets/${filename}`].default ?? modules[`/assets/${placeholder}`].default
}
