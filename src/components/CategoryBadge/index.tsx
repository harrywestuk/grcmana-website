import React from 'react'
import Link from 'next/link'

export type CategoryBadgeProps = {
  title: string
  slug: string
  href: string
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ title, href }) => {
  return (
    <Link href={href} className="category-badge">
      {title}
    </Link>
  )
}
