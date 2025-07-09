"use client";

import React, { useRef, useEffect, useState } from "react";

interface CustomAnimatedContentProps {
  children: React.ReactNode;
  distance?: number;
  direction?: "vertical" | "horizontal";
  initialOpacity?: number;
  animateOpacity?: boolean;
  threshold?: number;
  delay?: number;
}

const CustomAnimatedContent: React.FC<CustomAnimatedContentProps> = ({
  children,
  distance = 150, 
  direction = "vertical",
  initialOpacity = 0,
  animateOpacity = false,
  threshold = 1,
  delay = 0, 
}) => {
  const domRef = useRef<HTMLDivElement>(null);
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: threshold,
      }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  const animationStyles: React.CSSProperties = {
    transition: `all 0.4s ease-out ${delay}s`,
    opacity: isVisible && animateOpacity ? 1 : initialOpacity,
    transform: "none",
  };

  if (!isVisible) {
    if (direction === "vertical") {
      animationStyles.transform = `translateY(${distance}px)`;
    } else if (direction === "horizontal") {
      animationStyles.transform = `translateX(${distance}px)`;
    }
  }

  return (
    <div ref={domRef} style={animationStyles}>
      {children}
    </div>
  );
};

export default CustomAnimatedContent;
