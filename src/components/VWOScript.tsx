import React from 'react';
import Script from 'next/script';
import Head from 'next/head';
import { getAsyncCode } from '../templates/asyncCode';

export interface VWOScriptProps {
  accountId?: string;
  type?: 'ASYNC' | 'OSC';
  settingsTimeout?: number;
  hideElement?: string;
  hideElementStyle?: string;
  scriptAttributes?: Record<string, string>;
}

export const VWOScript: React.FC<VWOScriptProps> = ({ 
  accountId, 
  type = 'ASYNC',
  settingsTimeout = 2000,
  hideElement = 'body',
  hideElementStyle = 'opacity:0 !important;filter:alpha(opacity=0) !important;background:none !important',
  scriptAttributes = {}
}) => {
  const isAppDir = process.env.NEXT_RUNTIME === 'edge' || Boolean(process.env.NEXT_IS_APP_DIR);
  
  if (type === 'OSC') {
    return (
      <script 
        src={`https://dev.visualwebsiteoptimizer.com/lib/${accountId}.js`}
        {...scriptAttributes}
      />
    );
  }

  const asyncCode = accountId ? getAsyncCode(accountId, {
    settingsTimeout,
    hideElement,
    hideElementStyle,
  }) : '';

  if (isAppDir) {
    return (
      <>
        <link rel="preconnect" href="https://dev.visualwebsiteoptimizer.com" />
        <script 
          type="text/javascript"
          id="vwoCode"
          dangerouslySetInnerHTML={{ __html: asyncCode }}
        />
      </>
    );
  }

  // Page Router implementation
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://dev.visualwebsiteoptimizer.com" />
      </Head>
      <Script id="vwoCode" strategy="beforeInteractive">
        {asyncCode}
      </Script>
    </>
  );
}; 