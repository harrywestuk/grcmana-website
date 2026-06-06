import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { HeaderClient } from './Component.client'

export async function Header() {
  const headerData: HeaderType = await getCachedGlobal('header', 1)()

  return <HeaderClient data={headerData} />
}
