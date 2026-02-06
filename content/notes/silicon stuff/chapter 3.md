---
title: "Chapter 3 — Carrier Transport: Diffusion & PN Junction Formation"
date: 02.04.26
tags:
  - electronics
  - semiconductors
  - diffusion
  - pn-junction
author: Your Name
description: How concentration gradients cause diffusion current and how joining p-type and n-type materials creates the depletion region and built-in electric field.
---

# Chapter 3 — Diffusion & The Birth of the PN Junction  
*"Current without voltage?! Physics is getting rebellious."*

We now continue the journey of **carrier transport**, and once that’s complete, we finally build our **first real semiconductor device**:

> 🎉 **The PN Junction**

But first — we finish the second transport mechanism.

---

## 3.1 Quick Recap — Where We Left Off

Last time we learned:

### Why Pure Silicon is Weak Sauce
Pure silicon has:
$$
n_i \approx 10^{10} \text{ carriers/cm}^3
$$
Very small → poor conductivity.

### How We Fixed That (Doping)

| Type | Dopant | Majority Carrier | Approx. Density |
|------|--------|------------------|-----------------|
| n-type | Donor (Phosphorus) | Electrons | $n \approx N_D$ |
| p-type | Acceptor (Boron) | Holes | $p \approx N_A$ |

And always:
$$
np = n_i^2
$$

---

### Drift Transport (Already Covered)

Apply a voltage → create electric field $E$

Carriers reach **terminal velocity**:
$$
v = \mu E
$$

Current density from drift:
$$
J_{\text{drift}} = q(n\mu_n + p\mu_p)E
$$

That was **transport mechanism #1**.

Now comes the weird one.

---

# 3.2 Diffusion — Current Without Voltage  
*"Charges don’t like crowds. They spread out."*

We can have **current even if no electric field exists**.

That happens when there is a **concentration gradient**.

### Real-World Analogy: Ink in Water

Drop ink into water → ink spreads out.

Why?

Because molecules move from **high concentration → low concentration**.

That process is called:

> **Diffusion**

---

## 3.3 Diffusion in Semiconductors

If we inject electrons at one point in a semiconductor:

- Near injection → high electron concentration  
- Far away → low concentration  

Electrons naturally **move down the concentration gradient**.

This motion of charge = **current**.

---

## 3.4 Diffusion Current Equation

We expect diffusion current to depend on the **slope** of carrier concentration.

For electrons:
$$
J_n = q D_n \frac{dn}{dx}
$$

For holes:
$$
J_p = -q D_p \frac{dp}{dx}
$$

Total diffusion current:
$$
J_{\text{diff}} = q D_n \frac{dn}{dx} - q D_p \frac{dp}{dx}
$$

Where:

| Symbol | Meaning |
|--------|---------|
| $D_n$ | Electron diffusivity |
| $D_p$ | Hole diffusivity |

Typical values:
- $D_n \approx 34\ \text{cm}^2/\text{s}$
- $D_p \approx 12\ \text{cm}^2/\text{s}$

---

## 3.5 Understanding the Sign of $dn/dx$

Suppose electron concentration decreases with distance:

```
n(x)
↑
|\
| \
|  \
|   \____
+------------→ x
```

Then:
$$
\frac{dn}{dx} < 0
$$

So:
$$
J_n = q D_n \frac{dn}{dx}
$$
is negative → electrons flow in +x direction.

No extra negative sign is needed — the math already accounts for electron charge direction.

---

## 3.6 What If Diffusion Current Changes With Distance?

If diffusion current decreases as we move away from injection:

That means electrons are **disappearing**.

They don’t vanish magically.

They are **recombining with holes**.

So:

> Decreasing diffusion current → **recombination is happening**

---

### Case 1 — With Recombination

- Current decreases with distance  
- Carrier concentration curve is curved

### Case 2 — No Recombination

If there are almost no holes:

- Injected electrons cannot recombine  
- Current must stay constant

So concentration becomes a **straight line** (constant slope).

---

## 3.7 Drift vs Diffusion

| Mechanism | Cause | Equation |
|-----------|------|----------|
| Drift | Electric field | $J = q(n\mu_n + p\mu_p)E$ |
| Diffusion | Concentration gradient | $J = qD_n \frac{dn}{dx} - qD_p \frac{dp}{dx}$ |

Both can exist **simultaneously**.

---

## 3.8 Einstein Relation (Important!)

Mobility and diffusivity are related:

$$
\frac{D}{\mu} = \frac{kT}{q}
$$

Where:
- $k$ = Boltzmann constant  
- $T$ = temperature (Kelvin)  
- $q$ = electron charge  

At room temperature:

$$
\frac{kT}{q} \approx 26 \text{ mV}
$$

This is called the **thermal voltage**.

---

# 3.9 We Now Build a Device — The PN Junction  
*"Let’s stick P and N together and watch the chaos."*

A **PN junction** is made by joining:

- p-type semiconductor  
- n-type semiconductor  

It is a **two-terminal device** → called a **diode**.

Used in:
- Chargers  
- Adapters  
- Voltage multipliers  
- Power supplies  

---

## 3.10 Strange Experiment

### Case 1 — Just N-Type Material

Apply voltage → behaves like resistor:

$$
I = \frac{V}{R}
$$

Straight line I–V curve.

---

### Case 2 — PN Junction

Apply voltage → current behaves VERY differently:

- Positive voltage → current increases exponentially  
- Negative voltage → almost no current  

This is **not Ohm’s law**.

We must understand why.

---

# 3.11 Two Big Questions

### Question 1  
**When P and N are joined, how do carriers redistribute?**

### Question 2  
How does the PN junction behave under:

1. Equilibrium  
2. Reverse bias  
3. Forward bias  

Today we start with **equilibrium**.

---

# 3.12 Carrier Concentrations Before Contact

### In n-type material:

$$
n_n \approx N_D, \quad p_n = \frac{n_i^2}{N_D}
$$

### In p-type material:

$$
p_p \approx N_A, \quad n_p = \frac{n_i^2}{N_A}
$$

(Subscripts indicate the region.)

---

## 3.13 Charge Neutrality Reminder

Even though n-type has many electrons:

**Net charge = 0**

Positive ion cores balance negative electrons.

If we REMOVE an electron → a **positive ion** is left behind.

This becomes crucial next.

---

# 3.14 Forming the PN Junction (Equilibrium)

We join p-type and n-type into one crystal.

Initially:

- Electrons high on N side  
- Holes high on P side  

Nature says:

> "Let’s diffuse."

Electrons diffuse **N → P**  
Holes diffuse **P → N**

---

## 3.15 What Happens When They Leave?

When an electron leaves N side → a **positive ion** is left.

When a hole leaves P side → an electron fills it, leaving a **negative ion**.

So near the junction:

| Side | Ions Left Behind |
|------|------------------|
| N side | Positive ions |
| P side | Negative ions |

This creates a **space charge region**.

---

## 3.16 Electric Field Forms

Positive ions on left, negative ions on right → electric field forms.

Direction: **from N side to P side**

This field:

- Pushes holes back to P side  
- Pushes electrons back to N side  

So diffusion is opposed by drift due to electric field.

Eventually:

> Diffusion current = Drift current

That condition is called **equilibrium**.

---

## 3.17 Depletion Region

The region near the junction now has:

- No free carriers  
- Only immobile ions  

This region is called:

> **Depletion Region**  
(depleted of mobile charge)

---

Next, we will **quantify equilibrium** and calculate the **built-in potential** of the PN junction.
