import { Stack, Box } from '@mui/material'
import { useEffect, useRef, useState } from 'react'

import Canvas from './Canvas'
import CanvasToolbar from './CanvasToolbar'

const CanvasWorkarea = ({ backgroundImage }) => {
  const canvasRef = useRef(null)
  const [transactions, setTransactions] = useState()
  const [activeObject, setActiveObject] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    canvasRef.current.setBackgroundImage(backgroundImage)
  }, [backgroundImage])

  const onTextAdd = () => {
    canvasRef.current?.addText('text')
  }

  const onDelete = () => {
    canvasRef.current?.remove()
  }

  const onUndo = () => {
    canvasRef.current?.undo()
  }

  const onRedo = () => {
    canvasRef.current?.redo()
  }

  const onTransaction = (t) => setTransactions(t)

  const onObjectSelect = (object) => {
    setIsEditing(object?.isEditing)
    setActiveObject(object && !object?.isEditing)
  }

  return (
    <Box>
      <Stack alignItems="center" mb={1.5}>
        <CanvasToolbar
          textProps={{ onClick: onTextAdd }}
          deleteProps={{
            onClick: onDelete,
            disabled: !activeObject,
          }}
          undoProps={{
            onClick: onUndo,
            disabled: isEditing || !transactions?.undos.length,
          }}
          redoProps={{
            onClick: onRedo,
            disabled: isEditing || !transactions?.redos.length,
          }}
        />
      </Stack>
      <Canvas
        ref={canvasRef}
        onTransaction={onTransaction}
        onSelect={onObjectSelect}
      />
    </Box>
  )
}

export default CanvasWorkarea
