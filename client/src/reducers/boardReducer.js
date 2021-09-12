const initialState = {
  loading: true,
  columns: [],
  updating: false,
  lastUpdated: null,
}

export default function boardReducer(state = initialState, action) {
  switch (action.type) {
    case 'NEW_BOARD':
      if (state.lastUpdated === null || action.board.lastUpdated > state.lastUpdated) {
        return { ...action.board }
      } else {
        return state
      }
    case 'UPDATE_COLUMNS':
      return { columns: action.columns, updating: true, ...state, lastUpdated: new Date().toISOString() }
    default:
      return state
  }
}
