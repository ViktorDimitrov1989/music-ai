import app from './app.js'

const port = Number(process.env.PORT ?? 3030)

app.listen(port, '0.0.0.0', () => {
  console.log(`Backend listening on http://localhost:${port}`)
})
