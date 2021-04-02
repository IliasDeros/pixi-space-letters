export class DocumentMock {
  eventCallbacks: Record<string, Function[]>
  
  constructor() {
    this.eventCallbacks = {}
  }
  
  addEventListener(event: string, callback: (e: KeyboardEvent) => void) {
    this.eventCallbacks[event] ||= []
    this.eventCallbacks[event].push(callback)
  }

  dispatchEvent(event: Event) {
    this.eventCallbacks[event.type]?.forEach(cb => cb(event))
  }
}
