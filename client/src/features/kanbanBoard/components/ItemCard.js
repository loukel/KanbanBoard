import { Draggable } from 'react-beautiful-dnd'
import { Card } from 'react-bootstrap'

const ItemCard = ({ item, index }) => {
  return (
      <Draggable
        draggableId={`I${item.id}`}
        index={index}
      >
        {provided => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Card className='bg-primary text-white d-flex p-3 mb-2 project-card'>
              <span className='h5'>{item.name}</span>
            </Card>
          </div>
        )}
      </Draggable>
  )
}

export default ItemCard
