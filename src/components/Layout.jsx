import { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, PiggyBank, Moon, Sun, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { to: '/budgets', icon: PiggyBank, label: 'Budgets' },
]

function NavLinks({ dark, onClose }) {
  return (
    <nav className="flex flex-col gap-2 mt-8">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
            ${isActive
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

export default function Layout() {
  const [dark, setDark] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  function toggleDark() {
    setDark(d => {
      document.documentElement.classList.toggle('dark', !d)
      return !d
    })
  }

  const sidebarStyle = {
    backgroundColor: dark ? '#1e293b' : 'white',
    borderRight: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: dark ? '#0f172a' : '#f8fafc' }}>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — hidden on mobile unless open */}
      <aside
        style={{
          ...sidebarStyle,
          width: '240px',
          flexShrink: 0,
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'fixed',
          top: 0,
          left: mobileOpen ? 0 : '-240px',
          height: '100vh',
          zIndex: 30,
          transition: 'left 0.3s ease',
        }}
        className="md:static md:left-0 md:flex"
      >
        <div>
          <div className="flex items-center justify-between px-4">
            <h1 style={{ color: dark ? 'white' : '#0f172a' }} className="text-xl font-bold flex items-center gap-2">
              <img src="/rupee.ico" alt="rupee" className="w-6 h-6" />
              FinanceApp
            </h1>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(false)}
            >
              <X size={18} style={{ color: dark ? 'white' : '#0f172a' }} />
            </Button>
          </div>
          <NavLinks dark={dark} onClose={() => setMobileOpen(false)} />
        </div>
        <Button
          variant="ghost"
          className="flex items-center gap-2 w-full justify-start px-4 text-slate-600 dark:text-slate-300"
          onClick={toggleDark}
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
          {dark ? 'Light mode' : 'Dark mode'}
        </Button>
      </aside>

      {/* Right side */}
      <div className="flex flex-col flex-1 min-w-0" style={{ marginLeft: 0 }}>

        {/* Mobile top bar */}
        <header
          style={{
            backgroundColor: dark ? '#1e293b' : 'white',
            borderBottom: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
          }}
          className="flex md:hidden items-center justify-between px-4 h-14 sticky top-0 z-10"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={20} style={{ color: dark ? 'white' : '#0f172a' }} />
          </Button>
          <h1 style={{ color: dark ? 'white' : '#0f172a' }} className="text-lg font-bold flex items-center gap-2">
            <img src="/rupee.ico" alt="rupee" className="w-5 h-5" />
            FinanceApp
          </h1>
          <Button variant="ghost" size="icon" onClick={toggleDark}>
            {dark ? <Sun size={18} style={{ color: 'white' }} /> : <Moon size={18} />}
          </Button>
        </header>

        {/* Page content */}
        <main
          style={{ backgroundColor: dark ? '#0f172a' : '#f8fafc' }}
          className="flex-1 p-4 md:p-8"
        >
          <Outlet />
        </main>
      </div>

      {/* Desktop sidebar spacer */}
      <style>{`
        @media (min-width: 768px) {
          aside { position: sticky !important; left: 0 !important; }
        }
      `}</style>
    </div>
  )
}