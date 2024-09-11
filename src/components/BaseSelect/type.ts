export type BaseSelectOptionValueType<T = Record<string, unknown>> = string | T

export type BaseSelectOption = {
  id: string
  label: string
  value: BaseSelectOptionValueType
  disabled?: boolean
}

export type SelectedValue<T> =
  | BaseSelectOptionValueType<T>
  | BaseSelectOptionValueType<T>[]
  | undefined
