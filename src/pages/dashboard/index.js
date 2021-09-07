import ColumnChart from "../../components/column-chart/index"
import SortableTable from "../../components/sortable-table/index"
import RangePicker from "../../components/range-picker/index"
import header from "./bestsellers-header";

const BACKEND_URL = 'http://course-js.javascript.ru/';

export default class Page{
  element
  subElements = {}
  components = {}

  constructor() {

  }

  async updateComponent(from,to){
    /*const data = await fetch(`${BACKEND_URL}api/dashboard/bestsellers?_start=1&_end=20&from=${from.toISOString()}&to=${to.toISOString()}`)
      .then(response => response)
      .then(data => data)*/
    this.components.salesChart.update(from,to);
    this.components.customerCharts.update(from,to);
    this.components.ordersChart.update(from,to);
    this.components.sortableTable.update(from,to);
  }

  initComponents(){
    const to = new Date();
    const from = new Date(to.getTime() - (30 * 24 * 60 * 60 * 1000) );

    //console.log("to", to , "from" , from)

    const rangePicker = new RangePicker(
      {
        from,
        to
      });


    const ordersChart =  new ColumnChart({
      url : 'api/dashboard/orders',
      range : {
        from: from,
        to: to
      },
      label: "orders",
      link:'#'
    });
    const salesChart =  new ColumnChart({
      url : 'api/dashboard/sales',
        range : {
          from: from,
          to: to
        },
        label: "sales",
        formatHeading: data => `$${data}`
      });
    const customerCharts =  new ColumnChart({
      url : 'api/dashboard/customers',
        range : {
          from: from,
          to: to
        },
        label: "customers",

      });

    const sortableTable = new SortableTable(header,{
      url:`api/dashboard/bestsellers?from=${from.toISOString()}&to=${to.toISOString()}`,
      isSortLocally : true
    });




    this.components.salesChart = salesChart;
    this.components.customerCharts = customerCharts;
    this.components.ordersChart = ordersChart;
    this.components.rangepicker = rangePicker;
    this.components.sortableTable = sortableTable;
  }
  async render(){
    const  element = document.createElement("div");
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(element);

    console.log(this.subElements);



    this.initComponents();

    this.renderComponents();

    this.initEventListener();

    return this.element;

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

    console.log(this.components.rangepicker.from)
    this.components.rangepicker.element.addEventListener("date-select", (event) => {
      console.log(event.detail)
      const {from,to} = event.detail
      this.updateComponent(from,to)
    });
  }

  renderComponents(){
    Object.keys(this.components).forEach(component => {

      console.log(this.subElements[component]);

      const root = this.subElements[component];
      const {element} = this.components[component];

      console.log(root);

      root.append(element);
    });
  }

  getSubElements(element){
    const elements = element.querySelectorAll('[data-element]');
    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    },{} );
  }



  getTemplate(){
    return `
    <div class="dashboard">
    <div class="content__top-panel">
      <h2 class="page-title">Dashboard</h2>

      <!-- range-picker component -->
      <div data-element = "rangepicker"></div>

    </div>
    <!-- column-chart component -->
    <div data-element = "chartRoots" class="dashboard__charts">
      <div data-element = "ordersChart" class="dashboard__chart_orders"></div>
      <div data-element = "salesChart" class="dashboard__chart_sales"></div>
      <div data-element = "customerCharts" class="dashboard__chart_customers"></div>
    </div>

    <h3 class="block-title">Best sellers</h3>


    <div data-element = "sortableTable" >
    <!-- sortable-table component -->
    </div>

  </div>
    `;
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
