export const updateLastActivity = () => {
  localStorage.setItem('lastActivity', Date.now().toString())
}

export const getLastActivity = () => {
  const lastActivity = localStorage.getItem('lastActivity')
  return lastActivity ? parseInt(lastActivity, 10) : null
}

export const setLastActivity = () => {
  localStorage.setItem('lastActivity', Date.now().toString())
}
