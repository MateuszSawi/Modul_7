import {select} from '../settings.js';
import AmountWidget from './AmountWidget.js';

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

export default CartProduct;