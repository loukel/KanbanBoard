/**
 * Order an array with linked list structure
 * @param {Array} linkedListArray (LinkedListArray) including nextId and id
 * @returns {Array} Array in the linked list order
 */
const orderLinkedList = (linkedListArray) => {
  const result = []

  try {
    var prevItem
    for (let i = 0; i < linkedListArray.length; i++) {
      if (result.length === 0) {
        const [item] = [prevItem] = linkedListArray.filter(item => item.nextId === null)
        result.push(item)
      } else {
        const [item] = [prevItem] = linkedListArray.filter(item => item.nextId === prevItem.id)
        result.push(item)
      }
      // result.push(([prevItem] = linkedListArray.filter(item => item.nextId === ((result.length === 0) ? null : prevItem.id)))[0])
    }
  } catch (error) {
    return error
  }

  return result.reverse()
}

module.exports = orderLinkedList