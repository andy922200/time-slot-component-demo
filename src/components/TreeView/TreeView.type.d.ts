export interface TreeNode {
  key: string
  text?: string
  textKey?: string
  level: number
  parentKey: string | null
  [key: string]: any
}
