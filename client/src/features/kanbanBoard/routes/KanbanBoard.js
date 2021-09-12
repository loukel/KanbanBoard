import { Board } from "../components/Board"
import { Container } from "react-bootstrap"
import { useSelector, useDispatch } from 'react-redux'
import { initBoardAction } from "@/actions/boardActions"
import { useEffect } from "react"

export const KanbanBoard = () => {
  const board = useSelector(state => state.board)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initBoardAction())
  }, [])

  if (board.loading) {
    return <div>Loading...</div>
  }

  return (
    <Container className='text-center p-3'>
      <Board 
        columns={board.columns} 
        updating={board.updating} 
      />
    </Container>
  )
}