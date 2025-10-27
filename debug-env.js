// Debug script to check DATABASE_URL
console.log('=== DATABASE_URL CHECK ===')
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL)
console.log('DATABASE_URL starts with postgres:', process.env.DATABASE_URL?.startsWith('postgres'))
console.log('DATABASE_URL length:', process.env.DATABASE_URL?.length)
console.log('First 20 chars:', process.env.DATABASE_URL?.substring(0, 20))
console.log('==========================')

