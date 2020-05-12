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

### Near-By (NB)
- Near-By: 4 Cells around specified Box

### Blocked Box (BB)
- Box is at a corner (blocked permanently at 2 both H(orizontal) & V(ertical) directions)
- Box can only move along a line and there is not a possible Hole for that Box
- Box which's only Move is to becoming BB (as above cases)
- TBB (below) is not a BB.

### Temporarily Blocked Box (TBB)
- Temporarily BB is a Box that can't be moved for now 
	but if a nearby Box move, it can move

### Reached Box (RB)
- Box that is located on a Hole

### Dead Move (DM)
- Is a Move that make that Box or Near-By Box become BB

### Must Move (MM)
- A Move that cause a Temporarily blocked Box to become Free

### Heuristic Move
- A Move that make a Box closer to a Hole

### Implementation

- Global graph (then no recreating whole graph after each move)
- Graph is member of so call Algorithm object
	So we can access some closure's variable for distance calculation
- 


