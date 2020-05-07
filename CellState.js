const CellState = {
	// Low nibble
	Blank: 0x01,
	Hole: 0x02,
	// High nible
	Wall: 0x10,
	Box: 0x20,
	// Man:   0x40,

	// Get Blank or Hole part
	BaseNib: 0x0F,
	// Get Wall, Box, Man part
	ObjNib: 0xF0,
};
