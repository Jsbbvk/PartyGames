import { isMobile } from 'react-device-detect'

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
  // stroke: '#d8d8d8',
  fill: '#ffffff',
  stroke: '#000000',
  strokeWidth: 2.5,
  // strokeWidth: isMobile ? 1 : 1.25,
  // charSpacing: 0,
  fontWeight: 'bold',
}

export const objectOptions = {
  width: '500px',
  height: '500px',
}

export const defaultCanvasOptions = {
  width: 500,
  height: 500,
  maxWidth: 600,
  maxHeight: 600,
  selection: true,
  defaultCursor: 'default',
  isFullscreen: false,
}
