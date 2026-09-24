import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { sql } from '@codemirror/lang-sql'
import { bracketMatching, defaultHighlightStyle, HighlightStyle, indentOnInput, indentUnit, syntaxHighlighting } from '@codemirror/language'
import { Compartment, EditorState } from '@codemirror/state'
import { drawSelection, EditorView, highlightActiveLine, highlightActiveLineGutter, keymap, lineNumbers, placeholder } from '@codemirror/view'
import { tags as t } from '@lezer/highlight'
import { useEffect, useRef } from 'react'

const darkStyle = HighlightStyle.define([
  { tag: t.keyword, color: '#c792ea' },
  { tag: [t.string, t.special(t.string)], color: '#c3e88d' },
  { tag: [t.number, t.bool, t.null], color: '#f78c6c' },
  { tag: t.comment, color: '#6b7394', fontStyle: 'italic' },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: '#82aaff' },
  { tag: t.definition(t.variableName), color: '#ffcb6b' },
  { tag: t.typeName, color: '#ffcb6b' },
  { tag: t.operator, color: '#89ddff' },
])

function isDark() {
  const attr = document.documentElement.dataset.theme
  if (attr) return attr === 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function langExt(lang: string) {
  if (lang === 'py') return python()
  if (lang === 'sql') return sql()
  return javascript()
}

interface Props {
  value: string
  onChange: (v: string) => void
  lang: 'js' | 'py' | 'sql'
  onRun?: () => void
  minHeight?: number
  placeholderText?: string
}

export function CodeEditor({ value, onChange, lang, onRun, minHeight, placeholderText }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const view = useRef<EditorView | null>(null)
  const langComp = useRef(new Compartment())
  const themeComp = useRef(new Compartment())
  const onChangeRef = useRef(onChange)
  const onRunRef = useRef(onRun)
  onChangeRef.current = onChange
  onRunRef.current = onRun

  useEffect(() => {
    const state = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLineGutter(),
        history(),
        drawSelection(),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        highlightActiveLine(),
        indentUnit.of('    '),
        EditorState.tabSize.of(4),
        themeComp.current.of(syntaxHighlighting(isDark() ? darkStyle : defaultHighlightStyle, { fallback: true })),
        placeholder(placeholderText ?? ''),
        keymap.of([
          { key: 'Mod-Enter', run: () => (onRunRef.current?.(), true) },
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...historyKeymap,
          indentWithTab,
        ]),
        langComp.current.of(langExt(lang)),
        EditorView.updateListener.of((u) => {
          if (u.docChanged) onChangeRef.current(u.state.doc.toString())
        }),
        EditorView.theme({ '&': { minHeight: `${minHeight ?? 280}px` }, '.cm-scroller': { minHeight: `${minHeight ?? 280}px` } }),
      ],
    })
    view.current = new EditorView({ state, parent: host.current! })
    const retheme = () =>
      view.current?.dispatch({ effects: themeComp.current.reconfigure(syntaxHighlighting(isDark() ? darkStyle : defaultHighlightStyle, { fallback: true })) })
    const obs = new MutationObserver(retheme)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', retheme)
    return () => {
      obs.disconnect()
      mq.removeEventListener('change', retheme)
      view.current?.destroy()
    }
    // editor is created once; value/lang sync handled below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const v = view.current
    if (v && v.state.doc.toString() !== value) {
      v.dispatch({ changes: { from: 0, to: v.state.doc.length, insert: value } })
    }
  }, [value])

  useEffect(() => {
    view.current?.dispatch({ effects: langComp.current.reconfigure(langExt(lang)) })
  }, [lang])

  return <div ref={host} />
}
