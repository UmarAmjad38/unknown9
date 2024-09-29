import { useCallback, useEffect, useRef, useState } from "react";
import { MenuLine } from "../Svg/Svg";
import s from "./header.module.scss";
import { useGSAP } from "@gsap/react";
import gsap, { Power4 } from "gsap";
// import Elements from "./Elements";
import Link from "next/link";
import MenuElements from "./MenuElements";
import RandomLetter from "../Footer/RandomLetter";
import CustomLink from "../Footer/CustomLink";
import { useLottie } from "lottie-react";
import PL from "./PL_logo.json";
import { memo } from "react";
const Header = ({
  menuBtnEnter,
  menuBtnLeave,
}: {
  menuBtnEnter: () => void;
  menuBtnLeave: () => void;
}) => {
  const header = useRef<HTMLElement>(null);
  const logo = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState<string>();
  const [activeMenu, setActiveMenu] = useState<number>(-1);
  const tl = useRef<GSAPTimeline>();
  const tlPathOne = useRef<GSAPTimeline>();
  const tlPathTwo = useRef<GSAPTimeline>();
  const tlPathThree = useRef<GSAPTimeline>();
  const tlPathFour = useRef<GSAPTimeline>();
  const tlPathFive = useRef<GSAPTimeline>();
  const tlPathSix = useRef<GSAPTimeline>();

  const component = [
    { heading: "Work" },
    { heading: "Archive" },
    { heading: "Clients" },
    { heading: "Services" },
    { heading: "About" },
    { heading: "Contact" },
  ];
  const [activeMenus, setActiveMenus] = useState(0);
  const [isNavOpen, setIsNavOpen] = useState(false); // State to track navigation visibility
  const [activeComponentName, setActiveComponentName] = useState(
    component[0].heading
  );
  const toggleNav = () => {
    setIsNavOpen((prev) => !prev); // Toggle navigation visibility
  };

  const components = [
    { heading: "Work", color: "#ADDBD0" },
    { heading: "Archive", color: "#83D398" },
    { heading: "Clients", color: "#C1927F" },
    { heading: "Services", color: "#FFD95D" },
    { heading: "About", color: "#FF9293" },
    { heading: "Contact", color: "#D6C2E4" },
  ];

  const handleScroll = () => {
    const sections = component.map(comp => document.getElementById(comp.heading.toLowerCase()));
    const scrollPosition = window.scrollY  + window.innerHeight / 3; 

    sections.forEach((section, index) => {
      if (section) {
        const { offsetTop, clientHeight } = section;

        // Check if the current scroll position is within the bounds of this section
        if(scrollPosition >= offsetTop && scrollPosition < offsetTop + clientHeight) {
          setActiveMenus(index);
          // console.log(`Active section changed to: ${component[index].heading}`);
        }
      }
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScrollTo = (index: number) => {
      // console.log(`Scrolling to section: ${component[index].heading}`); 
    const element = document.querySelector(
      `#${components[index].heading.toLowerCase()}`
    );

    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    //   if (index === activeMenus) return; // Do nothing if already active

    //   setActiveMenus(index);
    //   setActiveComponentName(components[index].heading);
    // }
    if (element) {
      let offset;
      if (index <= 2) {
        offset = -150; // First three buttons have 200px offset
      } else {
        offset = -350; // Next three buttons have 300px offset
      }
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset + offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      setActiveMenus(index); // Set the new active button
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Check if section is entering or exiting based on intersectionRatio
          if (entry.isIntersecting) {
            const visibleIndex = component.findIndex(
              (comp) => comp.heading.toLowerCase() === entry.target.id
            );
            if (visibleIndex === 0) {
              setActiveMenus(0); // First section
            } else if (visibleIndex === 1) {
              setActiveMenus(1); // Second section
            } else if (visibleIndex > 1) {
              setActiveMenus(visibleIndex); // For others
            } // Update activeMenus based on the visible section
            console.log(`Active section changed to: ${component[visibleIndex].heading}`);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50% 0px", // Multiple thresholds to catch entry and exit points
      }
    );    

    // Observe each section
    component.forEach((comp) => {
      const element = document.getElementById(comp.heading.toLowerCase());
      if (element) {
        observer.observe(element);
      } else {
        console.error('Section element not found for:', comp.heading);
      }
    });

    // Clean up observer on unmount
    return () => {
      component.forEach((comp) => {
        const element = document.getElementById(comp.heading.toLowerCase());
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);

  const getDisplayedButtons = () => {
    if (components.length <= 3) {
      return components; // If fewer than 3 buttons, return all
    }

    if (activeMenus === 0) {
      return components.slice(0, 3); // If at the start, show the first three
    }

    if (activeMenus === components.length - 1) {
      return components.slice(-3); // If at the end, show the last three
    }

    // Otherwise, show the previous, current, and next buttons
    return components.slice(activeMenus - 1, activeMenus + 2);
  };

  const { contextSafe } = useGSAP(
    () => {
      //hero elements
      gsap
        .timeline({
          defaults: { ease: Power4.easeInOut, duration: 2 },
          onComplete: () => {
            gsap.to(".path-1", {
              keyframes: [{ y: 20 }, { y: -20 }, { y: 0 }],
              duration: 5,
              repeat: -1,
            });
            gsap.to(".path-2", {
              keyframes: [
                { rotate: 120, scale: 0.9 },
                { rotate: 180, scale: 1.1 },
                { rotate: 360, scale: 1 },
              ],
              duration: 10,
              repeat: -1,
            });
          },
        })
        .from(".path-1", { y: -200 })
        .from(".path-2", { y: -200, scale: 0 }, "<0.4");

      //menu animation
      tl.current = gsap
        .timeline({
          defaults: { ease: Power4.easeInOut, duration: 2 },
          reversed: true,
        })
        .to(".line-1", { top: "50%", y: "-50%", rotate: 45, duration: 0.5 })
        .to(
          ".line-2",
          { top: "50%", y: "-50%", rotate: -45, duration: 0.5 },
          "<"
        )
        .to(header.current!, { opacity: 0 })
        .to(".large", { opacity: 1, duration: 0.5 }, "<")
        .from(".large-text-1", { xPercent: 100, duration: 1 }, "<0.3")
        .from(".large-text-2", { xPercent: -100, duration: 1 }, "<")
        .to(".large", { rotate: -90, scale: 2, duration: 1 }, "<0.6")
        .to(".large-text-1", { xPercent: 80, duration: 2 }, "<0.5")
        .to(".large-text-2", { xPercent: -80, duration: 2 }, "<")
        .to(header.current!, { opacity: 1 }, "<0.6")
        .to(".menu", { clipPath: "inset(0% 0% 0% 0%)" }, "<")
        .from(".path-menu-1", { x: -400, y: -100 }, "<0.2")
        .from(".path-menu-2", { x: -500, y: 100 }, "<0.1")
        .from(".path-menu-3 path", { y: -100, stagger: 0.1, opacity: 0 }, "<")
        .from(".path-menu-4", { x: 500, y: -400, rotate: 360 }, "<0.1")
        .from(".path-menu-6", { x: 500, y: 1000, rotate: 360 }, "<0.1")
        .from(
          ".path-menu-7",
          { xPercent: 100, yPercent: -1000, scale: 3 },
          "<0.1"
        )
        .from(".path-menu-8", { yPercent: 300, rotate: 360 }, "<0.1")
        .from(
          ".path-menu-5 path",
          { y: -100, x: 400, stagger: 0.1, opacity: 0, duration: 0.5 },
          "<"
        )
        .from(".menu-link", { yPercent: 100, opacity: 0, stagger: 0.1 }, "<0.1")
        .from(".menu-social", { yPercent: 100, opacity: 0 }, "<0.1");

      tlPathOne.current = gsap
        .timeline({
          paused: true,
          repeat: -1,
          defaults: {
            duration: 2,
            ease: "power4",
          },
        })
        .to(".path-menu-1", {
          y: 200,
          scale: 0.2,
        })
        .to(".path-menu-1", {
          y: 0,
          scale: 1,
        });
      tlPathTwo.current = gsap
        .timeline({
          paused: true,
          repeat: -1,
          defaults: {
            duration: 2,
            ease: "power4",
          },
        })
        .to(".path-menu-4", {
          rotate: 360,
        })
        .to(".path-menu-4", {
          rotate: 0,
        });

      tlPathThree.current = gsap
        .timeline({
          paused: true,
          repeat: -1,
          defaults: {
            duration: 2,
            ease: "power4",
          },
        })
        .to(".path-menu-8", {
          rotate: 180,
          scale: 0.5,
        })
        .to(".path-menu-8", {
          rotate: 0,
          scale: 1,
        });
      tlPathFour.current = gsap
        .timeline({
          paused: true,
          repeat: -1,
          defaults: {
            duration: 2,
            ease: "power4",
          },
        })
        .to(".path-menu-6", {
          rotate: 180,
          scale: 0.5,
        })
        .to(".path-menu-6", {
          rotate: 0,
          scale: 1,
        });
      tlPathFive.current = gsap
        .timeline({
          paused: true,
          repeat: -1,
          defaults: {
            duration: 2,
            ease: "power4",
          },
        })
        .to(".path-menu-2", {
          scale: 2,
          x: -200,
        })
        .to(".path-menu-2", {
          x: 0,
          scale: 1,
        });
      tlPathSix.current = gsap
        .timeline({
          paused: true,
          repeat: -1,
          defaults: {
            duration: 2,
            ease: "power4",
          },
        })
        .to(".path-menu-7", {
          scale: 2,
        })
        .to(".path-menu-7", {
          scale: 0.7,
        });
    },
    { scope: container }
  );

  const handleClick = contextSafe(() => {
    toggleNav();
    if (!tl.current!.reversed()) {
      document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "hidden";
    }

    tl.current!.reversed(!tl.current!.reversed());
    setActiveMenu(-1);
  });

  const handlePointerEnter = (color: string, key: number) => {
    switch (key) {
      case 0:
        tlPathOne.current?.play();
        break;

      case 1:
        tlPathTwo.current?.play();
        break;

      case 2:
        tlPathThree.current?.play();
        break;

      case 3:
        tlPathFour.current?.play();
        break;

      case 4:
        tlPathFive.current?.play();
        break;

      case 5:
        tlPathSix.current?.play();
        break;

      default:
        break;
    }
  };

  const handlePointerLeave = () => {
    setColor("#F6F2E9");
    tlPathOne.current!.paused(true);
    tlPathTwo.current!.paused(true);
    tlPathThree.current!.paused(true);
    tlPathFour.current!.paused(true);
    tlPathFive.current!.paused(true);
    tlPathSix.current!.paused(true);
  };

  const [scrollY, setScrollY] = useState<number>(0);

  const onScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [onScroll]);

  useGSAP(
    () => {
      gsap.set(".logo", { xPercent: -50, yPercent: -50 });
      if (scrollY > 100) {
        gsap.to(".logo", { scale: 0.7, ease: "power4", duration: 0.8 });
      } else {
        gsap.to(".logo", { scale: 1, ease: "power4", duration: 0.8 });
      }
    },
    { scope: header, dependencies: [scrollY] }
  );

  const { View, play, stop } = useLottie({
    animationData: PL,
  });

  useEffect(() => {
    stop();
  }, [stop]);

  return (
    <div ref={container}>
      <div className={`large ${s.large}`}>
        {[...Array(20)].map((e, i) => {
          return (
            <div key={i}>
              <h1 className="large-text-1">Phlippe Layani Phlippe Layani</h1>
              <h1 className="large-text-2">
                Digital Designer Digital Designer
              </h1>
            </div>
          );
        })}
      </div>
      {/* 
      Removing Animated Style
      <Elements /> */}
      <header ref={header} id="unknown-header" className={s.main}>
        <div
          ref={logo}
          onPointerEnter={() => play()}
          onPointerLeave={() => stop()}
          className={`${s.logo} logo`}
          id="unknown-logo"
        >
          {/* <Logo /> */}
          {View}
        </div>
        <div className={s.menuBtn}>
          <button
            onPointerEnter={menuBtnEnter}
            onPointerLeave={menuBtnLeave}
            onClick={handleClick}
          >
            <div className={s.menufloat}>
              {Array.from("Menu").map((e, i) => {
                return (
                  <a className="menuinside" key={i}>
                    {e}
                  </a>
                );
              })}
              <div>
                {Array.from("Menu").map((e, i) => {
                  return (
                    <span className="menuoutside" key={i}>
                      <RandomLetter />
                    </span>
                  );
                })}
              </div>
            </div>
            <div className={s.menuBtn_box}>
              <span className="line-1" />
              <span className="line-2" />
            </div>
          </button>
        </div>
      </header>

      {!isNavOpen && (
        <div className={s.dotNavigation}>
          {getDisplayedButtons().map((comp, index) => {
            // Calculate the correct global index based on the buttons displayed
            const globalIndex =
              activeMenus === 0
                ? index
                : activeMenus === components.length - 1
                ? components.length - 3 + index
                : activeMenus - 1 + index;

            return (
              <div
                key={globalIndex}
                className={s.dotWrapper}
                onClick={() => handleScrollTo(globalIndex)}
              >
                <div className={s.nameContainer}>
                  <h1 className={s.name}>{comp.heading}</h1>
                </div>
                <div
                  className={`${s.dotContainer} ${
                    activeMenus === globalIndex ? s.active : ""
                  }`}
                >
                  <div className={s.dot}></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <nav className={`menu ${s.menu}`}>
        {/* <MenuElements /> */}
        <div className={s.menu_grid}>
          {[
            { heading: "Work", color: "#ADDBD0" },
            { heading: "Archive", color: "#83D398" },
            { heading: "Clients", color: "#C1927F" },
            { heading: "Services", color: "#FFD95D" },
            { heading: "About", color: "#FF9293" },
            { heading: "Contact", color: "#D6C2E4" },
          ].map((e, i) => {
            return (
              <div
                key={i}
                data-active={i === activeMenu}
                onClick={() => {
                  // setActiveMenu Removes onclick event, Line drawing event
                  // setActiveMenu(i);
                }}
                onPointerEnter={() => handlePointerEnter(e.color, i)}
                onPointerLeave={() => handlePointerLeave()}
                className={s.menuCover}
              >
                <MenuLine />
                <div key={i} className={s.menu3D}>
                  <div className={s.menu3D_bottom}>
                    {/* On Click Links */}
                    <Link
                      scroll={false}
                      onClick={handleClick}
                      className="menu-link"
                      href={`#${e.heading.toLowerCase()}`}
                    >
                      {e.heading}
                      <span>0{i + 1}</span>
                    </Link>
                  </div>
                  <div className={s.menu3D_front}>
                    <Link
                      scroll={false}
                      className="menu-link"
                      href="#"
                      // href={`#${e.heading.toLowerCase()}`}
                    >
                      {e.heading}
                      <span>0{i + 1}</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {/* <Link
            className="menu-link"
            data-active={asPath === "/#work"}
            href="#work"
          >
            Work<span>01</span>
          </Link>
           <Link
            className="menu-link"
            data-active={asPath === "/#archive"}
            href="#archive"
          >
            Archive<span>02</span>
          </Link>
          <Link
            className="menu-link"
            data-active={asPath === "/#clients"}
            href="#clients"
          >
            Clients<span>03</span>
          </Link>
          <Link
            className="menu-link"
            data-active={asPath === "/#services"}
            href="#services"
          >
            Services<span>04</span>
          </Link>
          <Link
            className="menu-link"
            data-active={asPath === "/#about"}
            href="#about"
          >
            About<span>05</span>
          </Link>
          <Link
            className="menu-link"
            data-active={asPath === "/#contact"}
            href="#contact"
          >
            Contact<span>06</span>
          </Link> */}
        </div>

        <div className={`menu-social ${s.menu_social}`}>
          <CustomLink href="/" text="Linkedin" />
          {/* <CustomLink href="/" text="Instagram" /> */}
          <CustomLink href="/" text="Behance" />
          <CustomLink href="/" text="Twitter" />
        </div>
      </nav>
    </div>
  );
};

export default memo(Header);
