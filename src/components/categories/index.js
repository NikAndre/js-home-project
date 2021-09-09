import SortableList from '../sortable-list';

const BACKEND_URL = 'https://course-js.javascript.ru';


export default  class  Categories{
  element;
  data;

  constructor(data) {
    this.data = data;
    this.render()
  }

   render(){
    const element = document.createElement('div')
    element.innerHTML = this.getCategoriesContainerTemplate(this.data)
    this.element = element.firstElementChild

    this.createSubcategoryList()

    this.initEventListeners()

  }
  getCategoriesContainerTemplate(data){
    return `
    <div data-element = "categoriesContainer">
           ${this.getSubcategoriesTemplate(data)}
    </div>
    `
  }



  getSubcategoriesTemplate(data) {
    return data.map(elem => {
      return `
        <div class='category' data-id='${elem.id}'>
          <header class='category__header'>${elem.title}</header>
          <div class='category__body'>
            <div class='subcategory-list' data-element='subcategoryList'>
            </div>
          </div>
        </div>
      `
  })
      .join('')
  }
  getCategories(){
    return this.data.map(element =>{
      const {subcategories} = element
      const items = subcategories.map(({id,title,count}) => this.getSubCategoriesTemplate(id,title,count))
      return items
    })
  }
  getSubCategoriesTemplate(id,title,count){
    const wrapper = document.createElement('div')

    wrapper.innerHTML =  `
      <li class = 'categories__sortable-list-item'  data-grab-handle=''  data-id='${id}'>
        <strong>${title}</strong>
        <span><b2>${count} products</b2></span>
     </li>
    `
    return wrapper.firstElementChild
  }

  createSubcategoryList(){
    const subcategoriesListArr = this.getCategories()
    console.log(subcategoriesListArr)
    const subcategoriesElementArr = this.element.querySelectorAll('[data-element = "subcategoryList"]')
    console.log(subcategoriesElementArr)
    subcategoriesElementArr.forEach( (element, index) => {
      const sortableList = new SortableList({items : subcategoriesListArr[index]})
      element.append(sortableList.element)
    })

  }

  initEventListeners(){
    document.addEventListener('click',event => this.getBlockOpen(event))
    this.element.addEventListener("sortable-list-reorder", this.onSortableListReorder);
  }

  getBlockOpen = (event) => {
    const  target = event.target.closest('.category__header')

    if(target){
      const  classList = target.parentElement.classList.contains('category_open')
      if(!classList) {

        target.parentElement.classList.add('category_open')
      }else{
        target.parentElement.classList.remove('category_open')
      }
    }
  }

  onSortableListReorder = async (event) => {
    const {target} = event
    const {children} = target

    const payload = [...children].map((child, index)=>{
      const {id} = child.dataset

      return {
        id,
        weight: index
      };
    });

    await this.send(payload)
  }

  async send(payload){
    const url = BACKEND_URL+'/api/rest/categories'

    await fetch(url, {
      method:'PATCH',
      headers:             {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(payload)
    })
  }

  removeEventListeners(){
    document.removeEventListener('click',event => this.getBlockOpen(event))
    this.element.removeEventListener("sortable-list-reorder", this.onSortableListReorder);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.removeEventListeners();
    this.remove();
  }
}
