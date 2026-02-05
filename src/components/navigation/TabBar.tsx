import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

// SVG Icons
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const SpacesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const EventsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const OpportunitiesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const AccountIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

const TabBarContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: ${({ theme }) => theme.surface};
  border-top: 1px solid ${({ theme }) => theme.border};
  padding: 0.5rem 0;
  padding-bottom: calc(0.5rem + env(safe-area-inset-bottom));
`;

const TabList = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  max-width: 500px;
  margin: 0 auto;
`;

const TabButton = styled.button<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
  min-width: 60px;
  
  color: ${({ $active, theme }) => $active ? theme.accent : theme.textMuted};
  
  &:hover {
    color: ${({ $active, theme }) => $active ? theme.accent : theme.text};
  }
`;

const TabIconWrapper = styled.span<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  transition: transform 0.15s ease;
  
  svg {
    width: 100%;
    height: 100%;
  }
  
  ${TabButton}:hover & {
    transform: scale(1.1);
  }
`;

const TabLabel = styled.span<{ $active: boolean }>`
  font-size: 0.65rem;
  font-weight: ${({ $active }) => $active ? 600 : 500};
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

export const TabBar: React.FC = () => {
  const router = useRouter();
  const currentPath = router.pathname;
  
  const tabs: Tab[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <HomeIcon />,
      href: '/dashboard',
    },
    {
      id: 'spaces',
      label: 'Spaces',
      icon: <SpacesIcon />,
      href: '/spaces',
    },
    {
      id: 'events',
      label: 'Events',
      icon: <EventsIcon />,
      href: '/events',
    },
    {
      id: 'opportunities',
      label: 'Opps',
      icon: <OpportunitiesIcon />,
      href: '/opportunities',
    },
    {
      id: 'account',
      label: 'Account',
      icon: <AccountIcon />,
      href: '/account',
    },
  ];
  
  const handleTabClick = (tab: Tab) => {
    router.push(tab.href);
  };
  
  const isActive = (tab: Tab) => {
    if (tab.href === '/dashboard') {
      return currentPath === '/dashboard' || currentPath === '/';
    }
    return currentPath.startsWith(tab.href);
  };
  
  return (
    <TabBarContainer>
      <TabList>
        {tabs.map((tab) => {
          const active = isActive(tab);
          return (
            <TabButton
              key={tab.id}
              $active={active}
              onClick={() => handleTabClick(tab)}
              aria-label={tab.label}
            >
              <TabIconWrapper $active={active}>{tab.icon}</TabIconWrapper>
              <TabLabel $active={active}>{tab.label}</TabLabel>
            </TabButton>
          );
        })}
      </TabList>
    </TabBarContainer>
  );
};

// Spacer to prevent content from being hidden behind the tab bar
export const TabBarSpacer = styled.div`
  height: calc(70px + env(safe-area-inset-bottom));
`;

export default TabBar;
