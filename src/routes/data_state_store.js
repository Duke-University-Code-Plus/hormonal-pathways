import {  writable } from 'svelte/store';

// Initialize writable stores with default values
export const gamma1 = writable(0.1);
export const gamma2 = writable(0.2);
export const gamma3 = writable(0.3);
export const G = writable(0.1);
export const Xmin = writable(1);
export const delSmax = writable(1);
export const delCmax = writable(1);
export const tau = writable(5);
export const K = writable(1);
export const alpha = writable(4);
export const beta = writable(2);
export const mu = writable(0);
export const z1 = writable(0.2);
export const z2 = writable(0.3);
export const z3 = writable(0.3);
export const N = writable(100);
export const foodShort = writable(0.4);
export const foodShortbegin = writable(8);
export const foodShortend = writable(20);
export const statRun = writable(false)