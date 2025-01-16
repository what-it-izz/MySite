import { preloadImages } from "./utils.js";

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

// Ensure images are loaded before removing the loading class & running init.
preloadImages(".card__img").then(() => {
  document.body.classList.remove("loading");
  // Number of stars
  const numStars = 200;

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
  }

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
