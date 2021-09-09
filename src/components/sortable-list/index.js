export default class SortableList {
  element

  constructor({
    items = ``
              }={}
              ) {
    //console.log(items)
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
    console.log(this.element)
    this.initEventListener()


  }
  initEventListener(){
    document.addEventListener('pointerdown', event => this.onPointerDown(event))

  }
  onPointerDown(event){
    console.log(event.which)
    if(event.which !== 1){
      return false
    }
    const target = event.target.closest('.sortable-list__item')

    if(target){
      if(event.target.closest('[data-grab-handle]')){
        event.preventDefault()
        this.setElement(event,target)
      }
    }
  }
  setElement(e,target){
    this.elementInitialIndex = [...this.element.children].indexOf(target)

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
    document.addEventListener('pointerup',this.elementDrop)
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
  elementDrop = () => {
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



    document.removeEventListener('pointerup',this.elementDrop)

    this.draggingTarget = null

    if (draggedElemIndex !== this.elementInitialIndex) {
      this.element.dispatchEvent(new CustomEvent('sortable-list-reorder', {
        bubbles: true,
        detail: {
          from: this.elementInitialIndex,
          to: draggedElemIndex
        }
      }));
    }
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
    this.remove()
  }
}
