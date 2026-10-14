'use client';

import { createContext, useContext, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { useScene, type ScenePhase } from '@/lib/motion/use-scene';

const SceneContext = createContext<ScenePhase>('final');

export const useScenePhase = () => useContext(SceneContext);

type Props = {
  children: ReactNode;
  threshold?: number;
} & Omit<ComponentPropsWithoutRef<'div'>, 'children'>;

/**
 * Client boundary for an animated mockup. Its (server-rendered) children carry
 * `data-anim` hooks; this only owns the observer and the `data-scene` attribute.
 */
export function Scene({ children, threshold, ...rest }: Props) {
  const { ref, phase } = useScene<HTMLDivElement>({ threshold });
  return (
    <SceneContext.Provider value={phase}>
      <div ref={ref} data-scene={phase} {...rest}>
        {children}
      </div>
    </SceneContext.Provider>
  );
}
