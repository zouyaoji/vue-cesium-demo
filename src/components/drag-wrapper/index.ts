/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-01-04 16:20:18
 * @LastEditTime: 2022-01-17 11:17:42
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-demo\src\components\drag-wrapper\index.ts
 */

import { defineComponent, onMounted, onBeforeUnmount, h, ref, getCurrentInstance } from 'vue'
import interact from 'interactjs'
import { hSlot } from 'vue-cesium/es/utils/private/render'

export default defineComponent({
  name: 'DragWrapper',
  props: {
    restriction: {
      type: [String, Object, Function],
      default: 'parent' // 'parent', 'self'
    }
  },
  setup(props, ctx) {
    // state
    const rootRef = ref(null)
    const instance = getCurrentInstance()

    // methods
    const dragMoveListener = event => {
      const target = event.target
      // keep the dragged position in the data-x/data-y attributes
      const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
      const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

      // translate the element
      target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

      // update the posiion attributes
      target.setAttribute('data-x', x)
      target.setAttribute('data-y', y)
    }

    const resizeListener = () => {
      const node = rootRef.value
      const draggable = interact(node!)
      const dragEvent = { name: 'drag', axis: 'xy' }
      draggable.reflow(dragEvent as any)
    }

    onMounted(() => {
      const node = rootRef.value

      interact(node!).draggable({
        ignoreFrom: 'button, .ignore-drag',
        allowFrom: '.drag-handle',
        inertia: true,
        onmove: dragMoveListener,
        // keep the element within the element
        restrict: {
          restriction: props.restriction,
          endOnly: true,
          elementRect: { left: 0, right: 1, top: 0, bottom: 1 }
        }
      })

      addEventListener('resize', resizeListener, false)
    })

    onBeforeUnmount(() => {
      const node = rootRef.value
      if (interact.isSet(node!)) {
        interact(node!).unset()
      }
      removeEventListener('resize', resizeListener, false)
    })

    Object.assign(instance?.proxy, { resizeListener })

    return () =>
      h(
        'div',
        {
          ref: rootRef,
          class: 'drag-wrapper absolute'
        },
        hSlot(ctx.slots.default)
      )
  }
})
