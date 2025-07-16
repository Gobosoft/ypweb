let handleLogoutFunction: (() => Promise<void>) | null = null

export const setHandleLogoutFunction = (fn: () => Promise<void>): void => {
  handleLogoutFunction = fn
}

export const getHandleLogoutFunction = (): (() => Promise<void>) | null =>
  handleLogoutFunction
