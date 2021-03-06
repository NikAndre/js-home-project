import ProductForm from '../../../components/product-form';


export default class Page {
  element;
  subElements = {};
  components = {};

  constructor(){
    this.getId = (path) =>{
      const id = [...path].slice(10)
      .join('')
      return id
    }
    this.productId = this.getId(window.location.pathname)
    console.log(this.productId)
  }

  async initComponents(){
    const productForm = new ProductForm(this.productId)
    await productForm.render()
    console.log(productForm)
    this.components.productForm = productForm
  }

  renderComponents(){
    Object.keys(this.components).forEach(component => {

      const root = this.subElements[component]

      const {element} = this.components[component]

      console.log(element)

      root.append(element)
    })
  }
  initEventListener(){
    document.addEventListener('pointerdown', event => {
      const target = event.target.closest('.icon-toggle-sidebar')
      const classExist = document.body.classList.contains('is-collapsed-sidebar')

      if(target){
        if(!classExist){
          document.body.classList.add('is-collapsed-sidebar')
        }else{
          document.body.classList.remove('is-collapsed-sidebar')
        }
      }
    })
  }
  async render() {
    const element = document.createElement('div');

    element.innerHTML = `
      <div>
        <h1>Edit page</h1>
        <div data-element = "productForm"></div>
      </div>`;

    this.element = element.firstElementChild;

    this.subElements = this.getSubElements(this.element)
    //console.log(this.subElements)

    await this.initComponents()
    this.renderComponents()

    this.initEventListener()

    return this.element;
  }
  getSubElements(element){
    const elements = element.querySelectorAll("[data-element]")

    return [...elements].reduce((accum,elem) => {
      accum[elem.dataset.element] = elem
      return accum
    },{})
  }

  destroy(){
    this.element.remove()
  }
}
