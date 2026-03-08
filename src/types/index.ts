export interface DailyRevenue {
  sale_date: string
  total_revenue: number
  tickets: number
  total_items: number
}

export interface Product {
  product: string
  category: string
  pos: string
  qty_sold: number
  total_revenue: number
  avg_price: number
}

export interface ProductFilters {
  outlet: string
  category: string
}

export interface GuestSpend {
  guest_name: string
  first_txn_date: string
  last_txn_date: string
  total_spend: number
  txn_count: number
}

export interface GuestCategorySpend {
  guest_name: string
  category: string
  category_spend: number
  category_qty: number
}

export interface SpendByGuestType {
  sale_date: string
  guest_type: 'in_house' | 'walk_in'
  total_revenue: number
  txn_count: number
}

export interface CurrentInhouseNationality {
  nationality: string
  num_stays: number
  total_guests: number
}

export interface NationalityByStay {
  nationality: string
  arrival_date: string
  departure_date: string
  persons: number
}

export interface NationalityAggregate {
  nationality: string
  totalGuests: number
}

export interface DailyRevenueByCategory {
  sale_date: string
  category: string
  category_revenue: number
}

export interface TopItemByCategory {
  category: string
  item_name: string
  total_qty: number
  total_revenue: number
}
