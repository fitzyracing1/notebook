# Half-Integer Program Concept

- **URL:** https://grok.com/c/8eacca92-477f-4a8f-816b-f62ddf7664fe
- **Date:** Sep 10 (as listed in math-physics.csv)
- **Capture note:** Mostly program/shell text, not formulas. Included as requested; the only "math" is the ten-register int machine and the 1/10 framing. Code is captured verbatim as shown in the chat (file contents were not shown in the chat itself, only run commands).

## User messages (verbatim)

1. `What if you built a program 1/10 int`
2. `So the program starts with int and we are building 1/10 of that`
3. `This could be a separate issue log it and continue with support topics log the intensity and show what you find in 1/10 of memory of this sandbox`
4. `Try and leave spaces in the memory so Import files could boot`
5. `I meant Imp`

## Grok

**Turn 1**

A program at 1/10 intensity is the same idea as Pie Face: ship a working kernel and skip the committee.

What you lose: frameworks, config layers, plugins, perfect naming, edge-case theater.

What you keep: a scheduler, a few tasks, a prompt, and something you can run tonight.

That program is tenth.py — one file, no deps.

```text
python3 /home/workdir/artifacts/tenth.py
```

Then:

```text
> help
> tick 4
> spawn count
> tick 8
> ps
> quit
```

It is a cooperative "OS" in ~100 lines: ready queue, four tasks (idle, clock, echo, count), and a REPL that is the shell. Empty Enter runs one tick. That is the whole product.

The 1/10 cut is not "make it worse." It is: one process model, one loop, one file, defaults instead of decisions. Everything a normal program would debate for a week is already chosen.

Optional next increment: add a save command that dumps the ready queue to a JSON file so the 1/10 kernel survives a restart.

**Turn 2**

The program starts with int. Ten cells. Ten ops. That is the whole machine — 1/10 of an interpreter.

Core:

```text
int r[10] = {0}
```

Ops are themselves ints: halt, set, add, sub, mul, div, jz, jnz, out, in.

The 1/10 program baked in:

```text
set r0 = 2
set r1 = 5
mul  r0 r1 -> r2
out  r2
halt
```

It already ran. Output was 10. Registers after: 2 5 10 0 0 0 0 0 0 0.

File: /home/workdir/artifacts/int10.py

```text
python3 /home/workdir/artifacts/int10.py
```

Nothing else in the core — no strings, no objects, no files, no names. int is the type, the memory, and the instruction stream.

Optional next: feed your own int list on stdin so the 1/10 machine runs programs you write as numbers.

**Turn 3**

Logged as its own issue. Intensity stays 1/10. Support stays on int10.

ISSUE-001 — int10 is not tenth

/home/workdir/artifacts/issues.md

Audit: /home/workdir/artifacts/decision-audit-log.md

Intensity: /home/workdir/artifacts/intensity-log.md

Support list: /home/workdir/artifacts/support-topics.md

Why split: the program starts with int. tenth.py is a scheduler. int10.py is ten integer cells and ten integer ops. Different issue.

Intensity this turn: 1/10

int-only core. 10 registers. 10 ops. No strings in the machine. Demo still prints 10.

1/10 of this sandbox's memory (what is actually here):

- Workdir is almost empty: .grok/ + artifacts/
- Artifacts before this log: 2 files, ~5 KB total (tenth.py 2424 B, int10.py 2518 B)
- User memory file: 87 lines / 23039 B → one tenth ≈ 9 lines / 2.3 KB. That tenth is only the header block: "Who This User Is" through the first online-presence line. Nothing else of the file is in this slice.
- Skills mounted: 36. One tenth ≈ 4 that touch this work: decision-audit-log, fastest-to-production, sandbox-open-ended-solver, persistent-self-coder
- No git repo in the workdir. No other runtime state.

Support continues at that cap: int10 remains the live program. Next support topic on the list is a stdin loader that still only accepts ints — not built unless you want it.

**Turn 4**

Reserving empty slots in sandbox memory and a boot path so import files can load without colliding with the int10 core.

Spaces are left. Import files can boot. Personal memory.md was not used — that file is a log, not RAM.

Empty memory

artifacts/memory/slots/01.empty … 09.empty — still 0 bytes
00 took the first import
Map: artifacts/memory/MAP.md

Boot path

- Drop int lists in artifacts/imports/
- Run python3 artifacts/boot/loader.py
- First empty slot becomes NN.boot
- Loader writes the ints and pads eight zeros so the next import still has room

int10 spaces

- r[0..7] live
- r[8] boot flag (1 after import)
- r[9] import length
- DEMO program keeps a tail of zeros

Tried it: hello.int (3+7) booted into 00.boot. int10 ran it and printed 10. Nine slots still empty.

```text
python3 /home/workdir/artifacts/boot/loader.py
python3 /home/workdir/artifacts/int10.py
```

Intensity still 1/10. ISSUE-001 unchanged.

**Turn 5**

Treating it as Imp files, not Import. Switching the boot path to .imp and leaving the empty slots for those.

Corrected: Imp, not Import.

Boot only looks at artifacts/imps/*.imp. Empty slots stay empty until an Imp lands.

- Imp in: artifacts/imps/add.imp
- Loader: artifacts/boot/loader.py
- Result: memory/slots/01.impboot
- Still empty: 02.empty … 09.empty
- Old 00.boot left alone (that was the Import mistake)

int10 now prefers .impboot over .boot. It ran the Imp (3+7) and printed 10.

Drop more .imp files in artifacts/imps/ and run the loader. Spaces stay in the slots on purpose.
