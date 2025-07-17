import React from 'react'

const List = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, children, ...props }, ref) => {
  return (
    <ul
      ref={ref}
      className={`absolute z-50 w-full max-h-40 overflow-auto bg-white border border-gray-300 mt-1 left-0 top-full shadow-lg ${className}`}
      {...props}
    >
      {children}
    </ul>
  )
})

List.displayName = 'List'

const ListItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { onClick?: () => void }
>(({ className, children, onClick, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
})

ListItem.displayName = 'ListItem'

export { List, ListItem }
