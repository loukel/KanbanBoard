import BoardColumn from './BoardColumn'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { reorder, move } from '@/utils/linkedList'
import { Row } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { updateColumns, updateItems } from '../socket'

export const Board = ({ columns: columnsData, updating }) => {
  // For client updating, this prevent dragging lag, otherwise the columnsData could just be used
  const [columns, setColumns] = useState(columnsData)
  useEffect(() => {
    setColumns(columnsData)
  }, [columnsData])

  /**
   * Occurs where a drag operation is finished.
   * @param result beautiful dnd object
  */
  const onDragEnd = (result) => {
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

    switch (type) {
      case 'ITEMS':
        // If the item is moved in the list or cross columns
        source.droppableId === destination.droppableId
        ? moveWithinList(source, destination)
        : moveToList(source, destination)
        break
      case 'COLUMNS':
        reorderColumns(source, destination)
        break
      default:
        break
    }
  }

  const moveWithinList = (source, destination) => {
    const [list] = columns.filter(column => column.id === source.droppableId)
    const [items, data] = reorder(
      list.items,
      source.index,
      destination.index
    )

    const columnsClone = [...columns]
    list.items = items
    const columnIndex = columns.findIndex(column => column.id === source.droppableId)
    columnsClone[columnIndex] = list

    updateItems(data, columnsClone)
    setColumns(columnsClone)
  }

  const moveToList = (source, destination) => {
    const [sourceList] = columns.filter(column => column.id === source.droppableId)
    const [destinationList] = columns.filter(column => column.id === destination.droppableId)

    const [result, data] = move(
      sourceList.items, // Item array of source list
      destinationList.items, // Item array of destination list
      source, // columnId (droppableId) and index of item being moved
      destination // columnId (droppableId) and index where the item is being moved to
    )

    const columnsClone = [...columns]

    // Update list clone to have the new columns
    sourceList.items = result[source.droppableId]
    destinationList.items = result[destination.droppableId]

    const sourceIndex = columns.findIndex(column => column.id === source.droppableId)
    const destinationIndex = columns.findIndex(column => column.id === destination.droppableId)

    columnsClone[sourceIndex] = sourceList
    columnsClone[destinationIndex] = destinationList


    updateItems(data, columnsClone)
    setColumns(columnsClone)
  }

  const reorderColumns = (source, destination) => {
    const [items, data] = reorder(
      [...columns],
      source.index,
      destination.index
    )

    updateColumns(data, items)
    setColumns(items)
  }

  return (
    <Row className='flex-row ml-3 mb-3 pb-2 mr-0 px-2 board flex-nowrap align-items-start'>
      <DragDropContext onDragEnd={onDragEnd} isDragDisabled={updating}>
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
              {columns.map((column, index) =>
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
