'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { sendGmail } from '@/lib/mail/gmail'
import type { TablesInsert } from '@/types/database'

export async function createDelayNoticeAction(formData: FormData) {
  const timeImpactRaw = formData.get('time_impact_days_estimate')
  const recipientsInput = String(formData.get('recipients') ?? '')
  const input: TablesInsert<'delay_notices'> = {
    project_id: String(formData.get('project_id') || ''),
    title: String(formData.get('title') || ''),
    description: String(formData.get('description') || ''),
    incident_date: String(formData.get('incident_date') || ''),
    reported_date: (() => {
      const value = formData.get('reported_date')
      return typeof value === 'string' && value.trim() !== '' ? value : null
    })(),
    time_impact_days_estimate:
      typeof timeImpactRaw === 'string' &&
      timeImpactRaw.trim() !== '' &&
      Number.isFinite(Number(timeImpactRaw))
        ? Number(timeImpactRaw)
        : null,
    recipients: recipientsInput
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean),
  }
  const supabase = await createClient()
  const { data, error } = await supabase.from('delay_notices').insert(input).select('id').single()
  if (error) {
    const message = encodeURIComponent(error.message)
    redirect(`/delay-notices/new?m=${message}&t=error`)
  }
  redirect(`/delay-notices/${data!.id}?m=Delay%20notice%20created&t=success`)
}

export async function markDelayNoticeSentAction(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('delay_notices')
    .update({ status: 'sent', emailed_at: new Date().toISOString() })
    .eq('id', id)
  if (error) {
    const message = encodeURIComponent(error.message)
    redirect(`/delay-notices/${id}?m=${message}&t=error`)
  }
  redirect(`/delay-notices/${id}?m=Marked%20as%20sent&t=success`)
}

export async function sendDelayNoticeEmailAction(id: string) {
  const emailReady = Boolean(
    process.env.GMAIL_SA_CLIENT_EMAIL &&
      process.env.GMAIL_SA_PRIVATE_KEY &&
      process.env.GMAIL_IMPERSONATE_EMAIL
  )
  if (!emailReady) {
    redirect(
      `/delay-notices/${id}?m=${encodeURIComponent('Email service is not configured yet')}&t=error`
    )
  }
  const supabase = await createClient()
  const { data: notice, error } = await supabase
    .from('delay_notices')
    .select('*')
    .eq('id', id)
    .single()
  if (error) {
    const message = encodeURIComponent(error.message)
    redirect(`/delay-notices/${id}?m=${message}&t=error`)
  }
  const { data: project } = await supabase
    .from('projects')
    .select('project_number,name')
    .eq('id', notice.project_id)
    .single()
  const recipients: string[] = Array.isArray(notice.recipients) ? notice.recipients : []
  if (recipients.length === 0) {
    redirect(`/delay-notices/${id}?m=No%20recipients%20set%20on%20notice&t=error`)
  }
  const subject = `Delay Notice - ${project?.project_number || ''} - ${notice.title}`.trim()
  const html = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;">
      <h2>Delay Notice</h2>
      <p><strong>Project:</strong> ${project?.project_number} — ${project?.name}</p>
      <p><strong>Incident Date:</strong> ${notice.incident_date}</p>
      <p><strong>Reported Date:</strong> ${notice.reported_date || ''}</p>
      <hr />
      <p>${(notice.description || '').replace(/\n/g, '<br/>')}</p>
      <hr />
      <p>Sent by ARC Glazing.</p>
    </div>
  `
  await sendGmail({ to: recipients, subject, html })
  await supabase
    .from('delay_notices')
    .update({ status: 'sent', emailed_at: new Date().toISOString() })
    .eq('id', id)
  redirect(`/delay-notices/${id}?m=Delay%20notice%20emailed&t=success`)
}
