import CartProduct from './CartProduct.js';
import {settings, select, templates, classNames} from '../settings.js';
import {utils} from '../utils.js';

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

export default Cart;