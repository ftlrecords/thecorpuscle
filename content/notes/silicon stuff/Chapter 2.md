---
title: "Chapter 2 — Carrier Transport: Drift"
date: 02.04.26
tags:
  - electronics
  - semiconductors
  - transport
  - drift
author: Your Name
description: Understanding how electric fields move charge in semiconductors, leading to drift velocity, mobility, and drift current.
---

# Chapter 2 — Doping Deep Dive & The First Transport Mechanism (Drift)  
*"We added carriers. Now let’s make them move."*

In the last chapter we answered:

✔ Where carriers come from  
✔ What electrons and holes are  
✔ Why pure silicon is a bad conductor  

Now we continue answering the **third big question**:

> **How do we MODIFY the number of charge carriers in silicon?**

And then we begin answering the **fourth big question**:

> **How does charge actually move to produce current?**

---

## 2.1 Quick Recap — Intrinsic Silicon

We learned that in pure silicon:

- Thermal energy breaks bonds  
- Each broken bond creates **one electron + one hole**

So:

$$
n = p = n_i
$$

At room temperature:

$$
n_i \approx 10^{10}\ \text{cm}^{-3}
$$

But silicon has about:

$$
10^{22} \text{ to } 10^{23}\ \text{atoms/cm}^3
$$

So only **1 in a trillion atoms** contributes a carrier.

Conclusion:  
Pure silicon has **very high resistance** → not useful for electronics.

So we ask:

> Can we increase the number of free carriers on purpose?

Yes. That process is called **doping**.

---

# 2.2 n-Type Doping — Making Electrons the Boss  
*"Invite atoms with extra electrons. Free carriers = party."*

We add impurity atoms with **5 valence electrons**, like phosphorus.

Inside the silicon crystal:

- 4 electrons form bonds
- 1 electron has nothing to bond with → becomes free

This atom **donates** an electron → called a **donor atom**

If we add $N_D$ donor atoms per cubic centimeter:

$$
n \approx N_D
$$

Why “approximately”? Because intrinsic electrons ($n_i$) are tiny compared to $N_D$:

$$
N_D \sim 10^{15} \text{ to } 10^{17}, \quad n_i \sim 10^{10}
$$

So intrinsic electrons are negligible.

---

### What Happens to Holes?

We know:

$$
np = n_i^2
$$

This remains true **even after doping**.

So if:

$$
n \approx N_D
$$

Then:

$$
p = \frac{n_i^2}{N_D}
$$

Because there are now many electrons, they recombine with holes, reducing hole density.

So in n-type material:

| Carrier | Density | Role |
|--------|--------|------|
| Electrons | $n \approx N_D$ | **Majority carriers** |
| Holes | $p = \frac{n_i^2}{N_D}$ | **Minority carriers** |

---

### Example Calculation

If:

$$
N_D = 10^{15}\ \text{cm}^{-3}
$$

Then:

$$
n \approx 10^{15}
$$

$$
p = \frac{(10^{10})^2}{10^{15}} = 10^{5}
$$

So electrons outnumber holes by **10 billion times**.

---

# 2.3 p-Type Doping — Now Holes Take Over  
*"Remove an electron, create a mobile vacancy."*

We add impurity atoms with **3 valence electrons**, like boron.

Boron cannot complete four bonds → leaves a **missing electron** → a hole.

This atom **accepts** an electron → called an **acceptor atom**

If we add $N_A$ acceptor atoms:

$$
p \approx N_A
$$

Using the same rule:

$$
np = n_i^2
$$

So:

$$
n = \frac{n_i^2}{N_A}
$$

In p-type material:

| Carrier | Density | Role |
|--------|--------|------|
| Holes | $p \approx N_A$ | **Majority carriers** |
| Electrons | $n = \frac{n_i^2}{N_A}$ | **Minority carriers** |

---

# 2.4 Temperature Quiz (Concept Check)

**Question:** What happens to carrier densities in n-type silicon as temperature increases?

- Donor atoms stay the same → $n \approx N_D$ (mostly constant)
- But intrinsic carrier concentration $n_i$ increases strongly with temperature

Since:

$$
p = \frac{n_i^2}{N_D}
$$

Minority carriers (holes) increase rapidly with temperature.

Majority carriers stay roughly constant.

---

# 2.5 Summary of Doping (We Just Solved Question #3)

| Type | Majority Carrier | Minority Carrier | Key Equations |
|------|------------------|------------------|---------------|
| n-type | Electrons | Holes | $n \approx N_D,\ p = n_i^2/N_D$ |
| p-type | Holes | Electrons | $p \approx N_A,\ n = n_i^2/N_A$ |

We now know how to **control conductivity**.

---

# 2.6 The Fourth Big Question Begins  
*"Okay, we have carriers. Now how do they move?"*

Carrier transport has **two mechanisms**:

1. Drift  
2. Diffusion (next chapter)

Today we start with **Drift**.

---

# 2.7 Drift — Motion Due to Electric Field  
*"Voltage pushes. Charges obey."*

Apply a voltage → creates electric field $E$.

Force on charge:

$$
F = qE
$$

Carriers accelerate but collide with atoms → reach **terminal drift velocity**:

$$
v = \mu E
$$

Where:

| Carrier | Mobility |
|--------|----------|
| Electrons | $\mu_n \approx 1350\ \text{cm}^2/\text{V·s}$ |
| Holes | $\mu_p \approx 400\ \text{cm}^2/\text{V·s}$ |

---

# 2.8 From Velocity to Current

Current = charge passing a cross-section per second.

Volume of carriers passing in 1 second:

$$
\text{Volume} = v \times W \times H
$$

Total charge:

$$
Q = vWH \cdot n \cdot q
$$

So current:

$$
I = q n v WH
$$

Substitute $v = \mu E$ and $E = V_B/L$:

$$
I = q n \mu \frac{V_B}{L} WH
$$

So resistance:

$$
R = \frac{V_B}{I} = \frac{L}{q n \mu WH}
$$

Resistivity:

$$
\rho = \frac{1}{q n \mu}
$$

---

# 2.9 Current Density (Preferred Form)

Divide by area:

$$
J_n = q n \mu_n E
$$

For holes:

$$
J_p = q p \mu_p E
$$

Total drift current density:

$$
J = q(n\mu_n + p\mu_p)E
$$

---

## End of Chapter 2  
We now understand **drift current**.

Next comes something shocking:

> Current can exist even with **no voltage applied**.

That mechanism is called **diffusion**.
