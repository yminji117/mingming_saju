import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 320, height: 700 } })
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text())
})

await page.goto('http://localhost:5173', { waitUntil: 'networkidle' })
await page.waitForSelector('text=나의 만세력')

const overflow = await page.evaluate(() => ({
  scrollWidth: document.body.scrollWidth,
  clientWidth: document.body.clientWidth,
  hasHorizontalOverflow: document.body.scrollWidth > document.body.clientWidth,
}))

await page.screenshot({ path: 'scripts/.mobile-320.png', fullPage: true })

console.log('320px 오버플로우 체크:', JSON.stringify(overflow))
console.log('콘솔 에러:', errors.length ? errors : '없음')

await browser.close()
