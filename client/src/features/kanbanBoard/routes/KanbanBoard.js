import { useEffect, useState } from "react"
import { getAllColumns } from "@/services/columnApi"
import { Board } from "../components/Board"
import { Container } from "react-bootstrap"

export const KanbanBoard = () => {
  const [loading, setLoading] = useState(true)
  const [columns, setColumns] = useState([])

  // Fetch-then-render columns
  useEffect(async () => {
    const columns = await getAllColumns()
    setColumns(columns)
    setLoading(false)
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Container>
      <Board columns={columns} />
    </Container>
  )
}