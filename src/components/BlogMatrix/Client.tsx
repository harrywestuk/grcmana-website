'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Category } from '@/payload-types'
import { BlogMatrixCard, type BlogCardPost } from './Card'

type Props = {
  posts: BlogCardPost[]
  categories: Category[]
}

export const BlogMatrixClient: React.FC<Props> = ({ posts, categories }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get('category') ?? 'all'
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      activeCategory === 'all' ||
      (post.categories != null &&
        post.categories.some(
          (cat) => typeof cat === 'object' && cat !== null && (cat as Category).slug === activeCategory,
        ))

    const q = searchQuery.trim().toLowerCase()
    const matchesSearch =
      !q ||
      post.title.toLowerCase().includes(q) ||
      (post.excerpt?.toLowerCase().includes(q) ?? false)

    return matchesCategory && matchesSearch
  })

  function handleCategoryClick(slug: string): void {
    if (slug === 'all') {
      router.push('/blog', { scroll: false })
    } else {
      router.push(`/blog?category=${slug}`, { scroll: false })
    }
  }

  return (
    <>
      <div className="matrix-toolbar">
        <ul className="matrix-filters">
          <li>
            <button
              type="button"
              className={`matrix-filter-btn${activeCategory === 'all' ? ' matrix-filter-btn--active' : ''}`}
              onClick={() => handleCategoryClick('all')}
            >
              All Posts
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                type="button"
                className={`matrix-filter-btn${activeCategory === cat.slug ? ' matrix-filter-btn--active' : ''}`}
                onClick={() => handleCategoryClick(cat.slug ?? '')}
              >
                {cat.title}
              </button>
            </li>
          ))}
        </ul>

        <div className="matrix-search">
          <input
            type="text"
            className="matrix-search__input"
            placeholder="Search insights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search articles"
          />
          <svg
            className="matrix-search__icon"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      <div className="matrix-grid">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => <BlogMatrixCard key={post.slug} post={post} />)
        ) : (
          <div
            className="matrix-item"
            style={{ gridColumn: '1 / -1', borderRight: 'none' }}
          >
            <p
              style={{
                color: 'var(--ink-300)',
                fontFamily: 'var(--font-dm-mono)',
                fontSize: '11px',
              }}
            >
              No articles found.
            </p>
          </div>
        )}
      </div>
    </>
  )
}
