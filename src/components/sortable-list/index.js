export default class SortableList {
  element

  constructor({
    items = ``
              }={}
              ) {
    this.items = items.map(item => {
      item.classList.add('sortable-list__item')
       return item
    },'')
    this.render()
  }

  render(){
    const  element = document.createElement('ul')
    element.className = 'sortable-list'
    element.append(...this.items)
    this.element = element
    this.initEventListener()
  }

  initEventListener(){
    document.addEventListener('pointerdown', e => {
      e.preventDefault()
      const target = e.target.closest('.sortable-list__item')
      if(target){
       this.setElement(e,target)
    }})

    document.addEventListener('pointerup',e => {
      this.elementDrop()
    })
  }
  setElement(e,target){
     this.draggingElemIndex = [...this.element.children].indexOf(target)


    this.draggingTarget = target

    this.placeholderElement = document.createElement('li')
    this.placeholderElement.className = 'sortable-list__placeholder';

    target.style.width = `${target.offsetWidth}px`
    target.style.height = `${target.offsetHeight}px`

    this.placeholderElement.style.width = target.style.width
    this.placeholderElement.style.height = target.style.height

    this.draggingTarget.classList.add('sortable-list__item_dragging')

    this.shiftY = e.clientY - target.getBoundingClientRect().y

    target.after(this.placeholderElement)

    this.element.append(target)

    document.addEventListener('pointermove',this.elementMove)
  }

  draggedElementChangePosition(clientY){
    this.draggingTarget.style.top = clientY - this.shiftY + 'px'
  }

  elementMove = (e) => {
    e.preventDefault()
    this.draggedElementChangePosition(e.clientY)

    const {firstElementChild, children} = this.element
    const {top: firstElementTop} = firstElementChild.getBoundingClientRect()
    const {bottom} = this.element.getBoundingClientRect()

    if(e.clientY < firstElementTop){
      this.movePlaceholderAt(0)
    }else if(e.clientY > bottom){
      this.movePlaceholderAt(children.length)
    }else {
      for (let i = 0 ; i< children.length; i++ ){
          const li = children[i]
          if(li !== this.draggingTarget){
            const {top,bottom} = li.getBoundingClientRect()
            const {offsetHeight: height} = li

            if(e.clientY >top && e.clientY < bottom){
              if(e.clientY < top + height / 2){
                this.movePlaceholderAt(i)
                break
              }else {
                this.movePlaceholderAt(i+1)
                break
              }
            }
          }
      }
    }
  }

  elementDrop(){
    document.removeEventListener('pointermove', this.elementMove)
    this.elementDragStop()

  }
  elementDragStop(){
    const draggedElemIndex = [...this.element.children].indexOf(this.placeholderElement)
    this.placeholderElement.replaceWith(this.draggingTarget)

    this.draggingTarget.classList.remove('sortable-list__item_dragging')

    this.draggingTarget.style.top = ''
    this.draggingTarget.style.left = ''
    this.draggingTarget.style.height = ''
    this.draggingTarget.style.width = ''

    this.draggingTarget = null
  }
  movePlaceholderAt(index){
    const element = this.element.children[index]
    if(element !== this.placeholderElement){
      this.element.insertBefore(this.placeholderElement,element)
    }
  }

  remove(){
    this.element.remove()
  }
  destroy(){

  }
}
