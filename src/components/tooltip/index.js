class Tooltip {
  element
  static initialize
  tollTipMessage

  constructor( ){
    if(Tooltip.initialize){
      Tooltip.initialize = this.remove()
    }
    Tooltip.initialize = this
  }
  initEventListener(){
    document.addEventListener("pointerover",event => this.getTooltip(event))
    document.addEventListener("pointerout",event => this.removeTooltip(event))
  }
  getTooltip = (event) => {
    const target = event.target.closest('[data-tooltip]')
    //console.log(event)
    if(target){
      console.log(event)
      this.tollTipMessage = target.dataset.tooltip
      this.render()
      this.setPosition(event)
      document.addEventListener('mousemove',event => this.setPosition(event))
    }
  }
  setPosition(event){
    const  offset = 10
    this.element.style.left = event.clientX + offset  + "px"
    this.element.style.top = event.clientY + offset  + "px"
  }
  removeTooltip(){
    this.remove()
  }
  initialize(){
    this.initEventListener()
  }
  render(){
    const element = document.createElement("div")
    element.className = 'tooltip'
    element.innerHTML = this.tollTipMessage
    element.style.position = 'absolute'
    this.element = element
    document.body.append(this.element)

  }
  remove(){
    if(this.element){
      this.element.remove()
      this.element = null
      document,removeEventListener('mousemove',event => this.setPosition(event))
    }
  }
  destroy(){
  this.remove()
    document.removeEventListener("pointerover",event => this.getTooltip(event))
    document.removeEventListener("pointerout",event => this.removeTooltip(event))
  }
}



const tooltip = new Tooltip();

export default tooltip;
