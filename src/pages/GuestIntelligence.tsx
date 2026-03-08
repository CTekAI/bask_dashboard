import { useState } from 'react'
import { useTopGuestSpenders } from '@/hooks/useTopGuestSpenders'
import { useGuestCategorySpend } from '@/hooks/useGuestCategorySpend'
import { TopSpendersTable } from '@/components/TopSpendersTable'
import { GuestCategoryBreakdown } from '@/components/GuestCategoryBreakdown'
import { NationalityMixWidget } from '@/components/NationalityMixWidget'

function fmtCurrency(n: number): string {
  return `Rp ${n.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export function GuestIntelligence() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [selectedGuest, setSelectedGuest] = useState<string | null>(null)

  const spenders = useTopGuestSpenders({ from, to })
  const categorySpend = useGuestCategorySpend(selectedGuest)

  const selectedRow = spenders.data.find((r) => r.guest_name === selectedGuest)

  function handleSelectGuest(name: string) {
    setSelectedGuest((prev) => (prev === name ? null : name))
  }

  function closeDrawer() {
    setSelectedGuest(null)
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-bold text-gray-900">Guest Intelligence</h1>
        <p className="text-sm text-gray-500">Top spenders by total POS spend — click a row to see category breakdown</p>
      </div>

      <TopSpendersTable
        data={spenders.data}
        loading={spenders.loading}
        error={spenders.error}
        from={from}
        to={to}
        onFromChange={setFrom}
        onToChange={setTo}
        onSelectGuest={handleSelectGuest}
        selectedGuest={selectedGuest}
      />

      <NationalityMixWidget />

      {/* Drawer */}
      {selectedGuest !== null && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={closeDrawer}
          />

          {/* Panel */}
          <div className="fixed right-0 inset-y-0 w-full max-w-sm bg-white z-50 shadow-xl flex flex-col overflow-hidden">
            {/* Panel header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Guest Breakdown</p>
                <h2 className="text-base font-bold text-gray-900 mt-0.5">{selectedGuest}</h2>
                {selectedRow && (
                  <p className="text-sm text-gray-500 mt-0.5">
                    {fmtCurrency(Number(selectedRow.total_spend))} total · {selectedRow.txn_count} transactions
                  </p>
                )}
              </div>
              <button
                onClick={closeDrawer}
                className="text-gray-400 hover:text-gray-600 p-1 -mr-1 focus:outline-none"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Category breakdown */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">Spend by Category</p>
              <GuestCategoryBreakdown
                data={categorySpend.data}
                loading={categorySpend.loading}
              />
              {categorySpend.error && (
                <p className="text-sm text-red-600 mt-2">{categorySpend.error}</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
