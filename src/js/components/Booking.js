import {select, templates} from '../settings.js';
import AmountWidget from './AmountWidget.js';

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
    
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.widgets.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.widgets.booking.hoursAmount);
  }

  initWidgets(){
    const thisBooking = this;

    thisBooking.price = thisBooking.dom.wrapper.querySelector(select.cartProduct.price);
    console.log('LINIA NIZEJ BLAD !!!!');
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    console.log('CHECK 1');
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    console.log('CHECK 2');
    thisBooking.dom.peopleAmount.addEventListener('updated', function(event){
      event.preventDefault();
      
    });

    thisBooking.dom.hoursAmount.addEventListener('updated', function(event){
      event.preventDefault();
      
    });
  }
}

export default Booking;
