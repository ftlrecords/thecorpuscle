---
title: "Chapter 4 — PN Junction in Equilibrium & Reverse Bias"
date: 02.04.26
tags:
  - electronics
  - pn-junction
  - diodes
  - capacitance
author: Your Name
description: Mathematical derivation of the built-in potential, equilibrium behavior of the PN junction, and how reverse bias turns the junction into a voltage-controlled capacitor (varactor).
---

# Chapter 4 — Quantifying Equilibrium & Reverse Bias Magic  
*"The junction builds its own voltage… and then becomes a voltage-controlled capacitor."*

Today we continue studying the **PN junction**, focusing on:

1. **Equilibrium behavior (math time 🧮)**
2. **Reverse bias operation**
3. **A real application: electronically controlled capacitance**

---

## 4.1 Quick Recap — Two Transport Mechanisms

We previously learned that current in semiconductors flows by:

### Drift (needs electric field)
$$
J_{\text{drift}} = q(n\mu_n + p\mu_p)E
$$

### Diffusion (needs concentration gradient)
$$
J_{\text{diff}} = qD_n \frac{dn}{dx} - qD_p \frac{dp}{dx}
$$

Both can exist at the same time.

---

## 4.2 Recap — What Happened When We Formed the PN Junction

Before contact:

- **N-side**  
  $$ n_n \approx N_D, \quad p_n = \frac{n_i^2}{N_D} $$

- **P-side**  
  $$ p_p \approx N_A, \quad n_p = \frac{n_i^2}{N_A} $$

After contact:

- Electrons diffuse **N → P**
- Holes diffuse **P → N**

This leaves behind:

| Region | Ions Left |
|--------|-----------|
| Near N side of junction | Positive donor ions |
| Near P side of junction | Negative acceptor ions |

This creates the **depletion region** and an **electric field**.

---

## 4.3 When Does Diffusion Stop? (Equilibrium Condition)

Even though diffusion starts the motion, it cannot continue forever.

Why?

Because the ions left behind create an **electric field**, and that field causes **drift current in the opposite direction**.

At equilibrium:

> Diffusion current = Drift current (for both electrons and holes)

---

### 4.3.1 Equating Hole Currents

Diffusion current of holes:
$$
J_{p,\text{diff}} = q D_p \frac{dp}{dx}
$$

Drift current of holes:
$$
J_{p,\text{drift}} = q \mu_p p E
$$

At equilibrium:
$$
q D_p \frac{dp}{dx} = q \mu_p p E
$$

Cancel $q$:
$$
D_p \frac{dp}{dx} = \mu_p p E
$$

Rearrange:
$$
\frac{dp}{p} = \frac{\mu_p}{D_p} E\,dx
$$

---

## 4.4 Integrating Across the Depletion Region

We integrate from:

- $x_1$ = edge of depletion region on N side  
- $x_2$ = edge of depletion region on P side  

Hole concentrations at edges:

- At $x_1$:  
  $$ p(x_1) = p_n = \frac{n_i^2}{N_D} $$

- At $x_2$:  
  $$ p(x_2) = p_p = N_A $$

Integrate:
$$
\int_{p_n}^{p_p} \frac{dp}{p} = \frac{\mu_p}{D_p} \int_{x_1}^{x_2} E\,dx
$$

Left side:
$$
\ln\!\left(\frac{p_p}{p_n}\right)
$$

Right side uses:
$$
V(b) - V(a) = -\int_a^b E\,dx
$$

So:
$$
\int_{x_1}^{x_2} E\,dx = V(x_1) - V(x_2)
$$

Define built-in potential:
$$
V_0 = V(x_1) - V(x_2)
$$

Thus:
$$
\ln\!\left(\frac{p_p}{p_n}\right) = \frac{\mu_p}{D_p} V_0
$$

---

## 4.5 Using Einstein Relation

Einstein relation:
$$
\frac{D_p}{\mu_p} = \frac{kT}{q}
\quad\Rightarrow\quad
\frac{\mu_p}{D_p} = \frac{q}{kT}
$$

So:
$$
\ln\!\left(\frac{p_p}{p_n}\right) = \frac{q}{kT} V_0
$$

Substitute:
$$
p_p = N_A, \quad p_n = \frac{n_i^2}{N_D}
$$

\[
\ln\!\left(\frac{N_A}{n_i^2/N_D}\right) = \frac{qV_0}{kT}
\]

\[
\ln\!\left(\frac{N_A N_D}{n_i^2}\right) = \frac{qV_0}{kT}
\]

---

## 4.6 Built-In Potential

\[
\boxed{
V_0 = \frac{kT}{q} \ln\!\left(\frac{N_A N_D}{n_i^2}\right)
}
\]

This is the **built-in voltage** of the PN junction.

At room temperature:
$$
\frac{kT}{q} \approx 26\ \text{mV}
$$

Typical doping:
$$
N_A \sim N_D \sim 10^{16}\ \text{cm}^{-3}, \quad n_i \sim 10^{10}
$$

\[
V_0 \approx 0.7 \text{ to } 0.8\ \text{V}
\]

---

## 4.7 Where Does This Voltage Exist?

Important:

- Electric field exists **only inside the depletion region**
- Outside, material is **charge neutral**

Using Gauss’s law → no net charge outside → no electric field

So:

> Built-in voltage is localized **only across the depletion region**

---

## 4.8 Why Can’t We Measure $V_0$ With a Voltmeter?

Because when we attach metal leads:

- We form **metal–semiconductor junctions**
- Those create their own built-in voltages
- These cancel the PN junction built-in voltage

Result: **External measurement = 0 V**

Sneaky physics.

---

# 4.9 Reverse Bias Operation  
*"Now we poke the junction from the outside."*

Reverse bias means:

- Positive terminal → N side  
- Negative terminal → P side  

This increases the internal electric field.

---

## 4.10 What Happens Physically?

Battery pulls:

- Electrons away from N side  
- Holes away from P side  

So:

> Depletion region **widens**

Almost no current flows (only tiny leakage).

---

# 4.11 The PN Junction Becomes a Capacitor

Look at structure:

- Neutral N region → conductive plate  
- Neutral P region → conductive plate  
- Depletion region → insulator

So the junction behaves like a **capacitor**.

Capacitance:
$$
C = \frac{\varepsilon A}{W}
$$

Where $W$ = depletion width.

Under reverse bias:
- $W$ increases  
- $C$ decreases

---

## 4.12 Junction Capacitance Formula

\[
\boxed{
C_J = \frac{C_{J0}}{\sqrt{1 + \dfrac{V_R}{V_0}}}
}
\]

Where:

- $C_{J0}$ = capacitance at zero bias  
- $V_R$ = reverse bias voltage  
- $V_0$ = built-in voltage  

As $|V_R|$ increases → $C_J$ decreases.

---

# 4.13 This Device Has a Name

A reverse-biased PN junction used as a variable capacitor is called a:

> **Varactor (or Varicap)**

It is an **electronically controlled capacitor**.

---

# 4.14 Why Is This Useful? (Bluetooth Connection)

Bluetooth transmitters use a **voltage-controlled oscillator (VCO)**.

Oscillator frequency depends on capacitance.

If capacitance changes with control voltage → frequency changes.

So inside the oscillator:

- A **varactor diode** changes capacitance  
- Control voltage (data) → changes capacitance  
- Capacitance change → changes oscillation frequency  

That produces **frequency modulation (FM)** around 2.4 GHz.

---

## 4.15 Summary of This Lecture

We learned:

✔ Built-in potential of PN junction  
✔ Electric field exists only in depletion region  
✔ Reverse bias widens depletion region  
✔ Junction acts like a capacitor  
✔ Capacitance depends on applied voltage  
✔ Reverse-biased diode = **varactor**  
✔ Used in RF oscillators like Bluetooth transmitters  

---

Next: **Forward Bias — when the diode finally conducts heavily and becomes extremely useful.**
