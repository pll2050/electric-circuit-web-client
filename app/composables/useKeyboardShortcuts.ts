import { ref, onMounted, onUnmounted } from 'vue'

export interface KeyboardShortcutCallbacks {
  onDelete?: () => void
  onEscape?: () => void
  onUndo?: () => void
  onRedo?: () => void
  onSelectAll?: () => void
  onCopy?: () => void
  onPaste?: () => void
  onCut?: () => void
  onSave?: () => void
  onZoomIn?: () => void
  onZoomOut?: () => void
  onFitToScreen?: () => void
}

export const useKeyboardShortcuts = (callbacks: KeyboardShortcutCallbacks = {}) => {
  const isEnabled = ref(true)
  let keyDownHandler: ((e: KeyboardEvent) => void) | null = null

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isEnabled.value) return

    // Ignore if user is typing in an input field
    const target = e.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
      return
    }

    const { ctrlKey, metaKey, shiftKey, altKey, key } = e
    const isModifierPressed = ctrlKey || metaKey

    // Delete/Backspace - Delete selected items
    if ((key === 'Delete' || key === 'Backspace') && !isModifierPressed) {
      e.preventDefault()
      callbacks.onDelete?.()
      return
    }

    // Escape - Clear selection/cancel operation
    if (key === 'Escape' && !isModifierPressed) {
      e.preventDefault()
      callbacks.onEscape?.()
      return
    }

    // Ctrl/Cmd shortcuts
    if (isModifierPressed) {
      switch (key.toLowerCase()) {
        case 'z':
          e.preventDefault()
          if (shiftKey) {
            callbacks.onRedo?.()
          } else {
            callbacks.onUndo?.()
          }
          break

        case 'y':
          e.preventDefault()
          callbacks.onRedo?.()
          break

        case 'a':
          e.preventDefault()
          callbacks.onSelectAll?.()
          break

        case 'c':
          e.preventDefault()
          callbacks.onCopy?.()
          break

        case 'v':
          e.preventDefault()
          callbacks.onPaste?.()
          break

        case 'x':
          e.preventDefault()
          callbacks.onCut?.()
          break

        case 's':
          e.preventDefault()
          callbacks.onSave?.()
          break

        case '=':
        case '+':
          e.preventDefault()
          callbacks.onZoomIn?.()
          break

        case '-':
          e.preventDefault()
          callbacks.onZoomOut?.()
          break

        case '0':
          e.preventDefault()
          callbacks.onFitToScreen?.()
          break
      }
    }

    // Function keys
    switch (key) {
      case 'F11':
        // Let browser handle fullscreen
        break
      
      case 'F5':
        // Let browser handle refresh
        break
    }
  }

  const enable = () => {
    isEnabled.value = true
  }

  const disable = () => {
    isEnabled.value = false
  }

  const addKeyboardListeners = () => {
    if (keyDownHandler) return // Already added

    keyDownHandler = handleKeyDown
    document.addEventListener('keydown', keyDownHandler)
  }

  const removeKeyboardListeners = () => {
    if (keyDownHandler) {
      document.removeEventListener('keydown', keyDownHandler)
      keyDownHandler = null
    }
  }

  // Auto-setup and cleanup
  onMounted(() => {
    addKeyboardListeners()
  })

  onUnmounted(() => {
    removeKeyboardListeners()
  })

  return {
    isEnabled,
    enable,
    disable,
    addKeyboardListeners,
    removeKeyboardListeners
  }
}

// Preset configurations for common use cases
export const useEditorKeyboardShortcuts = (editorCallbacks: {
  deleteSelected: () => void
  clearSelection: () => void
  undo?: () => void
  redo?: () => void
  selectAll?: () => void
  copy?: () => void
  paste?: () => void
  cut?: () => void
  save?: () => void
  zoomIn?: () => void
  zoomOut?: () => void
  fitToScreen?: () => void
}) => {
  return useKeyboardShortcuts({
    onDelete: editorCallbacks.deleteSelected,
    onEscape: editorCallbacks.clearSelection,
    onUndo: editorCallbacks.undo,
    onRedo: editorCallbacks.redo,
    onSelectAll: editorCallbacks.selectAll,
    onCopy: editorCallbacks.copy,
    onPaste: editorCallbacks.paste,
    onCut: editorCallbacks.cut,
    onSave: editorCallbacks.save,
    onZoomIn: editorCallbacks.zoomIn,
    onZoomOut: editorCallbacks.zoomOut,
    onFitToScreen: editorCallbacks.fitToScreen
  })
}