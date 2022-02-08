'use strict';

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//[188] Implementing smooth scrolling

//Button scrolling
btnScrollTo.addEventListener('click', function (e) {
  //getting position of the btn LEARN MORE from page
  const s1coords = section1.getBoundingClientRect();
  //console.log(s1coords);

  //or
  //console.log(e.target.getBoundingClientRect());

  //or
  console.log('Current scroll (x/y)', window.pageXOffset, pageYOffset);

  //dimensions of the viewport
  console.log(
    'height/width Viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );
  //Scrolling
  //too old method
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // also a older one
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // More smarter way
  section1.scrollIntoView({ behavior: 'smooth' });
});
//////////////////////////
//Page navigation

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();

//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

//1. Add event listener to common parent element
//2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  //Matching property
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//////////////////////////
/////////////////////////
/////////////////////////

//[194] Building a tabbed component

// tabs.forEach(t => t.addEventListener('click', () => console.log('tab'))); //we are not using this bcz if we have 200 tabs than we would have 200 call back functions so we will use event delegation

//using Event delegation
//for event delegation we need to attach event handler on the common parent element of all the elements that we are intrested in and in this case that is tabsContainer

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  //Guard clause
  if (!clicked) return;

  //Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //Active tab
  clicked.classList.add('operations__tab--active');

  //Activating  content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//[195] Passing argument to Event handlers
//Menu fade animation
const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = opacity;
    });
    logo.style.opacity = opacity;
  }
};
nav.addEventListener('mouseover', function (e) {
  handleHover(e, 0.5);
});

nav.addEventListener('mouseout', function (e) {
  handleHover(e, 1);
});

//[196] Implementing the sticky navigation: the scroll event
//sticky navigation

const initialCoords = section1.getBoundingClientRect();
window.addEventListener('scroll', function () {
  if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
});

// but we can do it in more better way as done below

//////////////////
//[197] A Better way: The Intersection Obeserver API

// This API allows our code to basically observe changesto the way that ascertain target element intersects another element. or the way intersects the viewport.

//lets see how the intersections of server API actually works but w/o the sticky navigation.
//to understand

// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootmargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//[198] Reavealing Elements on Scroll
const allSectoions = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSectoions.forEach(function (section) {
  sectionObserver.observe(section);
  //section.classList.add('section--hidden');
});

//[199] Lazy Loading images
// by doing this when we scroll down page images gets loads this will increase the performanance
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  //Replace src with data-src

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

//[200] Building a Slider Component part 1

//Slider
const sliders = function () {
  const slides = document.querySelectorAll('.slide');

  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  //functions

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}" </button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  //going to next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  //[201] Building a slider component: Part 2

  document.addEventListener('keydown', function (e) {
    console.log(e);
    if (e.key === 'ArrowLeft') prevSlide();
    //or we can also use short circuiting like
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
sliders();

//[186] Selecting, Creating and Deleting elements
/*
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
const allSection = document.querySelectorAll('.section');

console.log(allSection);

document.getElementById('setion--1');
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

console.log(document.getElementsByClassName('btn'));

//creating and inserting elements
//.insertAdjacentHTML
*/
const message = document.createElement('div');
/*
message.classList.add('cookie-message');
// message.textContent = 'We use cookie for improved functionality and analytics.';
message.innerHTML =
  'We use cookie for improved functionality and analytics.<button class="btn btn--close-cookie">Got it</button>';

// header.prepend(message); //it adds as first child
header.append(message); // it add as last child

// header.append(message.cloneNode(true)); //it added as both as first and last element

// header.before(message);
// header.after(message);

//Delete elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });

  */

//[187] Styles, Attributes, and Classes
/*
//Styles

message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.color);
console.log(message.style.backgroundColor);

console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);
*/
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

document.documentElement.style.setProperty('--color-primary', 'orangered');
/*
//Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);
console.log(logo.className);

logo.alt = 'Beautiful minimalist logo';

//Non-standard
console.log(logo.designer);
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'Bankist');

console.log(logo.src); //provides absolute url address
console.log(logo.getAttribute('src')); //relative url

// Data Attributes
//special type of attributes that start with data
console.log(logo.dataset.versionNumber);

//Classes
logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c'); //not includes

//Don't use ever
logo.className = 'Amit';
*/

//[188] Implementing smooth scrolling
/*
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  //getting position of the btn LEARN MORE from page
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  //or
  console.log(e.target.getBoundingClientRect());

  //or
  console.log('Current scroll (x/y)', window.pageXOffset, pageYOffset);

  //dimensions of the viewport
  console.log(
    'height/width Viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );
  //Scrolling
  //too old method
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // also a older one
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // More smarter way
  section1.scrollIntoView({ behavior: 'smooth' });
});
*/
//[189] Types of Events and Even Handlers
/*
const h1 = document.querySelector('h1');
const alertH1 = function (e) {
  alert('addEventListener: Great! You are reading the heading :D');
};

h1.addEventListener('mouseenter', alertH1);
setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);
*/

//or (not recommended)
// h1.onmouseenter = function (e) {
//   alert('addEventListener: Great! You are reading the heading :D');
// };

//[191] Event propagation in practice
// rgb(255,255,255)
/*
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);

  //to stop propagation
  //e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target, e.currentTarget);
});
*/

//[193] DOM Traversing
/*
//it is basically walking through the DOM. which means that we can select an element based on other element and this is very important bcz somethimes we need to select an element relative to a certain other element. for eg - a direct child or direct parent element and sometime we don't know even structure of DOM and for all these cases we need dom traversing

//let select h1 element
const h1 = document.querySelector('h1');

//going downwards: child
console.log(h1.querySelectorAll('.highlight')); // here it selects all elements with class highlight. here is both are the child of h1 element and we can go deeper n deeper as we want
//also if there are other highlight elements on the page i.e elements with the class highlight they would not get selected bcz they would not be children of h1 element
console.log(h1.childNodes); //sometimes all we need direct children so we use this
console.log(h1.children); //this only works for direct children

h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'red';

//Going upwards
console.log(h1.parentNode);
console.log(h1.parentElement);

//most of the time we actually need a parent element which is not a direct parent or in other words we might need to find parent element no matter how far away it is in DOM tree and for that we have the [closest method] for eg -

h1.closest('.header').style.background = 'var(--gradient-secondary)';

h1.closest('h1').style.background = 'var(--gradient-primary)';

// basically [querySelector] find the children in the dom Tree no matter how far it is and [Closest method] find the parent no matter how far it is in DOM tree

//Going sideways: sibling
//we can only acess direct sibling basically the previous and next
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

//we also have same properties for nodes
console.log(h1.previousSibling);
console.log(h1.nextSibling);

//but if we need all the siblings not just previous or next than we can move to parent element and than read all the children from there
//ex-

console.log(h1.parentElement.children);
// and it is iterable so we can spread it
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)';
});
*/

//[202] Lifecycle DOM Events

//1. DOM Content loaded = this event is fired as soon as the complete html is parsed which means that the html has been downloaded and converted into the DOM tree. also all script must be downloaded and converted for the DOM content loaded event can happen. we call like this
document.addEventListener('DOM content loaded', function (e) {
  console.log('HTML parsed and DOM tree built!', e);
});

//There is also the load event. And the load event is fired as soon as not only the HTML parsed but also all the images and external resources like CSS files are also loaded so basically when the complete page has finished loading is when this event get fired.

window.addEventListener('load', function (e) {
  console.log('Page fullly loaded', e);
});

//Before unload event which also gets fired on window
//for eg- when we close the tab then it will ask to user to 100% sure to leave the page.

//it should only be displayed when necessary. you should only prompt the user if they really want to leave the page. for eg - when the user leaving in the middle filling out the form or writing a block post. or situation in which the data could actually lost by accident.

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });
