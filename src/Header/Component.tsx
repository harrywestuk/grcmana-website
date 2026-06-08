import { getCachedGlobal } from '@/utilities/getGlobals'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import React from 'react'

import type { Header as HeaderType, MenuItem } from '@/payload-types'
import { buildMenuTree } from '@/utilities/buildMenuTree'
import type { MenuItemNode } from '@/utilities/buildMenuTree'

import { HeaderClient } from './Component.client'

const getCachedMenuItems = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'menu-items',
      limit: 200,
      depth: 1,
    })
    return result.docs as MenuItem[]
  },
  ['menu-items-all'],
  { tags: ['global_header'] },
)

export async function Header() {
  const headerData: HeaderType = await getCachedGlobal('header', 1)()
  const flatItems = await getCachedMenuItems()
  const menuTree: MenuItemNode[] = buildMenuTree(flatItems)

  return <HeaderClient data={headerData} menuTree={menuTree} />
}
