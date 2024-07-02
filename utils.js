exports.getAddedRemovedElementsFromArrays = (originalSortedArray, newSortedArray, exception = '') => {

    if (newSortedArray[0] === exception) { newSortedArray[0] = 0 }

    let addedElements = []
    let removedElements = []
    let a = 0,
        b = 0

    while (a < originalSortedArray.length && b < newSortedArray.length) {
        if (originalSortedArray[a] < newSortedArray[b]) {
            removedElements.push(originalSortedArray[a])
            a++
        } else if (originalSortedArray[a] > newSortedArray[b]) {
            addedElements.push(newSortedArray[b])
            b++
        } else {
            a++
            b++
        }
    }

    while (a < originalSortedArray.length) {
        removedElements.push(originalSortedArray[a])
        a++
    }

    while (b < newSortedArray.length) {
        addedElements.push(newSortedArray[b])
        b++
    }

    return { addedElements, removedElements }
}
