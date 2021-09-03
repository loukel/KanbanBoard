import { useState, useEffect } from 'react'
import { Card } from 'react-bootstrap'
import TextareaAutosize from 'react-textarea-autosize'
import ColumnOptions from './ColumnOptions'
import { Draggable } from 'react-beautiful-dnd'
import ColumnBody from './ColumnBody'

const BoardColumn = ({ items, heading, id, index: columnIndex, updateColumn, deleteColumn }) => {
  const [label, setLabel] = useState(heading)
  const [edit, setEdit] = useState(false)

  useEffect(() => {
    setLabel(heading)
  }, [heading])

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

  const updateHeading = () => {
    setEdit(false)

    const data = {
      name: label
    }
    updateColumn(id, data)
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
                  className='label h5 m-0 pl-3 pr-3 py-0'
                  onChange={e => setLabel(e.target.value)}
                  onBlur={() => updateHeading()}
                  onKeyPress={e => e.key === 'Enter' && updateHeading()}
                  id={`header-${id}`}
                />
              : <div className='label h5 m-0 pl-3 pr-3'>{heading}</div>
            }
            <ColumnOptions
              deleteColumn={() => deleteColumn(id)}
              label={heading}
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
