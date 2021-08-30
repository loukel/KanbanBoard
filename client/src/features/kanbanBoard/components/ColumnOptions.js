import { useRef, useState } from 'react'
import { Overlay, Card, Button } from 'react-bootstrap'

const ColumnOptions = ({ deleteColumn, label, empty, toggleColumn, hidden, edit }) => {
  const target = useRef(null)
  const [showOptions, setShowOptions] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  return (
    <div ref={target}>
      <div
        onClick={() => setShowOptions(!showOptions)}
        className='board-close'
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="5" height="18" viewBox="0 0 3 15" className='m-1'>
          <path style={{ fill: '#1c7cd5' }} d="M0,13.5A1.5,1.5,0,1,1,1.5,15,1.5,1.5,0,0,1,0,13.5Zm0-6A1.5,1.5,0,1,1,1.5,9,1.5,1.5,0,0,1,0,7.5Zm0-6A1.5,1.5,0,1,1,1.5,3,1.5,1.5,0,0,1,0,1.5Z" />
        </svg>
      </div>

      {/* Options */}
      <Overlay
        show={showOptions}
        target={target.current}
        placement="right"
        rootClose
        onHide={() => setShowOptions(false)}
      >
        <Card className='label-actions text-center'>
          <Card.Header className='py-1'>
            Actions
            <button className="close board-close" aria-label="close" onClick={() => setShowOptions(false)}>
              <span aria-hidden="true">×</span>
            </button>
          </Card.Header>
          <Card.Body className='p-0'>
            <Button variant='light' className='w-100 py-1' onClick={() => {
              setShowOptions(false)
              edit()
            }}>
              Edit
            </Button>
            <Button variant='light' className='w-100 py-1' onClick={() => {
              setShowOptions(false)
              empty
                ? setShowConfirmation(true)
                : setShowWarning(true)
            }}>
              Delete
            </Button>
          </Card.Body>
        </Card>
      </Overlay>

      {/* Confirmation for deleting the column */}
      <Overlay
        show={showConfirmation}
        target={target.current}
        placement="bottom"
        rootClose
        onHide={() => setShowConfirmation(false)}
      >
        <Card>
          <Card.Header className=''>
            <h5>Are you sure?</h5>
            <button className="close board-close" aria-label="close" onClick={() => setShowConfirmation(false)}>
              <span aria-hidden="true">×</span>
            </button>
          </Card.Header>
          <Card.Body className='d-flex flex-column' style={{ width: '300px' }}>
            There is no undo! Once {`'${label}'`} is deleted, it&apos;s gone forever.
            <Button variant={'danger'} className='mt-2' onClick={deleteColumn}>Delete Label</Button>
          </Card.Body>
        </Card>
      </Overlay>

      {/* Warning about delete columns with items */}
      <Overlay
        show={showWarning}
        target={target.current}
        placement="bottom"
        rootClose
        onHide={() => setShowWarning(false)}
      >
        <Card>
          <Card.Header>
            <h5>Warning </h5>
            <button className="close board-close" aria-label="close" onClick={() => setShowWarning(false)}>
              <span aria-hidden="true">×</span>
            </button>
          </Card.Header>
          <Card.Body className='d-flex flex-column' style={{ width: '300px' }}>
            You can&apos;t delete {`'${label}'`} because it&apos;s not empty. Move all the projects into another column if you want to delete it.
          </Card.Body>
        </Card>
      </Overlay>
    </div>
  )
}

export default ColumnOptions
