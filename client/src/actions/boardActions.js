import store from '../store'
import { updateColumns, updateItems, boardListener } from '@/services/boardSockets'
import { reorder, move } from '@/utils/linkedList'

export const initBoardAction = () => {
  return dispatch => {
    boardListener(board => {
      return dispatch({
        type: 'NEW_BOARD',
        board,
      })
    }) 
  }
}

export const moveWithinListAction = (source, destination) => {
  const columns = store.getState().board.columns
  const [column] = columns.filter(column => column.id === source.droppableId)
  const [items, data] = reorder(
    column.items,
    source.index,
    destination.index
  )

  const columnsClone = [...columns]
  column.items = items
  const columnIndex = columns.findIndex(column => column.id === source.droppableId)
  columnsClone[columnIndex] = column

  // Emit update to socket
  updateItems(data, columnsClone)

  // Dispatch update to state
  return dispatch => {
    dispatch({
      type: 'UPDATE_COLUMNS',
      columns: columnsClone,
    })
  }
}

export const moveToListAction = (source, destination) => {
  const columns = store.getState().board.columns
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

  // Emit update to socket
  updateItems(data, columnsClone)

  // Dispatch update to state
  return dispatch => {
    dispatch({
      type: 'UPDATE_COLUMNS',
      columns: columnsClone,
    })
  }
}

export const reorderColumnsAction = (source, destination) => {
  const columns = store.getState().board.columns
  const [items, data] = reorder(
    [...columns],
    source.index,
    destination.index
  )

  // Emit update to socket
  updateColumns(data, items)

  // Dispatch update to state
  return dispatch => {
    dispatch({
      type: 'UPDATE_COLUMNS',
      columns: items,
    })
  }
}