import type { CSSProperties } from 'react';
import { Scene } from '@/components/motion/Scene';
import { Bar, timing } from '@/components/ui/primitives';

/**
 * Flagship 05 (dark). Timeline: highlighted lines grow, axes extend, the ellipse is
 * swept in, the particle pops and makes one lap of the ellipse before settling at its
 * reference spot, the equation fades in and the scene progress bar fills.
 */

// Orbit maths (see tci-orbit-* keyframes): the wrappers share the ellipse box
// (left 24%, top 28%, 52% × 44% of the panel). The dot rests at panel 46%/46%, i.e.
// 42.31% / 40.91% of that box; --ox/--oy move its centre onto the ellipse centre.
const ORBIT_BOX: CSSProperties = { left: '24%', top: '28%', width: '52%', height: '44%' };
const OX = { '--ox': 'calc(7.692% - 7px)' } as CSSProperties;
const OY = { '--oy': 'calc(9.091% - 7px)' } as CSSProperties;

export function ExplainerMock({ label }: { label: string }) {
  return (
    <Scene
      role="img"
      aria-label={label}
      className="grid min-h-[280px] grid-cols-[1fr_1.3fr] overflow-hidden rounded-[14px] border border-dark-line bg-ink text-[12px] text-dark-text shadow-mock-dark"
    >
      <div className="flex flex-col gap-[9px] border-r border-dark-line p-[18px]">
        <div className="mono text-[10px] tracking-[0.06em] text-subtle">ThaiJO · Thai Environmental Engineering Journal · §3</div>
        <div className="text-[13px] font-semibold">แบบจำลองการแพร่กระจายของ PM2.5</div>
        <Bar w="96%" h={6} tone="dark" />
        <Bar w="88%" h={6} tone="dark" />
        <Bar w="92%" h={6} tone="primary" anim="grow-x" d={200} dur={520} />
        <Bar w="70%" h={6} tone="primary" anim="grow-x" d={320} dur={520} />
        <Bar w="90%" h={6} tone="dark" />
        <Bar w="60%" h={6} tone="dark" />
        <div className="mono mt-auto text-[10px] text-subtle">scroll ↓ to animate eq. (3)</div>
      </div>
      <div className="flex flex-col gap-3 p-[18px]">
        <div className="mono flex justify-between text-[10px] text-subtle">
          <span>MANIM SCENE 3 / 7</span>
          <span>AI-generated</span>
        </div>
        <div className="relative min-h-[150px] flex-1 overflow-hidden rounded-[10px] border border-dark-line bg-dark-inset">
          <div data-anim="grow-x-c" style={{ ...timing(300, 600), left: '14%', top: '50%', width: '72%' }} className="absolute h-px bg-dark-axis" />
          <div data-anim="grow-y-c" style={{ ...timing(420, 600), left: '50%', top: '14%', height: '72%' }} className="absolute w-px bg-dark-axis" />
          <div
            data-anim="sweep"
            style={{ ...timing(600, 900), left: '24%', top: '28%', width: '52%', height: '44%' }}
            className="absolute rounded-[50%] border-2 border-violet"
          />
          <div data-anim="orbit-x" style={{ ...timing(1500, 3200), ...ORBIT_BOX, ...OX }} className="absolute">
            <div data-anim="orbit-y" style={{ ...timing(1500, 3200), ...OY }} className="absolute inset-0">
              <div
                data-anim="pop"
                style={{ ...timing(1500, 420), left: '42.3077%', top: '40.9091%' }}
                className="absolute size-[14px] rounded-full bg-violet shadow-[0_0_18px_#7c76ff]"
              />
            </div>
          </div>
          <div data-anim="fade" style={timing(1600, 600)} className="mono absolute right-3 bottom-[10px] text-[11px] text-violet-soft">
            ∂C/∂t = D∇²C − v·∇C
          </div>
        </div>
        <div className="relative h-1 rounded-[2px] bg-dark-line">
          <div data-anim="grow-x" style={timing(400, 1800)} className="absolute top-0 left-0 h-full w-[43%] rounded-[2px] bg-violet" />
        </div>
      </div>
    </Scene>
  );
}
