import { useState } from 'react'
import BoardColumn from './BoardColumn'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { reorder, move } from '@/utils/linkedList'
import { Row } from 'react-bootstrap'
import { updateColumns } from '@/services/columnApi'
import { updateItems } from '@/services/itemApi'

export const Board = ({ columns }) => {
  const [lists, setLists] = useState(columns)
  const [loading, setLoading] = useState(false)

  /**
   * Occurs where a drag operation is finished.
   * @param result beautiful dnd object
  */
  const onDragEnd = async (result) => {
    const { source, destination, type } = result

    // End function if an update isn't necessary
    if (!destination) { return }
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) { return }

    // Droppable id's need to be strings and since there's two droppable types on the board, they need to be prefixed with the type: the below code remvoes those prefixes and converts them into integers
    source.droppableId = +source.droppableId.slice(1)
    destination.droppableId = +destination.droppableId.slice(1)

    setLoading(true)
    switch (type) {
      case 'ITEMS':
        // If the item is moved in the list or cross lists
        source.droppableId === destination.droppableId
        ? await moveWithinList(source, destination)
        : await moveToList(source, destination)
        break
      case 'COLUMNS':
        await reorderColumns(source, destination)
        break
      default:
        break
    }
    setLoading(false)
  }

  const moveWithinList = async (source, destination) => {
    const [list] = lists.filter(column => column.id === source.droppableId)
    const [items, data] = reorder(
      list.items,
      source.index,
      destination.index
    )

    const listsClone = [...lists]
    list.items = items
    const columnIndex = lists.findIndex(column => column.id === source.droppableId)
    listsClone[columnIndex] = list

    const res = await updateItems(data)
    if (res === 'OK') {
      setLists(listsClone)
    }
  }

  const moveToList = async (source, destination) => {
    const [sourceList] = lists.filter(column => column.id === source.droppableId)
    const [destinationList] = lists.filter(column => column.id === destination.droppableId)

    const [result, data] = move(
      sourceList.items, // Item array of source list
      destinationList.items, // Item array of destination list
      source, // columnId (droppableId) and index of item being moved
      destination // columnId (droppableId) and index where the item is being moved to
    )

    const listsClone = [...lists]

    // Update list clone to have the new columns
    sourceList.items = result[source.droppableId]
    destinationList.items = result[destination.droppableId]

    const sourceIndex = lists.findIndex(column => column.id === source.droppableId)
    const destinationIndex = lists.findIndex(column => column.id === destination.droppableId)

    listsClone[sourceIndex] = sourceList
    listsClone[destinationIndex] = destinationList

    const res = await updateItems(data)

    if (res === 'OK') {
      setLists(listsClone)
    }
  }

  const reorderColumns = async (source, destination) => {
    const [items, data] = reorder(
      [...lists],
      source.index,
      destination.index
    )

    const oldLists = [...lists]
    setLists(items)

    const res = await updateColumns(data)

    if (res !== 'OK') {
      setLists(oldLists)
    }
  }

  return (
    <Row className='flex-row ml-3 mb-3 pb-2 mr-0 px-2 board flex-nowrap align-items-start'>
      <DragDropContext onDragEnd={onDragEnd} isDragDisabled={loading}>
        <Droppable
          droppableId={'board'}
          type={'COLUMNS'}
          direction='horizontal'
        >
          {(provided) => (
            <div
              className='d-flex'
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {lists.map((column, index) =>
                <BoardColumn
                  key={column.id}
                  items={column.items}
                  id={column.id}
                  heading={column.name}
                  index={index}
                />
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Row>
  )
}
