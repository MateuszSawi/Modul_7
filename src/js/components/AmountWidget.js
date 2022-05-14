import {settings, select} from '../settings.js';

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

export default AmountWidget;