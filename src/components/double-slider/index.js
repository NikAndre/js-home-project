export default class DoubleSlider {
  element
  subElements

  constructor(
    {
      min = 100,
      max = 200,
      formatValue = value => "$" + value,
      selected = {
        from : min,
        to: max
      }
    }={}
  ) {
    this.min = min
    this.max = max
    this.formatValue = formatValue
    this.selected = selected
    this.render()
}
  render(){
    const element = document.createElement('div')
    element.innerHTML = this.getTemplate()
    this.element = element.firstElementChild
    //console.log(this.element)
    this.subElements = this.getSubElements(this.element)
    //console.log(this.subElements)
    this.initEventListener()
    this.update()
}
  initEventListener(){
    const {thumbLeft,thumbRight} = this.subElements
    thumbLeft.addEventListener('pointerdown', e => this.getItemDrag(e))
    thumbRight.addEventListener('pointerdown', e => this.getItemDrag(e))
}
  getItemDrag(e)
{
  e.preventDefault()
  //console.log(e)
  const target = e.target
  //console.log(target.getBoundingClientRect())
  const {left,right}  = target.getBoundingClientRect()
  //console.log("left", left,"right",right)

  if(target === this.subElements.thumbLeft){
    this.shiftX = right - e.clientX
  }else{
    this.shiftX = left - e.clientX
  }
  this.dragging = target
  //console.log(this.dragging)
  document.addEventListener('pointermove', this.getPosition)
  document.addEventListener('pointerup',this.getUserPointerUp)
}
  getUserPointerUp = () => {
  const {thumbLeft,thumbRight} = this.subElements

  document.removeEventListener('pointermove', this.getPosition)
  thumbLeft.removeEventListener('pointerdown', e => this.getItemDrag(e))
  thumbRight.removeEventListener('pointerdown', e => this.getItemDrag(e))
}
getPosition = (event) => {
    event.preventDefault()
    const {left:innerLeft,right:innerRight,width}  = this.subElements.inner.getBoundingClientRect()
    //console.log(this.dragging.getBoundingClientRect())
     if(this.dragging === this.subElements.thumbLeft){
       //console.log('innerLeft',innerLeft)
       //console.log('event.clientX',event.clientX)
       //console.log('this.shiftX',this.shiftX)
       //console.log('width',width)
       let newLeft =  (event.clientX - innerLeft + this.shiftX)/width
       if(newLeft < 0){
         newLeft = 0
       }
       newLeft *= 100
       let right = parseFloat(this.subElements.thumbRight.style.right)
       if(newLeft+right>100){
         newLeft = 100 - right
       }
       //console.log(newLeft)
       this.dragging.style.left = this.subElements.progress.style.left= newLeft + "%"
       this.subElements.from.innerHTML = this.formatValue(this.getValue().from)
     }else{
       // console.log('innerRight',innerRight)
       // console.log('event.clientX',event.clientX)
       // console.log('this.shiftX',this.shiftX)

       let newRight =  (innerRight-  event.clientX -  this.shiftX )/width
       //console.log(newRight)

       if(newRight < 0){
         newRight = 0
       }
       newRight *= 100

       let left = parseFloat(this.subElements.thumbLeft.style.left);

       if(left + newRight>100){
         newRight = 100 - left
       }

       this.dragging.style.right = this.subElements.progress.style.right =newRight + '%'
       this.subElements.to.innerHTML = this.formatValue(this.getValue().to)
     }


}
getTemplate(){
    return `
    <div class="range-slider">
    <span data-element = "from">${this.formatValue(this.min)}</span>
    <div data-element = "inner" class="range-slider__inner">
      <span data-element = "progress" class="range-slider__progress"></span>
      <span data-element = "thumbLeft" class="range-slider__thumb-left"></span>
      <span data-element = "thumbRight" class="range-slider__thumb-right"></span>
    </div>
    <span data-element = "to">${this.formatValue(this.max)}</span>
  </div>
    `
}
update(){
  const rangeTotal = this.max - this.min;
  const left = Math.floor((this.selected.from - this.min) / rangeTotal * 100) + '%';
  const right = Math.floor((this.max - this.selected.to) / rangeTotal * 100) + '%';

  this.subElements.progress.style.left = left;
  this.subElements.progress.style.right = right;

  this.subElements.thumbLeft.style.left = left;
  this.subElements.thumbRight.style.right = right;
}
getSubElements(element){
    const elements = element.querySelectorAll('[data-element]')
    return [...elements].reduce((accum, elem) => {
      accum[elem.dataset.element] = elem
      return accum
    },{})
}
  getValue() {
    const rangeTotal = this.max - this.min;
    const { left } = this.subElements.thumbLeft.style;
    const { right } = this.subElements.thumbRight.style;

    const from = Math.round(this.min + parseFloat(left) * 0.01 * rangeTotal);
    const to = Math.round(this.max - parseFloat(right) * 0.01 * rangeTotal);

    return { from, to };
  }
remove(){
    this.element.remove()
}
destroy(){
    this.remove()
}

}
