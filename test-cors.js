// Teste simples de CORS
const fetch = require('node-fetch')

async function testCORS() {
  console.log('Testing CORS...')

  try {
    const response = await fetch('http://localhost:3000/api/users', {
      method: 'OPTIONS',
      headers: {
        Origin: 'http://example.com',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type',
      },
    })

    console.log('Status:', response.status)
    console.log('CORS Headers:')
    response.headers.forEach((value, name) => {
      if (name.toLowerCase().includes('access-control')) {
        console.log(`  ${name}: ${value}`)
      }
    })

    console.log('\nAll Headers:')
    response.headers.forEach((value, name) => {
      console.log(`  ${name}: ${value}`)
    })

    console.log('\n✅ CORS test completed successfully!')
  } catch (error) {
    console.error('❌ Error testing CORS:', error.message)
  }
}

testCORS()
