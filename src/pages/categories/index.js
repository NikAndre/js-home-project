import SortableList from '../../components/sortable-list';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class Page{
  element
  subElements = {}


  async render(){
    const element = document.createElement('div')
    element.innerHTML = this.getTemplate()
    this.element = element.firstElementChild
    this.subElements = this.getSubElements(this.element)
    console.log(this.subElements)

    this.renderCategories()
    this.initEventListener()

    return this.element
  }
  initEventListener(){
    document.addEventListener('pointerdown',event => {

      const  target = event.target.closest('.category__header')

      if(target){
        const  classList = target.parentElement.classList.contains('category_open')
        if(!classList) {
          console.log(event.target)
          target.parentElement.classList.add('category_open')
        }else{
          target.parentElement.classList.remove('category_open')
        }
      }
    })
  }

  async getSubCategories(){
    const categories = await fetch(BACKEND_URL+'/api/rest/categories?_sort=weight&_refs=subcategory')
      .then(response => {
        return response.json()
      })
      .then(data => {
        return data
      })
    return categories
  }

  async renderCategories(){
    const categories = await this.getSubCategories()
    console.log(categories)
    const elements =  [...categories].map(elem => {
      return `
        <div class='category' data-id='${elem.id}'>
          <header class='category__header'>${elem.title}</header>
          <div class='category__body'>
            <div class='subcategory-list'>
            <ul class='sortable-list'>
            ${this.getSortableList(elem.subcategories)}
            </ul>
            </div>
          </div>
        </div>

      `
    })
    this.subElements.categoriesContainer.innerHTML = elements
  }
  getSortableList(subcategories){
    // const items = subcategories.map(item => {
    //   return `
    //   <div class='categories__sortable-list-item sortable-list__item' data-grab-handle data-id='${item.id}'>
    //
    //   </div>
    //   `
    // })


    const sortableList = new SortableList({
      items: subcategories.map(item => {
        const  element = document.createElement('li')
        element.classList.add('categories__sortable-list-item')
        element.dataset.id = item.id
        element.setAttribute('data-grab-handle',"")
        element.innerHTML = `
        <strong>${item.title}</strong>
        <span><b2>${item.count} products</b2></span>
        `
        console.log(element)
        return  element

        }

      )
    })
    console.log(sortableList.element)
    return sortableList.element.innerHTML
  }

  getTemplate(){
    return `
      <div class='categories'>
        <div class='content__top-panel'>
          <h1 class='page-title'>Категория товара</h1>
        </div>
        <div data-element = "categoriesContainer">

        </div>
      </div>
    `
  }
  getSubElements(element){
    const subElements = {}
    const elements = element.querySelectorAll('[data-element]')
    for(const item of  elements){
      subElements[item.dataset.element] = item
    }
    return subElements
  }

  remove(){
    this.element.remove()
  }
  destroy(){
    this.remove()
  }


}
