#!/usr/bin/env node

/**
 * Ping IndexNow to notify Bing, Yandex, and other search engines about your pages.
 * Run: node scripts/ping-indexnow.js
 * 
 * This submits all your article URLs to IndexNow endpoints.
 * Bing typically indexes within 24-48 hours after this.
 */

import fs from 'fs'
import path from 'path'

const INDEXNOW_KEY = '7a751798341d4bfdba34f3406cabc7fe'
const SITE_URL = 'https://themindfulai.dev'

// Get all article slugs
const articlesDir = path.join(process.cwd(), 'content/articles')
const slugs = fs.readdirSync(articlesDir)
  .filter(f => f.endsWith('.mdx'))
  .map(f => f.replace(/\.mdx$/, ''))

const urlList = [
  SITE_URL,
  `${SITE_URL}/about`,
  ...slugs.map(slug => `${SITE_URL}/articles/${slug}`),
]

const payload = {
  host: 'themindfulai.dev',
  key: INDEXNOW_KEY,
  keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
  urlList,
}

console.log(`\n📡 IndexNow: Pinging ${urlList.length} URLs...\n`)
urlList.forEach(url => console.log(`  → ${url}`))
console.log()

const endpoints = [
  { name: 'Bing', url: 'https://www.bing.com/indexnow' },
  { name: 'Yandex', url: 'https://yandex.com/indexnow' },
  { name: 'IndexNow.org', url: 'https://api.indexnow.org/indexnow' },
]

for (const ep of endpoints) {
  try {
    const res = await fetch(ep.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    })
    const status = res.status
    const emoji = status === 200 ? '✅' : status === 202 ? '✅' : '⚠️'
    const meaning = status === 200 ? 'URLs already known' 
                   : status === 202 ? 'Accepted for indexing'
                   : `HTTP ${status}`
    console.log(`${emoji} ${ep.name}: ${status} (${meaning})`)
  } catch (e) {
    console.log(`❌ ${ep.name}: ${e.message}`)
  }
}

console.log('\n✨ Done! Bing should index within 24-48 hours.\n')
