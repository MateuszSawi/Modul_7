import {settings, select} from '../settings.js';
import BaseWidget from './BaseWidget.js';

class AmountWidget extends BaseWidget{
  constructor(element){
    super(element, settings.amountWidget.defaultValue);
    const thisWidget = this;

    thisWidget.getElements(element);
    thisWidget.initActions();
    thisWidget.setValue(thisWidget.dom.input.value);

    console.log('AmountWidget: ', thisWidget);
    //console.log('Element: ', element);
  }

  getElements(){
    const thisWidget = this;
  
    // thisWidget.element = element;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
  }

  // setValue(value){ //12:29
  //   const thisWidget = this;
  //   //thisWidget.value = thisWidget.dom.wrapper.querySelector(settings.amountWidget.defaultValue);

  //   const newValue = thisWidget.parseValue(value);

  //   // TODO: Add validation
  //   if(thisWidget.value !== newValue && thisWidget.isValid(newValue)){
  //     thisWidget.value = newValue;
  //     this.announce();
  //   }
  //   // thisWidget.dom.input.value = thisWidget.value;
  //   thisWidget.renderValue();
  // }

  isValid(value){
    return !isNaN(value) 
      && value >= settings.amountWidget.defaultMin-1 
      && value <= settings.amountWidget.defaultMax+1;
  }

  renderValue(){
    const thisWidget = this;

    thisWidget.dom.input.value = thisWidget.value;
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
}

export default AmountWidget;