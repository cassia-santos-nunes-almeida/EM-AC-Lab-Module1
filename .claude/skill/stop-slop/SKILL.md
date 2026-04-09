---
name: stop-slop
description: Remove AI writing patterns from prose. Use when drafting, editing, or reviewing text to eliminate predictable AI tells.
metadata:
  trigger: Writing prose, editing drafts, reviewing content for AI patterns
  author: Hardik Pandya (https://hvpandya.com)
---

# Stop Slop

Eliminate predictable AI writing patterns from prose.

## Core Rules

1. **Cut filler phrases.** Remove throat-clearing openers, emphasis crutches, and all adverbs. See [references/phrases.md](references/phrases.md).

2. **Break formulaic structures.** Avoid binary contrasts, negative listings, dramatic fragmentation, rhetorical setups, false agency. See [references/structures.md](references/structures.md).

3. **Use active voice.** Every sentence needs a human subject doing something. No passive constructions. No inanimate objects performing human actions ("the complaint becomes a fix").

4. **Be specific.** No vague declaratives ("The reasons are structural"). Name the specific thing. No lazy extremes ("every," "always," "never") doing vague work.

5. **Put the reader in the room.** No narrator-from-a-distance voice. "You" beats "People." Specifics beat abstractions.

6. **Vary rhythm.** Mix sentence lengths. Two items beat three. End paragraphs differently. No em dashes.

7. **Trust readers.** State facts directly. Skip softening, justification, hand-holding.

8. **Cut quotables.** If it sounds like a pull-quote, rewrite it.

## Quick Checks

Before delivering prose:

- Any adverbs? Kill them.
- Any passive voice? Find the actor, make them the subject.
- Inanimate thing doing a human verb ("the decision emerges")? Name the person.
- Sentence starts with a Wh- word? Restructure it.
- Any "here's what/this/that" throat-clearing? Cut to the point.
- Any "not X, it's Y" contrasts? State Y directly.
- Three consecutive sentences match length? Break one.
- Paragraph ends with punchy one-liner? Vary it.
- Em-dash anywhere? Remove it.
- Vague declarative ("The implications are significant")? Name the specific implication.
- Narrator-from-a-distance ("Nobody designed this")? Put the reader in the scene.
- Meta-joiners ("The rest of this essay...")? Delete. Let the essay move.
- More than ~25% of sentences share an opener ("This," "The," "It")? Vary them.
- Three or more words from the vocabulary cluster list on one page? Replace with simpler alternatives.
- Three or more hedges in one paragraph? Commit or cut.
- More than two formal transitions ("However," "Moreover," "Furthermore") per page? Remove or restructure.
- All paragraphs roughly the same length? Break the pattern.
- Spot the three-beat setup-bridge-point? Collapse to the point.

## Statistical Detection Patterns

These are the subtler tells that survive after the obvious slop is removed. Check for these in any output longer than two sentences.

### 9. Sentence opener monotony
If more than ~25% of sentences in a passage start with the same word ("This," "The," "It," "However"), rewrite openers to vary them. AI defaults to a narrow set of sentence starters.

### 10. Vocabulary clustering
AI reaches for "impressive" filler words. Flag and replace with something specific or simpler:

> notably, particularly, significantly, ultimately, essentially, fundamentally, comprehensive, robust, facilitate, utilize, foster, enhance, underscore, pivotal, critical, transformative, innovative, streamline, employing, spanning, bolster

These are not banned outright. If one is the right word and no simpler alternative says the same thing, keep it. But if three or more appear in one page, something is wrong.

### 11. Hedging density
One or two hedges per paragraph is human ("may," "might," "could potentially," "it is possible that," "to some extent," "in many cases"). Three or more per paragraph is a red flag. Fix: commit to the claim or cut it.

**Exception:** Methods sections in academic papers may legitimately need more hedging. Relax this rule there.

### 12. Transition word overload
"However," "Moreover," "Furthermore," "Additionally," "Consequently," "Nevertheless" appearing more than twice per page is a classic AI fingerprint. Fix: remove the transition and let the sentence flow from the previous one, or restructure the paragraph.

### 13. Paragraph length uniformity
If all paragraphs in a passage are within ~20% of each other in length, break the pattern. Mix short (1-2 sentence) paragraphs with longer developed ones. Uniform blocks read as generated.

### 14. Setup-then-deliver pattern
AI loves: "[Context sentence]. [Bridge sentence]. [The actual point]." Humans more often lead with the point or weave context into the same sentence. If you spot this three-beat pattern, collapse it.

## Hard constraint

**The de-AI audit is cosmetic only. It must never alter meaning, remove content, add new ideas, or override the user's voice fingerprint. When choosing between "sounds slightly AI" and "changes what the text says," always keep the meaning. When in doubt, leave the text as-is.**

## Scoring

Rate 1-10 on each dimension:

| Dimension | Question |
|-----------|----------|
| Directness | Statements or announcements? |
| Rhythm | Varied or metronomic? |
| Trust | Respects reader intelligence? |
| Authenticity | Sounds human? |
| Density | Anything cuttable? |

Below 35/50: revise.

## Examples

See [references/examples.md](references/examples.md) for before/after transformations.

## License

MIT
