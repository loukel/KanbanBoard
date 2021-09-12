import BoardColumn from './BoardColumn'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { Row } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { moveToListAction, moveWithinListAction, reorderColumnsAction } from '@/actions/boardActions'

export const Board = ({ columns, updating }) => {
  const dispatch = useDispatch()

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
        if (source.droppableId === destination.droppableId) {
          return dispatch(moveWithinListAction(source, destination))
        } else {
          return dispatch(moveToListAction(source, destination))
        }
      case 'COLUMNS':
        return dispatch(reorderColumnsAction(source, destination))
      default:
        return
    }
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
