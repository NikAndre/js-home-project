import Categories from '../../components/categories';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class Page{
  element
  subElements = {}
  components = {}
  data


  async render(){
    const element = document.createElement('div')
    element.innerHTML = this.getTemplate()
    this.element = element.firstElementChild
    this.subElements = this.getSubElements(this.element)

    await this.getCategoriesData()

    this.initComponents(this.data)

    this.renderComponents()

    return this.element
  }

  initComponents(data){
    const categories = new Categories(data)

    this.components.categories = categories
  }

  renderComponents(){
    Object.keys(this.components).forEach(component => {
      const root = this.subElements[component]
      const {element} = this.components[component]
      console.log(root);
      root.append(element)
    })
  }

  getTemplate () {
    return `
    <div class="categories">
      <div class="content__top-panel">
        <h1 class="page-title">Категории товаров</h1>
      </div>
      <div data-element="categories">
        <!-- categories component -->
      </div>
    </div>`;
  }


  async getCategoriesData(){
    this.data = await fetch(BACKEND_URL+'/api/rest/categories?_sort=weight&_refs=subcategory')
      .then(response => {
        return response.json()
      })
      .then(data => {
        return data
      })
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
    document.removeEventListener('click',event => this.getBlockOpen(event))
  }
  destroy(){
    this.remove()
  }


}
