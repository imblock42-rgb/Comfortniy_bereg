import { describe, it, expect } from 'vitest';
import { filterListingRecords, applyDestinationFilter, getDestinationLabel } from '../src/catalog.js';

describe('filterListingRecords', () => {
  const records = [
    { destination: 'gagra' },
    { destination: 'pitsunda' },
    { destination: 'gagra' },
    { destination: 'sukhum' }
  ];

  it('returns all records when destination is falsy', () => {
    expect(filterListingRecords(records, '')).toHaveLength(4);
  });

  it('returns only matching records for a given destination', () => {
    expect(filterListingRecords(records, 'gagra')).toHaveLength(2);
  });

  it('returns an empty array when nothing matches', () => {
    expect(filterListingRecords(records, 'novy-afon')).toHaveLength(0);
  });
});

describe('applyDestinationFilter', () => {
  function makeElement(destination) {
    return { hidden: false, dataset: { destination } };
  }

  it('hides non-matching elements and returns the visible count', () => {
    const elements = [makeElement('gagra'), makeElement('pitsunda'), makeElement('gagra')];
    const visible = applyDestinationFilter(elements, 'gagra');

    expect(visible).toBe(2);
    expect(elements[0].hidden).toBe(false);
    expect(elements[1].hidden).toBe(true);
    expect(elements[2].hidden).toBe(false);
  });

  it('shows everything when destination is empty', () => {
    const elements = [makeElement('gagra'), makeElement('pitsunda')];
    const visible = applyDestinationFilter(elements, '');

    expect(visible).toBe(2);
    expect(elements.every((el) => el.hidden === false)).toBe(true);
  });

  it('returns 0 and hides all elements when nothing matches', () => {
    const elements = [makeElement('gagra'), makeElement('pitsunda')];
    const visible = applyDestinationFilter(elements, 'sukhum');

    expect(visible).toBe(0);
    expect(elements.every((el) => el.hidden === true)).toBe(true);
  });
});

describe('getDestinationLabel', () => {
  const labels = { gagra: 'Гагра', pitsunda: 'Пицунда' };

  it('resolves a known destination to its label', () => {
    expect(getDestinationLabel('gagra', labels)).toBe('Гагра');
  });

  it('falls back to the raw code for an unknown destination', () => {
    expect(getDestinationLabel('novy-afon', labels)).toBe('novy-afon');
  });

  it('returns the generic phrase when no destination is selected', () => {
    expect(getDestinationLabel('', labels)).toBe('по всем направлениям');
  });
});
