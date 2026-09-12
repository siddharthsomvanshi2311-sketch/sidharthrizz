import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Todo List - Siddharthis',
  description: 'A beautiful todo list app with local storage',
}

export default function TodoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
