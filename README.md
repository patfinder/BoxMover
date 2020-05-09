# Introduction
This tool help solving Block moving game

# Algorithm

## Simple solve
- For each Box, push to nearest Hole

## Sophisticated solver

### State Score
- Scoring a State so that state with higher Score means closer to Goal
- State with Blocked Box (see below) have Absolute Negative Score
- State caused by a Must Move have Absolute Positive Score

### Blocked Box
- Box is at a corner (blocked permanently at 2 both H(orizontal) & V(ertical) directions)
- Box can only move along a line and there is not a possible Hole for that Box
- A Box can be blocked temporarily when it is blocked by another block which can be moved
	This Box is not a Blocked Box

### Reached Box
- Box that is located on a Hole

### Dead Move
- Is a Move that create a Blocked Box

### Must Move
- A Move that cause a Temporarily blocked Box to become Free

### Heuristic Move
- A Move that make a Box closer to a Hole
