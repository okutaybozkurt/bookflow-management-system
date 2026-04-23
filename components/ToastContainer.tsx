'use client'

import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import { useApp } from '@/lib/store'

export default function ToastContainer() {
  const { toasts, removeToast } = useApp()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg pointer-events-auto animate-in slide-in-from-right-full duration-200 ${
            toast.type === 'success'
              ? 'bg-green-50 border border-green-200'
              : toast.type === 'error'
              ? 'bg-red-50 border border-red-200'
              : 'bg-blue-50 border border-blue-200'
          }`}
        >
          {toast.type === 'success' && (
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          )}
          {toast.type === 'error' && (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          )}
          {toast.type === 'info' && (
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          )}
          <p
            className={`text-sm font-medium ${
              toast.type === 'success'
                ? 'text-green-800'
                : toast.type === 'error'
                ? 'text-red-800'
                : 'text-blue-800'
            }`}
          >
            {toast.message}
          </p>
          <button
            onClick={() => removeToast(toast.id)}
            className={`ml-2 shrink-0 ${
              toast.type === 'success'
                ? 'hover:bg-green-100'
                : toast.type === 'error'
                ? 'hover:bg-red-100'
                : 'hover:bg-blue-100'
            } p-0.5 rounded transition-colors`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
