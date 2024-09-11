<script setup lang="ts">
import TreeView from '@/components/TreeView/index.vue'
import { TreeNode } from '@/components/TreeView/TreeView.type'
defineOptions({
  name: 'DemoTreeView',
})

const nodes: TreeNode[] = [
  { key: '1', text: 'Node 1', level: 0, parentKey: null },
  { key: '2', text: 'Node 2', level: 1, parentKey: '1' },
  { key: '3', text: 'Node 3', level: 1, parentKey: '1' },
  { key: '4', text: 'Node 4', level: 0, parentKey: null },
]

const triggerLink = (node: TreeNode) => {
  alert(node.text)
}
</script>

<template>
  <div class="w-full">
    <h1 class="text-center text-lg">TreeView 樹狀結構</h1>

    <div class="flex items-center justify-center">
      <TreeView :nodes="nodes" node-header-class="h-20" class="w-1/2 rounded border px-2">
        <template #node-text="{ node }">
          <a
            class="flex size-full items-center"
            :class="`${node.customClass || ''}`"
            :style="{ marginLeft: `${node.level * 20}px` }"
            @click="() => triggerLink(node)"
          >
            <span class="ml-4 flex-1 text-[#333333]">{{ node.text }}</span>
          </a>
        </template>
      </TreeView>
    </div>
  </div>
</template>
