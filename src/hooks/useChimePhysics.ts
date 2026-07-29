import { useState, useRef, useCallback, useEffect } from 'react';

interface PhysicsOptions {
  stiffness?: number;
  damping?: number;
  maxAngle?: number;
}

export function useChimePhysics(options: PhysicsOptions = {}) {
  const { stiffness = 0.08, damping = 0.94, maxAngle = 35 } = options;

  const [angle, setAngle] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const angleRef = useRef<number>(0);
  const velRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const initialAngleRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  const updatePhysics = useCallback(() => {
    if (!isDraggingRef.current) {
      // Pendulum restoring torque: -stiffness * angle
      const acceleration = -stiffness * angleRef.current;
      velRef.current = (velRef.current + acceleration) * damping;
      angleRef.current += velRef.current;

      // Limit max angle
      if (angleRef.current > maxAngle) angleRef.current = maxAngle;
      if (angleRef.current < -maxAngle) angleRef.current = -maxAngle;

      setAngle(angleRef.current);

      // Stop loop if motion is virtually zero
      if (Math.abs(angleRef.current) < 0.05 && Math.abs(velRef.current) < 0.05) {
        angleRef.current = 0;
        velRef.current = 0;
        setAngle(0);
        return;
      }
    }

    animFrameRef.current = requestAnimationFrame(updatePhysics);
  }, [damping, maxAngle, stiffness]);

  const startLoop = useCallback(() => {
    if (animFrameRef.current === null) {
      animFrameRef.current = requestAnimationFrame(updatePhysics);
    }
  }, [updatePhysics]);

  const applyImpulse = useCallback((force: number) => {
    velRef.current += force;
    startLoop();
  }, [startLoop]);

  const startDrag = useCallback((screenX: number) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartXRef.current = screenX;
    initialAngleRef.current = angleRef.current;
    startLoop();
  }, [startLoop]);

  const updateDrag = useCallback((screenX: number) => {
    if (!isDraggingRef.current) return;
    const deltaX = screenX - dragStartXRef.current;
    const computedAngle = initialAngleRef.current + deltaX * 0.15;
    const clampedAngle = Math.max(-maxAngle, Math.min(maxAngle, computedAngle));

    angleRef.current = clampedAngle;
    setAngle(clampedAngle);
  }, [maxAngle]);

  const endDrag = useCallback((): number => {
    if (!isDraggingRef.current) return 0;

    isDraggingRef.current = false;
    setIsDragging(false);

    const releasedAngle = angleRef.current;
    // Impulse velocity proportional to released deflection angle
    const releaseImpulse = -releasedAngle * 0.35;
    velRef.current = releaseImpulse;

    startLoop();
    return Math.abs(releasedAngle) / maxAngle; // Return 0..1 intensity factor
  }, [maxAngle, startLoop]);

  useEffect(() => {
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return {
    angle,
    isDragging,
    applyImpulse,
    startDrag,
    updateDrag,
    endDrag,
  };
}
