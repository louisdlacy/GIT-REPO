export const arrayUtils = {
  removeItemFromArray,
  removeItemAtIndexFromArray,
  getRandomItemFromArray,
  removeItemsFromArray,
}

function removeItemFromArray<t>(array: t[], item: t) {
  const itemIndex = array.indexOf(item);

  if (itemIndex >= 0) {
    array.splice(itemIndex, 1);
  }
}

function removeItemAtIndexFromArray<t>(array: t[], index: number) {
  if (index >= 0 && index < array.length) {
    array.splice(index, 1);
  }
}

function getRandomItemFromArray<t>(array: t[]): t | undefined {
  if (array.length > 0) {
    const randomIndex = Math.floor(array.length * Math.random());

    return array[randomIndex];
  }
  else {
    return undefined;
  }
}

function removeItemsFromArray<t>(arrayToRemoveFrom: t[], arrayOfItemsToRemove: t[]) {
  arrayOfItemsToRemove.forEach((item) => {
    removeItemFromArray(arrayToRemoveFrom, item);
  });
}