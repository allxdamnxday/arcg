export type UserRole = 'admin' | 'user'
export type ChangeOrderStatus = 'draft' | 'pending' | 'approved'

export interface User {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  project_number: string
  name: string
  client_name: string | null
  address: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface ChangeOrder {
  id: string
  project_id: string
  co_number: string
  title: string
  description: string
  cost_impact: number | null
  time_impact_days: number | null
  status: ChangeOrderStatus
  original_image_url: string | null
  ocr_text: string | null
  created_by: string | null
  approved_by: string | null
  approved_at: string | null
  created_at: string
  updated_at: string
}

export interface ChangeOrderItem {
  id: string
  change_order_id: string
  description: string
  quantity: number | null
  unit: string | null
  unit_price: number | null
  total_price: number | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  change_order_id: string | null
  project_id: string | null
  file_url: string
  file_name: string | null
  file_size: number | null
  mime_type: string | null
  uploaded_by: string | null
  created_at: string
}

export interface ChangeOrderSummary {
  id: string
  co_number: string
  title: string
  status: ChangeOrderStatus
  cost_impact: number | null
  time_impact_days: number | null
  created_at: string
  updated_at: string
  project_number: string
  project_name: string
  client_name: string | null
  created_by_name: string | null
  item_count: number
  document_count: number
}