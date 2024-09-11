<script setup lang="ts">
import { computed, PropType, ref } from 'vue'

import { TreeNode } from '@/components/TreeView/TreeView.type'
import SimpleLineIconsArrowUp from '~icons/simple-line-icons/arrow-up'

defineOptions({
  name: 'TreeView',
})

const props = defineProps({
  nodes: {
    type: Array as PropType<TreeNode[]>,
    default: () => [],
  },
  parentKey: {
    type: String as PropType<string | null>,
    default: null,
  },
  level: {
    type: Number,
    default: 0,
  },
  isAccordion: {
    type: Boolean,
    default: false,
  },
  nodeHeaderClass: {
    type: String,
    default: 'h-12',
  },
  textClass: {
    type: String,
    default: '',
  },
  isRecursive: {
    type: Boolean,
    default: false,
  },
})

const openStates = ref<Record<string, boolean>>({})

const toggle = (key: string) => {
  if (props.isAccordion && !openStates.value[key]) {
    openStates.value = {}
  }

  openStates.value[key] = !openStates.value[key]
}

const isOpen = (key: string) => {
  return !!openStates.value[key]
}

const filteredNodes = computed(() =>
  props.nodes.filter((node) => node.level === props.level && node.parentKey === props.parentKey),
)

const hasChildren = (node: TreeNode) => {
  return props.nodes.some((n) => n.parentKey === node.key)
}

// for Unit Test
defineExpose({ filteredNodes })
</script>

<template>
  <div class="tree-view">
    <div v-for="(node, index) in filteredNodes" :key="node.key" class="tree-node">
      <div
        class="node-header flex cursor-pointer items-center"
        :class="nodeHeaderClass || ''"
        :style="{
          borderBottom:
            !isRecursive && level === 0 && index === filteredNodes.length - 1
              ? 'none'
              : '1px solid #eeeeee',
        }"
      >
        <slot name="node-text" :node="node">
          <span
            class="node-text flex-1"
            :class="textClass || ''"
            :style="{ marginLeft: `${node.level * 20}px` }"
          >
            {{ node.textKey ? $t(node.textKey) : node.text }}
          </span>
        </slot>
        <span
          v-if="hasChildren(node)"
          class="toggle-icon cursor-pointer py-4 pl-4"
          @click="toggle(node.key)"
        >
          <SimpleLineIconsArrowUp
            class="size-4 transition-transform duration-300"
            :style="{ transform: isOpen(node.key) ? 'rotate(0deg)' : 'rotate(180deg)' }"
          />
        </span>
      </div>
      <TransitionGroup name="tree">
        <TreeView
          v-if="isOpen(node.key) && hasChildren(node)"
          :key="node.key"
          :nodes="nodes"
          :parent-key="node.key"
          :level="level + 1"
          :node-header-class="nodeHeaderClass"
          :is-accordion="isAccordion"
          :text-class="textClass"
          :is-recursive="true"
        >
          <template v-for="(_, slot) of $slots" #[slot]="scope: TreeNode">
            <slot :name="slot" v-bind="scope" />
          </template>
        </TreeView>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tree-enter-active,
.tree-leave-active {
  transition: all 0.3s ease-in-out;
}

.tree-enter-from,
.tree-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}

.tree-enter-to,
.tree-leave-from {
  max-height: 100px;
  opacity: 1;
}
</style>
