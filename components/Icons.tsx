
import React from 'react';

export const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

export const UserCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export const CommandLineIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
    </svg>
);


export const TrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-4.5A3.375 3.375 0 0012.375 7.5H11.625A3.375 3.375 0 008.25 10.875V18.75m9 0h-9" />
  </svg>
);

// Updated ShieldCheckIcon to be more generic Shield Icon for defense
export const ShieldIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c.966 0 1.892.286 2.678.814l.002.001L15 3.375M12 2.25c-.966 0-1.892.286-2.678.814l-.002.001L9 3.375m0 0A11.212 11.212 0 005.673 6.168M15 3.375A11.212 11.212 0 0118.327 6.168m-9.498-.99A11.208 11.208 0 003.75 8.25c0 6.627 4.03 12 9 13.5 4.97-1.5 9-6.873 9-13.5 0-1.558-.325-3.05-.904-4.413M6.375 12.375h11.25" />
    </svg>
);
// Original ShieldCheckIcon if still needed specifically for class or other UI
export const ShieldCheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622A11.99 11.99 0 0018.402 6a11.959 11.959 0 01-2.07-.964M12 4.5A3.75 3.75 0 008.25 8.25V10.5a3.75 3.75 0 003.75 3.75h0a3.75 3.75 0 003.75-3.75V8.25A3.75 3.75 0 0012 4.5v0z" />
    </svg>
);


export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L21 5.25l-.813 2.846a4.5 4.5 0 00-3.09 3.09L14.25 12l2.846.813a4.5 4.5 0 003.09 3.09L21 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09zM12 16.875l.813 2.846a4.5 4.5 0 003.09 3.09L18.75 21l-2.846-.813a4.5 4.5 0 00-3.09-3.09L12 14.25l-.813 2.846a4.5 4.5 0 00-3.09 3.09L5.25 21l2.846-.813a4.5 4.5 0 003.09-3.09L12 16.875z" />
    </svg>
);

export const PuzzlePieceIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 7.756a4.5 4.5 0 100 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 6.75h.008v.008H12v-.008z" />
    </svg>
);

export const ArrowPathIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

export const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

export const BeakerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.083c-.05.281-.09.567-.122.857A4.502 4.502 0 0015.75 9h.75m-2.672-2.917A4.501 4.501 0 0115.75 9h.75M8.25 9H12m3.75 0H9m1.5-3.75A4.502 4.502 0 008.25 9m3.75-3.75c.032.29.072.576.122.857m0 0A4.501 4.501 0 019.75 9h-.75m1.672-2.917A4.502 4.502 0 009.75 9h-.75M12 9V3.75m0 5.25v1.875c0 .596.223 1.17.624 1.622l1.017 1.22c.46.553 1.1.883 1.784.975.18.02.362.028.546.028c.184 0 .366-.008.546-.028.684-.092 1.323-.422 1.784-.975l1.017-1.22c.401-.452.624-1.026.624-1.622V9m-6.75 6.375H12m5.25 0H12m0 0V12m0 3.375v3.25A2.25 2.25 0 019.75 21h-3.5A2.25 2.25 0 014 18.75v-3.25M12 15.375V12m0 0V9" />
  </svg>
);

export const BoltIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

export const HeartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

export const ShieldExclamationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623A11.99 11.99 0 0018.402 6a11.959 11.959 0 01-2.07-.964M12 16.5h.008v.008H12v-.008z" />
  </svg>
);

export const SunIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
);

export const EyeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const ChatBubbleLeftRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3.682-3.091c-.375.024-.754.037-1.132.037H8.84c-1.136 0-2.077-.967-2.077-2.1v-4.286c0-.97.616-1.813 1.5-2.097m1.088-4.338c.884-.284 1.83-.284 2.713 0l1.751 1.751c.166.166.36.296.572.387m0 0c.202.08.414.12.632.12h1.876c.218 0 .43-.04.632-.12a4.482 4.482 0 002.43-1.276l1.036-1.036A1.5 1.5 0 0021.45 4.22c-.284-.884-1.128-1.5-2.097-1.5H8.647c-.97 0-1.813.616-2.097 1.5a1.5 1.5 0 00.223 1.447l1.036 1.036a4.482 4.482 0 002.43 1.276m0 0c.218.08.442.12.672.12h.814c.23 0 .454-.04.672-.12M6.75 12H20.25" />
  </svg>
);

export const CurrencyDollarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const BackpackIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H5.506c-.67 0-1.19-.578-1.119-1.243l1.263-12a1.125 1.125 0 011.119-1.007h8.47c.534 0 1.01.343 1.119 1.007zM8.25 10.5a2.25 2.25 0 00-2.25 2.25v.75c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-.75a2.25 2.25 0 00-2.25-2.25H8.25z" />
  </svg>
);

export const GithubIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 16 16" fill="currentColor" {...props}>
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
  </svg>
);

export const TwitterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733a4.67 4.67 0 002.048-2.578 9.3 9.3 0 01-2.958 1.13 4.664 4.664 0 00-7.938 4.25 13.229 13.229 0 01-9.602-4.868c-.4.69-.63 1.49-.63 2.342A4.658 4.658 0 003.65 9.75c-.795-.025-1.533-.244-2.17-.592v.06a4.655 4.655 0 003.732 4.563 4.638 4.638 0 01-2.166.082 4.644 4.644 0 004.338 3.223A9.328 9.328 0 010 17.54a13.176 13.176 0 007.141 2.093c8.567 0 13.255-7.098 13.255-13.254 0-.202-.005-.403-.014-.602a9.49 9.49 0 002.323-2.41z"/>
  </svg>
);

export const DiscordIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 245 240" fill="currentColor" {...props}>
    <path d="M104.4 103.9c-5.7 0-10.2 5-10.2 11.1s4.6 11.1 10.2 11.1c5.7 0 10.2-5 10.2-11.1.1-6.1-4.5-11.1-10.2-11.1zm36.5 0c-5.7 0-10.2 5-10.2 11.1s4.6 11.1 10.2 11.1c5.7 0 10.2-5 10.2-11.1s-4.5-11.1-10.2-11.1z"/>
    <path d="M189.5 20h-134C44.2 20 35 29.2 35 40.6v135.2c0 11.4 9.2 20.6 20.5 20.6h113.4l-5.3-18.5 12.8 11.9 12.1 11.2 21.5 19V40.6c0-11.4-9.2-20.6-20.5-20.6zm-38.6 130.6s-3.6-4.3-6.6-8.1c13.1-3.7 18.1-11.9 18.1-11.9-4.1 2.7-8 4.6-11.5 5.9-5 2.1-9.8 3.5-14.5 4.3-9.6 1.8-18.4 1.3-25.9-.1-5.7-1.1-10.6-2.7-14.7-4.3-2.3-.9-4.8-2-7.3-3.4-.3-.2-.6-.3-.9-.5-.2-.1-.3-.2-.4-.3-1.8-1-2.8-1.7-2.8-1.7s4.8 8 17.5 11.8c-3 3.8-6.7 8.3-6.7 8.3-22.1-.7-30.5-15.2-30.5-15.2 0-32.2 14.4-58.3 14.4-58.3 14.4-10.8 28.7-10.8 28.7-10.8l1 1.2c-18 5.2-26.3 13.1-26.3 13.1s2.2-1.2 5.9-2.9c10.7-4.7 19.2-6 22.7-6.3.6-.1 1.1-.2 1.7-.2 6.1-.8 13-1 20.2-.2 9.5 1.1 19.7 3.9 30.1 9.6 0 0-7.9-7.5-24.9-12.7l1.4-1.6s14.3 0 28.7 10.8c0 0 14.4 26.1 14.4 58.3 0 0-8.5 14.5-30.6 15.2z"/>
  </svg>
);

// Combat Icons
export const SwordIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 3.75l12.61 12.612a4.5 4.5 0 01-6.363 6.363L3.75 19.5m0-15.75v15.75m0-15.75h3.375c1.063 0 2.061.421 2.792 1.152l4.125 4.125m-6.917 0L20.25 3.75m-16.5 0h16.5" />
  </svg>
);


export const WindIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( // For Dodge / Miss
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 9.75A4.5 4.5 0 0013.75 12H3.75m14.5-2.25A4.5 4.5 0 0113.75 12H3.75M12 5.25A4.5 4.5 0 017.5 9.75H3.75" />
  </svg>
);

export const MagicBlastIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.378 2.036a.75.75 0 011.244 0l1.75 3.5a.75.75 0 00.962.448l3.798-.95a.75.75 0 01.95.95l-.95 3.798a.75.75 0 00.448.963l3.5 1.75a.75.75 0 010 1.244l-3.5 1.75a.75.75 0 00-.448.962l.95 3.798a.75.75 0 01-.95.95l-3.798-.95a.75.75 0 00-.962.448l-1.75 3.5a.75.75 0 01-1.244 0l-1.75-3.5a.75.75 0 00-.962-.448l-3.798.95a.75.75 0 01-.95-.95l.95-3.798a.75.75 0 00-.448-.962l-3.5-1.75a.75.75 0 010-1.244l3.5-1.75a.75.75 0 00.448-.962l-.95-3.798a.75.75 0 01.95-.95l3.798.95a.75.75 0 00.962.448l1.75-3.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v7.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 12h-7.5" />
  </svg>
);

export const DaggerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 4.5l-3.352 3.352A4.503 4.503 0 009.75 8.998V10.5m-.758 4.002l-3.352 3.352a4.5 4.5 0 01-6.364-6.364l7.954-7.954A4.5 4.5 0 0115.75 6h1.5m-2.242-1.5L19.5 9m-2.242 10.5L19.5 15m-4.5-4.5H15" />
  </svg>
);

export const FistIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( // For Brute attacks or unarmed
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-2.462M13.684 16.6L19.5 12m-5.816 4.6c-1.573 0-2.848-1.218-2.848-2.71 0-1.49.819-3.312 2.348-3.312M13.684 16.6c1.573 0 2.848 1.218 2.848 2.71 0 1.491-.819 3.312-2.348 3.312M3.75 12h16.5M3.75 6.75h16.5m-16.5 5.25h16.5" />
  </svg>
);

// Checkmark icon for success/hit
export const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

// X-Mark icon for failure/miss
export const XMarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const WalletIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6.062c0 .405-.233.77-.596.946-.09.044-.184.08-.278.112L16.5 21H7.5l-1.626-1.88c-.094-.032-.188-.068-.278-.112a1.21 1.21 0 01-.596-.946V12m0-2.25A2.25 2.25 0 015.25 7.5h13.5A2.25 2.25 0 0121 9.75M15.75 12H8.25" />
  </svg>
);

export const ArrowRightOnRectangleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( // For Disconnect/Logout
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
  </svg>
);

export const Cog6ToothIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.096.573.393 1.096.784 1.485l.95.95c.41.41.996.524 1.494.306l1.22-.54c.542-.24 1.148.027 1.35.543l1.253 2.17c.202.35.034.796-.354 1.037l-1.036.633c-.42.254-.67.71-.67 1.195v.71c0 .485.25.94.67 1.195l1.036.633c.388.24.556.686.354 1.037l-1.253 2.17c-.202.35-.807.783-1.35.543l-1.22-.54c-.498-.218-1.084-.104-1.494.306l-.95.95c-.39.39-.688.912-.784 1.485l-.213 1.281c-.09.542-.56.94-1.11-.94h-2.593c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.096-.573-.393-1.096-.784-1.485l-.95-.95c-.41-.41-.996-.524-1.494-.306l-1.22.54c-.542-.24-1.148.027-1.35.543l-1.253 2.17c-.202.35-.034.796-.354 1.037l1.036.633c.42.254.67.71.67 1.195v-.71c0-.485-.25-.94-.67-1.195L2.73 11.65c-.388-.24-.556-.686-.354-1.037l1.253-2.17c.202-.35.807.783 1.35.543l1.22.54c.498.218 1.084.104 1.494.306l.95-.95c.39-.39.688.912-.784 1.485l.213-1.281z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const QuestionMarkCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
  </svg>
);

// Status Effect Icons
export const FireIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.62a8.983 8.983 0 013.361-3.867 8.211 8.211 0 003 2.457zM12 12V9" />
  </svg>
);

export const TrendingUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
  </svg>
);

export const TrendingDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.511l5.511-3.181" />
  </svg>
);

export const StopIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
  </svg>
);
export const LightningBoltIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);
