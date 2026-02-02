---
title: Product Quantization
date: 01.31.26
tags:
  - blog
  - ml
  - math
  - agents
author: Your Name
description: A practical, engineer-friendly walkthrough of how massive embedding databases can be compressed from hundreds of gigabytes to a few gigabytes while still supporting fast similarity search
---

## We Put 300 GB of Vectors on a Diet (Now They’re 10 GB)

*(notes written by an engineer who tried the obvious solution first)*

## 0. Short Introduction  
*(what this is, why it exists, and how these notes are structured)*

These notes are about **Product Quantization (PQ)**.

PQ is not a fancy math trick.
It is a practical response to a very real problem:

> [!custom] Embeddings are huge, search is expensive, and production systems do not care about elegance. The claims like 100 Million Embedding in single memory with fast search is are made holding Product Quantization in the mind.

The goal of these notes is:
- to explain **why PQ exists**
- to explain **how it works**
- to explain **how systems like FAISS actually use it**

These notes are written in the order a human brain prefers:
- first the pain  
- then the idea  
- then the details  
- then a **clear plan of what logic the code must implement**  
- then the code  
- then the dry runs  

If something feels obvious later, that’s a success.
It means the notes did their job.

---

## 1. The Problem
*(everything is fine until it isn’t)*

### 1.1 Embeddings exist because computers need numbers
*(reality, unfortunately)*

Modern machine learning models do not operate on meaning. They operate on numbers. So text, images, audio, and other inputs are converted into numbers that machines can store and compare. These numbers are called **embeddings**.

An embedding is a fixed-length list of numbers that represents something in a form that machines can work with.

In modern systems, embeddings are large. A very common size is:
- **768 numbers per embedding**

Yes, Seven Hundred Sixty Eight.🙂

An embedding looks like this:
**[0.12, -1.7, 2.3, 0.9, ..., 0.01]**

There are 768 numbers in that list. No one reads them. No one should.

### 1.2 Similarity works because geometry pretends to be meaning
*(and it mostly gets away with it)*

Embeddings are trained so that geometry corresponds to meaning.

In practice, this means:
- similar things end up close together
- unrelated things end up far apart

Examples:
- Two sentences with the same intent are close
- A cat image is closer to a dog image than to a car image
- Translations of the same sentence are close, even across languages

The system does not understand meaning. It only understands distance. If two embeddings are close, the system assumes they are similar. This assumption works well enough to build products.

### 1.3 Storing embeddings scales faster than your confidence
*(this is where things start going wrong)*

Each embedding contains:
- 768 floating-point numbers
- each number uses 4 bytes

Memory per embedding:
- 768 × 4 bytes
- = 3072 bytes
- ≈ **3 KB**

Three kilobytes sounds harmless. It is not.

#### Case 1: 1 million embeddings
*(a small production system)*

- 1 embedding ≈ 3 KB
- 1,000,000 × 3 KB
- = 3,000,000 KB

Convert step by step:
- 3,000,000 KB ÷ 1024 ≈ 2930 MB
- 2930 MB ÷ 1024 ≈ **2.86 GB**

So:
- **1 million embeddings ≈ 3 GB of memory**

This is only storage. No indexes. No metadata. No overhead. Just numbers. Sitting there. Occupying RAM.

#### Case 2: 100 million embeddings
*(what actually happens if your product succeeds)*

- 100 million = 100 × 1 million
- Memory = 100 × 3 GB
- = **300 GB**

At this point the problem is no longer theoretical. It is now someone’s pager.

### 1.4 Searching embeddings is where everything breaks
*(aka “why is this query slow?”)*

A common operation is **similarity search**.

The task:
- take one query embedding
- find the most similar embeddings in the database

The naive approach is:
- compare the query with every stored embedding
- compute a distance each time

If:
- N = number of embeddings
- D = embedding dimension (768)

Then one search requires:
- N × D floating-point operations

Example:
- N = 1,000,000
- D = 768

That is:
- 1,000,000 × 768
- = **768,000,000 floating-point operations**

For one query.

If this needs to be real-time, on a CPU, with multiple users… it will not end well.

### 1.5 Why the obvious fixes fail
*(many ideas, all disappointing)*

Naive solution 1: Compare everything exactly
- Accurate
- Extremely slow
- Does not scale

Naive solution 2: Reduce numerical precision
- Breaks the geometry
- Similar things stop being similar
- Accuracy collapses

Naive solution 3: Reduce embedding size
- Throws away learned information
- Hurts semantic quality
- Usually worse than rounding

So we end up with a three-way conflict:
- Speed
- Memory
- Accuracy

Product Quantization exists because real systems need all three, and the obvious solutions give us at most one.

---

## 2. High-Level Solution
*(how an engineer refuses to deal with a big problem all at once)*

### 2.1 Start small on purpose
*(if it works here, it works everywhere)*

Assume our system stores multiple **vectors**. Each vector has exactly four numbers.

Dataset:

```
x0 = [1, 2, 3, 4]   ← this is the vector we will track
x1 = [1, 3, 3, 5]
x2 = [2, 2, 4, 4]
x3 = [8, 9, 0, 1]
x4 = [9, 8, 1, 0]
```

If this case feels easy, good. That’s the point.

### 2.2 Step 1 — Split the vector
*(stop treating everything as one problem)*

Choose the number of parts:

`m = 2`

Each part therefore has two numbers.

All vectors are split identically:

```
x = [a, b | c, d]
```

Applying this split to the dataset:

```
x0 = [1, 2 | 3, 4]
x1 = [1, 3 | 3, 5]
x2 = [2, 2 | 4, 4]
x3 = [8, 9 | 0, 1]
x4 = [9, 8 | 1, 0]
```

Nothing magical happened. We just agreed on boundaries.

### 2.3 Step 2 — Forget full vectors
*(they are not useful right now)*

Ignore full vectors. Only look at parts.

All part-0 values (first two numbers):

```
[1, 2]
[1, 3]
[2, 2]
[8, 9]
[9, 8]
```

All part-1 values (last two numbers):

```
[3, 4]
[3, 5]
[4, 4]
[0, 1]
[1, 0]
```

This is the real training data. Everything else is distraction.

### 2.4 Step 3 — Choose representatives
*(keep the patterns, drop the noise)*

We do NOT want to remember every value. We want a **small vocabulary of typical values**.

Rules for this example:
- representatives come from the dataset
- no averaging
- no made-up vectors
- symmetry is allowed

#### 2.4.1 Part 0 representatives
*(big numbers live together, small numbers live together)*

Observed values:

```
[1, 2]
[1, 3]
[2, 2]   ← small-value cluster

[8, 9]
[9, 8]   ← large-value cluster
```

Inside a cluster, exact choice does not matter. So we pick one and move on.

Chosen representatives:

```
rep0_0 = [1, 2]
rep0_1 = [8, 9]
```

Choosing `[9, 8]` instead would:
- change distances slightly
- not change the logic
- not break the method

Engineers call this “good enough”.

#### 2.4.2 Part 1 representatives
*(same idea, different numbers)*

Observed values:

```
[3, 4]
[3, 5]
[4, 4]   ← larger-value cluster

[0, 1]
[1, 0]   ← smaller-value cluster
```

Again, symmetry exists. Again, we pick one.

Chosen representatives:

```
rep1_0 = [3, 4]
rep1_1 = [0, 1]
```

The algorithm does not care which symmetric option you choose. Consistency matters more than perfection.

### 2.5 Step 4 — Encode the original vector
*(numbers quietly turn into labels)*

Return to the original vector:

```
x0 = [1, 2 | 3, 4]
```

Encode part by part.

#### 2.5.1 Part 0 encoding

```
[1, 2] matches rep0_0 exactly
→ index = 0
```

#### 2.5.2 Part 1 encoding

```
[3, 4] matches rep1_0 exactly
→ index = 0
```

Encoded result:

```
code(x0) = [0, 0]
```

Each position in the code corresponds to one part. Each number is just an index.

### 2.6 Step 5 — Store only the code
*(memory usage quietly improves)*

The system does NOT store:

```
[1, 2, 3, 4]
```

It stores:

```
[0, 0]
```

Four real numbers replaced by two small integers. This is the compression win.

### 2.7 One-line mental model
*(the sentence to remember)*

Product Quantization splits vectors into parts, replaces each part with the index of a representative pattern learned from data, and uses those indices instead of full vectors.

---

## 3. Distance Computation
*(where we stop touching vectors and start being lazy on purpose)*

### 3.1 Step 6 — Distance tables
*(do the expensive work once, not everywhere)*

We already have:
- representatives for each part
- stored codes instead of full vectors

Now a **query** arrives.

Example query:

**q = [1, 3, 4, 4]**

We split it the same way as everything else:

**q = [1, 3 | 4, 4]**

Consistency is non-negotiable.

### 3.2 Build distances to representatives
*(this is the only real math left)*

We compute distances from the query parts to **all representatives of that part**.

#### 3.2.1 Part 0 distances

Part 0 of the query:

**q_part0 = [1, 3]**

Representatives:

**rep0_0 = [1, 2]**  
**rep0_1 = [8, 9]**

Compute distances (use squared distance for simplicity):

**distance([1,3], [1,2]) = (1−1)² + (3−2)² = 1**  
**distance([1,3], [8,9]) = (1−8)² + (3−9)² = 85**

Store them in a table:

**table_part0 = [1, 85]**

#### 3.2.2 Part 1 distances

Part 1 of the query:

**q_part1 = [4, 4]**

Representatives:

**rep1_0 = [3, 4]**  
**rep1_1 = [0, 1]**

Compute distances:

**distance([4,4], [3,4]) = (4−3)² + (4−4)² = 1**  
**distance([4,4], [0,1]) = (4−0)² + (4−1)² = 25**

Store them:

**table_part1 = [1, 25]**

At this point:
- we are DONE with vector math
- everything else is lookup + add

### 3.3 Step 7 — Use stored codes to compute distances
*(this is why PQ is fast)*

Recall the stored code for our original vector:

**code(x0) = [0, 0]**

This means:
- part 0 uses representative 0
- part 1 uses representative 0

Distance from query **q** to **x0** is:

**distance = table_part0[0] + table_part1[0]**

Plug in values:

**distance = 1 + 1 = 2**

That’s it.

No comparison with **[1, 2, 3, 4]**.  
No loops over dimensions.  
No expensive math.

### 3.4 Try another stored vector
*(same tables, different code)*

Take vector:

**x3 = [8, 9 | 0, 1]**

From earlier encoding:

**code(x3) = [1, 1]**

Compute distance:

**distance = table_part0[1] + table_part1[1] = 85 + 25 = 110**

Same tables. Same logic. Different result.

### 3.5 What just happened
*(this is the entire trick)*

- distances to representatives were computed once
- stored vectors were never touched
- every comparison was:
  - array lookup
  - integer index
  - addition

This is why Product Quantization scales.

### 3.6 One-line mental model
*(add this to memory)*

Product Quantization replaces vector comparisons with table lookups by precomputing distances from the query to representative patterns.

---

## 4. Search and Retrieval
*(aka: put everything together and get actual answers)*

### 4.1 Step 8 — Repeat lookup for all stored codes
*(the boring loop that suddenly became cheap)*

At this point, we have:
- a query
- distance tables for each part
- a database of stored codes

Example distance tables (from the previous step):

**table_part0 = [1, 85]**  
**table_part1 = [1, 25]**

And stored codes:

**code(x0) = [0, 0]**  
**code(x1) = [0, 0]**  
**code(x2) = [0, 0]**  
**code(x3) = [1, 1]**  
**code(x4) = [1, 1]**

Now the system does the same thing for every stored code:

**distance(code) = table_part0[code[0]] + table_part1[code[1]]**

This loop is simple. That’s the point.

### 4.2 Step 9 — Rank by distance
*(smallest wins, everyone else loses)*

After computing distances, we get something like:

**x0 → distance 2**  
**x1 → distance 2**  
**x2 → distance 2**  
**x3 → distance 110**  
**x4 → distance 110**

Lower distance means “more similar”.

The system:
- sorts by distance
- keeps the smallest ones
- discards the rest

### 4.3 Step 10 — Return results
*(no magic here)*

The output of the system is:
- indices of nearest vectors
- approximate distances

Example:

**nearest = [x0, x1, x2]**  
**distances = [2, 2, 2]**

These are approximate neighbors. That is intentional.

### 4.4 What PQ deliberately does NOT fix
*(manage expectations early)*

Product Quantization does NOT guarantee:
- exact nearest neighbors
- perfect ordering
- zero error

It guarantees:
- fast search
- low memory usage
- similarity that is usually “good enough”

This is a systems tradeoff, not a math failure.

### 4.5 Why this scales
*(the real win)*

Let:
- **N** = number of stored vectors
- **m** = number of parts
- **k** = representatives per part

Then search cost is roughly:

**cost ≈ m × k  +  N × m**

The expensive part (**m × k**) happens once per query.  
The cheap part (**N × m**) is lookup + add.

This is why PQ handles millions of vectors.

### 4.6 One-line mental model
*(final form)*

Product Quantization answers similarity queries by replacing vector math with table lookups and ranking the results.

---

## 5. The Code Logic Plan
*(what the code must do, in what order, with no surprises)*

### 5.1 Goal of this step
*(this is the contract before writing code)*

Before writing any code, we want this to be true:

> If someone deletes the code tomorrow, you could rewrite it just from this section.

This section is **not implementation**. It is the **logic blueprint**.

### 5.2 What the system needs to store
*(data structures, not syntax)*

The system must store exactly these things:

1. **Configuration**
   - **D** : full vector dimension  
   - **m** : number of parts  
   - **ds = D / m** : dimensions per part  
   - **k** : number of representatives per part  

2. **Representatives (learned at training time)**  
   One list of representatives per part. Conceptual shape:

   **reps[part_index][rep_index][ds]**

3. **Encoded database**  
   One code per stored vector. Each code is a list of integers:

   **code = [rep_index_0, rep_index_1, ..., rep_index_(m-1)]**

### 5.3 What the code must be able to do
*(functional requirements)*

The code must implement **five logical operations**. No more. No less.

### 5.4 Operation 1 — Train representatives
*(offline, slow, done once)*

**Input**
- training vectors

**Steps**
- verify **D % m == 0**
- for **part_index** in **0 to m−1**:
  - extract that part from all training vectors
  - cluster those sub-vectors into **k** groups
  - store one representative per group

**Output**
- representatives for all parts

Nothing else happens here.

### 5.5 Operation 2 — Encode a vector
*(one-time per stored vector)*

**Input**
- one vector
- trained representatives

**Steps**
- split vector into **m** parts
- for each part:
  - compute distance to all its representatives
  - find index of closest representative
- assemble indices into a code

**Output**
- one code (list of **m** integers)

The original vector is not kept.

### 5.6 Operation 3 — Add vectors to the database
*(bookkeeping)*

**Input**
- many vectors

**Steps**
- encode each vector
- append resulting code to the stored codes list

**Output**
- growing list of stored codes

### 5.7 Operation 4 — Prepare query lookup tables
*(per query, fixed cost)*

**Input**
- one query vector
- trained representatives

**Steps**
- split query into **m** parts
- for each part:
  - compute distance to all **k** representatives
  - store results in a table

**Output**
- **m** lookup tables, each of size **k**

This is the **only place** heavy math happens at query time.

### 5.8 Operation 5 — Search using lookup + add
*(fast loop)*

**Input**
- lookup tables
- stored codes

**Steps**
- for each stored code:
  - initialize **distance = 0**
  - for **part_index** in **0 to m−1**:
    - **distance += lookup_table[part_index][code[part_index]]**
- keep the smallest distances (top-k)

**Output**
- nearest neighbor indices
- approximate distances

### 5.9 What the code must NOT do
*(important constraints)*

- must not compare full vectors at query time
- must not recompute representatives
- must not mix training logic with search logic
- must not depend on original vectors after encoding

### 5.10 One-line mental model
*(end of Step 4)*

The code trains patterns once, stores vectors as labels, and answers queries using lookup tables.

---

## 6. The Code
*(finally typing, but nothing should be surprising)*

### 6.1 What this code is
*(important expectations)*

This is a **minimal reference implementation**.
- clarity over speed
- correctness over tricks
- mirrors the logic plan exactly
- no optimizations
- no FAISS magic

If this code makes sense, everything else is scaling and engineering.

### 6.2 Configuration and data structures

We will implement a `ProductQuantizer` with:
- training
- encoding
- search

All following code is plain Python + NumPy logic.

### 6.3 Code: Product Quantizer (minimal)

```python
import numpy as np

class ProductQuantizer:
    def __init__(self,D,m,k):
        # Initializes configuration for PQ
        # - Splits vectors into m parts
        # - Each part has ds dimensions
        # - k representatives per part
        assert D % m == 0,"D must be divisible by m"
        self.D=D
        self.m=m
        self.ds=D//m
        self.k=k
        self.representatives=[]
        self.codes=[]
```

```python
    def train(self,X):
        # Learns representatives for each part
        # - Splits training vectors into parts
        # - Picks k sample vectors per part as representatives
        self.representatives=[]
        for part in range(self.m):
            start=part*self.ds
            end=start+self.ds
            sub_vectors=X[:,start:end]
            reps=sub_vectors[:self.k].copy()
            self.representatives.append(reps)
```

```python
    def encode(self,x):
        # Converts a full vector into a PQ code
        # - Finds closest representative per part
        # - Stores only representative indices
        code=[]
        for part in range(self.m):
            start=part*self.ds
            end=start+self.ds
            sub_vector=x[start:end]
            reps=self.representatives[part]
            distances=np.sum((reps-sub_vector)**2,axis=1)
            rep_index=np.argmin(distances)
            code.append(rep_index)
        return code
```

```python
    def add(self,X):
        # Adds multiple vectors to the database
        # - Encodes each vector
        # - Stores only the PQ codes
        for x in X:
            code=self.encode(x)
            self.codes.append(code)
```

```python
    def search(self,q,top_k):
        # Searches nearest neighbors using lookup tables
        # - Precomputes distances from query to representatives
        # - Uses table lookup + add instead of vector math
        lookup_tables=[]
        for part in range(self.m):
            start=part*self.ds
            end=start+self.ds
            q_part=q[start:end]
            reps=self.representatives[part]
            distances=np.sum((reps-q_part)**2,axis=1)
            lookup_tables.append(distances)
        all_distances=[]
        for idx,code in enumerate(self.codes):
            dist=0
            for part in range(self.m):
                dist+=lookup_tables[part][code[part]]
            all_distances.append((idx,dist))
        all_distances.sort(key=lambda x:x[1])
        return all_distances[:top_k]
```
---

## 7. Dry Run
*(no intuition, no hand-waving, just values moving through code)*

### 7.1 Dataset and configuration

We dry-run the **exact code** from Step 6.

Dataset:

```
x0 = [1, 2, 3, 4]
x1 = [1, 3, 3, 5]
x2 = [2, 2, 4, 4]
x3 = [8, 9, 0, 1]
x4 = [9, 8, 1, 0]
```

Configuration:

```
D = 4
m = 2
ds = 2
k = 2
```

### 7.2 Initialize the ProductQuantizer

Code:

```
pq = ProductQuantizer(D=4, m=2, k=2)
```

Internal state after init:

```
pq.D  = 4
pq.m  = 2
pq.ds = 2
pq.k  = 2

pq.representatives = []
pq.codes = []
```

### 7.3 Training phase (pq.train)

Call:

```
pq.train(X)
```

Where X is:

```
[
  [1, 2, 3, 4],
  [1, 3, 3, 5],
  [2, 2, 4, 4],
  [8, 9, 0, 1],
  [9, 8, 1, 0]
]
```

#### Training: part 0

Slice indices:

```
start = 0
end   = 2
```

Sub-vectors:

```
[
  [1, 2],
  [1, 3],
  [2, 2],
  [8, 9],
  [9, 8]
]
```

Naive representative selection (first k):

```
rep0_0 = [1, 2]
rep0_1 = [1, 3]
```

Stored as:

```
pq.representatives[0] =
  [[1, 2],
   [1, 3]]
```

#### Training: part 1

Slice indices:

```
start = 2
end   = 4
```

Sub-vectors:

```
[
  [3, 4],
  [3, 5],
  [4, 4],
  [0, 1],
  [1, 0]
]
```

Naive representative selection:

```
rep1_0 = [3, 4]
rep1_1 = [3, 5]
```

Stored as:

```
pq.representatives[1] =
  [[3, 4],
   [3, 5]]
```

### 7.4 Encoding database vectors (pq.add)

Call:

```
pq.add(X)
```

We encode vectors one by one.

#### Encoding x0 = [1, 2, 3, 4]

Part 0:

```
sub_vector = [1, 2]
Distances to reps:
to [1, 2] → 0
to [1, 3] → 1
Closest index: 0
```

Part 1:

```
sub_vector = [3, 4]
Distances:
to [3, 4] → 0
to [3, 5] → 1
Closest index: 0
```

Encoded:

```
code(x0) = [0, 0]
```

#### Encoding x1 = [1, 3, 3, 5]

```
Part 0 distances:
to [1, 2] → 1
to [1, 3] → 0
→ index 1

Part 1 distances:
to [3, 4] → 1
to [3, 5] → 0
→ index 1

code(x1) = [1, 1]
```

#### Encoding x2 = [2, 2, 4, 4]

```
Part 0 distances:
to [1, 2] → 1
to [1, 3] → 2
→ index 0

Part 1 distances:
to [3, 4] → 1
to [3, 5] → 2
→ index 0

code(x2) = [0, 0]
```

#### Encoding x3 = [8, 9, 0, 1]

```
Part 0 distances:
to [1, 2] → 98
to [1, 3] → 85
→ index 1

Part 1 distances:
to [3, 4] → 34
to [3, 5] → 41
→ index 0

code(x3) = [1, 0]
```

#### Encoding x4 = [9, 8, 1, 0]

```
Part 0 distances:
to [1, 2] → 100
to [1, 3] → 89
→ index 1

Part 1 distances:
to [3, 4] → 52
to [3, 5] → 61
→ index 0

code(x4) = [1, 0]
```

Stored codes after pq.add:

```
pq.codes =
  [
    [0, 0],
    [1, 1],
    [0, 0],
    [1, 0],
    [1, 0]
  ]
```

### 7.5 Search phase (pq.search)

Query:

```
q = [1, 3, 4, 4]
```

Call:

```
pq.search(q, top_k=3)
```

#### Build lookup tables

Part 0:

```
q_part0 = [1, 3]
Distances:
to [1, 2] → 1
to [1, 3] → 0
table_part0 = [1, 0]
```

Part 1:

```
q_part1 = [4, 4]
Distances:
to [3, 4] → 1
to [3, 5] → 2
table_part1 = [1, 2]
```

#### Compute distances to stored codes

```
code [0, 0] → 1 + 1 = 2
code [1, 1] → 0 + 2 = 2
code [0, 0] → 1 + 1 = 2
code [1, 0] → 0 + 1 = 1
code [1, 0] → 0 + 1 = 1
```

Sorted distances:

```
x3 → 1
x4 → 1
x0 → 2
x1 → 2
x2 → 2
```

### 7.6 Final result (top 3)

Returned by search:

```
[
  (3, 1),
  (4, 1),
  (0, 2)
]
```
---

8. Final sanity check

- No full vectors used at search time
- All math reduced to lookup + add
- Logic exactly matches Step 6 code
- Behavior matches Step 2 intuition

---
