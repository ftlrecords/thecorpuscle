---
title: Engram — Conditional Memory via Scalable Lookup
description: Notes on DeepSeek’s Engram paper introducing conditional memory as a new sparsity axis for large language models.
---

# Overview

**Paper:** *Conditional Memory via Scalable Lookup: A New Axis of Sparsity for Large Language Models*  
**Authors:** Xin Cheng, Wangding Zeng, Damai Dai, Qinyu Chen, et al.  
**Source:** arXiv, Jan 12, 2026 :contentReference[oaicite:1]{index=1}

The core idea of this work is to introduce **conditional memory** — a new architectural primitive for large language models that provides efficient, constant-time retrieval of static or semi-static patterns (e.g., repeated phrases, common facts) using a lookup mechanism called **Engram**. This contrasts with existing models that must *compute* all knowledge through neural layers. :contentReference[oaicite:2]{index=2}

---

# Motivation

Transformers and Mixture-of-Experts (MoE) models scale model capacity via conditional computation. However:

- Transformers **lack a native primitive for efficient memory lookup**  
- Static or repetitive knowledge (e.g., frequent n-gram patterns) is re-derived via feed-forward and attention layers, *wasting compute*  
- This leads to inefficiencies and suboptimal allocation of neural resources :contentReference[oaicite:3]{index=3}

The authors propose that separating *computation* from *memory retrieval* can improve performance across multiple tasks while keeping efficiency high. :contentReference[oaicite:4]{index=4}

---

# Key Contributions

1. **Conditional Memory as a New Sparsity Axis**  
   Introduces conditional memory alongside conditional computation (MoE), expanding the model’s ability to specialize tasks with fewer resources. :contentReference[oaicite:5]{index=5}

2. **Engram Module**  
   A contemporary take on N-gram embeddings that enables **O(1) lookup** — constant time retrieval of stored pattern embeddings. :contentReference[oaicite:6]{index=6}

3. **Sparsity Allocation Problem**  
   Formalizes how to distribute capacity between Engram memory and MoE computation, revealing a **U-shaped scaling law** that dictates optimal trade-offs. :contentReference[oaicite:7]{index=7}

4. **Empirical Results**  
   The Engram-augmented model (27B parameters) outperforms iso-parameter and iso-FLOPs MoE baselines in benchmarks for knowledge, reasoning, code, and math. :contentReference[oaicite:8]{index=8}

---

# Engram Architecture (Intuition)

The Engram module works by:

1. **Retrieving static embeddings** with constant-time lookup from an N-gram table  
2. **Gating these embeddings** with context from the main model stack  
3. **Fusing them** with current representations to provide memory biases without heavy computation :contentReference[oaicite:9]{index=9}

This resembles giving a model a structured *memory index* it can query directly, rather than forcing it to relearn common patterns repeatedly. :contentReference[oaicite:10]{index=10}

**Why this matters:**  
Static patterns (like common phrases, entities, or frequent structures) can be stored once and retrieved cheaply — just like how a CPU uses cache — leaving neural layers free to focus on dynamic reasoning. :contentReference[oaicite:11]{index=11}

---

# Sparsity Allocation & Scaling Laws

One of the core theoretical insights of the paper is that there is a **U-shaped trade-off** between allocating model capacity to:

- **Conditional computation** (e.g., MoE experts)
- **Conditional memory** (Engram embedding tables)

Allocating too much to either extreme reduces performance.  
The optimal balance yields **better overall efficiency** and performance across tasks. :contentReference[oaicite:12]{index=12}

---

# Benchmark Findings

Compared to iso-parameter and iso-FLOPs MoE models, Engram-augmented models achieve gains across diverse domains:

- **Knowledge:** MMLU +3.4, CMMLU +4.0  
- **Reasoning:** BBH +5.0, ARC-Challenge +3.7  
- **Code/Math:** HumanEval +3.0, MATH +2.4  
- **Long-Context Retrieval:** Multi-Query NIAH improved from 84.2 → 97.0 :contentReference[oaicite:13]{index=13}

These results suggest that augmenting memory explicitly helps both *static retrieval* and *dynamic reasoning*. :contentReference[oaicite:14]{index=14}

---

# Mechanistic Insights

Mechanistic analysis reveals two key effects:

1. **Reduced Reconstruction Burden**  
   Engram takes over static pattern reconstruction, freeing early layers of the backbone network to compute deeper reasoning features. :contentReference[oaicite:15]{index=15}

2. **Better Attention Allocation**  
   With Engram handling local memory, attention capacity focuses more on **global context** and long sequences. :contentReference[oaicite:16]{index=16}

This structural decoupling resembles splitting **memory and processing** — similar to cache hierarchies in computer architecture.

---

# Efficiency & Systems Observations

Unlike MoE’s dynamic routing (which requires runtime computation to choose experts), Engram uses deterministic lookup addressing, which enables:

- **Runtime prefetching from host memory**
- Offline memory table sharding
- Very low overhead in inference (< ~3% reported) :contentReference[oaicite:17]{index=17}

This makes Engram not only a modeling idea but a **systems-aware architecture** that can exploit hardware caches and memory hierarchies. :contentReference[oaicite:18]{index=18}

---

# Intuition + Critique

**Why this feels important:**  
Transformers treat knowledge and reasoning as the same problem. Engram says: *they’re not*.  
Static knowledge benefits from lookup; reasoning benefits from computation.

This separation is conceptually similar to how physical memory (RAM/cache) and CPU compute are distinct yet complementary.

**Open questions / caveats:**

- How well do Engram tables generalize outside frequent N-gram patterns?  
- Scaling beyond 27B to 100B+ regimes  
- Interaction with retrieval-augmented systems or retrieval memory

These remain avenues for further exploration.

---

# Conclusion

Engram establishes a **new axis of sparsity** — conditional memory — that complements neural computation in large models. It introduces efficient memory lookup primitives, better allocates model capacity, and demonstrates tangible improvements across reasoning, knowledge, code, and long-context tasks. :contentReference[oaicite:19]{index=19}

---

# References

- *Conditional Memory via Scalable Lookup: A New Axis of Sparsity for Large Language Models*, Cheng et al., 2026 (arXiv:2601.07372) :contentReference[oaicite:20]{index=20}
- DeepSeek Engram explainer (Medium) :contentReference[oaicite:21]{index=21}
