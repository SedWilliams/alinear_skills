# Technique catalog

Retrieval techniques, with the thinking level each one tests and when it earns its time. Levels use the revised Bloom's taxonomy: 1 Remember, 2 Understand, 3 Apply, 4 Analyze, 5 Evaluate, 6 Create. "Lower level" means 1–2, and "higher level" means 4–6. References are at the end.

## Declarative techniques

| Technique | Bloom | Finds | Best stage | Cost |
|---|---|---|---|---|
| Cover and recall (look, cover, write, check) | 1 | Missing labels and steps on diagrams and processes | Any, briefly | Low |
| Flashcards, single fact | 1 | Isolated facts, definitions, constants | Alongside other work, or late | Low per card, high when overused |
| Flashcards, relating two or three ideas | 2–3 | Specific relationships that don't fit anywhere else | Mid | Low |
| Flashcards, judgment | 5 | Whether the learner can say which idea or link matters most | Mid to late | Medium |
| Self-made questions, single fact | 1–2 | "What" knowledge | Rarely; flashcards do this better | Low |
| Self-made questions, relating ideas | 3–4 | How two, or more than two, ideas relate | Early to mid | Medium |
| Self-made questions, judgment | 5–6 | Whether the learner can rank ideas and links by importance and defend the ranking | Mid to late | High; write in one session, answer in the next |
| Written brain dump (a list or paragraphs) | 1–3 | Bulk recall of details | Just before the assessment | Medium |
| Mind map brain dump | 3–5 | Big-picture structure and missing links, fast | Early (1 day, 1 week) | Medium |
| Explaining to an imaginary beginner | 2–4 | Weak links and hidden jargon | Same day, early to mid | Medium |
| Practice questions, answer then check | Varies | Whatever the questions test | Avoid as the main method | Uses up a scarce resource |
| Practice questions with confidence ratings | Varies, plus the outside check | Unsure answers, missing pieces, causes of errors | 1 week onward, before the exam | High; split across sessions |
| Group debate about importance | 5–6 | Weak judgments about what matters | Mid to late | High (needs people) |
| Rebuilding a map of the topic from the material | 4–6 | Material that was never understood at a higher level | First step when a topic was learned badly | High |
| Memory palaces and other mnemonics | 1 | Long ordered lists of separate items | Narrow use only | Medium |

### Notes

- **Cover and recall.** Cover part of the notes or a diagram, reproduce it, uncover it, and check. Image-occlusion flashcards do the same job faster.
- **Single-fact flashcards** suit definitions, constants, and details that don't fit anywhere else. Spaced-repetition software such as Anki schedules them. When the bigger picture is weak, learners pile up cards for facts they don't understand, and the reviews eat their time. Use them last, for information that won't connect to anything.
- **Self-made questions.** Writing a question is retrieval, and so is answering it, so writing in one session and answering in the next gets two rounds out of the same questions. Judgment questions force the learner to decide which idea matters more, and that call needs the deepest understanding.
- **Brain dumps.** A written dump is easy, but it finds gaps only where the learner happens to stall. A mind map dump tests relationships, which harder assessments demand, so it's the better default early on (Blunt & Karpicke, 2014). Move to lower-level methods afterwards.
- **Explaining.** An imaginary beginner beats a friend, because a friend fills the gaps with their own knowledge. When Claude plays the beginner, it mustn't fill them either. Explaining right after learning something is cheap retrieval. A good prompt is "explain why this matters before you use any of its terms". Explaining to yourself (Chi et al., 1994) and teaching others (Fiorella & Mayer, 2013) both improve understanding.
- **Practice questions, answer then check.** This hides causes. A wrong answer gets written off as a silly mistake, and a lucky right answer gets counted as known. Past papers are limited, so use the confidence method below instead.
- **Practice questions with confidence ratings.** (1) Answer every question as well as possible. (2) Mark each answer sure, unsure, or guess. (3) Check against the official answers, or build a model answer from the material and check against that. (4) For every wrong or unsure answer, write down which piece of knowledge failed. Every unsure answer is a gap even when it was right (Butler, Karpicke & Roediger, 2008), because getting one version right doesn't mean getting its variations right. This technique doubles as the outside check.
- **Group debate.** Unlike open-ended group study, the goal is explicit: argue which relationships matter most for the big picture. One side tries to show the other has missed something.
- **Rebuilding a map from the material.** This is re-learning, listed here because doing it for older, badly learned material is the fastest way to find out how badly. Expect it to be hard. The struggle comes from the material never having been understood at a higher level the first time. Do it early, and leave time for other techniques.
- **Mnemonics** work for rote lists, but they're narrow and lower-level only, and leaning on them early can stand in for understanding. Use them for long lists of separate items, and even then look for a structure first.

## Procedural techniques

Procedural skills build on each other. Higher-level practice repeats the lower-level steps, so it tests them too. The path is to start low and climb.

| Technique | Bloom | Finds | Best stage | Cost |
|---|---|---|---|---|
| Single step from memory | 3 | Whether the learner can run one process with no cues | First practice of a new skill | Low |
| Combining skills | 3–4 | Whether several skills fit together into a larger one | As soon as single steps are competent | Medium |
| Working backwards from a goal | 4–6 | Planning from a target output, then building it | Once combining is comfortable | High |
| Problem from a given stem | 3 | Applying one skill to a set problem | Early | Low |
| Mixed problem set | 3–4 | Choosing the right method when the problem type isn't labeled | Mid | Medium |
| Multi-step problem in an untaught combination | 3–4 | Combining methods in ways the course didn't show | Mid | Medium |
| Edge case | 4–6 | Applying a method to an unusual or boundary case | Mid to late | High to solve, low to write |
| Same problem, new numbers | 3 | Running a known method again | Early | Low |
| Adding a condition | 4–5 | Whether a new condition makes sense, still has a solution, and how it interacts with the rest | Mid to late | Medium |

### Notes

- **Single steps from memory** are the right first practice. Kept up after mastery, they turn into repetition that no longer teaches anything, so move to combining skills as soon as basic competence shows. Worked examples help beginners, and the help fades as skill grows (Kalyuga et al., 2003).
- **Combining skills.** In coding, build bigger functions out of basic ones. In a language, chain simple phrases into a conversation.
- **Working backwards from a goal.** In coding, build a small program for a real need, from design through testing. In a language, script versions of a real conversation, then have it. It's the hardest form of practice.
- **Mixed problem sets.** Shuffle the problem types so each problem starts with choosing the method. Mixed practice beat blocked practice on later maths tests (Rohrer & Taylor, 2007). This is what "interleaving" means in the research.
- **Edge cases.** Writing one only needs a sense of which ideas could affect each other, so learners can write their own as a retrieval exercise. In procedural subjects, they can stand in for judgment questions. Claude can make harder variations of problems the learner already solved.
- **Adding a condition.** The learning comes from deciding which condition to add, whether it makes sense, what value is reasonable, whether a solution still exists, and how it interacts with the existing ones. Brown and Walter (2005) call this "what if not?" problem posing. Examples: add air resistance to a projectile problem, add a surface-area limit to a cylinder-volume problem, add a timeout or a second input to a coding task, add a third speaker to a language dialogue.

## Combinations

**Mostly procedural** (programming, maths-heavy courses). Start with the same problem with new numbers and single steps from memory. Move to mixed problem sets, untaught combinations, and adding conditions. Finish with edge cases and working backwards from a goal. Skip extra declarative sessions once the concepts are solid.

**Mostly declarative** (biology, history, theory courses).
1. Early sessions: a mind map brain dump plus explaining how ideas relate, to find big-picture gaps.
2. Middle sessions: self-made questions climbing to judgment (write in one session, answer in the next), plus practice questions with confidence ratings for the outside check and the assessment's style.
3. Late sessions: a debate or judgment flashcards, single-fact flashcards for leftover details, and a written brain dump just before the assessment.

**Mixed.** Build on the declarative plan, since declarative knowledge usually takes longest. Once the concepts are solid, often after the first pass plus one review session, swap in procedural techniques and climb them from low to high.

## Avoid

- Rereading, highlighting, and passively reviewing notes. They feel productive, but the material is in front of the learner, so nothing gets retrieved. Dunlosky et al. (2013) rated rereading and highlighting low in utility.
- Grinding past papers without a target: no idea how many to do, and no record of which knowledge failed.
- Copying a technique because it works for someone else, without checking that it fits the knowledge type and levels this material needs.

## References

- Blunt, J. R., & Karpicke, J. D. (2014). Learning with retrieval-based concept mapping. *Journal of Educational Psychology, 106*(3), 849–858.
- Brown, S. I., & Walter, M. I. (2005). *The art of problem posing* (3rd ed.). Lawrence Erlbaum.
- Butler, A. C., Karpicke, J. D., & Roediger, H. L. (2008). Correcting a metacognitive error: Feedback increases retention of low-confidence correct responses. *Journal of Experimental Psychology: Learning, Memory, and Cognition, 34*(4), 918–928.
- Chi, M. T. H., de Leeuw, N., Chiu, M.-H., & LaVancher, C. (1994). Eliciting self-explanations improves understanding. *Cognitive Science, 18*(3), 439–477.
- Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). Improving students' learning with effective learning techniques: Promising directions from cognitive and educational psychology. *Psychological Science in the Public Interest, 14*(1), 4–58.
- Fiorella, L., & Mayer, R. E. (2013). The relative benefits of learning by teaching and teaching expectancy. *Contemporary Educational Psychology, 38*(4), 281–288.
- Kalyuga, S., Ayres, P., Chandler, P., & Sweller, J. (2003). The expertise reversal effect. *Educational Psychologist, 38*(1), 23–31.
- Rohrer, D., & Taylor, K. (2007). The shuffling of mathematics problems improves learning. *Instructional Science, 35*(6), 481–498.
