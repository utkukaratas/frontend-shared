import React, { FC } from 'react'
import cn from 'classnames'

import { EditorState, EditorView, basicSetup } from '@codemirror/basic-setup'
import { javascript } from '@codemirror/lang-javascript'

import styles from './Code.module.scss'

export type CodeOptions = {
  isReadOnly: boolean
}

export type CodeProps = {
  value?: string
  className?: string
  options?: CodeOptions
}

const DEFAULT_OPTIONS: CodeOptions = {
  isReadOnly: false,
}

export const Code: FC<CodeProps> = ({ value, className, options = DEFAULT_OPTIONS }) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const [cm, setCm] = React.useState<any>(null)

  React.useEffect(() => {
    if (!cm) {
      let instance = new EditorView({
        state: EditorState.create({
          doc: value || '',
          extensions: [basicSetup, javascript(), EditorView.editable.of(!options.isReadOnly)],
        }),
        parent: ref.current as any,
      })

      setCm(instance)
    }
    return () => {
      setCm(null)
    }
  }, [])

  React.useMemo(() => {
    if (!cm) return
    cm.dispatch({
      changes: { from: 0, to: cm.state.doc.length, insert: value },
    })
  }, [value])

  return (
    <div className={cn(styles.container, className)}>
      xxx cm6 version
      <div ref={ref}></div>
    </div>
  )
}
