import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
// @ts-ignore
import pageHtml from './page.html?raw'

const app = new Hono()

app.use('/static/*', serveStatic({ root: './' }))

// 메인 페이지 - public/index.html 내용을 직접 서빙
app.get('/', (c) => {
  return c.html(pageHtml)
})

// 문의 API
app.post('/api/contact', async (c) => {
  const body = await c.req.json()
  const { name, phone, service, message } = body
  if (!name || !phone || !service) {
    return c.json({ success: false, message: '필수 항목을 입력해주세요.' }, 400)
  }
  return c.json({ success: true, message: '문의가 접수되었습니다. 빠른 시간 내에 연락드리겠습니다.' })
})

export default app
