import { useTopProducts } from '@/hooks/useTopProducts'
import { useBottomProducts } from '@/hooks/useBottomProducts'
import { useGuestNationality } from '@/hooks/useGuestNationality'
import { ProductTable } from '@/components/ProductTable'
import { TopProductsBarChart } from '@/components/TopProductsBarChart'
import { CategoryDonutChart } from '@/components/CategoryDonutChart'
import { GuestNationalityTable } from '@/components/GuestNationalityTable'
import { TopItemsWidget } from '@/components/TopItemsWidget'
import { TopPosSpendersWidget } from '@/components/TopPosSpendersWidget'

export function MenuPerformance() {
  const top = useTopProducts({ outlet: '', category: '' })
  const bottom = useBottomProducts({ outlet: '', category: '' })
  const nationality = useGuestNationality()

  const isLoading = top.loading || bottom.loading
  const error = top.error ?? bottom.error

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
        Failed to load data: {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold text-brand-charcoal">Menu Performance</h1>
        <p className="text-sm text-brand-stone">Top and bottom 20 items — last 30 days</p>
      </div>

      <TopItemsWidget data={top.data} loading={top.loading} error={top.error} />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-7 h-7 border-4 border-brand-stone/40 border-t-brand-charcoal rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <CategoryDonutChart products={top.data} />
            <TopProductsBarChart products={top.data.slice(0, 10)} />
          </div>

          <ProductTable title="Top Products" products={top.data} variant="top" />
          <ProductTable title="Bombing Out Products" products={bottom.data} variant="bottom" />
          <GuestNationalityTable rows={nationality.data} error={nationality.error} />
          <TopPosSpendersWidget />
        </>
      )}
    </div>
  )
}
