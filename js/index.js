import { preloadImages } from "./utils.js";
import { Item } from './item.js'; 
import { Content } from './content.js';

const init = () => {
  // specifies the screen width breakpoint
  const breakPoint = "53em";
  // to manage animations based on screen size 
  const mm = gsap.matchMedia();

  mm.add(
    {
      // To execute specific animations depending on
      // screen size.
      isDesktop: `(min-width: ${breakPoint})`,
      isMobile: `(max-width: ${breakPoint})`,
    },
    (context) => {
      let { isDesktop } = context.conditions;

      // Determine how many images there are, & determine 
      // the angle between them for circular distribution.
      const image = document.querySelector(".card__img");
      const cardList = gsap.utils.toArray(".card");
      const count = cardList.length;
      const sliceAngle = (2 * Math.PI) / count;

      // Distance from the image center to the screen center.
      const radius1 = 50 + image.clientHeight / 2;
      const radius2 = isDesktop ? 250 - radius1 : 180 - radius1;

      // Creates a GSAP timeline to define a sequence of animations.
      gsap
        .timeline()
        // Animates cards from off-screen with rotation, staggered timing, and scaling.
        .from(cardList, {
          y: window.innerHeight / 2 + image.clientHeight * 1.5,
          rotateX: -180,
          stagger: 0.1,
          duration: 0.5,
          opacity: 0.8,
          scale: 3,
        })
        // Adjusts the pivot point for 3D transformations.
        .set(cardList, {
          transformOrigin: `center ${radius1 + image.clientHeight / 2}px`,
        })
        .set(".group", {
          // https://developer.mozilla.org/en-US/docs/Web/CSS/transform-style
          transformStyle: "preserve-3d",
        })
        // Moves cards to their circular positions along the radius.
        .to(cardList, {
          y: -radius1,
          duration: 0.5,
          ease: "power1.out",
        })
        // Positions each card evenly around the circle.
        .to(
          cardList,
          {
            rotation: (index) => {
              return (index * 360) / count;
            },
            rotateY: 15,
            duration: 1,
            ease: "power1.out",
          },
          "<" // to overlap with the previous animation.
        )
        .to(cardList, {
          // Expand the radius
          x: (index) => {
            return Math.round(
              radius2 * Math.cos(sliceAngle * index - Math.PI / 4)
            );
          },
          y: (index) => {
            return (
              Math.round(radius2 * Math.sin(sliceAngle * index - Math.PI / 4)) -
              radius1
            );
          },
          rotation: (index) => {
            return (index + 1) * (360 / count);
          },
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
        // .to(cardList, {
        //   repeat: -1,
        //   duration: 2,
        //   // TODO: Maybe try to make this onRepeat animation do something else,
        //   // like sparkle or shine
        //   onRepeat: () => {
        //     gsap.to(cardList[Math.floor(Math.random() * count)], {
        //       rotateY: "+=180",
        //     });
        //   },
        // })

        // Slowly rotates the entire .group infinitely.
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

      // Arrow function that takes no arguments and performs no actions
      // Returning it makes this function accessible to the caller, 
      // but it essentially does nothing.
      // Here it is used because no cleanup is required, 
      // but GSAP still expects a function to be returned.
      return () => {};
    }
  );
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

// Ensure images are loaded before removing the loading class & running init.
preloadImages(".card__img").then(() => {
  document.body.classList.remove("loading");

  // Number of stars
  const numStars = 200;
  // Generate stars
  for (let i = 0; i < numStars; i++) {
      createStar();
  }
  // Update stars on resize
  window.addEventListener('resize', () => {
    document.querySelectorAll('.star').forEach(star => star.remove());
    for (let i = 0; i < numStars; i++) {
      createStar();
    }
  });
  
  init();
});

// frame element
const frameElement = document.querySelector('.frame');

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

// GSAP timeline
let tl = null;

// Setting up the animation properties
const animationSettings = {
    duration: 0.5, // Duration of the animation
    ease: 'power3.inOut', // Type of easing to use for the animation transition
    delayFactor: 0.13  // Delay between each item's animation
};

// Event listener for click events on the document
document.addEventListener('click', event => {
    // Check if the timeline is currently active (running)
    if (tl && tl.isActive() || frameElement.contains(event.target)) {
        return false; // Don't start a new animation
    }

    // The currently active content element
    const contentActive = contents.find(content => !content.DOM.el.classList.contains('hidden'));
    
    // Assuming there are only two content elements
    // const contentInactive = contents.find(content => content !== contentActive);

    // Mapping each Item object to its actual DOM element for the animation
    const allItems = items.map(item => item.DOM.el);

    // Creating a new GSAP timeline for managing a sequence of animations
    tl = gsap.timeline({
        paused: true, // Create the timeline in a paused state
        defaults: { // Default settings applied to all animations within this timeline
            duration: animationSettings.duration,
            ease: animationSettings.ease,
        }
    })
    .fromTo(allItems, { // Initial animation state
        opacity: 1, // Fully visible
        'clip-path': 'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%)', // CSS clip-path shape
    }, { // Animation target state
        ease: 'power3.in',
        stagger: animationSettings.delayFactor, // Time between each item's animation
        'clip-path': 'polygon(50% 0%, 83% 12%, 100% 43%, 94% 78%, 68% 100%, 32% 100%, 6% 78%, 0% 43%, 17% 12%)', // Target shape of the clip-path
    }, 0)
    .to(allItems, { // Animation target state
        ease: 'power3',
        stagger: animationSettings.delayFactor, // Time between each item's animation
        'clip-path': 'polygon(50% 0%, 100% 0%, 100% 43%, 100% 100%, 68% 100%, 32% 100%, 0% 100%, 0% 43%, 0% 0%)', // Target shape of the clip-path
    }, 0.5)
    .to(contentActive.DOM.el, {
        duration: 1,
        startAt: {scale: 1},
        scale: 1.2,
        opacity: 0
    }, 0)
    .to(allItems, { // Add a fade-out effect to the entire page
        duration: 1, // Duration of the fade-out
        opacity: 0,
        onComplete: () => {
            // Redirect to the next page after the fade-out
            window.location.href = "homepage.html";
        }
    });
    // Start the animation
    tl.play();
});

// Preloading all images specified by the selector
preloadImages('.layers__item-img').then(() => {
    // Once images are preloaded, remove the 'loading' indicator/class from the body
    document.body.classList.remove('loading');
});

