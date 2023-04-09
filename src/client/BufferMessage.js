const EventEmitter = require('../EventEmitter')

class BufferMessage {

  #eventEmitter = new EventEmitter()

  #releaseBufferEvent = 'releaseBufferEvent'

  #coomonText = ''

  #formatText = ''

  
  pushChank(chunk = '') {
    if (chunk === '\n') {

      return
    } 

    this.#coomonText
  }
  
  onReleaseBuffer(cb = (message = '') => null) {

  }
}