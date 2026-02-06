---
title: "Chapter 1 — Charge Carriers & Doping"
date: 02.04.26
tags:
  - electronics
  - semiconductors
  - physics
  - fundamentals
author: Your Name
description: Introduction to charge carriers in semiconductors, intrinsic vs doped materials, and how electrons and holes are created and controlled.
---

# Chapter 1 — How Charges Move in Semiconductors  
*"Because before we build magic devices, we need to know how the tiny workers behave."*

Welcome to the physics backstage of electronics.

Before diodes, before transistors, before amplifiers…  
we need to answer one giant question:

> **How does electric current actually flow inside a semiconductor?**

Metals are easy — tons of free electrons.  
Semiconductors? Way more dramatic.

This chapter sets up the **big questions** that the next chapters will slowly solve.

---

## 1.1 The Big Questions (The Mystery Begins)

Throughout the first few lectures, we are trying to answer **four core questions**:

1. **Where do charge carriers in semiconductors come from?**  
2. **What kinds of charge carriers exist?**  
3. **How can we control how many carriers are present?**  
4. **How do these carriers actually move to create current?**

This chapter answers the first three and *starts* the fourth.

---

## 1.2 From Atoms to Materials  
*"Zooming in until we see electrons doing social networking."*

Every material is made of atoms.  
Every atom has:

- A **nucleus**
- **Electrons in shells**

The outermost electrons are called **valence electrons**.  
These are the ones that decide how atoms bond.

Silicon has **four valence electrons**.  
This is perfect for forming **four covalent bonds** with neighboring atoms.

In a silicon crystal:

- Each atom shares one electron with four neighbors  
- Bonds form a stable **lattice**

At absolute zero → all electrons are locked in bonds → **no current**

But at room temperature… things get spicy 🌶️

---

## 1.3 Thermal Generation of Carriers  
*"Bonds break. Chaos (and current) begins."*

Thermal energy can break a covalent bond.

When that happens:

- One **free electron** is released
- One **hole** (missing electron) is left behind

They are created **as a pair**.

So in pure silicon, we always have:

$$
n = p = n_i
$$

Where $n_i$ is the **intrinsic carrier concentration**.

At room temperature:

$$
n_i \approx 10^{10}\ \text{cm}^{-3}
$$

But the number of silicon atoms is:

$$
\approx 5 \times 10^{22}\ \text{cm}^{-3}
$$

So only **1 in a trillion atoms** gives us a free carrier.  
That’s why pure silicon is a **terrible conductor**.

---

## 1.4 Meet the Two Carriers  
*"Electron and Hole — the odd couple of semiconductor physics."*

### Electrons 🧲  
Real particles, negative charge, move through the lattice.

### Holes 🕳️  
Not real particles — but behave like positive charges.

A hole moves when a nearby electron jumps into it, leaving another hole behind.

Electrons move like sports cars.  
Holes move like traffic in a construction zone.

---

## 1.5 First Big Control Knob: Doping  
*"Add one impurity, get millions of carriers. Science is unfair."*

We increase conductivity by **adding impurity atoms**.

### n-type Doping (Donors)

Example: Phosphorus (5 valence electrons)

One extra electron becomes free.

If donor concentration is $N_D$:

$$
n \approx N_D
$$
$$
p = \frac{n_i^2}{N_D}
$$

Electrons = **majority carriers**  
Holes = **minority carriers**

---

### p-type Doping (Acceptors)

Example: Boron (3 valence electrons)

One bond is missing an electron → hole created.

If acceptor concentration is $N_A$:

$$
p \approx N_A
$$
$$
n = \frac{n_i^2}{N_A}
$$

Holes = **majority carriers**  
Electrons = **minority carriers**

---

## 1.6 Now the Critical Question  
*"Okay genius, carriers exist… but how do they MOVE?"*

Current is **movement of charge**.

So now we must understand:

> What makes carriers move inside a semiconductor?

There are **two mechanisms**.  
Both are always trying to do their thing.

---

# 1.7 Mechanism 1 — Drift  
*"When an electric field says: MOVE."*

If we apply a voltage, we create an electric field $E$.

Force on a charge:

$$
F = qE
$$

Carriers accelerate… but constantly collide with atoms.

So instead of accelerating forever, they reach a steady average speed called **drift velocity**:

$$
v = \mu E
$$

Where $\mu$ is **mobility**.

Mobility tells us how easily a carrier moves.

| Carrier | Mobility |
|--------|----------|
| Electrons | $\mu_n \approx 1350\ \text{cm}^2/\text{V·s}$ |
| Holes | $\mu_p \approx 480\ \text{cm}^2/\text{V·s}$ |

Electrons are much more mobile.

---

### Drift Current Density

Total current due to drift:

$$
J_{\text{drift}} = q(n\mu_n + p\mu_p)E
$$

More carriers → more current  
Higher mobility → more current  
Stronger field → more current

This is basically the microscopic origin of **Ohm’s law**.

---

# 1.8 Mechanism 2 — Diffusion  
*"No voltage. Still moving. Because nature hates crowding."*

Even with **no electric field**, carriers move if their concentration is uneven.

Carriers naturally move:

> From high concentration → to low concentration

Just like perfume spreading in a room.

---

### Electron Diffusion Current

$$
J_n = qD_n \frac{dn}{dx}
$$

### Hole Diffusion Current

$$
J_p = -qD_p \frac{dp}{dx}
$$

Total diffusion current:

$$
J_{\text{diff}} = qD_n \frac{dn}{dx} - qD_p \frac{dp}{dx}
$$

---

### Diffusivity Values

| Carrier | Diffusivity |
|--------|-------------|
| $D_n$ | $\approx 34\ \text{cm}^2/\text{s}$ |
| $D_p$ | $\approx 12\ \text{cm}^2/\text{s}$ |

Diffusion can happen **without voltage**.  
That’s the first big mind-bender of semiconductor physics.

---

## 1.9 Drift vs Diffusion — The Two Forces of Nature

Drift = carriers pushed by electric field  
Diffusion = carriers spreading due to concentration gradient

They often **fight each other**.

And when they exactly cancel…

👀 something VERY important happens (coming in PN junction).

---

## 1.10 Einstein Relation — The Plot Twist

Mobility and diffusivity seem unrelated… but:

$$
\frac{D}{\mu} = \frac{kT}{q}
$$

Define thermal voltage:

$$
V_T = \frac{kT}{q} \approx 26\ \text{mV at 300K}
$$

This tiny voltage appears **everywhere** in device equations.

---

## 1.11 Final Equation of Carrier Transport

Both mechanisms together:

$$
J = q(n\mu_n + p\mu_p)E + qD_n\frac{dn}{dx} - qD_p\frac{dp}{dx}
$$

This single equation is the **engine of all semiconductor devices**.

---

## 1.12 What We Have Accomplished

We now know:

✔ Where carriers come from  
✔ Two types of carriers  
✔ How doping changes carrier density  
✔ How carriers move (drift + diffusion)

Next, we take p-type and n-type materials… stick them together…

…and watch physics try to fix the mess.

That device is called a **PN junction**.
