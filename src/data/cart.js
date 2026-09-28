// Different box combinations keep separate line items.
export function cartReducer(items, action) {
  switch (action.type) {
    case 'buyNow': {
      const { productId, quantity, variant = '' } = action
      if (!Number.isSafeInteger(quantity) || quantity < 1) return items
      const id = JSON.stringify([productId, variant])
      const otherItems = items
        .filter((item) => item.id !== id)
        .map((item) => ({ ...item, selected: false }))
      return [
        ...otherItems,
        { id, productId, quantity, variant, selected: true },
      ]
    }
    case 'add': {
      const { productId, quantity = 1, variant = '' } = action
      if (!Number.isSafeInteger(quantity) || quantity < 1) return items
      const id = JSON.stringify([productId, variant])
      const existing = items.find((item) => item.id === id)
      return existing
        ? items.map((item) =>
            item.id === id
              ? { ...item, quantity: item.quantity + quantity, selected: true }
              : item,
          )
        : [...items, { id, productId, variant, quantity, selected: true }]
    }
    case 'quantity':
      return Number.isSafeInteger(action.quantity) && action.quantity >= 1
        ? items.map((item) =>
            item.id === action.id
              ? { ...item, quantity: action.quantity }
              : item,
          )
        : items
    case 'select':
      return items.map((item) =>
        item.id === action.id ? { ...item, selected: action.selected } : item,
      )
    case 'selectAll':
      return items.map((item) => ({ ...item, selected: action.selected }))
    case 'remove':
      return items.filter((item) => item.id !== action.id)
    case 'removeOrdered':
      return items.filter((item) => !action.ids.includes(item.id))
    case 'clear':
      return []
    default:
      return items
  }
}
