import {faker} from '@faker-js/faker';

export function randomProjectTitle(): string {
    return `Project_${faker.word.adjective()}_${Date.now()}`;
}


export function randomProjectCode(): string{
    return faker.string.alpha({length:{min: 2, max: 6}, casing: 'upper'});
}

export function randomSuiteTitle(): string {
    return `Suite_${faker.word.verb()}_${Date.now()}`;
}

export function randomPassword(): string {
    return faker.string.alphanumeric({length:{min: 8, max: 16}});
}

export function randomTestCaseTitle(): string {
  return faker.string.alpha({ length: { min: 1, max: 255 } });
}