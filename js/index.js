import { preloadImages } from "./utils.js";

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

// Preload images and initialize animations
preloadImages(".card__img").then(() => {
  document.body.classList.remove("loading");

  // Run the intro animation
  initFirstAnimation();
});
