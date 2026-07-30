'use client'

function connectGitHub() {
  window.location.href =
    'https://github.com/apps/branch-radar/installations/new'
}

export default function Home() {
  return (
    <div>
      <button onClick={connectGitHub}>Connect to GitHub</button>
    </div>
  )
}
