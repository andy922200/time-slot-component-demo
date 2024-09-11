export interface CheckboxGroupOption {
  id: string
  isFather: boolean
  name: string
  checked: boolean
  value: string
}

export type CheckboxGroupOptionMap<T = object> = {
  id: string
  data: CheckboxGroupOption[]
} & T

export interface CheckboxGroupStyle {
  bgColor: string
  checkedBgColor: string
  checkedBorderColor: string
  defaultMarkIconColor: string
}
