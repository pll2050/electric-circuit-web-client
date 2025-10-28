/**
 * Navigator (미니맵) Composable
 * KitchenSink NavigatorService를 참고하여 작성
 */

// NavigatorElementView - KitchenSink와 동일
const createNavigatorElementView = (joint: any) => {
  return joint.dia.ElementView.extend({
    body: null,
    markup: joint.util.svg`<path @selector="body" opacity="0.4" />`,
    initFlag: ['@render', '@update', '@transform'],
    presentationAttributes: {
      position: ['@transform'],
      angle: ['@transform'],
      size: ['@update']
    },
    confirmUpdate: function(flags: any) {
      if (this.hasFlag(flags, '@render')) this.render()
      if (this.hasFlag(flags, '@update')) this.update()
      if (this.hasFlag(flags, '@transform')) this.updateTransformation()
    },
    render: function() {
      const doc = joint.util.parseDOMJSON(this.markup)
      this.body = doc.selectors.body
      this.el.appendChild(doc.fragment)
    },
    update: function() {
      const { model, body } = this
      const { width, height } = model.size()
      const d = `M 0 0 H ${width} V ${height} H 0 Z`
      body.setAttribute('d', d)
    }
  })
}

export const useNavigator = () => {
  let navigatorInstance: any = null
  let transitionCanceled = false

  /**
   * Navigator 생성 (KitchenSink 방식)
   */
  const createNavigator = async (container: HTMLElement, scroller: any) => {
    console.log('🔄 Creating Navigator (KitchenSink style)...')

    // JointJS+ 모듈 import
    const joint = await import('@joint/plus')

    // NavigatorElementView 생성
    const NavigatorElementView = createNavigatorElementView(joint)

    // 컨테이너 크기에 맞게 Navigator 크기 계산
    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight
    const navWidth = Math.max(200, containerWidth - 20)  // 최소 200px, 패딩 20px
    const navHeight = Math.max(100, containerHeight - 20)  // 최소 100px, 패딩 20px

    console.log('📐 Navigator size calculated:', {
      containerWidth,
      containerHeight,
      navWidth,
      navHeight
    })

    // Navigator 생성 (컨테이너 크기에 맞춤)
    navigatorInstance = new joint.ui.Navigator({
      paperScroller: scroller,
      width: navWidth,
      height: navHeight,
      padding: 10,
      zoom: false,
      useContentBBox: true,
      paperOptions: {
        async: true,
        sorting: joint.dia.Paper.sorting.APPROX,
        elementView: NavigatorElementView,
        cellViewNamespace: {},
        viewport: (view: any) => !view.model.isLink(),
        background: {
          color: 'transparent'
        },
        interactive: false
      }
    })

    // Transition 이벤트 리스너 (KitchenSink 방식)
    navigatorInstance.el.addEventListener('transitionend', () => {
      if (transitionCanceled) return
      navigatorInstance.updateCurrentView()
    })

    navigatorInstance.el.addEventListener('transitioncancel', () => {
      transitionCanceled = true
    })

    // Container에 추가 (prepend - 먼저 추가)
    container.appendChild(navigatorInstance.el)
    navigatorInstance.render()

    // 스크롤 이벤트 리스너
    scroller.el.addEventListener('scroll', () => {
      if (navigatorInstance) {
        navigatorInstance.updateCurrentView()
      }
    })

    // Paper의 transform 이벤트 리스너 (zoom, pan, resize)
    const paper = scroller.options.paper
    if (paper) {
      // Scale 변경 시 (zoom)
      paper.on('scale', () => {
        if (navigatorInstance) {
          navigatorInstance.updateCurrentView()
        }
      })

      // Translate 변경 시 (pan)
      paper.on('translate', () => {
        if (navigatorInstance) {
          navigatorInstance.updateCurrentView()
        }
      })

      // Paper 크기 변경 시 (resize)
      paper.on('resize', () => {
        if (navigatorInstance) {
          console.log('📐 Paper resized, updating Navigator viewport')
          navigatorInstance.updateCurrentView()
        }
      })

      // Graph 변경 시에도 업데이트 (요소 추가/제거)
      const graph = paper.model
      if (graph) {
        graph.on('change add remove', () => {
          if (navigatorInstance) {
            navigatorInstance.updateCurrentView()
          }
        })
      }

      console.log('✅ Paper transform and resize event listeners added')
    }

    // Navigator 클릭 시에도 viewport 업데이트
    navigatorInstance.el.addEventListener('mouseup', () => {
      setTimeout(() => {
        if (navigatorInstance) {
          navigatorInstance.updateCurrentView()
        }
      }, 10)
    })

    console.log('✅ Navigator created successfully')

    // 초기 viewport 업데이트
    setTimeout(() => {
      if (navigatorInstance) {
        navigatorInstance.updateCurrentView()
        console.log('🎯 Navigator initial viewport updated')
      }
    }, 100)

    return navigatorInstance
  }

  /**
   * Navigator 제거
   */
  const destroyNavigator = () => {
    if (navigatorInstance) {
      try {
        navigatorInstance.remove()
        navigatorInstance = null
        console.log('✅ Navigator destroyed')
      } catch (error) {
        console.error('❌ Navigator destroy failed:', error)
      }
    }
  }

  /**
   * Navigator 표시/숨김
   */
  const toggleNavigator = () => {
    if (!navigatorInstance) return

    const isVisible = !navigatorInstance.el.classList.contains('hidden')

    if (isVisible) {
      navigatorInstance.el.classList.add('hidden')
    } else {
      navigatorInstance.el.classList.remove('hidden')
      transitionCanceled = false
      setTimeout(() => {
        if (navigatorInstance) {
          navigatorInstance.updateCurrentView()
        }
      }, 300)
    }
  }

  /**
   * Viewport 업데이트
   */
  const updateViewport = () => {
    if (navigatorInstance) {
      navigatorInstance.updateCurrentView()
    }
  }

  return {
    createNavigator,
    destroyNavigator,
    toggleNavigator,
    updateViewport
  }
}
