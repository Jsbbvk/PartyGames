import { Box, ButtonGroup, styled, Tooltip, Button } from '@mui/material'
import TextFieldsIcon from '@mui/icons-material/TextFields'
import DeleteIcon from '@mui/icons-material/Delete'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import React from 'react'

const StyledButton = styled(Button)({
  borderRadius: 0,
  color: '#000000DE',
  userSelect: 'none',
  backgroundColor: '#fff',
  padding: '9px 0',
  textAlign: 'center',
  '&:hover, &:active': {
    backgroundColor: '#eaeaea',
  },

  '&.Mui-disabled': {
    pointerEvents: 'auto',
    backgroundColor: '#dcdcdc',
    '&:hover': {
      backgroundColor: '#dcdcdc',
    },
  },
})

const iconFontSize = 16

const CanvasToolbar = ({ textProps, deleteProps, undoProps, redoProps }) => {
  const buttonGroupStyles = {
    padding: '7px 7px 0 7px',
    boxShadow: 'none',

    '& > *': {
      border: '0 !important',
      borderRadius: '0 !important',
      margin: '0 7px',
    },
  }

  return (
    <Box>
      <ButtonGroup variant="contained" size="small" sx={buttonGroupStyles}>
        <ToolbarButton title="Add text" {...textProps}>
          <TextFieldsIcon sx={{ fontSize: iconFontSize }} />
        </ToolbarButton>
        <ToolbarButton title="Delete" {...deleteProps}>
          <DeleteIcon sx={{ fontSize: iconFontSize }} />
        </ToolbarButton>
        <ToolbarButton title="Undo" {...undoProps}>
          <UndoIcon sx={{ fontSize: iconFontSize }} />
        </ToolbarButton>
        <ToolbarButton title="Redo" {...redoProps}>
          <RedoIcon sx={{ fontSize: iconFontSize }} />
        </ToolbarButton>
      </ButtonGroup>
    </Box>
  )
}

const ToolbarButton = ({
  title,
  disabled,
  onClick,
  tooltipPlacement = 'top',
  ...props
}) => {
  const adjustedButtonProps = {
    disabled,
    component: disabled ? 'div' : undefined,
    onClick: disabled ? undefined : onClick,
  }

  return (
    <Tooltip title={title} placement={tooltipPlacement} disableFocusListener>
      <Box>
        <StyledButton {...props} {...adjustedButtonProps} disableRipple>
          {props.children}
        </StyledButton>
      </Box>
    </Tooltip>
  )
}

export default CanvasToolbar
