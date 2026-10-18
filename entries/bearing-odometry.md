# Robot using free spin of bearings to calculate motion

- **URL:** https://grok.com/c/1042fd37-4836-43f4-86c8-c3ac75b0a140
- **Date:** Oct 5
- **Curation note:** Kept, but this is robotics-leaning. Included because the chat states real mechanics relations (rolling odometry, rotational dynamics with friction, a prediction residual). Reviewer may prefer to reject it as robotics design.

## User messages (verbatim)

1. `Maybe the robot can use free spin of bearings to calculate motion`

## Grok

A free-spinning bearing is a usable motion sensor. Treat it as an unloaded integrator, not a drive element.

**Idler / freewheel odometry.** One bearing is not driven; it rolls with the ground or a trailing link. An encoder on that shaft counts revolutions. Distance and speed:

$$s = 2\pi r N, \qquad v = 2\pi r \dot{N}$$

where $r$ is the rolling radius and $N$ is revolutions. Like a fifth-wheel or mouse ball, the free bearing reports what the body actually did.

**Coast memory.** Clutch the bearing off the motor for a short window and let it freewheel. Friction bleeds its spin rate:

$$I\dot{\omega} = -\tau_f(\omega)$$

If $\tau_f$ is known (Coulomb plus viscous, calibrated once), the decay curve reconstructs the speed at release. Compare that free-spin reading with the driven-side encoder; the difference is slip, impact, or a bad prediction.

**Predict-then-correct.** Predict the free-spin rate expected if the last motion command was right; sample the bearing to get $\omega_{\text{measured}}$. Residual:

$$e = \omega_{\text{predicted}} - \omega_{\text{free}}$$

Correct the hypothesis from $e$, not from motor current alone (current lies when the wheel skates).

Practical limits: $r$ changes with load and tire squash, so it needs slow calibration; bearing drag sets a floor (below a few rad/s the count stalls); counts per revolution must be fine enough that one tick is smaller than the correction needed; the free bearing is not a gyro (a flywheel on a gimbal is for rotation).

Minimal loop: command, predict free-spin, sample the idler encoder, correct odometry and the next command from the residual.
