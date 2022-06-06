import { MemoryCache } from 'cachu'

const unverifiedUserCache = new MemoryCache({
  autoclear: true
})

const userCache = new MemoryCache({
  autoclear: true
})

const globalCache = new MemoryCache()

export {
  globalCache,
  unverifiedUserCache,
  userCache
}
