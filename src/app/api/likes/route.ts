import { NextRequest, NextResponse } from 'next/server'

interface LikeRecord {
  count: number
  slug: string
  createdAt: number
  updatedAt: number
}

// 使用内存存储（实际项目中应该使用数据库）
let likesStore: Map<string, LikeRecord> = new Map()

export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get('slug')
    if (!slug) {
      return NextResponse.json(
        { error: 'Missing slug parameter' },
        { status: 400 },
      )
    }

    const record = likesStore.get(slug)
    const likes = record?.count ?? 0

    return NextResponse.json({ likes, value: likes })
  }
  catch (error) {
    console.error('Error fetching likes:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug } = body

    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { error: 'Invalid slug parameter' },
        { status: 400 },
      )
    }

    const now = Date.now()
    const existing = likesStore.get(slug)

    if (existing) {
      existing.count += 1
      existing.updatedAt = now
      likesStore.set(slug, existing)
    }
    else {
      likesStore.set(slug, {
        count: 1,
        slug,
        createdAt: now,
        updatedAt: now,
      })
    }

    const updatedRecord = likesStore.get(slug)!
    return NextResponse.json({ likes: updatedRecord.count })
  }
  catch (error) {
    console.error('Error incrementing likes:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
