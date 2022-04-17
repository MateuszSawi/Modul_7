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
    db: {
      url: '//localhost:3131',
      products: 'products',
      orders: 'orders',
    },
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
      thisProduct.processOrder();
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
        const activeProduct = document.querySelector(select.all.menuProductsActive);
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
      thisProduct.priceSingle = price;
      // multiply price by amount
      price *= thisProduct.amountWidget.value;
      // update calculated price in the HTML
      //const priceSingle = price/thisProduct.amountWidget.value;
      thisProduct.priceElem.innerHTML = price;
      thisProduct.price = price;
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

      app.cart.add(thisProduct.prepareCartProduct());

      //thisProduct.prepareCartProduct();
      //thisProduct.prepareCartProductParams();
    }

    prepareCartProduct(){
      const thisProduct = this;
      const paramsObjElements = thisProduct.prepareCartProductParams();

      const productSummary = {
        id: thisProduct.id,
        name: thisProduct.data.name,
        amount: thisProduct.amountWidget.value,
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
            cartProductParamsObj[paramId].options[optionId] = option.label;
          }
        }
      }
      //console.log('cartProductParamsObj: ', cartProductParamsObj);
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

      const event = new CustomEvent('updated', {
        bubbles: true
      });
      thisWidget.element.dispatchEvent(event);
    }
  }
  //*

  class Cart{
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
      thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);
      thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);
      thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);
      thisCart.totalPrice = thisCart.dom.wrapper.querySelectorAll(select.cart.totalPrice);
      thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelector(select.cart.totalPrice);
      thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
      thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);
      thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    }

    initActions(){
      const thisCart = this;

      thisCart.dom.toggleTrigger.addEventListener('click', function(event){
        event.preventDefault();

        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive); //toggluje clase 'active' na elemencie z klasą 'cart'
      });

      thisCart.dom.productList.addEventListener('updated', function(){
        thisCart.updateCart();
      });

      thisCart.dom.productList.addEventListener('remove', function(){
        thisCart.remove(event.detail.cartProduct);
      });

      thisCart.dom.form.addEventListener('submit', function(event){
        event.preventDefault();
        //console.log('ORDER WAS CLICKED');
        thisCart.sendOrder();
      });
    }

    sendOrder(){
      const thisCart = this;

      const url = settings.db.url + '/' + settings.db.orders;

      const payload = {
        address: thisCart.dom.address.value,
        phone: thisCart.dom.phone.value,
        totalPrice: thisCart.dom.totalPrice.innerHTML,
        subtotalPrice: thisCart.dom.subtotalPrice.innerHTML,
        totalNumber: thisCart.dom.totalNumber.innerHTML,
        deliveryFee: thisCart.dom.deliveryFee.innerHTML,
        products: []
      };
      for(let product of thisCart.products) {
        payload.products.push(product.getData());
      }

      console.log('payload: ', payload);

      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      };
      
      fetch(url, fetchOptions)
        .then(function(response){
          return response.json();
        }).then(function(parsedResponse){
          console.log('parsedResponse: ', parsedResponse);
        });
    }

    remove(cartProduct){
      const thisCart = this;
      //znajduje produkt ktory usuwam
      cartProduct.dom.wrapper.remove();
      //znajduje index usuwanego elementu w tablicy
      const index = thisCart.products.indexOf(cartProduct);
      //usuwam 1 element poczawszy od elementu o indexie 'index' (usuwam element ktory chce usunac)
      thisCart.products.splice(index, 1);
      //const removedElement = thisCart.products.splice(index, 1);
      //console.log('removedElement: ', removedElement);
      thisCart.updateCart();
    }

    updateCart(){ // 8.5 sumowanie koszyka
      const thisCart = this;

      let totalNumber = 0;
      let subtotalPrice = 0;
      let totalPrice = 0;

      for(const product of thisCart.products){
        totalNumber += product.amount;
        subtotalPrice += product.priceSingle * product.amount;
      }

      if(totalNumber == 0){
        thisCart.dom.deliveryFee.innerHTML = 0;
      } else {
        thisCart.dom.deliveryFee.innerHTML = settings.cart.defaultDeliveryFee;
      }  
      let deliveryCost = parseInt(thisCart.dom.deliveryFee.innerHTML);
    
      totalPrice += deliveryCost + subtotalPrice;
      thisCart.dom.totalNumber.innerHTML = totalNumber;
      thisCart.dom.subtotalPrice.innerHTML = subtotalPrice;

      for(const price of thisCart.totalPrice){
        price.innerHTML = totalPrice;
      }
    }

    add(menuProduct){
      const thisCart = this;
      const generatedHTML = templates.cartProduct(menuProduct);
      const generatedDOM = utils.createDOMFromHTML(generatedHTML);

      //dodaje do productList wygenerowany produkt za pomocą appendChild:
      thisCart.dom.productList.appendChild(generatedDOM);

      //console.log('adding product: ', menuProduct);

      //thisCart.products.push(menuProduct);                                  //zakomentowac
      thisCart.products.push(new CartProduct(menuProduct, generatedDOM));     //odkomentować

      //console.log('thisCart.products: ', thisCart.products);
      thisCart.updateCart();
    }
  }
  
  class CartProduct{
    constructor(menuProduct, element){
      const thisCartProduct = this;

      thisCartProduct.menuProduct = menuProduct;
      thisCartProduct.element = element;

      thisCartProduct.id = menuProduct.id;
      thisCartProduct.name = menuProduct.name;
      thisCartProduct.amount = menuProduct.amount;
      thisCartProduct.priceSingle = menuProduct.priceSingle;
      thisCartProduct.price = menuProduct.priceElem;
      thisCartProduct.params = menuProduct.params;
      //console.log('menuProduct.priceElem: ', thisCartProduct.price);
      thisCartProduct.getElements(element);
      thisCartProduct.initAmountWidget();
      thisCartProduct.initActions();
      thisCartProduct.getData();
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

    getData(){
      const thisCartProduct = this;
      
      const orderParams = {
        id: thisCartProduct.id,
        amount: thisCartProduct.amount,
        price: parseInt(thisCartProduct.price.innerHTML),
        priceSingle: thisCartProduct.priceSingle,
        name: thisCartProduct.name,
        params: thisCartProduct.params
      };
      //console.log('orderParams: ', orderParams);
      return orderParams;
    }

    remove(){
      const thisCartProduct = this;

      const event = new CustomEvent('remove', {
        bubbles: true,
        detail: {
          cartProduct: thisCartProduct,
        },
      });

      thisCartProduct.dom.wrapper.dispatchEvent(event);  
      //console.log('removed'); 
    }

    initActions(){
      const thisCartProduct = this;

      thisCartProduct.dom.remove.addEventListener('click', function(event){
        event.preventDefault();
        thisCartProduct.remove();
      });

      thisCartProduct.dom.edit.addEventListener('click', function(event){
        event.preventDefault();
        
      });
    }

    initAmountWidget(){ // 8.5 
      const thisCartProduct = this;
      thisCartProduct.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);
      //console.log('thisCartProduct: ', thisCartProduct);

      thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidget);
      thisCartProduct.dom.amountWidget.addEventListener('updated', function(event){
        event.preventDefault();
        thisCartProduct.amount = thisCartProduct.amountWidget.value;
        thisCartProduct.price = thisCartProduct.priceSingle * thisCartProduct.amount;
        //console.log('thisCartProduct.amount: ', thisCartProduct.amount);
        //console.log('thisCartProduct.dom.amountWidget: ', thisCartProduct.dom.price);
        thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
      });
    }
  }

  const app = {
    initMenu: function(){
      const thisApp = this;
      //console.log('thisApp.data: ', thisApp.data);
      for(let productData in thisApp.data.products){
        //new Product(productData, thisApp.data.products[productData]);
        new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
      }
    },

    initData: function(){
      const thisApp = this;

      //thisApp.data = dataSource;
      thisApp.data = {};
      const url = settings.db.url + '/' + settings.db.products;
    
      fetch(url)
        .then(function(rawResponse){
          return rawResponse.json();
        })
        .then(function(parsedResponse){
          console.log('parsedResponse: ', parsedResponse);
          // save parsedResponse as thisApp.data.products
          thisApp.data = {
            products: parsedResponse
          };
          // execute initMenu method
          thisApp.initMenu();
        });
      console.log('thisApp.data: ', JSON.stringify(thisApp.data));
    },

    initCart: function(){
      const thisApp = this;

      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);
    },

    // initCartProduct: function(){
    //   const thisApp = this;

    //   const cartProduct = document.querySelector(select.containerOf.cart);
    // },

    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      // console.log('thisApp: ', thisApp);
      // console.log('classNames: ', classNames);
      // console.log('settings: ', settings);
      // console.log('templates: ', templates);

      thisApp.initData();
      //thisApp.initMenu();
      thisApp.initCart();
      //thisApp.initCartProduct();
    },
  };
  

  app.init();
}

