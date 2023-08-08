class OverlaySSE {
  constructor(url) {
    console.log('[OverlaySSE] constructor', url)
    this.eventSource = new EventSource(url, { withCredentials: true })
    this.eventSource.onmessage = this.onMessage
  }

  onMessage(event) {
    try {
      const data = JSON.parse(event.data)
      document.dispatchEvent(new CustomEvent(data.channel, { detail: data.payload }))
    } catch (error) {
      console.error('[EventsSSE]', error)
    }
  }
}
