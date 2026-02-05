import { DefaultTheme } from 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    // Core
    background: string;
    backgroundAlt: string;
    surface: string;
    surfaceHover: string;
    
    // Text
    text: string;
    textSecondary: string;
    textMuted: string;
    
    // Borders
    border: string;
    borderSubtle: string;
    borderRadius: string;
    
    // Accents
    accent: string;
    accentHover: string;
    accentMuted: string;
    accentGlow: string;
    accentGold: string;
    
    // Status
    live: string;
    liveGlow: string;
    success: string;
    warning: string;
    danger: string;
    
    // Effects
    shadow: string;
    shadowStrong: string;
    overlay: string;
    glow: string;
    
    // Named Colors (Into the Void palette)
    signalWhite: string;
    steelGray: string;
    infraRed: string;
  }
}

// Detroit Maker Hub - Dark Theme
// Industrial, community-first, civic infrastructure
export const darkTheme: DefaultTheme = {
  // Core backgrounds
  background: '#0D0D0F',           // Deep Charcoal
  backgroundAlt: '#18191D',        // Workshop Dark
  surface: '#18191D',              // Workshop Dark
  surfaceHover: '#222328',         // Slightly lighter for hover
  
  // Text
  text: '#F0F0F0',                 // Clean White
  textSecondary: '#A0A0A5',        // Muted gray
  textMuted: '#6B6B72',            // Even more muted
  
  // Borders
  border: '#2C2D33',               // Steel Border
  borderSubtle: '#222328',         // Subtle border
  borderRadius: '8px',
  
  // Accents - Industrial Orange
  accent: '#E85D2A',               // Maker Orange
  accentHover: '#D14E1F',          // Deeper orange
  accentMuted: 'rgba(232, 93, 42, 0.15)',
  accentGlow: 'rgba(232, 93, 42, 0.4)',
  accentGold: '#D4A340',           // Workshop Gold
  
  // Status
  live: '#E85D2A',                 // Maker Orange
  liveGlow: 'rgba(232, 93, 42, 0.3)',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  
  // Effects
  shadow: 'rgba(0, 0, 0, 0.5)',
  shadowStrong: 'rgba(0, 0, 0, 0.8)',
  overlay: 'rgba(13, 13, 15, 0.9)',
  glow: '0 0 20px rgba(232, 93, 42, 0.3)',
  
  // Named Colors (Detroit Maker palette)
  signalWhite: '#F0F0F0',
  steelGray: '#2C2D33',
  infraRed: '#E85D2A',
};

// Light theme (kept for compatibility, but app should default to dark)
export const lightTheme: DefaultTheme = {
  background: '#F5F5F0',
  backgroundAlt: '#E8E8E2',
  surface: '#FFFFFF',
  surfaceHover: '#F9F9F5',
  
  text: '#1A1A1E',
  textSecondary: '#4B4B55',
  textMuted: '#8A8A8F',
  
  border: '#D1D1CC',
  borderSubtle: '#E8E8E2',
  borderRadius: '8px',
  
  accent: '#E85D2A',
  accentHover: '#D14E1F',
  accentMuted: 'rgba(232, 93, 42, 0.1)',
  accentGlow: 'rgba(232, 93, 42, 0.2)',
  accentGold: '#D4A340',
  
  live: '#E85D2A',
  liveGlow: 'rgba(232, 93, 42, 0.2)',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowStrong: 'rgba(0, 0, 0, 0.2)',
  overlay: 'rgba(255, 255, 255, 0.9)',
  glow: '0 0 20px rgba(232, 93, 42, 0.15)',
  
  // Named Colors
  signalWhite: '#F0F0F0',
  steelGray: '#D1D1CC',
  infraRed: '#E85D2A',
};
