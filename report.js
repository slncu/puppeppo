const puppeteer = require('puppeteer')
require('dotenv').config()

const { URL, EMAIL, SECRET } = process.env
const { argv } = process

/**
 * バリデーション
 */
if (argv[2] === undefined) {
  console.error('概要を設定してください')
  process.exit(1)
}

if (argv[3] === undefined) {
  console.error('内容を設定してください')
  process.exit(1)
}

const summary = argv[2]
const report = argv[3]
const info = argv[4] === undefined ? 'なし' : argv[4]

!(async function() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(`${URL}/login`)
  await page.type('#email', EMAIL)
  await page.type('#password', SECRET)
  const loginButton = await page.$('button[type=submit]')
  await loginButton.click()
  await page.waitForNavigation({ waitUntil: 'domcontentloaded' })
  // 新規作成ページ
  await page.goto(`${URL}/arthur/r/create`)
  await page.type('textarea[name=summary]', summary)
  await page.click('input[name=condition][value=perfect]')
  await page.type('textarea[name=report]', report)
  await page.type('textarea[name=info]', info)
  const submitButton = await page.$('button[type=submit]')

  await submitButton.click()
  await page.waitForNavigation({ waitUntil: 'domcontentloaded' })
  await browser.close()
})()
