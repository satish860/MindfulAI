import { getAllArticles } from '@/lib/articles'
import { NextRequest, NextResponse } from 'next/server'

const INDEXNOW_KEY = '7a751798341d4bfdba34f3406cabc7fe'
const SITE_URL = 'https://themindfulai.dev'

export async function GET(request: NextRequest) {
  // Simple auth to prevent abuse — require ?key= param
  const authKey = request.nextUrl.searchParams.get('key')
  if (authKey !== INDEXNOW_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const articles = getAllArticles()

  const urlList = [
    SITE_URL,
    `${SITE_URL}/about`,
    ...articles.map((a) => `${SITE_URL}/articles/${a.slug}`),
  ]

  // Submit to IndexNow (Bing, Yandex, Seznam, Naver)
  const payload = {
    host: 'themindfulai.dev',
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList,
  }

  const results: Record<string, number | string> = {}

  // Ping Bing IndexNow
  try {
    const bingRes = await fetch('https://www.bing.com/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    })
    results.bing = bingRes.status
  } catch (e) {
    results.bing = `error: ${e instanceof Error ? e.message : 'unknown'}`
  }

  // Ping Yandex IndexNow
  try {
    const yandexRes = await fetch('https://yandex.com/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    })
    results.yandex = yandexRes.status
  } catch (e) {
    results.yandex = `error: ${e instanceof Error ? e.message : 'unknown'}`
  }

  // Ping IndexNow.org (distributes to all partners)
  try {
    const indexnowRes = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    })
    results.indexnow_org = indexnowRes.status
  } catch (e) {
    results.indexnow_org = `error: ${e instanceof Error ? e.message : 'unknown'}`
  }

  return NextResponse.json({
    success: true,
    submitted: urlList.length,
    urls: urlList,
    results,
    note: 'HTTP 200 or 202 = accepted. 200 = URL already known. 202 = URL accepted for indexing.',
  })
}
