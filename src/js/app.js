import {settings, select, classNames} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';

const app = {
  initBooking: function(){
    // const thisApp = this;

    new Booking();
  },

  initPages: function(){
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.widgets.nav.links);

    const idFromHash = window.location.hash.replace('#/', '');
    // console.log('idFromHash: ', idFromHash);

    let pageMatchingHash = thisApp.pages[0].id;

    for(let page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingHash = page.id;
        break;
      }
    }

    console.log('pageMatchingHash: ', pageMatchingHash);
    thisApp.activatePage(pageMatchingHash);

    for(let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        const id = clickedElement.getAttribute('href').replace('#', '');

        thisApp.activatePage(id);

        window.location.hash = '#/' + id;
      });
    }
  },

  activatePage: function(pageId){
    const thisApp = this;

    for(let page of thisApp.pages){
      // if(page.id == pageId){
      //   page.classList.add(classNames.pages.active);
      // } else {
      //   page.classList.remove(classNames.pages.active); 
      // }
      page.classList.toggle(classNames.pages.active, pageId == page.id);       
    }
    for(let link of thisApp.navLinks){
      link.classList.toggle(
        classNames.nav.active, 
        link.getAttribute('href') == '#' + pageId
      );       
    }
  },

  initMenu: function(){
    const thisApp = this;
    //console.log('thisApp.data: ', thisApp.data);
    for(let productData in thisApp.data.products){
      //new Product(productData, thisApp.data.products[productData]);
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },

  initData: function(){
    const thisApp = this;

    //thisApp.data = dataSource;
    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.products;
  
    fetch(url)
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(parsedResponse){
        console.log('parsedResponse: ', parsedResponse);
        // save parsedResponse as thisApp.data.products
        thisApp.data = {
          products: parsedResponse
        };
        // execute initMenu method
        thisApp.initMenu();
      });
    console.log('thisApp.data: ', JSON.stringify(thisApp.data));
  },

  initCart: function(){
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
    });
  },

  init: function(){
    const thisApp = this;
    console.log('*** App starting ***');
    // console.log('thisApp: ', thisApp);
    // console.log('classNames: ', classNames);
    // console.log('settings: ', settings);
    // console.log('templates: ', templates);

    thisApp.initPages();

    thisApp.initData();
    //thisApp.initMenu();
    thisApp.initCart();
    thisApp.initBooking();
    //thisApp.initCartProduct();
  },
};

app.init();

export default app;





// 14.30