# Question patterns

Templates for each round of the ladder. Every pattern gives a template, the **gap signal** to listen for, and the gap type it usually produces (the types are defined in SKILL.md, step 5). Adapt the wording to the topic and to the learner's real cue. Don't use templates word for word.

## Contents
- Quality checks for any question
- A. Backbone
- B. Links
- C. Judgement
- D. Use
- E. Create
- F. Details
- Judging a brain dump
- Worked example: MIPS assembly midterm
- Short example: discrete maths logic

## Quality checks for any question

Before asking, check that the question:
- **Can be answered from long-term memory.** It doesn't quote or paraphrase the learner's notes in a way that gives the answer away.
- **Probes one thing**, except for brain dumps.
- **Has no answer hidden in it.** "Since `la` loads an address, what does `lw` load?" is the answer with extra steps.
- **Uses the real cue.** It is phrased the way the knowledge will be needed (a problem stem, a code snippet, a situation), not the way the textbook heading names it.
- **Asks for recall, not recognition.** Options are only acceptable when the real assessment is multiple choice.
- **Has a rubric in your head**: what a full answer contains, and what each kind of miss would reveal.

## A. Backbone (Bloom 4–5, run first)

**A1. Mind-map brain dump**
> Without your notes: what are the 3–4 biggest chunks of <topic>, and how does each one connect to the others? Arrows and keywords are fine. Full sentences aren't needed.

Gap signals:
- A backbone chunk is missing: **Missing** or **Blind spot**, backbone severity.
- Chunks are listed but not linked, or linked with "relates to": **Unlinked** (an island).
- The structure copies the order of the lecture or textbook: poor order control. Probe with C3.
- A detail is promoted to a chunk, or the chunks are just headings: unintuitive chunking. Probe with C1.

**A2. Teach challenge**
> Explain to a 10-year-old why <topic> exists: what problem it solves. Don't use these words: <2–4 key terms>.

Gap signals:
- They can't get going without the banned terms: the term is memorized, not understood. **Shaky** or **Unlinked**.
- They explain *what* it is but never *why* it matters: **Can't create**-style weakness in importance and purpose.

**A3. Backbone from a cold cue**
> Someone hands you <a realistic artifact: an exam stem, a code file, a case>. Before solving anything, which big ideas from <topic> are in play, and in what order would you reach for them?

Gap signal: they pick the wrong chunks, or can't sequence them: **Can't apply**, backbone severity.

## B. Links (Bloom 2–4)

Aim these at links that were missing or weak in Round A.

**B1. Simple relational** (two ideas)
> How does <A> constrain, cause, or depend on <B>?

Gap signal: they describe A, then describe B, with no mechanism between them: **Unlinked**.

**B2. Multi-relational** (three or more ideas)
> If <A> changes, walk the effect through <B> to <C>.

Gap signal: the chain breaks at one step. Name exactly which step. That step is the gap.

**B3. Discriminating contrast**
> <A> and <B> look alike. What is the one difference that decides which you use?

Gap signal: they list surface differences but not the deciding one: **Wrong** or **Shaky**. This pattern also tests conditional knowledge.

**B4. Why-and-how probe**
> Why does <result> happen? What would have to be different for it not to?

Gap signal: they restate the result, or give a "what" answer to a "why": **Unlinked**.

## C. Judgement (Bloom 5)

**C1. Rank and remove**
> Of <A>, <B> and <C>, which matters most for <goal>? What breaks first if it's removed?

Gap signal: they rank without reasons, or their "what breaks" is wrong: **Wrong** or **Unlinked**, link severity.

**C2. Critique a half-truth**
> A classmate says: "<plausible statement that is half right>." What's right about it, what's wrong, and why does the difference matter?

Gap signal: they accept it whole or reject it whole: **Wrong**. Write the half-truth around a misconception that is actually likely for this topic.

**C3. Alternative structure** (reverse chunking)
> Suppose you reorganized <topic> around <a repeated element or a different axis>. What would the chunks be? Is that structure better or worse than yours, and why?

Gap signal: they can't regroup the material at all. The schema is rigid, memorized in one order: **Unlinked**, backbone severity.

## D. Use (Bloom 3–6)

**D1. Cue-matched scenario**
Present the situation they will actually face, with no topic label. They have to recognize which knowledge applies before they can use it.
> <exam-style stem / code snippet / clinical case / conversation>. What do you do?

Gap signals:
- They recognize the knowledge but can't run it: **Can't apply**.
- They don't recognize which knowledge applies: **Locked**, if a topic hint unlocks it, or **Missing** if it doesn't.

**D2. Integrative challenge**
Combine two or more procedures in a way the material never showed directly.

Gap signal: each part works on its own but the joins fail. The joins are the gap.

**D3. Edge case**
An atypical input, a boundary value, or an unfamiliar context.
> What happens when <input> is <zero / negative / empty / maximum / malformed>?

Gap signal: they apply the standard procedure blindly: **Wrong**. Underneath this is a declarative gap about the principle.

**D4. Variable addition**
Take a problem they just solved and add one constraint that makes sense and still has a solution.
> Same problem, but now <added condition>. What changes, and what stays the same?

Gap signal: they redo everything, or change nothing. Either way, they don't see which parts of the solution depend on which assumptions.

**D5. Predict before computing**
> Before you work it out: as <parameter> goes to <extreme>, what happens to <output>, and why?

Gap signal: the prediction contradicts the result they then compute: **Shaky** or **Wrong**.

## E. Create (Bloom 6)

**E1. Hardest question**
> Write the hardest question you can about <chunk>, one that would catch someone who memorized it without understanding it. Then answer it.

Judge the question first: is it relevant, higher-order, and solvable? Then judge the answer.
- A weak question means **Can't create**: the schema's importance and purpose are unclear.
- A good question with a weak answer means **Can't apply**.

**E2. Make an edge case**
> Invent an input or situation where <procedure or rule> might fail. Does it fail?

Creating an edge case is easier than solving one, so a failure to create one is a strong signal.

## F. Details (Bloom 1–2, last and only when needed)

**F1. Isolated recall**
> What is <term / value / step N>?

**F2. Label or reconstruct**
> List the <n> parts of <process> in order.

Ask these only for details the assessment needs and the earlier rounds didn't already prove. A detail that comes up correctly inside a Round D answer counts as proven.

## Judging a brain dump

Compare it with your silent map from step 2:
1. List the backbone chunks that are missing, the links that are missing, and the links that are wrong.
2. Pick the **most severe** item and ask about it next (a B or C question). Don't read out the whole list: that hands over the map.
3. Log the rest as provisional gaps. If a later question shows they do know an item, remove it.

## Worked example: MIPS assembly midterm

This example is built from the user's "Midterm retrieval" page, which covers storage, integer representation and assembly.

**Silent map**
- **Backbone:**
  - data representation (binary, hex, two's complement);
  - memory and addressing (byte-addressed, 4-byte words, `.data`, `.text`, alignment);
  - moving data (`la`, `li`, `lw`, `sw`, `lb`, `sb`, `move`);
  - control flow (branches, labels, loops).
- **Links most likely to be missing:**
  - two's complement ↔ `sra` versus `srl`, and signed branches;
  - byte addressing ↔ scaling the index by 4 ↔ `.align` and `lw` alignment;
  - `la` (an address) versus `lw` (a value);
  - pseudo-instructions (`bge`, `blt`) expanding to `slt` plus `beq` or `bne`.

**Ladder (10 questions)**

| # | Round | Question | Full answer contains |
|---|---|---|---|
| 1 | A1 | Without notes: what are the 3–4 big chunks your midterm covers, and how does each depend on the others? | The four backbone chunks, with links. For example, representation decides which shift and branch instructions you use; addressing decides how loads and stores are written. |
| 2 | A2 | Explain to a 10-year-old why a computer needs a special way to store negative numbers. Don't say "bit", "sign" or "complement". | A fixed number of slots; plain adding should still work for negative numbers; there's a wrap-around (odometer) idea. |
| 3 | B1 | How does byte addressing change the way you index into a `.word` array, compared with a `.byte` array? | Each word is 4 bytes, so offset = index × 4 (often `sll` by 2). For bytes, offset = index. |
| 4 | B3 | `la $t0, x` and `lw $t0, x`: what ends up in `$t0` for each, and when do you need the first before using `lw`? | `la` gives x's address and `lw` gives the word stored at x. You need `la` for the base address before indexed access like `lw $t1, 8($t0)`. |
| 5 | C1 | Translating `x[i] = x[i] + 1`: which is more important to get right, the address calculation or the arithmetic? What breaks if each goes wrong? | Addressing: a wrong address silently corrupts other data or faults on misalignment. Wrong arithmetic is local and easy to spot. |
| 6 | D1 | Translate `for (i = 0; i < n; i++) sum += a[i];`. `a` is a `.word` array and `n` is in `$s1`. | Initialize; the loop label; an exit branch (`bge` or `slt`/`beq`); the address as base + i×4; `lw`; `add`; increment; jump back. |
| 7 | D3 | `$t1` holds -7. What is in `$t0` after `sra $t0, $t1, 1`? After `srl $t0, $t1, 1`? | `sra`: -4 (`0xFFFFFFFC`): the sign is preserved, rounding toward negative infinity. `srl`: `0x7FFFFFFC` (2147483644). |
| 8 | D4 | Same loop as question 6, but `a` now holds signed bytes. What changes, and why does `lb` versus `lbu` matter? | Offset = i (no ×4); use `lb`. `lb` sign-extends, so -1 stays -1; `lbu` would read it as 255. |
| 9 | E1 | Write a branch question that someone who memorized the opcode list would get wrong. Then answer it. | A relevant, higher-order question, such as signed versus unsigned comparison or what a pseudo-instruction expands to, and a correct answer to it. |
| 10 | F1 | Convert -20 to 8-bit two's complement, then to hex. | `11101100`, `0xEC` |

**Example gap entries**
- Q4 answer: "`lw` gives the address." This is **Wrong**, link severity. Re-encode: draw the register-to-memory boundary and put `la` and `lw` on either side of it.
- Q7: correct for `sra`, tagged "guess", and wrong for `srl`. Log **Shaky** for `sra` and **Wrong** for `srl`, link severity, because the gap is the link between two's complement and the shifts. Re-encode by relating both shifts to division and sign.
- Q9: they wrote "What does `bne` stand for?" That is a recall question, not a hard one. Log **Can't create** for control flow, and re-encode around why the signed and unsigned variants exist.

## Short example: discrete maths logic

From the user's "Retrieval" page: DNF, power set notation, tautology, contradiction, conditional.

| Round | Question | Full answer contains |
|---|---|---|
| B3 | A tautology and a contingency can both be true for the row you test first. What is the one check that tells them apart? | A tautology is true for **every** assignment; a contingency is true for some and false for others. |
| D3 | Is (p→q) ∨ (q→p) a tautology, a contradiction or a contingency? Prove it without a truth table. | A tautology: the left side is false only when p is true and q is false; the right side is false only when q is true and p is false; both can't happen at once. |
| D3 | What are \|P(∅)\| and \|P({∅})\|? | 1 and 2, because \|P(S)\| = 2^\|S\| and ∅ ≠ {∅} |
| C2 | A classmate says: "Any formula can be written in DNF by reading off its truth table, so DNF is just a truth table." What's right, and what's wrong? | Right: you can read DNF off the true rows. Wrong: DNF is a syntactic form, many DNFs are equivalent, and it can be simplified. A truth table is a semantic object. |
