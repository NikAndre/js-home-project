//import escapeHtml from './utils/escape-html.js';
//import fetchJson from './utils/fetch-json.js';
import SortableList from '../sortable-list';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  element
  subElements
  defaultProductData =  {
      title:'',
      images: [],
      price:0,
      quantity: 0,
      discount:0,
      status:0,
      description:'',
      subcategory: ''
    }

  constructor(
      productId= ''
  ) {
    this.productId = productId
    //this.render()
  }


  uploadImage(){
    console.log(true)
    const  fileInput = document.createElement('input')

    fileInput.type = 'file'
    fileInput.accept = 'image/*'

    fileInput.onchange = async () => {
      const  [file] = fileInput.files

      if(file){
        const formData = new FormData
        const {uploadImage, imageListContainer} = this.subElements

        formData.append('image',file)

        uploadImage.classList .add('is-loading')
        uploadImage.disabled = true

        const result = await fetch('https://api.imgur.com/3/image',{
          method:'POST',
          headers:{
            Authorization: `Client-ID ${IMGUR_CLIENT_ID}`
          },
          body: formData
        })

        this.renderImages()

        uploadImage.classList.remove('is-loading');
        uploadImage.disabled = false;

        fileInput.remove()
      }

    }
    fileInput.hidden = true
    document.body.appendChild(fileInput)
    fileInput.click()
  }

  async render(){
    const categoriesPromise =  this.getSubCategories()
    const productPromise = this.productId
    ? this.getProductData()
    : [this.defaultProductData]
    const [categoriesData, productResponse] = await Promise.all([categoriesPromise,productPromise])

    const [productData] = productResponse

    //console.log(productData)

    this.formData  = productData
    this.categories = categoriesData

    this.renderTemplate()
    this.setFormData()

    this.renderImages()

    this.initEventListeners()

    return this.element
  }

  renderTemplate(){
    const element = document.createElement('div')
    element.innerHTML = this.getTemplate()
    this.element = element.firstElementChild
    this.subElements = this.getSubElements(element)
    //console.log(this.subElements)
  }

  setFormData(){
    const {productForm} = this.subElements

    const excludeOption = ['images']
    const  fields = Object.keys(this.defaultProductData).filter( item => !excludeOption.includes(item))


    fields.forEach(item => {

      const  element = productForm.querySelector(`#${item}`)
      //console.log(this.formData)
      element.value = this.formData[item] || this.defaultProductData[item]
    })
  }

  dispatchEvent (id) {
    const event = this.productId
      ? new CustomEvent('product-updated', { detail: id })
      : new CustomEvent('product-saved');

    this.element.dispatchEvent(event);
  }

  initEventListeners(){
    const {productForm,uploadImage,sortableListContainer} = this.subElements

    productForm.addEventListener('submit', async e => {
      e.preventDefault()
       this.save()
    })

    uploadImage.addEventListener('click',e => {
      //console.log(e);
      this.uploadImage()})

    sortableListContainer.addEventListener('click', event => {
      if ('deleteHandle' in event.target.dataset) {
        event.target.closest('li').remove();
      }
    });
  }

  async save(){
      const  product = this.getFormData()

    try {
      let response = await fetch('https://course-js.javascript.ru/api/rest/products', {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(product)
      })
      this.dispatchEvent(response.id)
    }catch(error){
        console.error(error)
    }


  }

  getFormData(){
    const {productForm,imageListContainer} = this.subElements
    const  excludeItem = ['images']
    const setToNumber = ['discount','price','quantity','status']
    const  fields = Object.keys(this.defaultProductData).filter(item => !excludeItem.includes(item))
    const values = {}

    for(const  field of fields){
      values[field] = setToNumber.includes(field)
      ? parseInt(productForm.querySelector(`#${field}`).value)
      : productForm.querySelector(`#${field}`).value
    }

    const imCollection = imageListContainer.querySelectorAll('.sortable-table__cell-img')

    values.images = []
    values.id = this.productId

    for(const  item  of imCollection){
      values.images.push(
        {
          url:item.src,
          source:item.alt
        }
      )
    }
    console.log(values)
    return values

  }

  getUrl(){
    //console.log(this.productId)
    const url = BACKEND_URL+"/api/rest/products?id="+this.productId
    return url
  }

  async getProductData(){
    const url = this.getUrl()
    const data = await fetch(url)
      .then(response => {
        return response.json()
      })
      .then(data => {
        return data
      })
    return data
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

  getTemplate(){
        return `
      <div class="product-form">
          <form data-element="productForm" class="form-grid">
            <div class="form-group form-group__half_left">
              <fieldset>
                <label class="form-label">???????????????? ????????????</label>
                <input id = 'title' required="" type="text" name="title" class="form-control" placeholder='???????????????? ????????????'>
              </fieldset>
            </div>
            <div class="form-group form-group__wide">
              <label class="form-label">????????????????</label>
              <textarea id = 'description' required="" class="form-control" name="description" data-element="productDescription" placeholder='???????????????? ????????????'></textarea>
            </div>
            <div class="form-group form-group__wide" data-element="sortableListContainer">
              <label class="form-label">????????</label>

              <button type="button" data-element="uploadImage" class="button-primary-outline">
              <span>??????????????????</span>
              </button>
            </div>
            <div class="form-group form-group__half_left">
            <label class="form-label">??????????????????</label>
              ${this.renderCategories()}
            </div>
            <div class="form-group form-group__half_left form-group__two-col">
              <fieldset>
                <label class="form-label">???????? ($)</label>
                <input id = 'price' required="" type="number" name="price" class="form-control" placeholder="${this.defaultProductData.price}">
              </fieldset>
              <fieldset>
                <label class="form-label">???????????? ($)</label>
                <input id = 'discount' required="" type="number" name="discount" class="form-control" placeholder="${this.defaultProductData.discount}">
              </fieldset>
            </div>
            <div class="form-group form-group__part-half">
              <label class="form-label">????????????????????</label>
              <input id = 'quantity' required="" type="number" class="form-control" name="quantity" placeholder="${this.defaultProductData.quantity}">
            </div>
            <div class="form-group form-group__part-half">
              <label class="form-label">????????????</label>
              <select id = 'status' class="form-control" name="status">
                <option value="1">??????????????</option>
                <option value="0">??????????????????</option>
              </select>
            </div>
            <div class="form-buttons">
              <button type="submit" name="save" class="button-primary-outline">
                ?????????????????? ??????????
              </button>
            </div>
        </form>
  </div>
    `  }

  renderCategories(){
    const wrapper = document.createElement('div')
    wrapper.innerHTML = '<select id = "subcategory" class="form-control" name="subcategory"> </select>'
    const  select = wrapper.firstElementChild
    for(const category  of this.categories){
        for(const item of category.subcategories){
          select.append(new Option(`${category.title} > ${item.title}`,item.id))
        }
    }
    return select.outerHTML
  }

  renderImages(){

    const elements = [...this.formData.images].map(item =>{
      return `
                <input type="hidden" name="url" value=${item.url}>
                <input type="hidden" name="source" value=${item.source}>
                <span>
                <img src="icon-grab.svg" data-grab-handle="" alt="grab">
                <img class="sortable-table__cell-img" alt="${item.source}" src=${item.url}>
                <span>${item.source}</span></span><button type="button">
                <img src="icon-trash.svg" data-delete-handle="" alt="delete">
                </button>
               `
    })

    //console.log(elements)
    const sortableList = new SortableList({
      items: elements.map(item =>{
        const element = document.createElement('li')

        element.classList.add('products-edit__imagelist-item')
        element.classList.add('sortable-list__item')

        element.innerHTML = item
        return element
      })
    })
    //console.log(sortableList)
    this.subElements.sortableListContainer.append(sortableList.element)
  }

  getSubElements(element){
      const elements = element.querySelectorAll('[data-element]')
    return [...elements].reduce((accum,subElement) => {
       accum[subElement.dataset.element] =  subElement
      return accum
    },{})
  }

  remove(){
    this.element.remove()
  }

  destroy(){
    this.remove();
    this.element = null;
    this.subElements = null;
  }
}
