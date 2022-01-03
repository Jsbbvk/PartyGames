import { Stack, Box } from '@mui/material'
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

import Canvas from './Canvas'
import CanvasToolbar from './CanvasToolbar'

const CanvasWorkarea = ({ backgroundImage }, ref) => {
  const canvasRef = useRef(null)
  const [transactions, setTransactions] = useState()
  const [activeObject, setActiveObject] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editable, setEditable] = useState(true)

  const black = '#000000'
  const white = '#e9e9e9'

  const [alignment, setAlignment] = useState('left')
  const [defaultAlignment, setDefaultAlignment] = useState('left')
  const [defaultTextColor, setDefaultTextColor] = useState(black)
  const [textColor, setTextColor] = useState(black)

  useEffect(() => {
    canvasRef.current.setBackgroundImage(backgroundImage)
  }, [backgroundImage])

  const getDataUrl = () => canvasRef.current?.exportCanvas()

  const onTextAdd = () => {
    canvasRef.current?.addText('text', {
      textAlign: defaultAlignment,
      fill: defaultTextColor,
    })
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

  const setCanvasEditable = (canEdit) => {
    setEditable(canEdit)
    canvasRef.current?.setCanvasEditable(canEdit)
  }

  const onTransaction = (t) => setTransactions(t)

  const onObjectSelect = (object) => {
    setIsEditing(object?.isEditing)
    setActiveObject(object)
  }

  useEffect(() => {
    if (!activeObject) {
      setAlignment(defaultAlignment)
      setTextColor(defaultTextColor)
      return
    }

    if (activeObject.type === 'i-text') {
      setAlignment(activeObject.textAlign)
      setTextColor(activeObject.fill)
    }
  }, [activeObject])

  const alignText = (align) => {
    canvasRef.current?.alignText(align)
  }

  const setTextFill = (color) => {
    canvasRef.current?.setTextFill(color)
  }

  const toggleAlignment = () => {
    if (activeObject) {
      const newAlign = alignment === 'left' ? 'center' : 'left'
      setAlignment(newAlign)
      alignText(newAlign)
    } else {
      const newAlign = defaultAlignment === 'left' ? 'center' : 'left'
      setDefaultAlignment(newAlign)
      setAlignment(newAlign)
    }
  }

  const toggleTextColor = () => {
    if (activeObject) {
      const newColor = textColor === black ? white : black
      setTextColor(newColor)
      setTextFill(newColor)
    } else {
      const newColor = textColor === black ? white : black
      setTextColor(newColor)
      setDefaultTextColor(newColor)
    }
  }

  useImperativeHandle(ref, () => ({
    getDataUrl,
    setCanvasEditable,
  }))

  return (
    <Box>
      <Stack alignItems="center" mb={1.5}>
        <CanvasToolbar
          props={{
            alignment,
            textColor,
          }}
          textColorProps={{
            onClick: toggleTextColor,
            disabled: isEditing || !editable,
          }}
          alignProps={{
            onClick: toggleAlignment,
            disabled: isEditing || !editable,
          }}
          textProps={{ onClick: onTextAdd, disabled: !editable }}
          deleteProps={{
            onClick: onDelete,
            disabled: !activeObject || isEditing || !editable,
          }}
          undoProps={{
            onClick: onUndo,
            disabled: isEditing || !transactions?.undos.length || !editable,
          }}
          redoProps={{
            onClick: onRedo,
            disabled: isEditing || !transactions?.redos.length || !editable,
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

export default forwardRef(CanvasWorkarea)
