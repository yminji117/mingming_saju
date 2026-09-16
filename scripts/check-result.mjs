import { chromium } from 'playwright'

const browser = await chromium.launch()

const baseInput = {
  nickname: '콜로세움냥냥',
  calendarType: 'solar',
  isLeapMonth: false,
  year: 1995,
  month: 3,
  day: 12,
  ampm: 'AM',
  hour: 7,
  minute: 30,
  timeUnknown: false,
  city: '부산',
  gender: '남',
}

async function shot(name, width, input) {
  const page = await browser.newPage({ viewport: { width, height: 1400 } })
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' })
  await page.evaluate((data) => localStorage.setItem('saju:lastInput', JSON.stringify(data)), input)
  await page.goto('http://localhost:5173/result', { waitUntil: 'networkidle' })
  await page.waitForSelector('text=만세력')
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.body.scrollWidth,
    clientWidth: document.body.clientWidth,
  }))
  await page.screenshot({ path: `scripts/.${name}.png`, fullPage: true })
  console.log(`${name} (${width}px):`, JSON.stringify(overflow), overflow.scrollWidth > overflow.clientWidth ? '❌ 오버플로우' : '✅')
  console.log('콘솔 에러:', errors.length ? errors : '없음')
  await page.close()
}

await shot('result-320', 320, baseInput)
await shot('result-375', 375, baseInput)
await shot('result-timeunknown-375', 375, { ...baseInput, timeUnknown: true })

await browser.close()
