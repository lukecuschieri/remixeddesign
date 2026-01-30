import {PatchEvent, set} from 'sanity'
import {Box, Button, Stack, Text, TextArea} from '@sanity/ui'
import {useCallback, useState} from 'react'
import type {ClipboardEvent, FormEvent} from 'react'

/**
 * Paste handler: captures full HTML with figmeta (Figma native copy).
 * Uses text/html so vector data in data-metadata is preserved.
 */
function getPastedHtml(event: ClipboardEvent<HTMLDivElement>): string | null {
  const dt = event.clipboardData
  if (!dt) return null
  const html = dt.getData('text/html')
  if (html && html.trim()) return html
  return null
}

/**
 * Copy stored HTML back to clipboard as text/html so Figma can paste it.
 * Preserves figmeta structure (base64-encoded vector data).
 */
async function copyHtmlToClipboard(html: string): Promise<boolean> {
  if (!html?.trim()) return false
  try {
    const blob = new Blob([html], {type: 'text/html'})
    await navigator.clipboard.write([new ClipboardItem({'text/html': blob})])
    return true
  } catch {
    return false
  }
}

export interface FigmaClipboardInputProps {
  value?: string | null
  onChange: (event: PatchEvent) => void
  readOnly?: boolean
  schemaType?: {title?: string; options?: {rows?: number}; description?: string; [key: string]: unknown}
  [key: string]: unknown
}

// Sanity passes StringInputProps; we accept compatible props (value, onChange, readOnly, schemaType).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function FigmaClipboardInput(props: any) {
  const {value = '', onChange, readOnly, schemaType} = props
  const [copied, setCopied] = useState(false)

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLDivElement>) => {
      const htmlData = getPastedHtml(e)
      if (htmlData) {
        e.preventDefault()
        e.stopPropagation()
        onChange(PatchEvent.from(set(htmlData)))
      }
    },
    [onChange]
  )

  const handleChange = useCallback(
    (e: FormEvent<HTMLTextAreaElement>) => {
      const next = (e.target as HTMLTextAreaElement).value
      onChange(PatchEvent.from(set(next)))
    },
    [onChange]
  )

  const handleCopy = useCallback(async () => {
    const ok = await copyHtmlToClipboard(value || '')
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [value])

  const rows = schemaType?.options?.rows ?? 12

  return (
    <Stack space={3}>
      <Box onPasteCapture={handlePaste}>
        <TextArea
          value={value ?? ''}
          onChange={handleChange}
          readOnly={readOnly}
          rows={rows}
          placeholder="Paste from Figma (native Copy, not Copy as SVG). HTML with figmeta will be stored."
        />
      </Box>
      <Stack space={2}>
        <Button
          text={copied ? 'Copied!' : 'Copy to clipboard'}
          tone={copied ? 'positive' : 'primary'}
          disabled={!value?.trim() || readOnly}
          onClick={handleCopy}
        />
        <Text size={1} muted>
          In Figma: select vector/shape layers → Right‑click → Copy (or Cmd/Ctrl+C). Paste here to
          store HTML with figmeta. Use the Copy button above to copy back into Figma.
        </Text>
      </Stack>
    </Stack>
  )
}
