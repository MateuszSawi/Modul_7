/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product', // CODE ADDED
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input.amount', // CODE CHANGED
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    // CODE ADDED START
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
    // CODE ADDED END
  };
  
  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    // CODE ADDED START
    cart: {
      wrapperActive: 'active',
    },
    // CODE ADDED END
  };
  
  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }, // CODE CHANGED
    // CODE ADDED START
    cart: {
      defaultDeliveryFee: 20,
    },
    // CODE ADDED END
  };
  
  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
    // CODE ADDED START
    cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
    // CODE ADDED END
  };

  class Product{
    constructor(id, data){
      const thisProduct = this;

      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initAmountWidget();
      thisProduct.initOrderForm();
    }

    renderInMenu(){
      const thisProduct = this;

      // generate HTML based on template 
      const generatedHTML = templates.menuProduct(thisProduct.data);
      
      // create element using utils.createElementFromHtml
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);
      
      // find menu container
      const menuContainer = document.querySelector(select.containerOf.menu);

      // add element to menu
      menuContainer.appendChild(thisProduct.element);

    }

    getElements(){
      const thisProduct = this;
    
      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
      thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
      thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
      thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
      thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
    }

    //                    initAccordion()  -  7.5

    initAccordion(){
      const thisProduct = this;
      //console.log('Accordion thisProduct: ' + thisProduct);
      //console.log('Accordion thisProduct.element: ' + thisProduct.element);
      /* find the clickable trigger (the element that should react to clicking) */
      //const clickableTrigger = thisProduct.element.querySelectorAll(select.menuProduct.clickable);
      
      /* START: add event listener to clickable trigger on event click */
      thisProduct.accordionTrigger.addEventListener('click', function(event) {
        /* prevent default action for event */
        event.preventDefault();
        /* find active product (product that has active class) */
        const activeProduct = document.querySelector('.active');
        /* if there is active product and it's not thisProduct.element, remove class active from it */
        if(activeProduct && activeProduct != thisProduct.element){
          activeProduct.classList.remove('active');
        }
        thisProduct.element.classList.toggle('active');
      });
    }

    //                    End of 7.5

    initOrderForm(){
      const thisProduct = this;
      //console.log('initOrderForm ');

      thisProduct.form.addEventListener('submit', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });
      
      for(let input of thisProduct.formInputs){
        input.addEventListener('change', function(){
          thisProduct.processOrder();
        });
      }
      
      thisProduct.cartButton.addEventListener('click', function(event){
        event.preventDefault();
        thisProduct.processOrder();
        thisProduct.addToCart();
      });
    }   

    processOrder() {
      const thisProduct = this;
      
      // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
      const formData = utils.serializeFormToObject(thisProduct.form);
      //console.log('formData', formData);
    
      // set price to default price
      let price = thisProduct.data.price;
      
      // for every category (param)...
      for(let paramId in thisProduct.data.params) {
        // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
        const param = thisProduct.data.params[paramId];
        //console.log(paramId, param);

        // for every option in this category
        for(let optionId in param.options) { //===========================
          // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
          const option = param.options[optionId];
          //console.log(formData[paramId]);
          const optionImage = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId + '');
          //============================       7.7       ===================================
          
          //const optionImage = thisProduct.imageWrapper.querySelector('.' + paramId + '-' + optionId + '');
          //console.log('optionImage: ', optionImage);
          //console.log('formData[paramId]: ', formData[paramId]);

          if(optionImage && formData[paramId] && formData[paramId].includes(optionId)){
            optionImage.classList.add('active');       
          } else if (optionImage && formData[paramId] && !formData[paramId].includes(optionId)){
            optionImage.classList.remove('active');  
          }

          //console.log('optionId, option: ', optionId, option);
          //console.log('formData[paramId] ', formData[paramId]);

          //============================     End of 7.7    ================================

          // check if there is param with a name of paramId in formData and if it includes optionId
          if(formData[paramId] && formData[paramId].includes(optionId)) {
            // check if the option is not default
            if(!option.default) {
              //add option price to price variable
              price = price + option.price;
            }
          } else {
            // check if the option is default
            if(option.default == true) {
              // reduce price variable
              price = price - option.price;
            }
          }
        }
      }
      // multiply price by amount
      price *= thisProduct.amountWidget.value;
      // update calculated price in the HTML
      //const priceSingle = price/thisProduct.amountWidget.value;
      thisProduct.priceElem.innerHTML = price;
      //console.log('priceSingle: ', priceSingle);
      //console.log('price: ', price);
    }

    initAmountWidget(){
      const thisProduct = this;

      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);

      thisProduct.amountWidgetElem.addEventListener('updated', function(event){
        event.preventDefault();
        thisProduct.processOrder();
      });
    }

    addToCart(){
      const thisProduct = this;

      app.cart.add(thisProduct);

      thisProduct.prepareCartProduct();
      //thisProduct.prepareCartProductParams();
    }

    prepareCartProduct(){
      const thisProduct = this;
      const paramsObjElements = thisProduct.prepareCartProductParams();

      const productSummary = {
        id: thisProduct.id,
        name: thisProduct.name,
        amount: thisProduct.amount,
        priceSingle: thisProduct.priceSingle,
        price: thisProduct.price,
        params: paramsObjElements
      };
      //console.log('priceSingle: ', productSummary.priceSingle);
      //console.log('price: ', productSummary.price);
      return productSummary;
    }
    //=======================================================================++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++================================================================
    prepareCartProductParams(){
      const thisProduct = this;
      const formData = utils.serializeFormToObject(thisProduct.form);
      const cartProductParamsObj = {};
      //const cartProductParamsObj = { ingredients: []};
      for(let paramId in thisProduct.data.params) {
        // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
        const param = thisProduct.data.params[paramId];

        cartProductParamsObj[paramId] = {
          label: param.label,
          options: {}
        };
        // for every option in this category
        for(let optionId in param.options) {
          const option = thisProduct.data.params[paramId].options[optionId];
          if(formData[paramId] && formData[paramId].includes(optionId)){
            cartProductParamsObj[paramId].options[optionId] = {
              options: option.label
            };
          }
        }
      }
      console.log('cartProductParamsObj: ', cartProductParamsObj);
      return cartProductParamsObj;
    }
  }

  //*
  class AmountWidget{
    constructor(element){
      const thisWidget = this;

      //console.log('AmountWidget: ', thisWidget);
      //console.log('Element: ', element);

      thisWidget.getElements(element);
      thisWidget.initActions();
      thisWidget.setValue(thisWidget.input.value);

    }

    getElements(element){
      const thisWidget = this;
    
      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    }

    setValue(value){
      const thisWidget = this;
      //thisWidget.value = thisWidget.element.querySelector(settings.amountWidget.defaultValue);

      const newValue = parseInt(value);

      // TODO: Add validation
      if(thisWidget.value !== newValue && !isNaN(newValue) && newValue >= settings.amountWidget.defaultMin-1 && newValue <= settings.amountWidget.defaultMax+1){
        thisWidget.value = newValue;
        this.announce();
      }
      thisWidget.input.value = thisWidget.value;
    }

    initActions(){
      const thisWidget = this;

      thisWidget.value = settings.amountWidget.defaultValue;

      thisWidget.input.addEventListener('change', function(event){
        event.preventDefault();
        thisWidget.setValue(thisWidget.value);
      });
      
      thisWidget.linkDecrease.addEventListener('click', function(event){
        event.preventDefault();
        thisWidget.setValue(thisWidget.value-1);
      });

      thisWidget.linkIncrease.addEventListener('click', function(event){
        event.preventDefault();
        thisWidget.setValue(thisWidget.value+1);
      });
    }

    announce(){
      const thisWidget = this;

      const event = new Event('updated');
      thisWidget.element.dispatchEvent(event);
    }
  }
  //*

  /*class Cart{
    constructor(element){
      const thisCart = this;

      thisCart.products = [];
      
      thisCart.getElements(element);
      thisCart.initActions();

      //console.log('new Cart: ', thisCart);
    }

    getElements(element){
      const thisCart = this;

      thisCart.dom = {};

      thisCart.dom.wrapper = element;
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
      thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    }

    initActions(){
      const thisCart = this;

      thisCart.dom.toggleTrigger.addEventListener('click', function(event){
        event.preventDefault();

        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive); //toggluje clase 'active' na elemencie z klasą 'cart'
      });
    }

    add(menuProduct){
      const thisCart = this;
      const generatedHTML = templates.menuProduct(menuProduct);

      const generatedDOM = utils.createDOMFromHTML(generatedHTML);

      generatedDOM.appendChild(thisCart.dom.productList);

      console.log('adding product: ', menuProduct);

      thisCart.products.push(menuProduct);                                  //zakomentowac
      //thisCart.products.push(new CartProduct(menuProduct, generatedDOM)); //odkomentować

      console.log('thisCart.products: ', thisCart.products);
    }
  }*/
  
  class CartProduct{
    constructor(menuProduct, element){
      const thisCartProduct = this;

      thisCartProduct.menuProduct = menuProduct;
      thisCartProduct.element = generatedDOM;

      thisCartProduct.id = menuProduct.id;
      thisCartProduct.name = menuProduct.name;
      thisCartProduct.amount = menuProduct.amount;
      thisCartProduct.priceSingle = menuProduct.priceSingle;
      thisCartProduct.price = menuProduct.price;

      thisCartProduct.params = menuProduct.params;

      thisCartProduct.getElements(element);
      console.log('thisCartProduct: ', thisCartProduct);
    }

    getElements(element){
      const thisCartProduct = this;

      thisCartProduct.dom = {};

      thisCartProduct.dom.wrapper = element;
      thisCartProduct.dom.amountWidget = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);
      thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);
      thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.edit);
      thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);
    }
  }

  const app = {
    initMenu: function(){
      const thisApp = this;

      console.log('thisApp.data: ', thisApp.data);

      for(let productData in thisApp.data.products){
        new Product(productData, thisApp.data.products[productData]);
      }
    },

    initData: function(){
      const thisApp = this;

      thisApp.data = dataSource;
    },

    initCart: function(){
      const thisApp = this;

      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);
    },

    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp: ', thisApp);
      console.log('classNames: ', classNames);
      console.log('settings: ', settings);
      console.log('templates: ', templates);

      thisApp.initData();
      thisApp.initMenu();
      thisApp.initCart();
    },
  };
  

  app.init();
}

