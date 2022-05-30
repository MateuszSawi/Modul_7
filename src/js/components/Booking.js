import {select, templates, settings} from '../settings.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';
import {utils} from '../utils.js';

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

  getData() {
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

    const params = {
      bookings: [
        startDateParam,
        endDateParam,
      ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam
      ],
      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam
      ]
    };

    const urls = {
      bookings:       settings.db.url + '/' + settings.db.bookings  + '?' + params.bookings.join('&'),
      eventsCurrent:  settings.db.url + '/' + settings.db.events    + '?' + params.eventsCurrent.join('&'),
      eventsRepeat:   settings.db.url + '/' + settings.db.events    + '?' + params.eventsRepeat.join('&'),
    };

    Promise.all([
      fetch(urls.bookings),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function(allResponses){
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(([bookings, eventsCurrent, eventsRepeat]) => {
        // console.log('bookings', bookings);
        // console.log('eventsCurrent', eventsCurrent);
        // console.log('eventsRepeat', eventsRepeat); 
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }

  parseData(bookings, eventsCurrent, eventsRepeat){
    const thisBooking = this;

    thisBooking.booked = {};

    for(let item  of bookings){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    for(let item  of eventsCurrent){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.datePicker.minPicker;
    const maxDate = thisBooking.datePicker.maxPicker;

    for(let item  of eventsRepeat){
      if(item.repeat == 'daily'){
        for(let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)){
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
      // console.log('thisBooking.booked', thisBooking.booked);
    }
    // console.log('thisBooking.booked: ', thisBooking.booked);
    // console.log('eventsRepeat: ', eventsRepeat);

    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table){
    const thisBooking = this;

    if(typeof thisBooking.booked[date] == 'undefined'){
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for(let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5){
      // console.log('hourBlock: ', hourBlock);

      if(typeof thisBooking.booked[date][hourBlock] == 'undefined'){
        thisBooking.booked[date][hourBlock] = [];
      }
      
      thisBooking.booked[date][hourBlock].push(table);
    }
  }

  updateDOM(){
    const thisBooking = this;
    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    let allAvailable = false;

    if (
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ) {
      allAvailable = true;
    }
  
    for(let table of thisBooking.dom.tables) {
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if(!isNaN(tableId)) {
        tableId = parseInt(tableId);
      }

      if(
        !allAvailable
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId) > -1
      ) {
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
  }

  selectTable() {
    for(let table of this.dom.tables) {
      table.addEventListener('click', (e) => {
        const clickedTable = e.target;
        this.dom.tables.forEach(table => table.classList.remove('selected'));
        if (!clickedTable.classList.contains('booked')) {
          clickedTable.classList.add('selected');
          this.table = clickedTable;
        }
      });
    }
    this.isTimeUpdated();
    this.isBookingSubmitted();
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

    // thisBooking.dom.peopleAmount.addEventListener('updated', function(event){
    //   event.preventDefault();
    // });

    // thisBooking.dom.hoursAmount.addEventListener('updated', function(event){
    //   event.preventDefault();
    // });

    thisBooking.dom.wrapper.addEventListener('updated', function(){
      thisBooking.updateDOM();
    });
  }
}

export default Booking;
