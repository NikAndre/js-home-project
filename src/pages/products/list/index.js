import DoubleSlider from '../../../components/double-slider';
import SortableTable from '../../../components/sortable-table';
import header from './products-header';

const BACKEND_URL = 'http://course-js.javascript.ru/';




export default  class Page{
  element
  subElements = {}
  components = {}
  priceFrom = 0
  priceTo = 4000
  status
  titleLike = ''

  async updateSortableTable(){
    const url = `api/rest/products?_embed=subcategory.category&price_gte=${this.priceFrom}&price_lte=${this.priceTo}&title_like=${this.titleLike}&status=${this.status}&_sort=title&_order=asc&_start=0&_end=30`

    const data = await fetch(BACKEND_URL+url)
      .then(response => response)
      .then(data => data)

    this.components.sortableTable.update(data)

  }

  initComponents(){
    const doubleSlider = new DoubleSlider({
      min: 0,
      max: 4000,
    })

    const sortableTable = new SortableTable(header,{
      url: 'api/rest/products?_embed=subcategory.category&',
      isSortLocally:true
    })

    this.components.doubleSlider = doubleSlider
    this.components.sortableTable = sortableTable
  }

  renderComponents(){
    Object.keys(this.components).forEach(component => {
      const root = this.subElements[component]
      const {element} = this.components[component]
      root.append(element)
      }
    )
  }
  formatValue(text){
    const number = [];
    [...text].forEach(letter => {
      if(letter !== "$"){
        return number.push(letter)
      }
    })
    //console.log(number)
    return parseFloat(number.join(''))
  }
  initEventListener(){
    this.subElements.filterName.addEventListener('change',event => {
      this.titleLike = this.subElements.filterName.value
      this.updateSortableTable()
    })
    this.subElements.thumbLeft.addEventListener('pointerup',event => {
      this.priceFrom = this.formatValue(this.subElements.from.innerText)
      this.updateSortableTable()
    })
    this.subElements.thumbRight.addEventListener('pointerup',event => {
      this.priceTo = this.formatValue(this.subElements.to.innerText)
      this.updateSortableTable()
    })
    this.subElements.filterStatus.addEventListener('change',event => {
      this.status = this.subElements.filterStatus.value
      this.updateSortableTable()
    })
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


  }

  async render(){
    const element = document.createElement('div')
    element.innerHTML = this.getTemplate()
    this.element = element.firstElementChild
    this.subElements = this.getSubElements(this.element)


    this.initComponents()

    this.renderComponents()

    this.subElements = this.getSubElements(this.element)

    console.log(this.subElements)

    this.initEventListener()

    return this.element
  }
  getTemplate(){
    return `
    <div class='products-list'>
      <div class='content__top-panel'>
        <h1>Товары</h1>
        <a href='/products/add' class='button-primary'>Добавить товар</a>
      </div>
      <div class='content-box content-box_small'>
        <form class='form-inline'>
          <div class='form-group'>
            <label class='form-label'>Сортировать по:</label>
            <input type='text' data-element='filterName' class='form-control' placeholder='Название товара'>
          </div>
          <div class='form-group' data-element='doubleSlider'>
            <label class='form-label'>Сортировать по:</label>

          </div>
          <div class='form-group'>
            <label class='form-label'>Статус:</label>
            <select class='form-control' data-element='filterStatus'>
              <option value selected> Любой </option>
              <option value='1'> Активный </option>
              <option value='0'> Неактивный </option>
            </select>
          </div>

        </form>
      </div>
      <div data-element="sortableTable" class='products-list__container'></div>
    </div>
`
  }
  getSubElements(element){
    const elements = element.querySelectorAll('[data-element]')
    return [...elements].reduce((accum,elem) => {
      accum[elem.dataset.element] = elem
      return accum
    },{})
  }

  destroy(){

  }

}
