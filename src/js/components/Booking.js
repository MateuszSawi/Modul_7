import {select, templates} from '../settings.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

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
    
    // Zadanie: użycie widgetów DatePicker i HourPicker
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector('.date-picker');
    // thisBooking.dom.datePicker.input = thisBooking.dom.wrapper.querySelector(select.widgets.booking.peopleAmount);;
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector('.hour-picker');
    // thisBooking.dom.hourPicker.input = thisBooking.dom.wrapper.querySelector(select.widgets.booking.peopleAmount);
    // --
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.widgets.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.widgets.booking.hoursAmount);
  }

  initWidgets(){
    const thisBooking = this;

    thisBooking.price = thisBooking.dom.wrapper.querySelector(select.cartProduct.price);
    
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    
    thisBooking.dom.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.dom.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.peopleAmount.addEventListener('updated', function(event){
      event.preventDefault();
    });

    thisBooking.dom.hoursAmount.addEventListener('updated', function(event){
      event.preventDefault();
    });
  }
}

export default Booking;
