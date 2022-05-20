import {settings, select} from '../settings.js';

class Booking{
  constructor(element){
    const thisBooking = this;

    thisBooking.getElements(element);
  }

  getElements(element){
    const thisBooking = this;
  
    thisBooking.element = element;
    thisBooking.widgetContainer = document.querySelector(select.containerOf.booking);
  }


}

export default Booking;