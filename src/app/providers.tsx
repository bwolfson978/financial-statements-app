'use client';

import { useEffect } from 'react';
import LogRocket from 'logrocket';

export function LogRocketProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  useEffect(() => {
    // Initialize LogRocket only on the client side and in production
    if (typeof window !== 'undefined') { // todo: can add  && process.env.NODE_ENV === 'production' filter to send data from different environments (dev/staging/prod to different LogRocket projects)
      LogRocket.init('5io0b1/first-project');
    }
  }, []);

  return <>{children}</>;
} 