import { useState, useEffect } from 'react'
import { Card } from 'react-bootstrap'
import TextareaAutosize from 'react-textarea-autosize'
import ColumnOptions from './ColumnOptions'
import { Draggable } from 'react-beautiful-dnd'
import { updateColumn } from '@/services/columnApi'
import ColumnBody from './ColumnBody'

const BoardColumn = ({ items, heading, id, deleteColumn, index: columnIndex }) => {
  const [label, setLabel] = useState(heading)
  const [edit, setEdit] = useState(false)

  useEffect(() => {
    if (edit) {
      const headerEl = document.getElementById(`header-${id}`)

      // Focus the input field
      headerEl.focus()

      // Start the cursor at the end of the input
      const value = headerEl.value
      headerEl.value = ''
      headerEl.value = value
    }
  }, [edit])

  const updateLabel = async () => {
    setEdit(false)

    const data = {
      name: label
    }
    await updateColumn(id, data)
  }

  return (
    <Draggable index={columnIndex} draggableId={`C${id}`}>
    {provided => (
      <div ref={provided.innerRef} {...provided.draggableProps}>
        <Card className='mr-2 board-column'>
          <Card.Header className='d-flex px-0 position-relative' {...provided.dragHandleProps}>
            {
              edit
              ? <TextareaAutosize
                  type='textarea'
                  value={label}
                  onChange={(event) => { setLabel(event.target.value) }}
                  className='label h5 m-0 pl-3 pr-3 py-0'
                  onBlur={updateLabel}
                  onKeyPress={(e) => e.key === 'Enter' && updateLabel()}
                  id={`header-${id}`}
                />
              : <div className='label h5 m-0 pl-3 pr-3'>{label}</div>
            }
            <ColumnOptions
              deleteColumn={() => deleteColumn(id)}
              label={label}
              empty={items.length === 0}
              edit={() => setEdit(true)}
            />
          </Card.Header>
          <ColumnBody
            items={items}
            id={id}
          />
        </Card>
      </div>
      )}
    </Draggable>
  )
}

export default BoardColumn
