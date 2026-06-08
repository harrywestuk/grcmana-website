import type { MenuItem } from '@/payload-types'

export type MenuItemNode = MenuItem & {
  children: MenuItemNode[]
}

export function resolveMenuHref(item: MenuItem): string {
  if (item.linkType === 'internal') {
    const ref = item.reference
    if (ref && typeof ref.value === 'object' && ref.value !== null && 'slug' in ref.value) {
      return `/${(ref.value as { slug: string }).slug}`
    }
    return '#'
  }
  return item.url ?? '#'
}

export type ColumnGroup = {
  colKey: number
  meta: NonNullable<MenuItemNode['columnMeta']>[number] | undefined
  children: MenuItemNode[]
}

export function groupByColumn(item: MenuItemNode): ColumnGroup[] {
  const columns: Record<number, MenuItemNode[]> = {}
  for (const child of item.children) {
    const col = child.column ?? 1
    if (!columns[col]) columns[col] = []
    columns[col].push(child)
  }

  const metaByColumn: Record<number, NonNullable<MenuItemNode['columnMeta']>[number]> = {}
  for (const m of item.columnMeta ?? []) {
    if (m.columnNumber != null) metaByColumn[m.columnNumber] = m
  }

  return Object.keys(columns)
    .map(Number)
    .sort((a, b) => a - b)
    .map((colKey) => ({
      colKey,
      meta: metaByColumn[colKey],
      children: columns[colKey],
    }))
}

export function buildMenuTree(flat: MenuItem[]): MenuItemNode[] {
  const byId = new Map<number, MenuItemNode>()

  for (const item of flat) {
    byId.set(item.id, { ...item, children: [] })
  }

  const roots: MenuItemNode[] = []

  for (const node of byId.values()) {
    const parentId =
      node.parent == null
        ? null
        : typeof node.parent === 'object'
          ? node.parent.id
          : node.parent

    if (parentId != null && byId.has(parentId)) {
      byId.get(parentId)!.children.push(node)
    } else {
      roots.push(node)
    }
  }

  const sortByOrder = (a: MenuItemNode, b: MenuItemNode): number =>
    (a.order ?? 0) - (b.order ?? 0)

  const sortTree = (nodes: MenuItemNode[]): MenuItemNode[] => {
    nodes.sort(sortByOrder)
    for (const node of nodes) {
      sortTree(node.children)
    }
    return nodes
  }

  return sortTree(roots)
}
