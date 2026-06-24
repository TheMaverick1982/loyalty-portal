import React, { useEffect, useRef } from 'react';

export const LoyaltyWidget = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only inject if the container exists and we haven't already injected the script
    if (containerRef.current && !document.getElementById('loyalty-widget-script')) {
      const script = document.createElement('script');
      script.id = 'loyalty-widget-script';
      script.src = 'https://cdn.apigateway.co/webchat-client..prod/sdk.js';
      script.setAttribute('data-widget-id', '0e7a5da5-5ec4-11f1-bf6e-5ab4acf8c4b0');
      script.setAttribute('data-embed-mode', 'embedded');
      script.setAttribute('data-embed-target', 'embedded-widget-container');
      script.defer = true;
      
      document.body.appendChild(script);
    }
    
    // We don't cleanup the script to prevent flicker/re-initialization issues when navigating away and back,
    // as it's meant to be long-lived. The widget's own JS will handle the container lifecycle.
  }, []);

  return (
    <div 
      id="embedded-widget-container" 
      ref={containerRef} 
      className="w-full h-full flex-1"
      style={{ height: '100%', width: '100%' }}
    />
  );
};
