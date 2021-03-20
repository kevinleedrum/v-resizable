const allHandles = ['t', 'r', 'b', 'l', 'tr', 'br', 'bl', 'tl']

let defaults = {
  handles: allHandles,
  minWidth: 0,
  maxWidth: Number.MAX_SAFE_INTEGER,
  minHeight: 0,
  maxHeight: Number.MAX_SAFE_INTEGER,
  handleWidth: 12,
  handleZIndex: 100,
}

const bind = (el, { value, modifiers }) => {
  let left, top, width, height, startX, startY, handleEls, activeHandle
  let handles,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    handleWidth,
    handleZIndex

  el.style.position = 'absolute'
  setOptions()
  addHandles()
  el.addEventListener('mousedown', start)
  el.addEventListener('touchstart', start)
  el.onMouseDown = start // for removing the event listeners in unbind

  function setOptions() {
    const getModifier = x =>
      value && value[x] && typeof value[x] === 'number' ? value[x] : null
    const getOption = x => getModifier(x) || defaults[x]
    minWidth = getOption('minWidth')
    maxWidth = getOption('maxWidth')
    minHeight = getOption('minHeight')
    maxHeight = getOption('maxHeight')
    handleWidth = getOption('handleWidth')
    handleZIndex = getOption('handleZIndex')
  }

  function addHandles() {
    if (Object.keys(modifiers).some(m => allHandles.includes(m))) {
      handles = allHandles.filter(m => modifiers[m])
    } else {
      handles = defaults.handles
    }
    handleEls = handles.map(createHandleEl)
    handleEls.forEach(handleEl => el.appendChild(handleEl))
  }

  function createHandleEl(handle) {
    const handleWidthPx = handleWidth + 'px'
    const handleOffsetPx = -handleWidth / 2 + 'px'
    const handleCornerZIndex = handleZIndex + 1

    const handleEl = document.createElement('div')
    handleEl.dataset.handle = handle
    handleEl.style.position = 'absolute'
    handleEl.style.touchAction = 'none'
    handleEl.style.userSelect = 'none'
    handleEl.style.zIndex =
      handle.length === 1 ? handleZIndex : handleCornerZIndex
    handleEl.style.cursor = getCursor(handle)
    if (handle.includes('t')) {
      handleEl.style.top = handleOffsetPx
      handleEl.style.height = handleWidthPx
      if (handle === 't') {
        handleEl.style.left = 0
        handleEl.style.width = '100%'
      }
    }
    if (handle.includes('b')) {
      handleEl.style.bottom = handleOffsetPx
      handleEl.style.height = handleWidthPx
      if (handle === 'b') {
        handleEl.style.left = 0
        handleEl.style.width = '100%'
      }
    }
    if (handle.includes('r')) {
      handleEl.style.right = handleOffsetPx
      handleEl.style.width = handleWidthPx
      if (handle === 'r') {
        handleEl.style.top = 0
        handleEl.style.height = '100%'
      }
    }
    if (handle.includes('l')) {
      handleEl.style.left = handleOffsetPx
      handleEl.style.width = handleWidthPx
      if (handle === 'l') {
        handleEl.style.top = 0
        handleEl.style.height = '100%'
      }
    }
    return handleEl
  }

  function start(e) {
    if (!handleEls.includes(e.target)) return

    const isTouch = e.type === 'touchstart' && e.touches.length > 0
    const evtData = isTouch ? e.touches[0] : e
    startX = evtData.clientX
    startY = evtData.clientY
    left = el.offsetLeft
    top = el.offsetTop
    width = el.clientWidth
    height = el.clientHeight

    document.documentElement.style.cursor = getCursor(e.target.dataset.handle)
    activeHandle = e.target.dataset.handle

    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', end)
    document.addEventListener('touchmove', move)
    document.addEventListener('touchend', end)
    e.preventDefault()
  }

  function move(e) {
    const isTouch = e.type === 'touchmove' && e.touches.length > 0
    const evtData = isTouch ? e.touches[0] : e
    const dx = evtData.clientX - startX
    const dy = evtData.clientY - startY
    const currentWidth = el.clientWidth
    const currentHeight = el.clientHeight

    if (activeHandle.includes('t')) {
      const newHeight = Math.min(maxHeight, Math.max(minHeight, height - dy))
      if (currentHeight !== newHeight && newHeight >= minHeight && newHeight <= maxHeight) {
        el.style.height = newHeight + 'px'
        el.style.top = top + dy + 'px'
      }
    }
    if (activeHandle.includes('b')) {
      const newHeight = Math.min(maxHeight, Math.max(minHeight, height + dy))
      if (currentHeight !== newHeight && newHeight >= minHeight && newHeight <= maxHeight) {
        el.style.height = newHeight + 'px'
        el.style.top = top + 'px'
      }
    }
    if (activeHandle.includes('l')) {
      const newWidth = Math.min(maxWidth, Math.max(minWidth, width - dx))
      if (currentWidth !== newWidth && width !== newWidth && newWidth >= minWidth && newWidth <= maxWidth) {
        el.style.width = newWidth + 'px'
        el.style.left = left + dx + 'px'
      }
    }
    if (activeHandle.includes('r')) {
      const newWidth = Math.min(maxWidth, Math.max(minWidth, width + dx))
      if (currentWidth !== newWidth && newWidth >= minWidth && newWidth <= maxWidth) {
        el.style.width = newWidth + 'px'
        el.style.left = left + 'px'
      }
    }
    el.dispatchEvent(new CustomEvent('resize'))
    e.preventDefault()
  }

  function end() {
    document.documentElement.style.cursor = ''
    activeHandle = null

    document.removeEventListener('mousemove', move)
    document.removeEventListener('mouseup', end)
    document.removeEventListener('touchmove', move)
    document.removeEventListener('touchend', end)
  }
}

const unbind = el => {
  document.documentElement.style.cursor = ''
  el.removeEventListener('mousedown', el.onMouseDown)
  el.removeEventListener('touchstart', el.onMouseDown)
}

function getCursor(handle) {
  // e.g. 'bl' => 'sw-resize'
  const cursorDirection = {
    t: 'n',
    r: 'e',
    b: 's',
    l: 'w',
  }
  return (
    handle
      .split('')
      .map(l => cursorDirection[l])
      .join('') + '-resize'
  )
}

const setDefaults = options => {
  defaults = Object.assign({}, defaults, options)
}

const directive = {
  bind,
  beforeMount: bind,
  unbind,
  unmounted: unbind,
}

const install = (Vue, defaults) => {
  if (defaults) setDefaults(defaults)
  Vue.directive('resizable', directive)
}

// if included via script tag, install for global Vue instance
if (typeof window !== 'undefined' && window.Vue && window.Vue.use) {
  window.VResizable = { setDefaults }
  window.Vue.use(install)
}

// export as plugin
export default { install }
