# PLAYBOOK.md — When to Do What

Your operating manual for the Claude session system. Read this once. Refer back to the relevant section when needed.

## Part 1 — First Time Setup (do once per project)

This is the one-time work to get the system in place.

### Step 1 — Place the global files

Put these three files at the root of your project (or in a central location you use across projects):

```
your-project/
├── CLAUDE.md       ← copy from this setup
├── PATTERNS.md     ← copy from this setup (pre-loaded)
├── SESSION.md      ← copy from this setup (empty template)
└── skills/
    └── user/
        ├── lut-lecture/
        ├── stack-xml-generator/
        ├── message-coach/
        └── circuitikz-circuit-diagrams/
```

If you work across multiple projects (EM&AC, EP, SEFI paper, lab apps), decide:

- **Option A:** One shared root with all skills — simpler, one CLAUDE.md to maintain
- **Option B:** Per-project root — more isolation, more files to keep in sync

Recommendation: Option A, since your skills and patterns overlap heavily across projects.

### Step 2 — Audit your existing SKILL.md files

Go through each SKILL.md and remove anything that now lives in CLAUDE.md:

| If the SKILL.md contains... | Action |
|---|---|
| Cássia's name or project identity | Remove — it's in CLAUDE.md §1 |
| Email sign-off rules | Remove — in CLAUDE.md §6 + PATTERNS.md |
| Banned words list | Keep in message-coach (domain-specific depth), add summary to CLAUDE.md §6 |
| Python/environment notes | Remove — in CLAUDE.md §2 + PATTERNS.md |
| Self-verification steps | Remove — in CLAUDE.md §3 |
| Notation conflict (A vs S, λ vs Λ) | Remove from skills — in CLAUDE.md §1 |
| Domain rules (PRT grading, figure annotation) | Keep in SKILL.md — this is where they belong |

After removing duplicates, add one line at the top of each SKILL.md:

```
*Global rules: see CLAUDE.md. Recurring corrections: see PATTERNS.md.*
```

### Step 3 — Pre-load PATTERNS.md

PATTERNS.md is already pre-loaded with your known recurring corrections. Review it:

- Confirm each entry is accurate
- Add any corrections you remember that are not listed
- Remove anything that no longer applies

### Step 4 — Test the session open protocol

Start a new Claude session and say:

```
open session
```

Claude should:

- Confirm it has read CLAUDE.md
- Confirm it has read PATTERNS.md and list the active pattern count
- Confirm it has read SESSION.md (or note that it is empty/template)
- State which skills are relevant to your stated goal for the session

If Claude does not do all four — paste CLAUDE.md §4 into the chat manually. That is the fallback.

### Step 5 — Test the session close protocol

At the end of a test session, say:

```
close session
```

Claude should produce:

- A completed SESSION.md (paste into your file)
- Any new PATTERNS.md entries (paste into your file)
- A list of any SKILL.md changes proposed (confirm or reject)

## Part 2 — Each Session (every time)

### Opening a session (5 minutes)

**Step 1 — Trigger session open**
Say: `open session` or `load context`

Paste CLAUDE.md + PATTERNS.md + SESSION.md if Claude does not have file access.
In Claude Code or claude.ai with Drive access, reference the file paths.

**Step 2 — State today's goal**
One sentence is enough:

- "Today: finishing Week 12 lecture, Workflow A."
- "Today: STACK questions for Week 11 magnetostatics."
- "Today: SEFI paper statistical analysis section."

**Step 3 — Confirm context loaded**
Claude should confirm: active patterns count, relevant skills, any conflicts.
If it skips this — ask: "Confirm which patterns are active."

### During the session

- You do not need to re-explain your project, your courses, or your notation preferences — Claude has CLAUDE.md.
- If Claude makes a mistake that is already in PATTERNS.md, say: "Check PATTERNS.md" — do not re-explain the rule.
- If Claude makes a new mistake twice, note it. It will become a pattern at close.
- If Claude proposes a SKILL.md change, note it for the close step — do not apply mid-session.

### Closing a session (10 minutes)

**Step 1 — Trigger session close**
Say: `close session` or `wrap up`

**Step 2 — Review Claude's output**
Claude will produce:

- Updated SESSION.md content (paste into your file)
- New PATTERNS.md entries, if any (paste into your file)
- Proposed SKILL.md updates (confirm or reject)

**Step 3 — Save the files**
Paste SESSION.md and PATTERNS.md updates into their files. This is the only manual step — the system does not auto-save.

**Step 4 — Commit (optional but recommended)**
If your project is in git:

```bash
git add CLAUDE.md PATTERNS.md SESSION.md
git commit -m "session close: [brief summary]"
```

## Part 3 — When to Update Each File

| File | Update when... | Who updates |
|---|---|---|
| CLAUDE.md | Project identity changes, new global rule, new environment note | You (manually, or confirm Claude's proposed change) |
| PATTERNS.md | Session close produces new patterns, or you recall a correction between sessions | Claude (at close), or you directly |
| SESSION.md | Every session close | Claude (produces content), you paste |
| SKILL.md | Skill workflow changes, new domain rule, rule refinement | You (after Claude proposes at close) |

Never edit PATTERNS.md mid-session — save notes, apply at close.

## Part 4 — The Self-Improvement Loop (how it compounds)

```
Session 1: Claude makes mistake X.
           You correct it.
Session 1 close: Claude detects pattern, adds P-STACK-07 to PATTERNS.md.

Session 2: Claude reads PATTERNS.md at open.
           P-STACK-07 is now a hard constraint.
           Mistake X does not happen again.
           You do not repeat yourself.

Session N: PATTERNS.md has 30+ entries.
           Your corrections are encoded.
           Sessions start clean.
```

The file grows. The repetition shrinks.

## Part 5 — Quick Reference

| Situation | What to say |
|---|---|
| Starting a session | `open session` |
| Ending a session | `close session` |
| Claude ignores a known rule | `Check PATTERNS.md` |
| Claude proposes SKILL.md change | Note it, confirm at close |
| New mistake happened twice | Note it, add at close |
| Claude seems to have forgotten context | Paste CLAUDE.md §1–3 directly |
| Not sure which skill applies | Check CLAUDE.md §7 Skill Index |

## Part 6 — Audit Findings (what was duplicated before this setup)

For reference — what was cleaned up when this system was put in place:

| Content | Was in | Moved to |
|---|---|---|
| Project identity (Cássia, LUT, courses) | Each SKILL.md description | CLAUDE.md §1 |
| Notation conflict (A vs S, λ vs Λ) | Ad-hoc corrections | CLAUDE.md §1 + PATTERNS.md P-LEC-04 |
| Python env (python vs python3) | Nowhere (repeated verbally) | CLAUDE.md §2 + PATTERNS.md P-ENV-01 |
| Self-verification protocol | Nowhere (repeated per-session) | CLAUDE.md §3 |
| Session open/close | Nowhere | CLAUDE.md §4–5 |
| Email sign-off rule | Nowhere (repeated verbally) | CLAUDE.md §6 + PATTERNS.md P-MSG-02 |
| "flagging" ban | Memory only | CLAUDE.md §6 + PATTERNS.md P-MSG-01 |
| Anti-AI rules | message-coach/SKILL.md only | Cross-referenced in CLAUDE.md §6 |
| STACK grading rules | stack-xml-generator/SKILL.md | Kept there + recurring fixes in PATTERNS.md |
| Figure annotation rule | lut-lecture/SKILL.md + PEDAGOGICAL_DNA | Kept there + PATTERNS.md P-LEC-01 |
| NotebookLM auth | Nowhere (repeated verbally) | PATTERNS.md P-ENV-03 |
| Course architecture (M1/M2/M3) | COURSE_GUIDELINES.md (×3 repos) | CLAUDE.md §8 |
| Shared conventions (cn, MathWrapper, dark mode) | COURSE_GUIDELINES.md + repo CLAUDE.md | CLAUDE.md §9 (global) + repo CLAUDE.md (specific) |
| Pedagogical patterns | COURSE_GUIDELINES.md | CLAUDE.md §10 |
| Lessons learned (15 items) | COURSE_GUIDELINES.md | PATTERNS.md P-CODE-01 through P-CODE-15 |
