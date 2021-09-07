import SortableTable from '../../components/sortable-table';
import RangePicker from '../../components/range-picker';
import header from './header';
import fetchJson from '../../utils/fetch-json.js';

const BACKEND_URL = 'http://course-js.javascript.ru/';

export default class Page{
  element
  subElements = {}
  components = {}



  async updateComponents(from,to){
    const data = await fetch(`${BACKEND_URL}api/rest/orders?createdAt_gte=${from.toISOString()}&createdAt_lte=${to.toISOString()}&_sort=createdAt&_order=desc&_start=0&_end=30`)
      .then(response => response)
      .then(data => data)

    this.components.ordersContainer.update(data)
    this.components.ordersContainer.addRows(data)
    this.components.ordersContainer.from = from.toISOString();
    this.components.ordersContainer.to = to.toISOString();
  }

  initComponents(){
    const to = new Date()
    const from = new Date(to.getTime() - (30 * 24 * 60 * 60 * 1000))

    const rangePicker = new RangePicker({
      from:from,
      to:to
    })

    const ordersContainer = new SortableTable(header,{
      url : `api/rest/orders?createdAt_gte=${from.toISOString()}&createdAt_lte=${to.toISOString()}`,
      isSortLocally: true
    })
    console.log(ordersContainer)
    this.components.rangePicker = rangePicker
    this.components.ordersContainer = ordersContainer

  }

  renderComponents(){
    Object.keys(this.components).forEach(component => {

       const root = this.subElements[component]

       const {element} = this.components[component]


      console.log(root);
       root.append(element)


    })


  }

  async render(){
    const  element = document.createElement('div')
    element.innerHTML = this.getTemplate()
    this.element = element.firstElementChild
    this.subElements = this.getSubElements(this.element)

    console.log(this.subElements)

    this.initComponents()

    this.renderComponents()

    this.initEventListener()

    return this.element
  }
  initEventListener(){
    document.addEventListener('pointerdown', event => {
      const target = event.target.closest('.icon-toggle-sidebar')
      const classExist = document.body.classList.contains('is-collapsed-sidebar')
      console.log(document.body.classList)
      if(target){
        if(classExist){
          document.body.classList.add('is-collapsed-sidebar')
        }else{
          document.body.classList.remove('is-collapsed-sidebar')
        }
      }
    })

    this.components.rangePicker.element.addEventListener("date-select", async (event) => {
      console.log(event.detail)
      const {from,to} = event.detail
      await this.updateComponents(from,to)
    });
  }

  getTemplate(){
    return `
            <div class = 'sales full-height flex-column'>
              <div   class='content__top-panel'>
                <h1 class='page-title'>Продажи</h1>
                <div  data-element = 'rangePicker' class='rangepicker'></div>
              </div>
              <div data-element = "ordersContainer" class='full-height flex-column'>

              </div>
            </div>
    `
  }
  getSubElements(element){
    const elements = element.querySelectorAll("[data-element]")

    return [...elements].reduce((accum,elem) => {
      accum[elem.dataset.element] = elem
      return accum
    },{})
  }
  remove(){
    this.element.remove()
  }
  destroy(){
    for (const component of Object.values(this.components)){
      component.destroy()
    }
  }

}
