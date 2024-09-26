import { useEffect, useState } from "react";
import { memo } from "react";

const RandomLetter = () => {
  const [letter, setLetter] = useState("A");

  useEffect(() => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0987654321";
    let animationFrameId: number;
    let timeoutId: NodeJS.Timeout;

    const updateLetter = () => {
      timeoutId = setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * alphabet.length);
        setLetter(alphabet[randomIndex]);

        // Continue the animation on the next frame after 1 second delay
        animationFrameId = requestAnimationFrame(updateLetter);
      }, 1000); // 1 second delay
    };

    // Start the animation
    animationFrameId = requestAnimationFrame(updateLetter);

    // Cleanup on component unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
    };
  }, []);

  return <>{letter}</>;
};

export default memo(RandomLetter);
