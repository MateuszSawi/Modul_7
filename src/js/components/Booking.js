import {settings, select, templates} from '../settings.js';

class Booking{
  constructor(){
    const thisBooking = this;

    thisBooking.getElements();
    thisBooking.render();
    thisBooking.initWidgets();
  }

  getElements(){
    const thisBooking = this;
  
    thisBooking.widgetContainer = document.querySelector(select.containerOf.booking);
  }

  render(){
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};

    thisBooking.dom.wrapper = thisBooking.widgetContainer;

    thisBooking.dom.wrapper.innerHTML = generatedHTML;
  }

  initWidgets(){

  }
}

export default Booking;