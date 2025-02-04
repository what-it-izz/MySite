import { preloadImages } from "./utils.js";
import { Item } from './item.js'; 
import { Content } from './content.js';

let tl = null;

// Function to initialize the first animation
const initFirstAnimation = () => {
  const breakPoint = "53em";
  const mm = gsap.matchMedia();

  mm.add(
    {
      isDesktop: `(min-width: ${breakPoint})`,
      isMobile: `(max-width: ${breakPoint})`,
    },
    (context) => {
      let { isDesktop } = context.conditions;

      const image = document.querySelector(".card__img");
      const cardList = gsap.utils.toArray(".card");
      const count = cardList.length;
      const sliceAngle = (2 * Math.PI) / count;

      const radius1 = 50 + image.clientHeight / 2;
      const radius2 = isDesktop ? 250 - radius1 : 180 - radius1;

      // Create the first GSAP timeline
      let tl1 = gsap.timeline()
      tl1
        .from(cardList, {
          y: window.innerHeight / 2 + image.clientHeight * 1.5,
          rotateX: -180,
          stagger: 0.1,
          duration: 0.5,
          opacity: 0.8,
          scale: 3,
        })
        .set(cardList, {
          transformOrigin: `center ${radius1 + image.clientHeight / 2}px`,
        })
        .set(".group", {
          transformStyle: "preserve-3d",
        })
        .to(cardList, {
          y: -radius1,
          duration: 0.5,
          ease: "power1.out",
        })
        .to(
          cardList,
          {
            rotation: (index) => (index * 360) / count,
            rotateY: 15,
            duration: 1,
            ease: "power1.out",
          },
          "<"
        )
        .to(cardList, {
          x: (index) =>
            Math.round(radius2 * Math.cos(sliceAngle * index - Math.PI / 4)),
          y: (index) =>
            Math.round(radius2 * Math.sin(sliceAngle * index - Math.PI / 4)) -
            radius1,
          rotation: (index) => (index + 1) * (360 / count),
        })
        .from(
          ".headings",
          {
            opacity: 0,
            filter: "blur(60px)",
            duration: 1,
          },
          "<"
        )
        .to(
          ".group",
          {
            rotation: 360,
            duration: 20,
            repeat: -1,
            ease: "none",
          },
          "<-=2"
        );

      return () => {};
    }
  );
};

// Function to initialize the second animation
// TODO: fix the second animation
const initSecondAnimation = () => {
  // Selecting the element with class 'layers' (these are the photos used in the animation)
  const DOMlayers = document.querySelector('.layers');
  // Selecting all elements with class 'layers__item' and converting NodeList to an array
  // (these are the photos used in the animation)
  const DOMItems = [...DOMlayers.querySelectorAll('.layers__item')];
  const items = []; // Array to store instances of the Item class

  // Creating new instances of Item for each selected DOM element
  DOMItems.forEach(item => {
      items.push(new Item(item)); // Initializing a new object for each item
  });

  // Selecting all elements with class 'content__inner' and converting NodeList to an array
  const DOMContentSections = [...document.querySelectorAll('.content > .content__inner')];
  const contents = []; // Array to store instances of the Content class

  // Creating new instances of Content for each selected DOM element
  DOMContentSections.forEach(content => {
      contents.push(new Content(content)); // Initializing a new object for each content
  });

  // Setting up the animation properties
  const animationSettings = {
    duration: 0.5, // Duration of the animation
    ease: 'power3.inOut', // Type of easing to use for the animation transition
    delayFactor: 0.13  // Delay between each item's animation
  };

  // Mapping each Item object to its actual DOM element for the animation
  const allItems = items.map(item => item.DOM.el);

  // The currently active content element
  const contentActive = contents.find(content => !content.DOM.el.classList.contains('hidden'));

  // Create the second GSAP timeline
  tl = gsap.timeline({
    paused: true,
    defaults: {
      duration: animationSettings.duration,
      ease: animationSettings.ease,
    },
  });

  tl.fromTo(allItems, {
    opacity: 1,
    'clip-path': 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%)',
  }, {
    ease: 'power3.in',
    stagger: animationSettings.delayFactor,
    'clip-path': 'polygon(50% 0%, 83% 12%, 100% 43%, 94% 78%, 68% 100%, 32% 100%, 6% 78%, 0% 43%, 17% 12%)',
  })
  .to(allItems, {
    ease: 'power3',
    stagger: animationSettings.delayFactor,
    'clip-path': 'polygon(50% 0%, 100% 0%, 100% 43%, 100% 100%, 68% 100%, 32% 100%, 0% 100%, 0% 43%, 0% 0%)',
  })
  .to(contentActive.DOM.el, {
    duration: 1,
    startAt: { scale: 1 },
    scale: 1.2,
    opacity: 0,
  })
  .to(allItems, {
    duration: 1,
    opacity: 0,
    onComplete: () => {
      window.location.href = "index.html";
    },
  });

  // Start the animation
  tl.play();
};

// Function to generate random positions and animations for stars
function createStar() {
  const star = document.createElement('div');
  star.classList.add('star');

  // Random position
  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight;

  // Random animation duration
  const duration = Math.random() * 2 + 1;

  star.style.left = `${x}px`;
  star.style.top = `${y}px`;
  star.style.animationDuration = `${duration}s`;

  document.body.appendChild(star);
};

// Preload images and initialize animations
preloadImages(".card__img").then(() => {
  document.body.classList.remove("loading");

  // Initialize stars
  const numStars = 200;
  for (let i = 0; i < numStars; i++) {
    createStar();
  }
  window.addEventListener('resize', () => {
    document.querySelectorAll('.star').forEach(star => star.remove());
    for (let i = 0; i < numStars; i++) {
      createStar();
    }
  });

  // Run the intro animation
  initFirstAnimation();
});

// TODO: Uncomment below after the second animation is fixed
// // Attach the second animation to a click event
// document.addEventListener('click', (event) => {
//   const frameElement = document.querySelector('.frame');
//   if (tl && tl.isActive() || frameElement.contains(event.target)) {
//     return false;
//   }
//   initSecondAnimation();
// });
