/** Shared element constants for Qi components */

export const ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];

export const ELEM_COLORS = {
  Wood: '#4caf50', Fire: '#ff5722', Earth: '#a9825a', Metal: '#90a4ae', Water: '#0288d1',
};

/** Sheng (generative) cycle: parent → child */
export const GENERATES = {
  Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood',
};

/** Ko (controlling) cycle: controller → controlled */
export const CONTROLS = {
  Wood: 'Earth', Fire: 'Metal', Earth: 'Water', Metal: 'Wood', Water: 'Fire',
};
