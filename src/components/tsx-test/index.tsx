/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2022-08-23 19:08:12
 * @LastEditTime: 2022-08-23 19:21:06
 * @LastEditors: zouyaoji
 * @Description:
 *
 * @FilePath: \vue-cesium-demo\src\components\tsx-test\index.tsx
 */
import { defineComponent, ref } from 'vue'
import { VcAnalyses, VcAnalysesRef, VcBtn } from 'vue-cesium'
import { VcDrawingActionInstance } from 'vue-cesium/es/utils/drawing-types'

export default defineComponent({
  name: 'Test',
  setup(props, ctx) {
    const analysisRef = ref<VcAnalysesRef>(null)

    const toggle = (drawingActionInstance: VcDrawingActionInstance) => {
      analysisRef.value.toggleAction(drawingActionInstance.name)
    }
    const slots = {
      body: (drawingActionInstances: Array<VcDrawingActionInstance>) => {
        const child = []
        drawingActionInstances.forEach(drawingActionInstance => {
          child.push(
            <VcBtn
              rounded
              onClick={() => toggle(drawingActionInstance)}
              color={drawingActionInstance.isActive ? 'positive' : 'primary'}>
              {drawingActionInstance.name}
            </VcBtn>
          )
        })

        return <div class='custom-analysis'>{child}</div>
      }
    }
    return () => [<VcAnalyses v-slots={slots} ref={analysisRef}></VcAnalyses>]
  }
})
