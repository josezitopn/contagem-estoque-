import React from 'react'

export function Card({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-xl bg-card/70 border border-stroke shadow-soft p-4">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  )
}

export function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-sm text-muted font-medium mb-2">{children}</div>
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        'w-full rounded-xl bg-card2 border border-stroke px-3 py-3 outline-none focus:ring-2 focus:ring-primary/40 ' +
        (props.className ?? '')
      }
    />
  )
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={
        'w-full min-h-24 rounded-xl bg-card2 border border-stroke px-3 py-3 outline-none focus:ring-2 focus:ring-primary/40 ' +
        (props.className ?? '')
      }
    />
  )
}

export function Button({ variant = 'solid', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'solid' | 'ghost' }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold transition active:scale-[0.99]'
  const solid = 'bg-primary text-white hover:bg-primary/90'
  const ghost = 'bg-card2 border border-stroke text-white hover:bg-white/5'
  return <button {...props} className={`${base} ${variant === 'solid' ? solid : ghost} ${props.className ?? ''}`} />
}

export function Pill({ children }: { children: React.ReactNode }) {
  return <span className="text-xs px-2 py-1 rounded-full bg-white/10 border border-stroke">{children}</span>
}
