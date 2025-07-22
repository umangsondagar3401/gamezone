import { useEffect } from "react";
import confetti from "canvas-confetti";

interface ConfettiCannonProps {
  trigger?: boolean;
  onComplete?: () => void;
}

const ConfettiCannon = ({
  trigger = true,
  onComplete,
}: ConfettiCannonProps) => {
  useEffect(() => {
    if (trigger) {
      // Fire confetti from multiple angles for a cannon effect
      const fireConfetti = () => {
        const count = 200;
        const defaults = {
          origin: { y: 0.7 },
          zIndex: 9999,
        };
        function fire(particleRatio: number, opts: confetti.Options) {
          confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio),
          });
        }
        // Fire from left
        fire(0.25, {
          spread: 26,
          startVelocity: 55,
          origin: { x: 0.2, y: 0.7 },
        });
        // Fire from center
        fire(0.2, {
          spread: 60,
          startVelocity: 45,
          origin: { x: 0.5, y: 0.7 },
        });
        // Fire from right
        fire(0.35, {
          spread: 100,
          decay: 0.91,
          scalar: 0.8,
          origin: { x: 0.8, y: 0.7 },
        });
        // Fire upward burst
        fire(0.1, {
          spread: 120,
          startVelocity: 25,
          decay: 0.92,
          scalar: 1.2,
          origin: { x: 0.5, y: 0.9 },
        });
        // Fire golden confetti
        fire(0.1, {
          spread: 120,
          startVelocity: 45,
          colors: ["#FFD700", "#FFA500", "#FF6347"],
          origin: { x: 0.5, y: 0.6 },
        });
      };
      // Initial burst
      fireConfetti();
      // Additional bursts for more dramatic effect
      const timeout1 = setTimeout(fireConfetti, 300);
      const timeout2 = setTimeout(fireConfetti, 600);
      // Call onComplete after all confetti is done
      const completeTimeout = setTimeout(() => {
        onComplete?.();
      }, 1000);
      return () => {
        clearTimeout(timeout1);
        clearTimeout(timeout2);
        clearTimeout(completeTimeout);
      };
    }
  }, [trigger, onComplete]);
  return null; // This component doesn't render anything visible
};
export default ConfettiCannon;
