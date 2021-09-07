export default class ColumnChart {
  element
  subElements
  chartHeight = 50
  data

  constructor(
    {
      url = '',
      range = {},
      label = "",
      formatHeading = data => data,
      link = ""
    } = {}
  ) {
    this.url = url
    this.range = range
    this.formatHeading = formatHeading
    this.label = label
    this.link = link

    this.render()
    this.loadData()

  }
  getMainLink(from = this.range.from ,to = this.range.to){
    return `https://course-js.javascript.ru/${this.url}?from=${from}&to=${to}`
  }
  render(){
    const element = document.createElement('div')
    element.innerHTML = this.getTemplate()
    this.element = element.firstElementChild
    this.subElements = this.getSubElements(element)
    console.log(this.subElements)
  }

  async loadData (from,to) {
    const  response = await fetch(this.getMainLink(from,to))
    const data = await response.json()

    this.element.classList.remove('column-chart_loading')
    this.subElements.body.innerHTML = this.getColumn(data)
    this.subElements.header.innerText = this.getHeader(data)
  }

  getColumn(data){
    const maxValue = Math.max(...Object.values(data))
    const scale = this.chartHeight/maxValue
    console.log(maxValue , scale )

    return [...Object.values(data)].map( (elem) => {
      const percent = ((elem/maxValue)*100).toFixed(0)

      return `<div style="--value: ${Math.floor(elem*scale)}" data-tooltip="${percent}"></div>`
    })
      .join('');

  }
  getHeader(data){
    return this.formatHeading([...Object.values(data)].reduce((accum, elem) => accum + elem,0))

  }
  getSubElements(element){
    const elements = element.querySelectorAll('[data-element]')
    return [...elements].reduce((accum,item) => {
      accum[item.dataset.element] = item
      return accum
    },{})
  }
  getLink(){
    return this.link ? `<a href="${this.link}" class="column-chart__link">View all</a>` : "";
  }
  getTemplate(){
    return  `<div class="column-chart  column-chart_loading">
                <div class="column-chart__title">Total ${this.label}  ${this.getLink()} </div>
                <div class="column-chart__container">
                <div data-element="header" class="column-chart__header"></div>
                <div data-element="body" class="column-chart__chart"></div>
                </div>
            </div>`
  }
  update(from,to){
    this.loadData(from,to)
  }
  remove(){
    this.element.remove()
  }
  destroy(){
    this.remove()
  }
}
