# Solving Quadratic Equation Step-by-Step

- **URL:** https://grok.com/c/de529f48-98cf-4bb4-a926-49b6a877c64c
- **Date:** Jan 24, 2026

## User messages (verbatim)

1. `x^2-1x/v=mc`
2. `c is the speed of light`

## Grok

**Turn 1**

The equation you wrote appears to be:

$$x^2 - \frac{x}{v} = mc$$

(or possibly $x^2 - \frac{1x}{v} = mc$, which is the same since $1x = x$).

This is a quadratic equation in $x$. Assuming $m$, $c$, and $v$ are constants ($v \neq 0$), solve step by step.

Rearrange into standard quadratic form:

$$x^2 - \frac{1}{v}x - mc = 0$$

This matches $ax^2 + bx + c = 0$, where $a = 1$, $b = -\frac{1}{v}$, and $c = -mc$ (the constant term; the physics $c$ and the quadratic $c$ are unrelated here).

Quadratic formula:

$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

Substitute:

$$x = \frac{\frac{1}{v} \pm \sqrt{\frac{1}{v^2} + 4mc}}{2}$$

Multiply numerator and denominator by $v$:

$$x = \frac{1 \pm \sqrt{1 + 4 m c v^{2}}}{2 v}$$

The two solutions:

$$x = \frac{1 + \sqrt{1 + 4 m c v^{2}}}{2 v}$$

$$x = \frac{1 - \sqrt{1 + 4 m c v^{2}}}{2 v}$$

The minus-sign root is usually negative (the square root exceeds 1), so depending on context it may be discarded.

**Turn 2**

With $c$ = speed of light ($\approx 3 \times 10^8$ m/s in vacuum), Grok said this suggests special relativity, and that the form does not match a standard textbook equation exactly. It discussed possible connections:

1. **Relativistic velocity addition:** $w = \frac{u + v}{1 + uv/c^2}$, and the inverse $u = \frac{w - v}{1 - wv/c^2}$. Grok noted a quadratic of this shape can arise when solving for a coordinate or delay term.
2. **Relativistic energy/momentum:** $E = \gamma m c^2$ with $\gamma = \frac{1}{\sqrt{1 - v^2/c^2}}$; $p = \gamma m v$; $E^2 = p^2 c^2 + (mc^2)^2$.
3. **Hyperbolic motion / Rindler coordinates:** $(x + \text{something})^2 - c^2 t^2 = \text{constant}$, which expands to forms with $x^2 - (\text{something})x$.

Grok flagged a units problem: $mc$ has units of momentum (kg·m/s), so $x^2 - x/v = mc$ is not dimensionally consistent as written; "assuming the original equation had consistent units (perhaps a missing $/c$ or similar factor)," the solutions are still

$$x = \frac{1 \pm \sqrt{1 + 4 (mc) v^{2}}}{2 v}$$

with the $+$ root usually the physical one. It asked for the source context (decay, rocket, Doppler ranging, homework).
