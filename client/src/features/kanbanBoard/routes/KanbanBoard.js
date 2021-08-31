import { useEffect, useState } from "react"
import { getAllColumns } from "@/services/columnApi"
import { Board } from "../components/Board"
import { Container } from "react-bootstrap"

export const KanbanBoard = () => {
  const [loading, setLoading] = useState(true)
  const [columns, setColumns] = useState([])

  // Fetch-then-render columns
  useEffect(() => {
    const fetchData = async () => {
      const columns = await getAllColumns()
      setColumns(columns)
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Container className='text-center p-3'>
      <Board columns={columns} />
    </Container>
  )
}