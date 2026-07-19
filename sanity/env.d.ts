// ponytail: stubs until `sanity` and `@sanity/*` packages are installed
// Remove this file and install deps when setting up Sanity Studio

declare module "sanity" {
  export function defineConfig(config: {
    name?: string
    title?: string
    projectId: string
    dataset: string
    basePath?: string
    plugins?: unknown[]
    schema?: { types: unknown[] }
  }): unknown

  export function defineType(config: {
    name: string
    title: string
    type: string
    fields: unknown[]
    preview?: { select?: Record<string, string> }
  }): unknown

  export function defineField(config: {
    name: string
    title?: string
    type: string
    options?: Record<string, unknown>
    validation?: (rule: { required: () => unknown }) => unknown
    of?: unknown[]
    initialValue?: unknown
    fields?: unknown[]
    rows?: number
    description?: string
  }): unknown
}
