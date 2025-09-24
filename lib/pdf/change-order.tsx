import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'

export type LaborBreakdown = {
  label: string
  hours?: number | null
  crew?: string | null
}

export type CostLineItem = {
  description: string
  quantity?: number | null
  unit?: string | null
  unitPrice?: number | null
  total?: number | null
}

export type ChangeOrderPdfData = {
  coNumber: string
  title: string
  projectName: string
  projectNumber?: string | null
  description: string
  justification?: string | null
  additionalInfo?: string | null
  delayNoticeRef?: string | null
  costImpact?: number | null
  timeImpactDays?: number | null
  createdAt?: string | null
  labor?: {
    totalHours?: number | null
    rate?: number | null
    overheadPercent?: number | null
    notes?: string | null
    items?: LaborBreakdown[]
    subtotal?: number | null
    overhead?: number | null
    total?: number | null
  }
  totals?: {
    labor?: number | null
    overhead?: number | null
    grandTotal?: number | null
  }
  lineItems?: CostLineItem[]
}

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 11,
    fontFamily: 'Helvetica',
    lineHeight: 1.4,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#1f2933',
    borderBottomStyle: 'solid',
    marginBottom: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textMuted: {
    color: '#4b5563',
  },
  bullet: {
    marginBottom: 2,
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderCollapse: 'collapse',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    flexGrow: 1,
    padding: 6,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#d1d5db',
    fontSize: 10,
  },
  tableHeader: {
    backgroundColor: '#f3f4f6',
    fontWeight: 'bold',
  },
})

const formatCurrency = (value?: number | null, fallback = '-') => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value)
}

const formatHours = (value?: number | null) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '-'
  return `${value.toFixed(1)} hrs`
}

function changeOrderSummary(data: ChangeOrderPdfData) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Summary</Text>
      <View style={styles.row}>
        <Text>Change Order: {data.coNumber}</Text>
        {data.projectNumber ? <Text>Project #{data.projectNumber}</Text> : null}
      </View>
      <Text>{data.projectName}</Text>
      {data.delayNoticeRef ? (
        <Text style={styles.textMuted}>Related Delay Notice: {data.delayNoticeRef}</Text>
      ) : null}
      <View style={{ marginTop: 6 }}>
        {typeof data.costImpact === 'number' ? (
          <Text>Cost Impact: {formatCurrency(data.costImpact)}</Text>
        ) : null}
        {typeof data.timeImpactDays === 'number' ? (
          <Text>Schedule Impact: {data.timeImpactDays} day(s)</Text>
        ) : null}
        {data.createdAt ? (
          <Text>Updated: {new Date(data.createdAt).toLocaleDateString()}</Text>
        ) : null}
      </View>
    </View>
  )
}

function narrative(data: ChangeOrderPdfData) {
  if (!data.description && !data.justification && !data.additionalInfo) return null
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Narrative</Text>
      {data.description ? <Text>{data.description}</Text> : null}
      {data.justification ? <Text style={{ marginTop: 8 }}>{data.justification}</Text> : null}
      {data.additionalInfo ? (
        <Text style={{ marginTop: 8, color: '#4b5563' }}>{data.additionalInfo}</Text>
      ) : null}
    </View>
  )
}

function laborBreakdown(data: ChangeOrderPdfData) {
  if (!data.labor) return null
  const { labor } = data
  const items = labor.items ?? []
  const hasNumbers =
    typeof labor.totalHours === 'number' ||
    typeof labor.rate === 'number' ||
    typeof labor.overheadPercent === 'number'
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Labor &amp; Costs</Text>
      {hasNumbers ? (
        <View style={{ marginBottom: 6 }}>
          {labor.totalHours != null ? (
            <Text>Total Man-Hours: {formatHours(labor.totalHours)}</Text>
          ) : null}
          {labor.rate != null ? <Text>Hourly Rate: {formatCurrency(labor.rate)}</Text> : null}
          {labor.overheadPercent != null ? (
            <Text>Overhead: {(labor.overheadPercent * 100).toFixed(2)}%</Text>
          ) : null}
        </View>
      ) : null}
      {items.length > 0 ? (
        <View style={{ marginVertical: 6 }}>
          {items.map((item, idx) => (
            <Text key={`${item.label}-${idx}`} style={styles.bullet}>
              • {item.label}
              {item.hours != null ? ` — ${item.hours} hrs` : ''}
              {item.crew ? ` (${item.crew})` : ''}
            </Text>
          ))}
        </View>
      ) : null}
      {labor.notes ? <Text style={{ marginTop: 6 }}>{labor.notes}</Text> : null}
      <View style={{ marginTop: 10 }}>
        {labor.subtotal != null ? (
          <View style={styles.row}>
            <Text>Labor Subtotal</Text>
            <Text>{formatCurrency(labor.subtotal)}</Text>
          </View>
        ) : null}
        {labor.overhead != null ? (
          <View style={styles.row}>
            <Text>Overhead</Text>
            <Text>{formatCurrency(labor.overhead)}</Text>
          </View>
        ) : null}
        {labor.total != null ? (
          <View style={styles.row}>
            <Text style={{ fontWeight: 'bold' }}>Total Change Order</Text>
            <Text style={{ fontWeight: 'bold' }}>{formatCurrency(labor.total)}</Text>
          </View>
        ) : null}
      </View>
    </View>
  )
}

function lineItemsTable(data: ChangeOrderPdfData) {
  if (!data.lineItems?.length) return null
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Line Items</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCell, { flex: 3 }]}>Description</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>Qty</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>Unit</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>Unit Price</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>Total</Text>
        </View>
        {data.lineItems.map((item, idx) => (
          <View key={`${item.description}-${idx}`} style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 3 }]}>{item.description}</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>
              {item.quantity != null ? item.quantity.toString() : ''}
            </Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>{item.unit ?? ''}</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>
              {formatCurrency(item.unitPrice, '')}
            </Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>{formatCurrency(item.total, '')}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

export function ChangeOrderPdfDocument({ data }: { data: ChangeOrderPdfData }) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.textMuted}>Prepared by ARC Glazing</Text>
        </View>
        {changeOrderSummary(data)}
        {narrative(data)}
        {laborBreakdown(data)}
        {lineItemsTable(data)}
      </Page>
    </Document>
  )
}

export async function generateChangeOrderPdfBlob(data: ChangeOrderPdfData) {
  const instance = pdf(<ChangeOrderPdfDocument data={data} />)
  return instance.toBlob()
}
