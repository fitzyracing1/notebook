# Circle Plot with 0.1 Rad Step

- **URL:** https://grok.com/c/17390579-d94c-492f-88b7-bef72806901d
- **Date:** Jul 29
- **Curation note:** Kept, but thin: the mathematics is the parametric unit circle $x=r\cos\theta$, $y=r\sin\theta$ sampled at $\Delta\theta = 0.1$ rad. Mostly code; reviewer may reject it as a coding exercise.

## User messages (verbatim)

1. `calculation of 0.1 = math stdio import math use directives as the if and write to code for the circle plot`

## Grok

Code for a circle plot with step size 0.1, `import math`, print/"stdio"-style output, and `if` as control directives (verbatim):

```python
#!/usr/bin/env python3
"""
Circle Plot Generator
Calculates points on a unit circle using step of 0.1 radians.
Uses import math, and conditional (if) directives for control.
"""

import math
import matplotlib.pyplot as plt

# Calculation step size
STEP = 0.1

def generate_circle_points(radius=1.0, step=STEP):
    """Generate x,y points for a circle using parametric equations."""
    x_points = []
    y_points = []
    theta = 0.0
    
    # Use if as directive-like control for loop bounds
    if step <= 0:
        print("Invalid step size, using default 0.1")
        step = 0.1
    
    while True:
        # Calculate using math module
        x = radius * math.cos(theta)
        y = radius * math.sin(theta)
        x_points.append(x)
        y_points.append(y)
        
        theta += step
        
        # Directive-style if to break when full circle reached
        if theta >= 2 * math.pi + step:  # slight overshoot to close
            break
    
    return x_points, y_points

def plot_circle(x, y, filename="circle_plot.png"):
    """Plot the circle and save to file."""
    plt.figure(figsize=(8, 8))
    plt.plot(x, y, 'b-', linewidth=2, label='Unit Circle (step=0.1)')
    plt.plot(x[0], y[0], 'ro', markersize=8, label='Start point')  # mark start
    plt.axis('equal')
    plt.grid(True, linestyle='--', alpha=0.7)
    plt.axhline(0, color='black', linewidth=0.5)
    plt.axvline(0, color='black', linewidth=0.5)
    plt.title('Circle Plot - Parametric (θ step = 0.1 rad)\nUsing math.cos / math.sin')
    plt.xlabel('x = r * cos(θ)')
    plt.ylabel('y = r * sin(θ)')
    plt.legend()
    plt.tight_layout()
    plt.savefig(filename, dpi=150)
    print(f"Circle plot saved to: {filename}")
    # Also print some calculated points using "stdio"-like print
    print("\nSample calculated points (first 5):")
    for i in range(min(5, len(x))):
        print(f"  θ≈{i*STEP:.1f}: x={x[i]:.4f}, y={y[i]:.4f}")

if __name__ == "__main__":
    # Main calculation and plot
    xs, ys = generate_circle_points()
    plot_circle(xs, ys)
    
    # Additional calculation demo of 0.1 related
    print(f"\nMath verification: math.cos(0.1) = {math.cos(0.1):.6f}")
    print(f"math.sin(0.1) = {math.sin(0.1):.6f}")
    print(f"2 * math.pi ≈ {2 * math.pi:.6f}")
```

Key calculations of 0.1 (from the run Grok reported):

- $\cos(0.1) = 0.995004$, $\sin(0.1) = 0.099833$
- $\theta \approx 0.0 \to (1.0000, 0.0000)$; $\theta \approx 0.1 \to (0.9950, 0.0998)$; $\theta \approx 0.2 \to (0.9801, 0.1987)$; $\theta \approx 0.3 \to (0.9553, 0.2955)$; $\theta \approx 0.4 \to (0.9211, 0.3894)$

Grok said the script was run and produced a plot image (unit circle, start point in red); the image is not reproduced here.
