import {settings, select} from '../settings.js';
import BaseWidget from './BaseWidget.js';

class AmountWidget extends BaseWidget{
  constructor(element){
    super(element, settings.amountWidget.defaultValue);
    const thisWidget = this;

    //console.log('AmountWidget: ', thisWidget);
    //console.log('Element: ', element);

    thisWidget.getElements(element);
    thisWidget.initActions();
    thisWidget.setValue(thisWidget.dom.input.value);

  }

  getElements(){
    const thisWidget = this;
  
    // thisWidget.element = element;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
  }

  setValue(value){
    const thisWidget = this;
    //thisWidget.value = thisWidget.dom.wrapper.querySelector(settings.amountWidget.defaultValue);

    const newValue = parseInt(value);

    // TODO: Add validation
    if(thisWidget.value !== newValue && !isNaN(newValue) && newValue >= settings.amountWidget.defaultMin-1 && newValue <= settings.amountWidget.defaultMax+1){
      thisWidget.value = newValue;
      this.announce();
    }
    thisWidget.dom.input.value = thisWidget.value;
  }

  parseValue(value){


  }

  isValid(value){

  }

  initActions(){
    const thisWidget = this;

    thisWidget.value = settings.amountWidget.defaultValue;

    thisWidget.dom.input.addEventListener('change', function(event){
      event.preventDefault();
      thisWidget.setValue(thisWidget.value);
    });
    
    thisWidget.dom.linkDecrease.addEventListener('click', function(event){
      event.preventDefault();
      thisWidget.setValue(thisWidget.value-1);
    });

    thisWidget.dom.linkIncrease.addEventListener('click', function(event){
      event.preventDefault();
      thisWidget.setValue(thisWidget.value+1);
    });
  }

  announce(){
    const thisWidget = this;

    const event = new CustomEvent('updated', {
      bubbles: true
    });
    thisWidget.dom.wrapper.dispatchEvent(event);
  }
}

export default AmountWidget;