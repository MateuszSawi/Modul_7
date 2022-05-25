class BaseWidget{
  constructor(wrapperElement, initialValue){
    const thisWidget = this;

    thisWidget.dom = {};
    thisWidget.dom.wrapper = wrapperElement;

    thisWidget.value = initialValue;
  }

  setValue(value){ //12:29
    const thisWidget = this;
    //thisWidget.value = thisWidget.dom.wrapper.querySelector(settings.amountWidget.defaultValue);

    const newValue = thisWidget.parseValue(value);

    // TODO: Add validation
    if(thisWidget.value !== newValue && thisWidget.isValid(newValue)){
      thisWidget.value = newValue;
      this.announce();
    }
    // thisWidget.dom.input.value = thisWidget.value;
    thisWidget.renderValue();
  }

  parseValue(value){
    return parseInt(value);
  }

  isValid(value){
    return !isNaN(value);
  }

  renderValue(){
    const thisWidget = this;

    thisWidget.dom.wrapper.innerHTML = thisWidget.value;
  }

  announce(){
    const thisWidget = this;

    const event = new CustomEvent('updated', {
      bubbles: true
    });
    thisWidget.dom.wrapper.dispatchEvent(event);
  }
}

export default BaseWidget;