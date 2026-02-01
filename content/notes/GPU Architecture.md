---
title: GPU Architecture — Memory, Compute, and How Parallel Machines Think
description: Detailed notes on GPU architecture covering compute units, memory hierarchy, execution model, and why GPUs are built for massive parallel math.
---

# Big Picture

A GPU (Graphics Processing Unit) is built for one thing:

**Do the same kind of math on a *lot* of data at the same time.**

CPU = few very smart workers  
GPU = thousands of fast math workers

GPUs optimize for:
- Throughput
- Parallelism
- Memory bandwidth

---

# Core Design Idea — SIMT

GPUs follow **SIMT** (Single Instruction, Multiple Threads).

Many threads  
→ execute  
the same instruction  
→ on different data

Perfect for math like:

$$
\mathbf{Y} = \mathbf{XW}
$$

(Matrix multiplications everywhere.)

---

# High-Level GPU Structure

A modern GPU is made of repeating compute blocks called **Streaming Multiprocessors (SMs)**.

```
GPU
 ├── SM 0
 ├── SM 1
 ├── SM 2
 ├── ...
 └── SM N
```

Each SM is a mini parallel processor.

---

# What’s Inside an SM

Each **SM** contains:

- CUDA cores (basic math ALUs)
- Tensor cores (matrix multiply accelerators)
- Load/Store units
- Registers
- Shared memory
- Warp schedulers

This is where actual computation happens.

---

# Execution Model

Threads are organized hierarchically:

Threads → Warps → Blocks → Grid

- **Thread**: smallest unit of execution  
- **Warp**: 32 threads executing the same instruction  
- **Block**: group of threads that can share memory  
- **Grid**: all blocks launched by a kernel  

A **kernel** is a function run on the GPU.

---

# Warp Execution

A warp executes one instruction at a time.

If threads diverge:

```
if (condition) do A else do B
```

Both paths must run serially → **warp divergence** (slow).

GPUs like uniform control flow.

---

# Memory Hierarchy (Critical for Performance)

Fast → Slow:

### Registers
- Per-thread
- Fastest memory

### Shared Memory
- Shared by threads in a block
- On-chip
- Very fast

### L1 / L2 Cache
- Hardware-managed
- Caches global memory

### Global Memory (VRAM)
- Large but high latency

### Host Memory (CPU RAM)
- Accessed over PCIe
- Very slow compared to on-GPU memory

---

# Memory Coalescing

When a warp loads memory:

Good pattern:
```
A[0], A[1], A[2], ..., A[31]
```
→ One efficient memory transaction

Bad pattern:
```
A[0], A[999], A[17], A[5021]...
```
→ Many transactions → slow

This is **memory coalescing**.

---

# Arithmetic Units

### CUDA Cores

General math:

$$
a = b + c
$$

### Tensor Cores

Specialized for matrix multiply-accumulate:

$$
D = A \times B + C
$$

Used heavily in deep learning.

---

# Latency Hiding

GPUs don’t reduce memory latency.

They **hide** it.

If one warp waits for memory:
→ scheduler runs another warp

Massive parallelism keeps hardware busy.

---

# Compute vs Memory Bound

Performance depends on:

$$
\text{Performance} = \min(\text{Compute Capacity}, \text{Memory Bandwidth})
$$

Lots of math per byte → compute bound  
Lots of data, little math → memory bound

This is the **Roofline Model** idea.

---

# Shared Memory & Tiling

Threads in a block can load data once into shared memory and reuse it.

Example: Matrix multiply

Instead of reloading matrix rows from global memory:
1. Load tile into shared memory  
2. All threads reuse it  
3. Fewer global memory accesses  

Big speedup.

---

# GPU vs CPU

| Feature | CPU | GPU |
|--------|-----|-----|
| Cores | Few | Thousands |
| Goal | Low latency | High throughput |
| Best at | Branching logic | Linear algebra |
| Memory | Big caches | High bandwidth |
| Parallelism | Limited | Massive |

---

# GPUs in Deep Learning

GPUs are perfect for:

- Matrix multiplication
- Convolutions
- Attention

Example:

$$
\text{Attention}(Q,K,V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d}}\right)V
$$

Every operation here is massively parallel.

---

# Final Mental Model

A GPU is:

Thousands of tiny math workers  
Each with a small notebook (registers)  
Sharing a whiteboard (shared memory)  
All pulling data from a big storage room (global memory)

Performance comes from:
- Keeping workers busy
- Feeding them data efficiently
- Avoiding memory traffic jams

---

# Key Takeaways

- GPUs = parallel math engines
- SMs are the compute blocks
- Memory hierarchy determines speed
- Tensor cores accelerate deep learning math
- Good GPU programming = smart data movement
