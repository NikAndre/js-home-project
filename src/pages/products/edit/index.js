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

  initComponents(){
    const productForm = new ProductForm(this.productId)

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

    this.initComponents()
    this.renderComponents()

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
