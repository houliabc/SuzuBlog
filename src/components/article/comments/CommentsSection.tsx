'use client'

import dynamic from 'next/dynamic'

const TwikooComments = dynamic(async () => import('./TwikooComments'))
const DisqusComments = dynamic(async () => import('./DisqusComments'))

interface CommentsSectionProps {
  walineServerURL?: string | null
  twikooEnvId?: string | null
  disqusShortname?: string | null
  path: string
}

export default function CommentsSection({
  walineServerURL,
  twikooEnvId,
  disqusShortname,
  path,
}: CommentsSectionProps) {
  // 暂时只支持Twikoo和Disqus，Waline后续可以添加
  if (twikooEnvId && twikooEnvId.length > 0) {
    return <TwikooComments environmentId={twikooEnvId} />
  }
  
  if (disqusShortname && disqusShortname.length > 0) {
    return <DisqusComments disqusShortname={disqusShortname} />
  }

  // 没有配置评论系统
  return null
}
