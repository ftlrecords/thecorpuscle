---
title: MHC- Manifold Hyperconnections
date: 01.31.26
tags:
  - blog
  - ml
  - math
  - agents
author: Your Name
description: A geometric framework for modeling AI agent identity as trajectories over manifolds connected through higher-order hyperedges.
---

# Part 1 — Residual Connections (The Foundation of Deep Stability)

Residual connections solved the fundamental training problem of deep neural networks: **unstable gradients**.  
To understand why they matter, we first examine deep networks *before* residual connections.

## 1.1 Deep Networks Before Residuals

Originally, deep networks stacked transformations like this:

$$
x_{l+1} = F(x_l, W_l)
$$

Each layer completely transforms its input. Stacking $L$ layers gives:

$$
x_L = F_L(F_{L-1}(\dots F_1(x_0)\dots))
$$

### Gradient Problem

During backpropagation, gradients follow the chain rule:

$$
\frac{\partial x_L}{\partial x_0} = \prod_{i=1}^{L} \frac{\partial F_i}{\partial x_{i-1}}
$$

This is a **product of many matrices**.

If the average magnitude of these derivatives is:
- Less than 1 → gradients shrink exponentially (**vanishing gradients**)  
- Greater than 1 → gradients grow exponentially (**exploding gradients**)  

As network depth increases, training becomes unstable or impossible.

## 1.2 Residual Connection Formulation

Residual Networks changed the update rule to:

$$
x_{l+1} = x_l + F(x_l, W_l)
$$

Instead of replacing the representation, each layer adds a **correction** to the existing signal.

## 1.3 Identity Mapping Property

If the residual function learns zero:

$$
F(x_l, W_l) = 0
$$

Then:

$$
x_{l+1} = x_l
$$

This means the network can easily represent the **identity function**, allowing information to pass unchanged through many layers.

## 1.4 Gradient Behavior with Residuals

Let

$$
J_l = \frac{\partial F(x_l, W_l)}{\partial x_l}
$$

Then the layer Jacobian becomes:

$$
\frac{\partial x_{l+1}}{\partial x_l} = I + J_l
$$

Across many layers:

$$
\frac{\partial x_L}{\partial x_0} = \prod_{i=1}^{L} (I + J_i)
$$

Now gradients are products of matrices **close to the identity**, instead of arbitrary matrices.  
Eigenvalues remain closer to 1, greatly improving training stability.

## 1.5 Channel Interpretation

Each representation is a vector with **C channels**:

$$
x_l \in \mathbb{R}^C
$$

A **channel** is one feature dimension. Residual connections operate on a **single stream** of width $C$.

## 1.6 Structural Limitation

Residual layers only allow:

$$
x_{l+1} = x_l + \text{change}
$$

They do **not** allow:
- Splitting the stream into multiple parallel paths  
- Routing information between separate streams  
- Reorganizing channels across independent residual pathways  

All information must flow through one narrow residual stream.

## 1.7 Summary of Residual Connections

**Strength:** Stable training via identity mapping and well-behaved gradients.  
**Limitation:** Expressivity is restricted because the architecture only supports additive refinement within a single stream.

This limitation motivates the next step: **Hyper-Connections**, which expand the residual stream into multiple interacting streams.

---

# Part 2 — Hyper-Connections (HC): More Expressivity, New Instability

Residual connections gave us **stability**, but they restrict information to flow through a **single stream** of width $C$.  
Hyper-Connections (HC) were introduced to increase the **expressive power** of residual architectures by allowing multiple interacting streams.

## 2.1 Expanding the Residual Stream

Instead of a single vector:

$$
x_l \in \mathbb{R}^C
$$

HC uses multiple parallel streams:

$$
x_l \in \mathbb{R}^{n \times C}
$$

This means:
- There are $n$ residual streams  
- Each stream has $C$ channels  
- The model can maintain multiple evolving feature pathways

---

## 2.2 Learnable Routing Between Streams

HC introduces three learnable mappings to manage interactions.

### (1) Pre-Mapping

$$
H_l^{\text{pre}} \in \mathbb{R}^{1 \times n}
$$

This matrix **reads from all $n$ streams** and produces a single aggregated input for the layer transformation.

### (2) Post-Mapping

$$
H_l^{\text{post}} \in \mathbb{R}^{1 \times n}
$$

This matrix **writes the layer output back** into the $n$ streams.

### (3) Residual Mixing

$$
H_l^{\text{res}} \in \mathbb{R}^{n \times n}
$$

This matrix mixes information **between streams** inside the residual pathway.

---

## 2.3 HC Forward Pass

The layer update becomes:

$$
x_{l+1} = H_l^{\text{res}} x_l + H_l^{\text{post}^\top} F(H_l^{\text{pre}} x_l, W_l)
$$

Step-by-step:
1. **Read streams:** $z_l = H_l^{\text{pre}} x_l$  
2. **Transform:** $y_l = F(z_l, W_l)$  
3. **Write back:** $H_l^{\text{post}^\top} y_l$  
4. **Mix old streams:** $H_l^{\text{res}} x_l$

HC allows information to **move sideways across streams**, not just forward through depth.

---

## 2.4 Why HC Improves Expressivity

Standard residuals allow only:

$$
x_{l+1} = x_l + \text{correction}
$$

HC allows:

$$
\text{Each stream}_{l+1} = \sum_j (\text{mixing of streams}_l^j) + \text{new information}
$$

This enables:
- Specialized streams  
- Cross-stream communication  
- Richer representational structure  

Performance improves in practice.

---

## 2.5 The Stability Problem Appears

Stacking many HC layers yields:

$$
x_L = \left(\prod_{i=l}^{L-1} H_i^{\text{res}}\right) x_l + \sum \text{transformed terms}
$$

The key term is:

$$
\prod_{i} H_i^{\text{res}}
$$

In residual networks:

$$
H^{\text{res}} = I
$$

so the product is still identity.

In HC, $H^{\text{res}}$ is **unconstrained**.

---

## 2.6 Why Unconstrained Mixing Is Dangerous

If matrices are unconstrained:
- They can amplify signals  
- They can suppress signals  
- Eigenvalues can grow or shrink exponentially  

Repeated multiplication leads to:

$$
\left\| \prod H_i^{\text{res}} \right\| \gg 1 \quad \text{or} \quad \ll 1
$$

Empirically, signal gain reached **thousands**, instead of staying near 1.

This causes:
- Exploding activations  
- Vanishing gradients  
- Training instability at scale  

---

## 2.7 Root Cause

Residual stability depended on the identity mapping:

$$
x_{l+1} = x_l + \text{small change}
$$

HC replaces identity with a **learned linear transformation**:

$$
x_{l+1} = H^{\text{res}} x_l + \dots
$$

If $H^{\text{res}} \neq I$ and is unconstrained, the identity path is lost.  
The network can no longer guarantee stable signal propagation.

---

## 2.8 Summary of Hyper-Connections

**Advantage:**  
Multiple streams and learnable routing increase expressive power.

**Problem:**  
Unconstrained stream mixing destroys the identity mapping property, leading to signal explosion or decay across depth.

This motivates the next step: **Manifold-Constrained Hyper-Connections (mHC)**, which restore stability while keeping cross-stream routing.

---

# Part 3 — Manifold-Constrained Hyper-Connections (mHC): Stability Through Geometry

Hyper-Connections introduced multiple streams and learnable routing, but lost the **identity mapping stability** of residual networks.  
Manifold-Constrained Hyper-Connections (mHC) fix this by restricting the mixing matrices to a **geometrically safe set**.

---

## 3.1 The Core Idea of mHC

HC allowed arbitrary mixing:

$$
x_{l+1} = H_l^{\text{res}} x_l + H_l^{\text{post}^\top} F(H_l^{\text{pre}} x_l, W_l)
$$

mHC keeps the same structure but **constrains** the matrices so that signal magnitude cannot explode or vanish.

Main rule:

**Streams may mix, but cannot amplify total signal energy.**

---

## 3.2 Constraining the Residual Mixing Matrix

mHC forces:

$$
H_l^{\text{res}} \text{ is doubly stochastic}
$$

This means:

1. All entries are non-negative  
   $$
   H_{ij} \ge 0
   $$

2. Each row sums to 1  
   $$
   H_l^{\text{res}} \mathbf{1} = \mathbf{1}
   $$

3. Each column sums to 1  
   $$
   \mathbf{1}^\top H_l^{\text{res}} = \mathbf{1}^\top
   $$

where $\mathbf{1}$ is a vector of all ones.

---

## 3.3 Intuition: Convex Mixing

Each new stream becomes a **weighted average** of old streams:

$$
\text{new stream}_i = \sum_j H_{ij} \cdot \text{old stream}_j
$$

Because weights are non-negative and sum to 1:
- No stream can grow in magnitude uncontrollably  
- No stream can be inverted or destroyed  

The operation is **pure mixing**, not amplification.

---

## 3.4 Stability Across Depth

Stacking layers gives:

$$
x_L = \left(\prod_{i=l}^{L-1} H_i^{\text{res}}\right) x_l + \dots
$$

Key property:

**The product of doubly stochastic matrices is still doubly stochastic.**

Therefore:

- Row sums stay 1  
- Column sums stay 1  
- Signal magnitude remains bounded  

This restores the stable behavior that residual connections had.

---

## 3.5 Identity Mapping Is Still Possible

The identity matrix:

$$
I =
\begin{bmatrix}
1 & 0 & \dots & 0 \\
0 & 1 & \dots & 0 \\
\vdots & & \ddots & \vdots \\
0 & 0 & \dots & 1
\end{bmatrix}
$$

is doubly stochastic.

So mHC contains standard residual connections as a **special case**.

---

## 3.6 Constraining Pre and Post Mappings

mHC also stabilizes the read/write matrices:

$$
H_l^{\text{pre}} = \sigma(\tilde{H}_l^{\text{pre}})
$$

$$
H_l^{\text{post}} = 2 \cdot \sigma(\tilde{H}_l^{\text{post}})
$$

where $\sigma$ is the sigmoid function.

This ensures:
- All entries are non-negative  
- No destructive positive/negative cancellation  

---

## 3.7 Projecting Onto the Manifold (Sinkhorn-Knopp)

To make a matrix doubly stochastic, mHC uses iterative normalization.

Start with a positive matrix:

$$
M^{(0)} = \exp(\tilde{H}_l^{\text{res}})
$$

Then alternate row and column normalization:

$$
M^{(t)} = T_r(T_c(M^{(t-1)}))
$$

After several iterations, $M^{(t)}$ converges to a doubly stochastic matrix.

This process projects the matrix onto the **Birkhoff polytope**.

---

## 3.8 Geometric Interpretation

The set of all doubly stochastic matrices forms the **Birkhoff polytope**.

Important facts:
- Vertices are permutation matrices  
- Any doubly stochastic matrix is a convex combination of permutations  

So mHC performs **soft permutations** of streams while preserving total signal.

---

## 3.9 mHC Forward Pass

Given $x_l \in \mathbb{R}^{n \times C}$:

1. Compute constrained mappings $H_l^{\text{pre}}, H_l^{\text{post}}, H_l^{\text{res}}$
2. Aggregate streams:
   $$
   z_l = H_l^{\text{pre}} x_l
   $$
3. Apply transformation:
   $$
   y_l = F(z_l, W_l)
   $$
4. Update streams:
   $$
   x_{l+1} = H_l^{\text{res}} x_l + H_l^{\text{post}^\top} y_l
   $$

---

## 3.10 Final Summary

Residual Connections:
Stable but limited to one stream.

Hyper-Connections:
Multiple streams and routing, but unstable due to unconstrained mixing.

Manifold-Constrained Hyper-Connections:
Multiple streams **with mixing restricted to convex combinations**, restoring stability while preserving expressive power.

---

# Numeric Dry Run — Residual vs HC vs mHC

We use a tiny example so every step is visible.

Let:
- Number of channels per stream: C = 1  
- Number of streams (for HC/mHC): n = 2  

So each "vector" is just simple numbers.

---

### 1. Residual Connection (Single Stream)

Start with:

$$
x_l = 10
$$

Let the layer compute:

$$
F(x_l) = 2
$$

Residual update:

$$
x_{l+1} = x_l + F(x_l) = 10 + 2 = 12
$$

Next layer, suppose:

$$
F(x_{l+1}) = 3
$$

Then:

$$
x_{l+2} = 12 + 3 = 15
$$

Notice:
- The original signal is always preserved
- Changes are small additions
- No explosion

---

### 2. Hyper-Connections (HC) — Unconstrained Mixing

Now we use **2 streams**:

$$
x_l =
\begin{bmatrix}
10 \\
20
\end{bmatrix}
$$

Assume:

$$
H^{pre} = [0.5 \quad 0.5]
$$

So the layer input is the average:

$$
z_l = H^{pre} x_l = 0.5(10) + 0.5(20) = 15
$$

Let:

$$
F(z_l) = 4
$$

Let post-mapping write equally:

$$
H^{post} =
\begin{bmatrix}
1 \\
1
\end{bmatrix}
$$

So new information added to streams is:

$$
H^{post} F(z_l) =
\begin{bmatrix}
4 \\
4
\end{bmatrix}
$$

Now the dangerous part — residual mixing.

Assume HC learns:

$$
H^{res} =
\begin{bmatrix}
2 & 1 \\
1 & 2
\end{bmatrix}
$$

This is **unconstrained**.

Multiply:

$$
H^{res} x_l =
\begin{bmatrix}
2(10) + 1(20) \\
1(10) + 2(20)
\end{bmatrix}
=
\begin{bmatrix}
40 \\
50
\end{bmatrix}
$$

Add new information:

$$
x_{l+1} =
\begin{bmatrix}
40 \\
50
\end{bmatrix}
+
\begin{bmatrix}
4 \\
4
\end{bmatrix}
=
\begin{bmatrix}
44 \\
54
\end{bmatrix}
$$

The streams jumped from (10, 20) → (44, 54).  
Signal **amplified massively**.

Stack another similar layer and values explode further.

This is why HC becomes unstable.

---

### 3. Manifold-Constrained HC (mHC) — Safe Mixing

We start again with:

$$
x_l =
\begin{bmatrix}
10 \\
20
\end{bmatrix}
$$

Use the same read and write:

$$
H^{pre} = [0.5 \quad 0.5], \quad F(z_l) = 4
$$

$$
H^{post} =
\begin{bmatrix}
1 \\
1
\end{bmatrix}
\Rightarrow
H^{post} F(z_l) =
\begin{bmatrix}
4 \\
4
\end{bmatrix}
$$

Now mHC forces:

$$
H^{res} =
\begin{bmatrix}
0.7 & 0.3 \\
0.3 & 0.7
\end{bmatrix}
$$

Check constraints:
- All entries ≥ 0  
- Rows sum to 1  
- Columns sum to 1  

Now mix:

$$
H^{res} x_l =
\begin{bmatrix}
0.7(10) + 0.3(20) \\
0.3(10) + 0.7(20)
\end{bmatrix}
=
\begin{bmatrix}
13 \\
17
\end{bmatrix}
$$

Add new information:

$$
x_{l+1} =
\begin{bmatrix}
13 \\
17
\end{bmatrix}
+
\begin{bmatrix}
4 \\
4
\end{bmatrix}
=
\begin{bmatrix}
17 \\
21
\end{bmatrix}
$$

Compare:

| Method | Result |
|--------|--------|
| Residual | 10 → 12 |
| HC | (10,20) → (44,54) ❌ explosion |
| mHC | (10,20) → (17,21) ✅ stable |

mHC allows **mixing**, but only as **weighted averages**, so values stay controlled.

---

#  Takeaways

Residual: adds small changes, always stable.  
HC: mixes streams freely, can explode.  
mHC: mixes streams **as convex combinations**, keeping stability while allowing cross-stream communication.

--- 

Alright, vibes aside — now we actually understand what’s going on conceptually.

Time to open the math toolbox.  
From here on, numbers have responsibilities.

**⚠️ Math ahead. But don’t worry — we build it step by step.**

---

## SECTION A — Prerequisite Concepts (Intuition First, Math When Needed)

Before we can understand Manifold-Constrained Hyper-Connections, we need to understand **why signal stability matters**, **how matrices change signals**, and **what kind of matrix mixing is safe**.

We will build these ideas step by step.

---

### A1. Why Deep Networks Become Unstable

When we stack many layers, each layer transforms its input:

$$
x_{l+1} = F(x_l)
$$

If we apply many layers, we get:

$$
x_L = F_L(F_{L-1}(\dots F_1(x_0)\dots))
$$

This means the final signal depends on **repeated transformations**.

### Why this is dangerous

During training, gradients flow backward through the same chain of transformations.  
Mathematically:

$$
\frac{\partial x_L}{\partial x_0} = \prod_{i=1}^{L} \frac{\partial F_i}{\partial x_{i-1}}
$$

This is a **product of many matrices**.

If those matrices slightly shrink signals, the product shrinks exponentially → gradients vanish.  
If they slightly amplify signals, the product grows exponentially → gradients explode.

So the core problem of deep learning is:

**Repeated matrix multiplication causes instability.**

---

### A2. How Residual Connections Fix This

Residual networks changed the update rule:

$$
x_{l+1} = x_l + F(x_l)
$$

Now the signal is not replaced — it is *updated*.

If we expand two layers:

$$
x_{l+2} = x_{l+1} + F(x_{l+1}) = x_l + F(x_l) + F(x_{l+1})
$$

The original signal $x_l$ always remains present.

### What this means mathematically

Take derivatives:

$$
\frac{\partial x_{l+1}}{\partial x_l} = I + J_l
$$

where

$$
J_l = \frac{\partial F(x_l)}{\partial x_l}
$$

Instead of multiplying arbitrary matrices, we multiply matrices close to identity:

$$
\prod (I + J_l)
$$

The identity matrix keeps eigenvalues near 1, preventing explosion or vanishing.

**Key insight:** Identity mapping stabilizes deep networks.

---

### A3. When Does a Matrix Amplify a Signal?

Suppose a matrix $H$ acts on a vector $x$:

$$
y = Hx
$$

We want to know: does $H$ increase the signal magnitude?

We measure signal size using the Euclidean norm:

$$
\|x\|_2 = \sqrt{x_1^2 + x_2^2 + \dots}
$$

If:

$$
\|Hx\|_2 > \|x\|_2
$$

then the matrix amplifies the signal.

To avoid instability, we want:

$$
\|H\|_2 \le 1
$$

This guarantees:

$$
\|Hx\|_2 \le \|x\|_2
$$

So repeated multiplication stays bounded.

---

### A4. A Safe Way to Mix Numbers: Convex Combinations

Suppose we mix numbers like this:

$$
y = w_1 x_1 + w_2 x_2 + \dots + w_n x_n
$$

If:

- $w_i \ge 0$
- $\sum w_i = 1$

then $y$ is a **convex combination**.

This guarantees:

$$
\min(x_i) \le y \le \max(x_i)
$$

So mixing cannot create extreme values.

Convex combinations are **naturally stable operations**.

---

### A5. Extending Convex Mixing to Matrices

We now generalize this idea.

Let a matrix $H$ mix elements of a vector:

$$
(Hx)_i = \sum_j H_{ij} x_j
$$

If each row of $H$ contains non-negative weights that sum to 1, then each output element is a convex combination of inputs.

But we also want fairness across inputs, so we also require columns to sum to 1.

This gives the definition of a **doubly stochastic matrix**:

$$
H_{ij} \ge 0
$$

$$
\sum_j H_{ij} = 1
$$

$$
\sum_i H_{ij} = 1
$$

Such matrices mix values without changing total “mass.”

---

### A6. Why Doubly Stochastic Matrices Are Stable

Because rows are convex weights:

$$
(Hx)_i = \sum_j H_{ij} x_j
$$

No output element can exceed the input range.

More formally, these matrices satisfy:

$$
\|H\|_2 \le 1
$$

So:

$$
\|Hx\|_2 \le \|x\|_2
$$

They never amplify signals.

Even better:

If $H_1$ and $H_2$ are doubly stochastic:

$$
H_1 H_2
$$

is also doubly stochastic.

So stability holds across many layers.

---

### A7. The Geometry: The Birkhoff Polytope

All doubly stochastic matrices form a geometric object called the **Birkhoff polytope**.

Important facts:
- The corners are permutation matrices (perfect shuffles)
- Every doubly stochastic matrix is a weighted average of permutations

So these matrices perform **soft shuffling without amplification**.

---

### A8. Sinkhorn Projection: Making Matrices Doubly Stochastic

Neural networks produce unconstrained matrices $\tilde{H}$.  
We need a way to convert them into doubly stochastic matrices.

Step 1: Make entries positive

$$
M^{(0)} = \exp(\tilde{H})
$$

Step 2: Normalize rows and columns repeatedly

Row normalization:
$$
M_{ij} \leftarrow \frac{M_{ij}}{\sum_j M_{ij}}
$$

Column normalization:
$$
M_{ij} \leftarrow \frac{M_{ij}}{\sum_i M_{ij}}
$$

After several iterations:

$$
M^{(t)} \rightarrow H \in \mathcal{B}_n
$$

This algorithm is called **Sinkhorn-Knopp**.  
It projects any matrix onto the set of doubly stochastic matrices.

---

### Section A Summary

We now understand:

• Deep instability comes from repeated matrix multiplication  
• Residual networks are stable because of identity mapping  
• Stability requires matrices that do not amplify signals  
• Convex combinations are naturally stable  
• Doubly stochastic matrices generalize convex mixing to vectors  
• Sinkhorn projection enforces this constraint in neural networks


------------------------------------------------------------

## SECTION B — Deriving mHC Step by Step (Math, but Friendly)


Alright. We’ve built all the tools.  
Now we use them to *derive* Manifold-Constrained Hyper-Connections instead of just accepting them.

We start simple and slowly add complexity.

---

### B1. Step 1 — Start From Residual Connections

We know a stable deep layer looks like:

$$
x_{l+1} = x_l + F(x_l)
$$

Why is this safe? Because the signal $x_l$ always has a direct path forward.

Even if $F(x_l)$ is messy, noisy, or badly trained, the original signal is preserved.

So deep down, stability comes from this idea:

**There is always an identity path.**

---

### B2. Step 2 — We Want More Expressivity

Residual connections are stable, but boring.  
They only allow:

"take what you had and add a correction"

But what if different parts of the representation should evolve differently?

So we say:

Let’s split the representation into multiple streams.

Instead of:

$$
x_l \in \mathbb{R}^C
$$

we use:

$$
x_l \in \mathbb{R}^{n \times C}
$$

Now we have $n$ streams, each with $C$ channels.

You can imagine this like having multiple parallel “thought tracks.”

---

### B3. Step 3 — Let Streams Talk to Each Other

If we have multiple streams, we should let them mix.

So we introduce a mixing matrix:

$$
H_l^{res} \in \mathbb{R}^{n \times n}
$$

and define the residual update as:

$$
x_{l+1}^{(res)} = H_l^{res} x_l
$$

This replaces the identity path with a learned linear transformation.

Sounds powerful. Also sounds slightly dangerous. (Foreshadowing.)

---

### B4. Step 4 — What Happens After Many Layers?

Stack layers:

$$
x_L = \left(\prod_{i=l}^{L-1} H_i^{res}\right) x_l + \dots
$$

Let’s call the big product:

$$
M = \prod_{i=l}^{L-1} H_i^{res}
$$

So the original signal becomes:

$$
x_L^{(res)} = M x_l
$$

Now the question is:

**When does this blow up?**

---

### B5. Step 5 — When Does a Matrix Make Things Explode?

If a matrix stretches vectors, repeated multiplication stretches them more.

Mathematically, if the largest eigenvalue of $H$ is greater than 1, then:

$$
\|H^k x\| \approx \lambda^k \|x\|
$$

which grows exponentially with depth $k$.

So for stability we need:

$$
\|H_l^{res}\|_2 \le 1
$$

That way:

$$
\|H_l^{res} x\|_2 \le \|x\|_2
$$

No explosion.

---

### B6. Step 6 — But We Still Want Mixing

We don’t want $H_l^{res} = I$ all the time. That would just be residuals again.

We want mixing, but **safe mixing**.

What’s a naturally safe mixing operation?

Averages.

If I average numbers, I don’t create extreme values out of nowhere.

---

### B7. Step 7 — Turn “Averaging” Into Math

Suppose we update a stream like this:

$$
x_i^{new} = \sum_j w_{ij} x_j
$$

If:

- $w_{ij} \ge 0$
- $\sum_j w_{ij} = 1$

then $x_i^{new}$ is a convex combination of old streams.

That means it’s just an average — not an amplifier.

---

### B8. Step 8 — Put This Into Matrix Form

The rule above means:

$$
(Hx)_i = \sum_j H_{ij} x_j
$$

with:

$$
H_{ij} \ge 0, \quad \sum_j H_{ij} = 1
$$

This makes each row a convex combination.

But we also want fairness — we don’t want some streams to accumulate more and more weight over time.

So we also require:

$$
\sum_i H_{ij} = 1
$$

Now $H$ is **doubly stochastic**.

---

### B9. Step 9 — Why This Solves Stability

Doubly stochastic matrices have three magic properties:

1. Each output is an average of inputs → no extreme growth  
2. Their largest eigenvalue is 1 → spectral norm ≤ 1  
3. The product of doubly stochastic matrices is still doubly stochastic  

So:

$$
M = \prod H_i^{res}
$$

stays safe no matter how deep the network is.

No explosion. No vanishing. Just controlled mixing.

---

## B10. Step 10 — Identity Is Still Allowed

The identity matrix:

$$
I
$$

is doubly stochastic.

So the model can choose to behave exactly like a residual network if needed.

We didn’t remove the safety mechanism — we generalized it.

---

## B11. Step 11 — Final Form of mHC

We now define:

$$
H_l^{res} \in \mathcal{B}_n
$$

where $\mathcal{B}_n$ is the set of doubly stochastic matrices.

The update becomes:

$$
x_{l+1} = H_l^{res} x_l + H_l^{post^T} F(H_l^{pre} x_l)
$$

This gives:
• Multiple streams  
• Cross-stream communication  
• Guaranteed stability  

---

## B12. And How Do We Enforce This?

Neural nets don’t magically obey constraints.  
So we generate an unconstrained matrix $\tilde{H}$ and project it:

$$
H_l^{res} = \text{Sinkhorn}(\tilde{H}_l^{res})
$$

Sinkhorn normalization forces the matrix onto the doubly stochastic manifold.

So every residual mixing step is guaranteed to be safe.

---

## Final Takeaway

We didn’t randomly choose doubly stochastic matrices.

We derived them by asking:

"What is the most general way to mix streams that does not break residual stability?"

Answer:

**Convex mixing across streams → Doubly stochastic matrices → mHC**
