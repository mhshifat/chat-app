export function arrayEquals(a: (string | number)[], b: (string | number)[]) {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index]);
}

export function isDeepEqual(arr1: any[], arr2: any[]) {
  // If the arrays are not the same length, they are not equal
  if (arr1.length !== arr2.length) return false;

  // Compare the elements of the arrays
  for (let i = 0; i < arr1.length; i++) {
    const elem1 = arr1[i];
    const elem2 = arr2[i];

    // If the elements are not the same type, they are not equal
    const elem1Type = Object.prototype.toString.call(elem1);
    const elem2Type = Object.prototype.toString.call(elem2);
    if (elem1Type !== elem2Type) return false;

    // If the elements are not arrays or objects, they are equal if they have the same value
    if (elem1Type !== '[object Array]' && elem1Type !== '[object Object]') {
      if (elem1 !== elem2) return false;
    } else {
      // Recursively compare the arrays or objects
      if (!isDeepEqual(elem1, elem2)) return false;
    }
  }

  // If the arrays have the same elements, they are equal
  return true;
}