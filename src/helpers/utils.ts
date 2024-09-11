export const fixedDomOverflow = (dom: HTMLElement | null, boolean: boolean) => {
  if (!dom) return
  dom.style.overflow = boolean ? 'hidden' : ''
}

export const isMobileAgent = () => {
  return !!window.navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i,
  )
}

export const isCustomEmpty = (value: any) => {
  if (value === undefined || value === null) {
    return true
  }

  if (typeof value === 'string' && value.trim() === '') {
    return true
  }

  if (typeof value === 'object' && Object.keys(value).length === 0) {
    return true
  }

  return false
}
