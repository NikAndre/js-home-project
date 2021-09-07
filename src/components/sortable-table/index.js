// import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {

  element = {}
  subElements= {}
  field = "title"
  order = "asc"
  start = 0
  data = []
  end = 20
  loading = false

  constructor(
    header = [],
    {url = '',
      isSortLocally = false,
    }={}
  ){
    this.isSortLocally = isSortLocally
    this.header = header,
    this.url = url,
    this.render()
  }

  async render(){
    const element = document.createElement("div")
    element.innerHTML = this.getTemplate(this.header)
    this.element = element.firstElementChild
    this.subElements = this.getSubElements(element)
    const data = await this.getBody()
    this.renderRows(data)
    this.initEventListener()
    console.log(this.subElements.body.children.length)

  }
  renderRows(data){
    this.addRows(data)
  }
  addRows(data){
    this.data = data
    this.subElements.body.innerHTML = this.getTableRows(data)
  }
  initEventListener(){
    this.subElements.header.addEventListener('click',(event) => {
      const column = event.target.closest('[data-sortable]')
      if(column) {
        return this.isSortLocally ? this.localeSort(event) : this.sortOnServer(event)

      }
    })
    window.addEventListener('scroll', e => this.updateOnScroll(e) )
  }
  async updateOnScroll(event){
    event.preventDefault()

    if((window.pageYOffset + document.documentElement.clientHeight) >= document.body.scrollHeight && !this.loading){
      this.loading = true

      this.start += 20
      this.end += 20
      const data = await this.getBody()

      this.update(data)

      this.loading = false
      console.log(this.subElements.body.children.length)
    }
  }

  async sortOnServer(event){
    const column =  event.target.closest('[data-sortable = "true"]'  )

    column.dataset.order = column.dataset.order === 'asc'
      ? column.dataset.order =  "desc"
      : column.dataset.order = "asc";

    const {id,order} = column.dataset
    this.order = order
    this.title = id
    const data = await  this.getBody()
    this.renderRows(data)
    column.prepend(this.subElements.arrow)
  }
  localeSort(event){
    const column =  event.target.closest('[data-sortable = "true"]'  )

    column.dataset.order = column.dataset.order === 'asc'
      ? column.dataset.order =  "desc"
      : column.dataset.order = "asc";

    const {id,order} = column.dataset
    this.order = order
    this.title = id
    const sortedData = this.getTableSort(id,order)
    console.log(sortedData)
    this.subElements.body.innerHTML = this.getTableRows(sortedData)

    column.prepend(this.subElements.arrow)
  }
  get arrow(){
    return `<span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>`
  }
  getHeader(data){
    return [...data].map( item => {
      //console.log(item.id)
      if (item.id === 'title') {
        return `<div className="sortable-table__cell" data-id="${item.id}"
                    data-sortable="${item.sortable}" data-order="asc">
                <span>${item.title}</span>
                ${this.arrow}
              </div>`
      }else{
        return `<div className="sortable-table__cell" data-id="${item.id}"
                    data-sortable="${item.sortable}" data-order="asc">
                <span>${item.title}</span>
              </div>`
      }
    }).join('')
  }
  get link(){
    const options = `_sort=${this.field}&_order=${this.order}&_start=${this.start}&_end=${this.end}`

    return BACKEND_URL+'/'+this.url+'&'+options
  }
  async getBody(){
    console.log(this.link)
          const data = await fetch(this.link)
       .then(response => {

         return  response.json()
       })
       .then(data =>{

         return data
       })
     return data

  }
  update(data){
    console.log('update')
    const rows = document.createElement('div')
    this.data = [...this.data,...data]

    rows.innerHTML=this.getTableRows(data)

    this.subElements.body.append(...rows.childNodes)
  }
  getTableRows(data){
    return  [...data].map( item => {
        return `<a href="/products/3d-ochki-epson-elpgs03" class="sortable-table__row">
          ${ this.header.map((elem) => {
          if(elem.id === 'images'){
            return elem.template(item['images'])
          }else if(elem.id === 'subcategory'){
            return elem.template(item['subcategory'])
          }else{
            return `<div class="sortable-table__cell">${item[elem.id]}</div>`
          }
        })
          .join('')}
        </a>`
      })
        .join('')
  }
  getTemplate(header){
    return `<div class="sortable-table">
    <div data-element="header" class="sortable-table__header sortable-table__row">
    ${this.getHeader(header)}
    </div>
    <div data-element="body" class="sortable-table__body">

    </div>`
  }
  getSubElements(element){
    const elements = element.querySelectorAll('[data-element]')
    //console.log(elements)
    return [...elements].reduce((accum,item)=>{
      accum[item.dataset.element] = item
      return accum
    },{})
  }
  getTableSort(field = 'title',order= 'asc'){
    const newData = [...this.data]
    const column = this.header.find( elem => elem.id === field ? elem.sortType : false)
    let dir = order === "asc" ? 1 : -1
    return newData.sort((a,b) => {
      switch (column.sortType) {
        case "number" :
          return dir*(a[field] - b[field]);
        case "string" :
          return dir*a[field].localeCompare(b[field],"ru");
        default :
          return dir*a[field].localeCompare(b[field],"ru");
      } } )

       }

  remove(){
    this.element.remove()
    document.removeEventListener('scroll', this.onWindowScroll);
  }
  destroy(){
    this.remove()
    this.subElements = {}
  }
}
