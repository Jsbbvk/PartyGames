import { isMobile } from 'react-device-detect'

export const TRANSACTION_TYPES = {
  add: 'add',
  update: 'update',
  remove: 'remove',
}

export const fontOptions = {
  left: isMobile ? 50 : 100,
  top: isMobile ? 50 : 30,
  fontSize: isMobile ? 30 : 40,
}

export const impactOptions = {
  fontFamily: 'Impact',
  fill: '#ffffff',
  stroke: '#000000',
  fontWeight: 'bold',
}

export const arialOptions = {
  fontFamily: 'Arial',
  stroke: '#ffffff',
  fill: '#000000',
  strokeWidth: 1,
  paintFirst: 'stroke',
}

export const objectOptions = {
  width: '500px',
  height: '500px',
}

export const defaultCanvasOptions = {
  width: 500,
  height: 500,
  maxWidth: 500,
  maxHeight: 600,
  selection: true,
  defaultCursor: 'default',
  isFullscreen: false,
}
