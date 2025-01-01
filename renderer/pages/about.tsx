import React, { useEffect, useState } from 'react'
import Head from 'next/head'

export default function AboutPage() {
  const [version, setVersion] = useState('')

  useEffect(() => {
    // Fetch the app version from the main process
    if (typeof window !== 'undefined' && window.electron) {
      window.electron.ipcRenderer.invoke('get-app-version').then((version: string) => {
        setVersion(version)
      })
    }
  }, [])

  const openGithub = () => {
    if (typeof window !== 'undefined' && window.electron) {
      window.electron.ipcRenderer.send('open-external-link', 'https://github.com/MotanOfficial/s3rp3nt')
    }
  }

  return (
    <React.Fragment>
      <Head>
        <title>About - Nextron App</title>
      </Head>
      <div className="bg-black text-white flex flex-col items-center justify-center h-screen font-sans text-center">
        <h1 className="text-4xl mb-4">My Nextron App</h1>
        <p id="version" className="text-xl mb-4">Version: {version}</p>
        <button onClick={openGithub} className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-500">
          View on GitHub
        </button>
      </div>
    </React.Fragment>
  )
}
