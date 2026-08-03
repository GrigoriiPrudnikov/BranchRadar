'use client'

import { redirect } from 'next/navigation'

function connectGitHub() {
  redirect('https://github.com/apps/branch-radar/installations/new')
}

export default function Home() {
  return (
    <div>
      <button onClick={connectGitHub}>Connect to GitHub</button>
    </div>
  )
}
