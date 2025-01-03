import React from 'react';
import { useRouter } from 'next/router';
import styles from '../components/Animation.module.css';

const GoBackButton: React.FC = () => {
  const router = useRouter();

  const goBackHome = () => {
    router.push('/home');
  };

  return (
    <div className={styles.buttonContainer}>
      <span className={styles.button}>
        <a onClick={goBackHome}>
          <span className={styles.icon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </span>
          <span className={styles.text}>Go Back</span> {/* Text on the right side */}
        </a>
      </span>
    </div>
  );
};

export default GoBackButton;
