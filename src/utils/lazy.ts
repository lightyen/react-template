export const lazy = (source: string) => () => import(source)
