import { useEffect, useRef, useState } from "react";

/**
 * Animates a number from 0 to `target` once the element enters the viewport.
 * Returns [ref to attach to the triggering element, current display value as string].
 */
export function useCountUp(
    target: number,
    duration = 1800,
    prefix = "",
    suffix = ""
): [React.RefObject<HTMLElement>, string] {
    const ref = useRef<HTMLElement>(null);
    const [value, setValue] = useState(0);
    const started = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    const startTime = performance.now();

                    const step = (now: number) => {
                        const elapsed = now - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease out quad
                        const eased = 1 - (1 - progress) * (1 - progress);
                        setValue(Math.floor(eased * target));
                        if (progress < 1) requestAnimationFrame(step);
                        else setValue(target);
                    };

                    requestAnimationFrame(step);
                }
            },
            { threshold: 0.3 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [target, duration]);

    const display = `${prefix}${value.toLocaleString()}${suffix}`;
    return [ref as React.RefObject<HTMLElement>, display];
}
