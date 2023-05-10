import { Typography } from '@mui/material'
import React from 'react'
import { FileBrowserFooterProps } from '../../Interface/FileBrowser'

const FileBrowserFooter = ({ selected }: FileBrowserFooterProps) => {
  const current = [...selected].pop()
  return (
    <>
      <Typography>{current ? current.doc_name : 'Home'}</Typography>
    </>
  )
}

export default FileBrowserFooter