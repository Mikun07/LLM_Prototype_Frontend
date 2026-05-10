import jsPDF from 'jspdf'
import pdfHeaderUrl from '../assets/pdf-header.png'
import type {
  AmbiguityResult,
  ComparisonReport,
  ComparisonRow,
  InconsistencyResult,
  ModelReport,
  SmellLabel,
} from '../types'
import { appVersionLabel } from '../constants/appVersion'
import { formatModelName, formatPercentage } from './formatters'

type PdfField = {
  label: string
  value: string
}

type PdfStat = {
  label: string
  value: string
}

type ReviewItem = {
  id: string
  check: string
  domain: string
  requirement: string
  reason: string
  suggestion: string
  extraFields?: PdfField[]
}

type ReviewSelection = {
  shown: ReviewItem[]
  totalReview: number
  hiddenClean: number
  hiddenByLimit: number
}

const appName = 'ReqSmell'
const appVersionStamp = `${appName} ${appVersionLabel}`
const pageMargin = 16
const pageTop = 42
const footerHeight = 20
const lineHeight = 4.6
const maxReviewItemsInPdf = 100
let pdfHeaderImagePromise: Promise<HTMLImageElement> | null = null

function formatDateTime(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function getFileStem(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '')
}

function getPageWidth(doc: jsPDF): number {
  return doc.internal.pageSize.getWidth()
}

function getPageHeight(doc: jsPDF): number {
  return doc.internal.pageSize.getHeight()
}

function getContentWidth(doc: jsPDF): number {
  return getPageWidth(doc) - pageMargin * 2
}

function getContentBottom(doc: jsPDF): number {
  return getPageHeight(doc) - footerHeight
}

function ensureSpace(doc: jsPDF, y: number, neededHeight: number): number {
  if (y + neededHeight <= getContentBottom(doc)) {
    return y
  }

  doc.addPage()

  return pageTop
}

function wrapText(doc: jsPDF, text: string, maxWidth: number): string[] {
  return text.split('\n').flatMap((paragraph, index, paragraphs) => {
    const lines = doc.splitTextToSize(paragraph || ' ', maxWidth) as string[]

    return index === paragraphs.length - 1 ? lines : [...lines, ' ']
  })
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text
  }

  return `${text.slice(0, maxLength - 3).trim()}...`
}

function resultLabel(label: SmellLabel): string {
  return label === 'SMELL' ? 'Needs review' : 'Clean'
}

function setTextColor(doc: jsPDF, color: [number, number, number]): void {
  doc.setTextColor(color[0], color[1], color[2])
}

function setFillColor(doc: jsPDF, color: [number, number, number]): void {
  doc.setFillColor(color[0], color[1], color[2])
}

function setDrawColor(doc: jsPDF, color: [number, number, number]): void {
  doc.setDrawColor(color[0], color[1], color[2])
}

function loadPdfHeaderImage(): Promise<HTMLImageElement> {
  if (pdfHeaderImagePromise !== null) {
    return pdfHeaderImagePromise
  }

  pdfHeaderImagePromise = new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Unable to load PDF header image.'))
    image.src = pdfHeaderUrl
  })

  return pdfHeaderImagePromise
}

function addFallbackHeader(doc: jsPDF): number {
  setFillColor(doc, [92, 75, 235])
  doc.roundedRect(6, 8, getPageWidth(doc) - 12, 22, 3, 3, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  setTextColor(doc, [255, 255, 255])
  doc.text(appName, pageMargin, 21)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.text(appVersionStamp, getPageWidth(doc) - pageMargin, 21, { align: 'right' })

  return 39
}

function addVersionStamp(doc: jsPDF, y: number, color: [number, number, number]): void {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  setTextColor(doc, color)
  doc.text(appVersionStamp, getPageWidth(doc) - pageMargin, y, { align: 'right' })
}

async function addHeader(doc: jsPDF, title: string, subtitle: string): Promise<number> {
  let y = 39

  try {
    const image = await loadPdfHeaderImage()
    const imageWidth = getPageWidth(doc) - 12
    const imageHeight = imageWidth * (image.naturalHeight / image.naturalWidth)

    doc.addImage(image, 'PNG', 6, 8, imageWidth, imageHeight)
    addVersionStamp(doc, 20, [255, 255, 255])
    y = 8 + imageHeight + 12
  } catch {
    y = addFallbackHeader(doc)
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  setTextColor(doc, [15, 23, 42])
  doc.text(title, pageMargin, y)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  setTextColor(doc, [71, 85, 105])
  doc.text(subtitle, pageMargin, y + 7)
  addVersionStamp(doc, y + 7, [71, 85, 105])

  return y + 18
}

function addFooter(doc: jsPDF): void {
  const pageCount = doc.getNumberOfPages()
  const generatedOn = formatDateTime(new Date())
  const pageWidth = getPageWidth(doc)
  const pageHeight = getPageHeight(doc)
  const footerText = `Generated on ${generatedOn} | Copyright (c) ${new Date().getFullYear()} ${appName}. All rights reserved.`

  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page)
    setDrawColor(doc, [226, 232, 240])
    doc.line(pageMargin, pageHeight - 14, pageWidth - pageMargin, pageHeight - 14)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    setTextColor(doc, [100, 116, 139])
    doc.text(footerText, pageMargin, pageHeight - 8)
    doc.text(`Page ${page} of ${pageCount}`, pageWidth - pageMargin, pageHeight - 8, {
      align: 'right',
    })
  }
}

function addMetaRows(doc: jsPDF, rows: readonly PdfField[], y: number): number {
  const labelWidth = 31
  let currentY = ensureSpace(doc, y, rows.length * 6 + 4)

  rows.forEach((row) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    setTextColor(doc, [51, 65, 85])
    doc.text(`${row.label}:`, pageMargin, currentY)

    doc.setFont('helvetica', 'normal')
    setTextColor(doc, [71, 85, 105])
    doc.text(row.value, pageMargin + labelWidth, currentY)
    currentY += 6
  })

  return currentY + 4
}

function addSummaryStats(doc: jsPDF, stats: readonly PdfStat[], y: number): number {
  const gap = 4
  const cardWidth = (getContentWidth(doc) - gap * 3) / 4
  const cardHeight = 19
  const nextY = ensureSpace(doc, y, cardHeight + 6)

  stats.forEach((stat, index) => {
    const x = pageMargin + index * (cardWidth + gap)

    setFillColor(doc, [248, 250, 252])
    setDrawColor(doc, [226, 232, 240])
    doc.roundedRect(x, nextY, cardWidth, cardHeight, 2.5, 2.5, 'FD')

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    setTextColor(doc, [100, 116, 139])
    doc.text(stat.label, x + 4, nextY + 6)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    setTextColor(doc, [15, 23, 42])
    doc.text(stat.value, x + 4, nextY + 14)
  })

  return nextY + cardHeight + 8
}

function addNote(doc: jsPDF, title: string, text: string, y: number): number {
  const width = getContentWidth(doc)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  const lines = wrapText(doc, text, width - 10)
  const height = 12 + lines.length * lineHeight
  const nextY = ensureSpace(doc, y, height + 4)

  setFillColor(doc, [239, 246, 255])
  setDrawColor(doc, [191, 219, 254])
  doc.roundedRect(pageMargin, nextY, width, height, 2.5, 2.5, 'FD')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  setTextColor(doc, [30, 64, 175])
  doc.text(title, pageMargin + 5, nextY + 7)

  doc.setFont('helvetica', 'normal')
  setTextColor(doc, [51, 65, 85])
  doc.text(lines, pageMargin + 5, nextY + 13)

  return nextY + height + 8
}

function addSectionHeading(doc: jsPDF, title: string, y: number): number {
  const nextY = ensureSpace(doc, y, 12)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  setTextColor(doc, [15, 23, 42])
  doc.text(title, pageMargin, nextY)
  setDrawColor(doc, [226, 232, 240])
  doc.line(pageMargin, nextY + 4, getPageWidth(doc) - pageMargin, nextY + 4)

  return nextY + 10
}

function drawReviewTableHeader(doc: jsPDF, y: number): number {
  const columnWidths = getReviewTableWidths(doc)
  const headers = ['Item', 'Check', 'Domain', 'Main reason']
  let x = pageMargin

  setFillColor(doc, [241, 245, 249])
  setDrawColor(doc, [203, 213, 225])
  doc.rect(pageMargin, y, getContentWidth(doc), 9, 'FD')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  setTextColor(doc, [51, 65, 85])
  headers.forEach((header, index) => {
    doc.text(header, x + 2, y + 5.8)
    x += columnWidths[index]
  })

  return y + 9
}

function getReviewTableWidths(doc: jsPDF): number[] {
  const width = getContentWidth(doc)

  return [26, 32, 36, width - 94]
}

function addReviewTable(doc: jsPDF, items: readonly ReviewItem[], y: number): number {
  let currentY = addSectionHeading(doc, 'Review queue', y)

  if (items.length === 0) {
    return addNote(
      doc,
      'No detailed review rows',
      'No review-first rows are available for this report.',
      currentY,
    )
  }

  currentY = drawReviewTableHeader(doc, currentY)

  items.forEach((item) => {
    const columnWidths = getReviewTableWidths(doc)
    const reasonLines = wrapText(doc, truncateText(item.reason, 180), columnWidths[3] - 4)
    const rowHeight = Math.max(10, reasonLines.length * 4 + 5)
    let rowY = ensureSpace(doc, currentY, rowHeight + 9)

    if (rowY !== currentY) {
      rowY = drawReviewTableHeader(doc, rowY)
    }

    setDrawColor(doc, [226, 232, 240])
    doc.rect(pageMargin, rowY, getContentWidth(doc), rowHeight, 'S')

    let x = pageMargin
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    setTextColor(doc, [15, 23, 42])
    doc.text(item.id, x + 2, rowY + 6)

    x += columnWidths[0]
    doc.setFont('helvetica', 'normal')
    doc.text(item.check, x + 2, rowY + 6)

    x += columnWidths[1]
    doc.text(wrapText(doc, item.domain, columnWidths[2] - 4), x + 2, rowY + 6)

    x += columnWidths[2]
    doc.text(reasonLines, x + 2, rowY + 6)

    currentY = rowY + rowHeight
  })

  return currentY + 8
}

function addField(doc: jsPDF, field: PdfField, y: number): number {
  const valueWidth = getContentWidth(doc) - 8
  let currentY = ensureSpace(doc, y, 10)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  setTextColor(doc, [71, 85, 105])
  doc.text(field.label, pageMargin + 4, currentY)
  currentY += 4.5

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  setTextColor(doc, [15, 23, 42])

  wrapText(doc, field.value, valueWidth).forEach((line) => {
    currentY = ensureSpace(doc, currentY, lineHeight)
    doc.text(line, pageMargin + 4, currentY)
    currentY += lineHeight
  })

  return currentY + 1.5
}

function addDetailItem(
  doc: jsPDF,
  item: ReviewItem,
  itemNumber: number,
  y: number,
): number {
  let currentY = ensureSpace(doc, y, 18)

  setDrawColor(doc, [37, 99, 235])
  doc.setLineWidth(0.8)
  doc.line(pageMargin, currentY - 2, pageMargin, currentY + 7)
  doc.setLineWidth(0.2)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  setTextColor(doc, [15, 23, 42])
  doc.text(`${itemNumber}. ${item.id} - ${item.check}`, pageMargin + 4, currentY)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  setTextColor(doc, [190, 18, 60])
  doc.text('Needs review', getPageWidth(doc) - pageMargin, currentY, { align: 'right' })
  currentY += 7

  const fields: PdfField[] = [
    { label: 'Domain', value: item.domain },
    { label: 'Requirement', value: item.requirement },
    ...(item.extraFields ?? []),
    { label: 'Reason', value: item.reason },
    { label: 'Suggested action', value: item.suggestion || 'None' },
  ]

  fields.forEach((field) => {
    currentY = addField(doc, field, currentY)
  })

  setDrawColor(doc, [226, 232, 240])
  doc.line(pageMargin, currentY + 1, getPageWidth(doc) - pageMargin, currentY + 1)

  return currentY + 8
}

function addDetails(doc: jsPDF, items: readonly ReviewItem[], y: number): number {
  let currentY = addSectionHeading(doc, 'Review details', y)

  if (items.length === 0) {
    return addNote(
      doc,
      'Nothing to review',
      'No rows were flagged for manual review in this report.',
      currentY,
    )
  }

  items.forEach((item, index) => {
    currentY = addDetailItem(doc, item, index + 1, currentY)
  })

  return currentY
}

function addSelectionNote(
  doc: jsPDF,
  selection: ReviewSelection,
  cleanLabel: string,
  reviewLabel: string,
  y: number,
): number {
  const cleanText =
    selection.hiddenClean === 0
      ? ''
      : ` ${selection.hiddenClean} ${cleanLabel} are counted in the summary and not repeated here.`
  const limitText =
    selection.hiddenByLimit === 0
      ? ''
      : ` ${selection.hiddenByLimit} more ${reviewLabel} are not shown to keep the PDF readable.`

  return addNote(
    doc,
    'Review-first PDF',
    `This PDF shows ${selection.shown.length} of ${selection.totalReview} ${reviewLabel}.${cleanText}${limitText} Download CSV for the complete row-by-row data.`,
    y,
  )
}

function saveDocument(doc: jsPDF, filename: string): void {
  addFooter(doc)
  doc.save(filename)
}

function ambiguityToReviewItem(row: AmbiguityResult): ReviewItem | null {
  if (row.label !== 'SMELL') {
    return null
  }

  return {
    id: row.id,
    check: 'Ambiguity',
    domain: `${row.domain} | ${row.type}`,
    requirement: row.text,
    reason: row.explanation,
    suggestion: row.suggestion,
  }
}

function inconsistencyToReviewItem(row: InconsistencyResult): ReviewItem | null {
  if (row.label !== 'SMELL') {
    return null
  }

  return {
    id: `${row.reqAId} / ${row.reqBId}`,
    check: 'Inconsistency',
    domain: row.domain,
    requirement: `${row.reqAId}: ${row.reqAText}\n${row.reqBId}: ${row.reqBText}`,
    reason: row.explanation,
    suggestion: row.suggestion,
  }
}

function buildModelReviewSelection(report: ModelReport): ReviewSelection {
  const totalRows = report.ambiguityResults.length + report.inconsistencyResults.length
  const reviewItems = [
    ...report.ambiguityResults.map(ambiguityToReviewItem),
    ...report.inconsistencyResults.map(inconsistencyToReviewItem),
  ].filter((item): item is ReviewItem => item !== null)
  const shown = reviewItems.slice(0, maxReviewItemsInPdf)

  return {
    shown,
    totalReview: reviewItems.length,
    hiddenClean: totalRows - reviewItems.length,
    hiddenByLimit: Math.max(0, reviewItems.length - shown.length),
  }
}

export async function downloadModelReportPdf(report: ModelReport): Promise<void> {
  const modelName = formatModelName(report.model)
  const selection = buildModelReviewSelection(report)
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  let y = await addHeader(
    doc,
    `${modelName} Review Report`,
    `${report.fileName} | review-first requirements analysis`,
  )

  y = addMetaRows(
    doc,
    [
      { label: 'File', value: report.fileName },
      { label: 'Model', value: modelName },
      { label: 'Report date', value: formatDateTime(report.generatedAt) },
    ],
    y,
  )
  y = addSummaryStats(
    doc,
    [
      { label: 'Total checks', value: String(report.stats.total) },
      { label: 'Needs review', value: String(report.stats.smells) },
      { label: 'Clean', value: String(report.stats.clean) },
      { label: 'Review rate', value: formatPercentage(report.stats.smellRate) },
    ],
    y,
  )
  y = addSelectionNote(doc, selection, 'clean checks', 'review items', y)
  y = addReviewTable(doc, selection.shown, y)
  addDetails(doc, selection.shown, y)

  saveDocument(doc, `reqsmell-${report.model}-review-first-${getFileStem(report.fileName)}.pdf`)
}

function comparisonToReviewItem(row: ComparisonRow): ReviewItem | null {
  if (row.agreementStatus !== 'DISAGREE') {
    return null
  }

  return {
    id: row.id,
    check: 'Model disagreement',
    domain: `${row.domain} | ${row.type}`,
    requirement: row.text,
    reason: `Claude marked this as ${resultLabel(row.claudeLabel)}. ChatGPT marked this as ${resultLabel(row.chatgptLabel)}.`,
    suggestion: 'Review this requirement manually before accepting either model label.',
    extraFields: [
      { label: 'Claude result', value: resultLabel(row.claudeLabel) },
      { label: 'ChatGPT result', value: resultLabel(row.chatgptLabel) },
    ],
  }
}

function buildComparisonReviewSelection(report: ComparisonReport): ReviewSelection {
  const reviewItems = report.rows
    .map(comparisonToReviewItem)
    .filter((item): item is ReviewItem => item !== null)
  const shown = reviewItems.slice(0, maxReviewItemsInPdf)

  return {
    shown,
    totalReview: reviewItems.length,
    hiddenClean: report.rows.length - reviewItems.length,
    hiddenByLimit: Math.max(0, reviewItems.length - shown.length),
  }
}

export async function downloadComparisonReportPdf(report: ComparisonReport): Promise<void> {
  const selection = buildComparisonReviewSelection(report)
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  let y = await addHeader(
    doc,
    'Model Comparison Review Report',
    `${report.fileName} | review-first model agreement analysis`,
  )

  y = addMetaRows(
    doc,
    [
      { label: 'File', value: report.fileName },
      { label: 'Report date', value: formatDateTime(report.generatedAt) },
    ],
    y,
  )
  y = addSummaryStats(
    doc,
    [
      { label: 'Matches', value: String(report.stats.fullAgreement) },
      { label: 'Claude only', value: String(report.stats.claudeOnly) },
      { label: 'ChatGPT only', value: String(report.stats.chatgptOnly) },
      { label: 'Agreement', value: formatPercentage(report.stats.agreementRate) },
    ],
    y,
  )
  y = addSelectionNote(doc, selection, 'matching rows', 'model disagreements', y)
  y = addReviewTable(doc, selection.shown, y)
  addDetails(doc, selection.shown, y)

  saveDocument(doc, `reqsmell-comparison-review-first-${getFileStem(report.fileName)}.pdf`)
}
