import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import CustomToolbar from '../components/CustomToolbar';
import GradientEffect from '../components/GradientEffect';
import GoBackButton from '../components/GoBackButton'; // Import the GoBackButton component
import { useRouter } from 'next/router';
import styles from '../components/Animation.module.css';

export default function AboutPage() {
  const [version, setVersion] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Fetch the app version from the main process
    if (typeof window !== 'undefined' && window.electron) {
      window.electron.ipcRenderer.invoke('get-app-version').then((version: string) => {
        setVersion(version);
      });
    }
  }, []);

  const openGithub = () => {
    if (typeof window !== 'undefined' && window.electron) {
      window.electron.ipcRenderer.send('open-external-link', 'https://github.com/MotanOfficial/s3rp3nt');
    }
  };

  return (
    <React.Fragment>
      <Head>
        <title>About - Nextron App</title>
      </Head>
      <CustomToolbar />
      <div className="relative h-screen w-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <GradientEffect />
        </div>
        <div className="text-container">
        <h1 className="text-[120px] font-bold font-glow font-glow-hover z-10 relative">
            Version: {version}
          </h1>
        </div>
        <button onClick={openGithub} className="mt-4 bg-gray-700 bg-opacity-70 text-white py-2 px-4 rounded hover:bg-gray-600 active:scale-95 transition-all duration-200 z-10 relative">
          View on GitHub
        </button>
        <GoBackButton /> {/* Use the GoBackButton component */}
      </div>
    </React.Fragment>
  );
}
