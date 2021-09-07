export default class RangePicker {
  element
  subElements
  selected = {
    from : new  Date(),
    to: new Date()
  }
  changed =  false

  constructor(
    {
      from  = new Date,
      to  = new Date
    }={}
  ) {
    this.shownDateFrom = new Date(from)
    this.selected.from =from
    this.selected.to = to

    this.render()

    //console.log(this.shownDateFrom)
    //console.log(this.selected.from.setDate(1))
  }
  render(){
      const element = document.createElement('div')
      element.innerHTML = this.getTemplate()
      this.element = element.firstElementChild
      this.subElements = this.getSubElements(element)
      //console.log(this.subElements)
      this.initEventListener()
  }
  initEventListener(){
     document.addEventListener("pointerdown", (e) => {
       e.preventDefault()
       //console.log(e)
      const target = e.target.closest('.rangepicker__input')
      const target2 = e.target.closest('.rangepicker__selector')
       if(target) {
         this.subElements.selector.style.display = 'inline-flex'
         this.subElements.selector.innerHTML =  this.getCalendar(this.selected.from)

       }else if(target2){

       }else{
         this.subElements.selector.style.display = 'none'
         this.shownDateFrom = new Date(this.selected.from)
       }
     })
     document.addEventListener('pointerdown',(e)=> {
       const target = e.target.closest('.rangepicker__selector-control-left')
       const target2 = e.target.closest('.rangepicker__selector-control-right')
       if (target) {
        this.getCalendarChanged('left')
         //console.log(true)
       }else if(target2) {
         this.getCalendarChanged('right')
         //console.log(true)
       }
       else{
     }
     })
    this.subElements.selector.addEventListener('pointerdown', (e)=> {
      const target = e.target.closest('.rangepicker__cell')
      if(target){
        //console.log(target.dataset.value)
        const newSelected = new Date(target.dataset.value)
        //console.log(newSelected)
        if(!this.changed){
          this.selected.from = new Date(newSelected)
          this.changed = true
        }else{
          this.selected.to = new Date(newSelected)
          this.subElements.selector.innerHTML =  this.getCalendar(this.selected.from)
          this.getInputUpdate()
          this.changed = false
          //this.subElements.selector.style.display = 'inline-flex'
          this.subElements.selector.classList += ''
        }
      }
    })
  }
  dispatchEvent(){
    this.element.dispatchEvent(new CustomEvent('date-select',{
      bubbles: true,
      detail : this.selected
    }))
  }
  getInputUpdate (){
    this.dispatchEvent()
    const from = this.selected.from.toLocaleString('ru',{dateStyle: "short"})
    const to = this.selected.to.toLocaleString('ru',{dateStyle: "short"})
    this.subElements.from.innerHTML = from
    this.subElements.to.innerHTML = to

  }
  getCalendarChanged(dir){
    let newMonth = new Date(this.shownDateFrom)

    if(dir === 'left'){
       newMonth.setMonth(this.shownDateFrom.getMonth() - 1)
    }else{
       newMonth.setMonth(this.shownDateFrom.getMonth() + 1)
    }
    console.log(this.shownDateFrom.getMonth() ,  newMonth.getMonth())
    this.subElements.selector.innerHTML =  this.getCalendar(newMonth)
    this.shownDateFrom = new Date(newMonth)
  }
  getDays(date){
    const  getWeekDay = (dayInd) => {
      let index = dayInd === 0 ? 6 : dayInd -1
      return index + 1
    }

    let i = 1

    const currentMonth  = new Date(date)
    currentMonth.setDate(i)

    //console.log(currentMonth.getMonth())
    let html = ``
    const firstDay = () =>{
      if(currentMonth.getDate() === 1){
        return `style="--start-from: ${getWeekDay(currentMonth.getDay())}"`
      }}
    while(currentMonth.getMonth() === date.getMonth()){
       if(currentMonth >= this.selected.from && currentMonth <= this.selected.to) {
         //console.log(true)
         html += `<button type="button"  ${firstDay()} class="rangepicker__cell rangepicker__selected-between"
                    data-value="${currentMonth.toISOString()}" >${currentMonth.getDate()}</button>`
       }else{
         //console.log(false)
         html += `
          <button type="button" class="rangepicker__cell" ${firstDay()} data-value="${currentMonth.toISOString()}">${currentMonth.getDate()}</button>
       `
       }
       i += 1
      currentMonth.setDate(i)
    }

    return html
  }
  getCalendar(showDate){

    let showMonth = new Date(showDate)
    let showMonth2 = new Date(showDate)
    showMonth2.setMonth(showMonth2.getMonth() + 1)


    let table = `
      <div class="rangepicker__selector-arrow"></div>
      <div class="rangepicker__selector-control-left"></div>
      <div class="rangepicker__selector-control-right"></div>
    `
    table += `
      <div class="rangepicker__calendar">
        <div class="rangepicker__month-indicator">
          <time datetime="${showMonth.toLocaleString('en-EN', {month:'long'})}">${showMonth.toLocaleString('en-EN', {month:'long'})}</time>
        </div>
        <div class="rangepicker__day-of-week">
          <div>Пн</div><div>Вт</div><div>Ср</div><div>Чт</div><div>Пт</div><div>Сб</div><div>Вс</div>
        </div>
        <div class="rangepicker__date-grid">
          ${this.getDays(showMonth)}
        </div>
      </div>`



     table += ` <div class="rangepicker__calendar">
        <div class="rangepicker__month-indicator">
          <time datetime="${showMonth2.toLocaleString('en-EN', {month:'long'})}">${showMonth2.toLocaleString('en-EN', {month:'long'})}</time>
        </div>
        <div class="rangepicker__day-of-week">
          <div>Пн</div><div>Вт</div><div>Ср</div><div>Чт</div><div>Пт</div><div>Сб</div><div>Вс</div>
        </div>
        <div class="rangepicker__date-grid">
          ${this.getDays(showMonth2)}
        </div>
      </div>

    `

    return table
  }
  getTemplate(){
    const from = this.selected.from.toLocaleString('ru',{dateStyle: "short"})
    const to = this.selected.to.toLocaleString('ru',{dateStyle: "short"})


    return `
          <div class="rangepicker">
            <div class="rangepicker__input" data-element="input">
              <span data-element="from">${from}</span> -
              <span data-element="to">${to}</span>
            </div>

            <div class="rangepicker__selector" data-element="selector"></div>
          </div>
            `
  }

  getSubElements(element){
    const elements = element.querySelectorAll('[data-element]')
    //console.log(elements)
    return [...elements].reduce((accum,item)=> {
      accum[item.dataset.element] = item
        return accum
    },{})
  }
  remove(){

  }
  destroy(){}
}
