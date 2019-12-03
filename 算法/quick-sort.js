function quickSort(arr) {
    if (arr.length < 1) {
        return arr
    }
    let left = []
    let right = []
    let base = arr[0]
    arr.forEach((data) => {
        if (data > base[0]) {
            right.push(data)
        } else {
            left.push(data)
        }
    })
    return quickSort(left).concat(base, quickSort(right))
}