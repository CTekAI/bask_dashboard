type Tab = 'overview' | 'menu' | 'occupancy' | 'guests'

const TAB_LABELS: Record<Tab, string> = {
  overview: 'Overview',
  menu: 'POS',
  occupancy: 'Occupancy',
  guests: 'Guests',
}

interface HeaderProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  onLogout?: () => void
}

export function Header({ activeTab, onTabChange, onLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-brand-charcoal text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <img
            src="/logo.png"
            alt="BASK"
            className="h-6 w-auto max-w-[88px] object-contain flex-shrink-0"
            style={{ mixBlendMode: 'screen' }}
          />
          {onLogout && (
            <button
              onClick={onLogout}
              className="text-xs text-brand-stone hover:text-white transition-colors focus:outline-none"
            >
              Log out
            </button>
          )}
        </div>
        <div className="flex gap-1 pb-0">
          {(['overview', 'menu', 'occupancy', 'guests'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={[
                'px-4 py-2 text-sm font-medium rounded-t-lg transition-colors focus:outline-none',
                activeTab === tab
                  ? 'bg-brand-blanco text-brand-charcoal'
                  : 'text-brand-stone hover:text-white hover:bg-white/10',
              ].join(' ')}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}
