import s from "./hero.module.scss";
import { HeroArrowDown } from "../Svg/Svg";
import { useScrollTo } from "react-use-window-scroll";
import useWindowSize from "@/hooks/useWindowSize";
import dynamic from "next/dynamic";
import { useState, useEffect, memo } from "react";
import { useInView } from "react-intersection-observer";

const Lottie = dynamic(() => import('react-lottie'), { ssr: false });

type AnimationData = {
  default: object;
};

const Hero: React.FC = () => {
  const scrollTo = useScrollTo();
  const size = useWindowSize();
  const [showData2, setShowData2] = useState(false);
  const [animationData, setAnimationData] = useState<object | null>(null);
  const { ref, inView } = useInView({
    triggerOnce: true, 
    threshold: 0.5,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowData2(true);
    }, 15800); // Switch to second GIF after 16 seconds

    return () => clearTimeout(timer);
  }, []);

  const getAnimationData = async (): Promise<AnimationData> => {
    if (size?.width && size.width > 640) {
      return showData2 ? import('./lottie/EndPortion.json') : import('./lottie/data.json');
    } else {
      return showData2 ? import('./lottie/data-m2.json') : import('./lottie/data-m.json');
    }
  };

  useEffect(() => {
    const loadAnimation = async () => {
      try {
        const data = await getAnimationData();
        setAnimationData(data.default);
      } catch (error) {
        console.error("Failed to load animation data:", error);
      }
    };

    if (inView) {
      loadAnimation();
    }
  }, [size, showData2, inView]);

  return (
    <section id="hero" className={s.main} ref={ref}>
      <div onClick={() => scrollTo({ top: window.innerHeight, behavior: "smooth" })} className={s.arrow}>
        <HeroArrowDown />
      </div>
      <div className={s.lottie}>
        {animationData && (
          <Lottie
            options={{
              loop: showData2,
              autoplay: true,
              animationData: animationData,
            }}
          />
        )}
      </div>
    </section>
  );
};

export default memo(Hero);
