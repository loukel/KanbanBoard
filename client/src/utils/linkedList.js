/**
 * @param {[]} list Array of items to be reordered, each element must have an id and nextId property.
 * @param {Number} startIndex Index of the element that is being moved.
 * @param {Number} endIndex Index of the array where the lement is being moved.
 * @returns {[][]} `[result, data]` `result` is the list with the new order, `data` is is an array of rows that need to be updated in the database. `result` will not have updated nextId's but it will be in the correct order.
*/
export const reorder = (list, startIndex, endIndex) => {
  /** Reorder the linked list
   * Linked list moving scenarios
   *  - Only two items
   *  - Moving item from the start of the list
   *  - Moving item to the start of the list
   *  - Moving item from/to the rest of the list down
   *  - Moving item from/to the rest of the list up
   */
  let data = []
  if (list.length === 2) {
    // The next ids swap
    data = [
      {
        id: list[0].id,
        nextId: null
      },
      {
        id: list[1].id,
        nextId: list[0].id
      }
    ]
  } else {
    // list greater than 2
    if (startIndex === 0) {
      // If moving an item from the start
      // No deletion is needed
      data = [
        {
          id: list[startIndex].id,
          nextId: list[endIndex + 1]?.id || null
        },
        {
          id: list[endIndex].id,
          nextId: list[startIndex].id
        }
      ]
    } else if (endIndex === 0) {
      // If moving an item to the start
      // Insertion only requires changing the item being moved
      data = [
        {
          id: list[startIndex - 1].id,
          nextId: list[startIndex + 1]?.id || null // If move the last item to the start, therefore the next id is null
        },
        {
          id: list[startIndex].id,
          nextId: list[endIndex].id
        }
      ]
    } else {
      if (startIndex < endIndex) {
        // If an item is moving down the list
        data = [
          {
            id: list[startIndex - 1].id, // There will always be an item before the start
            nextId: list[startIndex + 1].id // There will always be an item after the start
          },
          {
            id: list[startIndex].id,
            nextId: list[endIndex + 1]?.id || null // There may not be an item after the end position since the item could move to the end
          },
          {
            id: list[endIndex].id,
            nextId: list[startIndex].id
          }
        ]
      } else {
        // If an item is moving up the list
        data = [
          {
            id: list[endIndex - 1].id,
            nextId: list[startIndex].id
          },
          {
            id: list[startIndex - 1].id,
            nextId: list[startIndex + 1]?.id || null
          },
          {
            id: list[startIndex].id,
            nextId: list[endIndex].id
          }
        ]
      }
    }
  }

  // Reorder the array
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return [result, data]
}

export const move = (source, destination, droppableSource, droppableDestination) => {
  // Generate data to be updated in the database

  // Deleting from the start a singly linked list means nothing needs to be deleted except for the actual moved item -> which is inserted in another list
  const deletion = []
  if (droppableSource.index !== 0) {
    deletion.push({
      id: source[droppableSource.index - 1].id,
      nextId: source[droppableSource.index + 1]?.id || null
    })
  }

  // Update the item being moved with the new columnId and nextId
  const insertion = [
    {
      id: source[droppableSource.index].id,
      columnId: droppableDestination.droppableId,
      nextId: destination[droppableDestination.index]?.id || null
    }
  ]

  // If an item is being added after another then update the previous item's nextId to the be the moved item's id
  if (destination[droppableDestination.index - 1]) {
    insertion.push({
      id: destination[droppableDestination.index - 1].id,
      nextId: source[droppableSource.index].id
    })
  }

  const data = [
    ...deletion,
    ...insertion
  ]

  // Reorder list
  const sourceClone = Array.from(source)
  const destClone = Array.from(destination)
  const [removed] = sourceClone.splice(droppableSource.index, 1)

  destClone.splice(droppableDestination.index, 0, removed)

  const result = {}
  result[droppableSource.droppableId] = sourceClone
  result[droppableDestination.droppableId] = destClone

  return [result, data]
}