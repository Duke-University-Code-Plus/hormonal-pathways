import { writable } from 'svelte/store';

// Initialize writable stores with default values
export const gamma1_tissue = writable(0);
export const gamma2_tissue = writable(0);
export const gamma3_tissue = writable(0);
export const hormoneCount = writable(0);

export const currRate1 = writable(0);
export const currRate2 = writable(0);
export const currRate3 = writable(0);

export const receptorsBound1 = writable(0);
export const receptorsBound2 = writable(0);
export const receptorsBound3 = writable(0);

export const labelToggle = writable(false);

export const selectedBird = writable(0);