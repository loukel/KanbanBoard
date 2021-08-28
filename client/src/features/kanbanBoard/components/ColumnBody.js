import { Droppable } from 'react-beautiful-dnd'
import { Card } from 'react-bootstrap'
import ItemCard from './ItemCard'

const ColumnBody = ({ items, id }) => {
  return (
    <Droppable
      droppableId={`I${id}`}
      type={'ITEMS'}
      direction='vertical'
    >
      {(provided) => (
        <Card.Body
          className='p-2'
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {items.map((item, index) =>
            <ItemCard
              item={item}
              index={index}
              key={item.id}
            />
          )}
          {provided.placeholder}
        </Card.Body>
      )}
    </Droppable>
  )
}

export default ColumnBody
