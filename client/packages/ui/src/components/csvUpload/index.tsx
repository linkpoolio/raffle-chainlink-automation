import React, { useState } from 'react'
import { useCSVReader, formatFileSize } from 'react-papaparse'

import {
  styles,
  DEFAULT_REMOVE_HOVER_COLOR,
  REMOVE_HOVER_COLOR_LIGHT
} from './styles'

export const CSVUpload = ({ callback }) => {
  const { CSVReader } = useCSVReader()
  const [zoneHover, setZoneHover] = useState(false)
  const [removeHoverColor, setRemoveHoverColor] = useState(
    DEFAULT_REMOVE_HOVER_COLOR
  )

  return (
    <CSVReader
      onUploadAccepted={(results: any) => {
        callback(results.data)
        setZoneHover(false)
      }}
      onDragOver={(event: DragEvent) => {
        event.preventDefault()
        setZoneHover(true)
      }}
      onDragLeave={(event: DragEvent) => {
        event.preventDefault()
        setZoneHover(false)
      }}>
      {({
        getRootProps,
        acceptedFile,
        ProgressBar,
        getRemoveFileProps,
        Remove
      }: any) => (
        <>
          <div
            {...getRootProps()}
            style={Object.assign(
              {},
              styles.zone,
              zoneHover && styles.zoneHover
            )}>
            {acceptedFile ? (
              <>
                <div style={styles.file}>
                  <div style={styles.info}>
                    <span style={styles.size}>
                      {formatFileSize(acceptedFile.size)}
                    </span>
                    <span style={styles.name}>{acceptedFile.name}</span>
                  </div>
                  <div style={styles.progressBar}>
                    <ProgressBar />
                  </div>
                  <div
                    {...getRemoveFileProps()}
                    style={styles.remove}
                    onMouseOver={(event: Event) => {
                      event.preventDefault()
                      setRemoveHoverColor(REMOVE_HOVER_COLOR_LIGHT)
                    }}
                    onMouseOut={(event: Event) => {
                      event.preventDefault()
                      setRemoveHoverColor(DEFAULT_REMOVE_HOVER_COLOR)
                    }}>
                    <Remove color={removeHoverColor} />
                  </div>
                </div>
              </>
            ) : (
              'Drop CSV file here or click to upload'
            )}
          </div>
        </>
      )}
    </CSVReader>
  )
}
