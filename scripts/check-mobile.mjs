import { chromium } from 'playwright'

const browser = await chromium.launch()

async function shot(name, width, before) {
  const page = await browser.newPage({ viewport: { width, height: 900 } })
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' })
  await page.waitForSelector('text=나의 만세력')
  if (before) await before(page)
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.body.scrollWidth,
    clientWidth: document.body.clientWidth,
  }))
  await page.screenshot({ path: `scripts/.${name}.png`, fullPage: true })
  console.log(`${name} (${width}px):`, JSON.stringify(overflow), overflow.scrollWidth > overflow.clientWidth ? '❌ 오버플로우' : '✅')
  console.log('콘솔 에러:', errors.length ? errors : '없음')
  await page.close()
}

await shot('main-320', 320)
await shot('main-375', 375)

// localStorage에 저장값을 넣어 "저장된 정보 있을 경우" 화면도 확인
await shot('saved-375', 375, async (page) => {
  await page.evaluate(() => {
    localStorage.setItem(
      'saju:lastInput',
      JSON.stringify({
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
        city: '서울',
        gender: '남',
      }),
    )
  })
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForSelector('text=작성했던 정보로 확인')
})

await browser.close()
