import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import styled, { keyframes } from "styled-components";
import { useRouter } from "next/router";
import { useUser } from "@/contexts/UserContext";
import { Loading } from "@/components/Loading";
import { EventCard } from "@/components/events";
import { SpaceCard, SpaceData } from "@/components/spaces";
import { TabBar, TabBarSpacer } from "@/components/navigation";
import { communityConfig } from "@/config/community";

interface EventPreview {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  imageUrl: string | null;
  eventDate: Date;
  startTime: string | null;
  endTime: string | null;
  isExternal: boolean;
  externalUrl: string | null;
  creator: {
    id: string;
    username: string | null;
    displayName: string | null;
    pfpUrl: string | null;
  };
  rsvpCount: number;
  userRsvpStatus?: string | null;
}

interface OpportunityPreview {
  id: string;
  title: string;
  type: string;
  createdAt: Date;
  space: { name: string; slug: string } | null;
  postedBy: {
    displayName: string | null;
    username: string | null;
  };
}

const TYPE_LABELS: Record<string, string> = {
  collaborator: 'Collaborator',
  paid_gig: 'Paid Gig',
  grant: 'Grant/RFP',
  tool_access: 'Tool Access',
  materials_swap: 'Materials',
  open_studio: 'Open Studio',
};

const TYPE_COLORS: Record<string, string> = {
  collaborator: '#3B82F6',
  paid_gig: '#22C55E',
  grant: '#F59E0B',
  tool_access: '#8B5CF6',
  materials_swap: '#EC4899',
  open_studio: '#06B6D4',
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.background};
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ContentArea = styled.div`
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  padding: 1.5rem 1rem 1rem;
  animation: ${fadeIn} 0.4s ease-out;
`;

const WelcomeSection = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.accent}15 0%, ${({ theme }) => theme.accent}05 100%);
  border: 1px solid ${({ theme }) => theme.accent}30;
  border-radius: 16px;
`;

const WelcomeTitle = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin: 0 0 0.35rem 0;

  @media (min-width: 600px) {
    font-size: 1.75rem;
  }
`;

const WelcomeSubtitle = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.textMuted};
  margin: 0;
  line-height: 1.5;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0;
`;

const SeeAllLink = styled(Link)`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.accent};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const EventsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const EmptyBlock = styled.div`
  padding: 1.5rem;
  text-align: center;
  color: ${({ theme }) => theme.textMuted};
  background: ${({ theme }) => theme.surface};
  border: 1px dashed ${({ theme }) => theme.border};
  border-radius: 12px;
  font-size: 0.9rem;
`;

const SpacesRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const OppList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const OppItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.accent};
  }
`;

const OppTypeDot = styled.span<{ $type: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $type }) => TYPE_COLORS[$type] || '#6B7280'};
  flex-shrink: 0;
`;

const OppInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const OppTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const OppMeta = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.textMuted};
`;

const QuickLinksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;

  @media (min-width: 480px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const QuickLinkCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.25rem 0.75rem;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.accent};
    transform: translateY(-1px);
  }
`;

const QuickLinkIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: ${({ theme }) => theme.accentMuted};
  color: ${({ theme }) => theme.accent};

  svg {
    width: 20px;
    height: 20px;
  }
`;

const QuickLinkLabel = styled.span`
  font-size: 0.8rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  text-align: center;
`;

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { user, isLoading: isUserLoading } = useUser();
  const [events, setEvents] = useState<EventPreview[]>([]);
  const [opportunities, setOpportunities] = useState<OpportunityPreview[]>([]);
  const [featuredSpaces, setFeaturedSpaces] = useState<SpaceData[]>([]);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/app');
    }
  }, [isUserLoading, user, router]);

  useEffect(() => {
    if (!user) return;

    // Fetch events
    fetch('/api/events')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.events) setEvents(data.events.slice(0, 5));
      })
      .catch(() => {});

    // Fetch opportunities
    fetch('/api/opportunities')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.opportunities) setOpportunities(data.opportunities.slice(0, 5));
      })
      .catch(() => {});

    // Fetch featured spaces
    fetch('/api/spaces')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.spaces) {
          setFeaturedSpaces(data.spaces.filter((s: SpaceData) => s.isFeatured).slice(0, 3));
        }
      })
      .catch(() => {});
  }, [user]);

  if (isUserLoading && !user) {
    return <Loading text="Loading..." />;
  }

  if (!isUserLoading && !user) {
    return null;
  }

  if (!user) {
    return null;
  }

  const displayName = user.displayName || user.username || 'there';

  return (
    <Container>
      <Head>
        <title>{communityConfig.name}</title>
        <meta name="description" content={communityConfig.description} />
        <link rel="icon" href={communityConfig.branding.favicon} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Main>
        <ContentArea>
          <WelcomeSection>
            <WelcomeTitle>Welcome, {displayName}</WelcomeTitle>
            <WelcomeSubtitle>
              {communityConfig.home.missionStatement}
            </WelcomeSubtitle>
          </WelcomeSection>

          {/* Quick Links */}
          <Section>
            <QuickLinksGrid>
              <QuickLinkCard href="/spaces">
                <QuickLinkIcon>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                </QuickLinkIcon>
                <QuickLinkLabel>Spaces</QuickLinkLabel>
              </QuickLinkCard>
              <QuickLinkCard href="/events">
                <QuickLinkIcon>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </QuickLinkIcon>
                <QuickLinkLabel>Events</QuickLinkLabel>
              </QuickLinkCard>
              <QuickLinkCard href="/opportunities">
                <QuickLinkIcon>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                </QuickLinkIcon>
                <QuickLinkLabel>Opportunities</QuickLinkLabel>
              </QuickLinkCard>
              <QuickLinkCard href="/members">
                <QuickLinkIcon>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </QuickLinkIcon>
                <QuickLinkLabel>Members</QuickLinkLabel>
              </QuickLinkCard>
            </QuickLinksGrid>
          </Section>

          {/* Upcoming Events */}
          <Section>
            <SectionHeader>
              <SectionTitle>Upcoming Events</SectionTitle>
              <SeeAllLink href="/events">View all</SeeAllLink>
            </SectionHeader>
            {events.length > 0 ? (
              <EventsList>
                {events.map((event) => (
                  <EventCard key={event.id} event={event} compact />
                ))}
              </EventsList>
            ) : (
              <EmptyBlock>No upcoming events. Check back soon!</EmptyBlock>
            )}
          </Section>

          {/* New Opportunities */}
          <Section>
            <SectionHeader>
              <SectionTitle>New Opportunities</SectionTitle>
              <SeeAllLink href="/opportunities">View all</SeeAllLink>
            </SectionHeader>
            {opportunities.length > 0 ? (
              <OppList>
                {opportunities.map(opp => (
                  <OppItem key={opp.id} href={`/opportunities/${opp.id}`}>
                    <OppTypeDot $type={opp.type} />
                    <OppInfo>
                      <OppTitle>{opp.title}</OppTitle>
                      <OppMeta>
                        {TYPE_LABELS[opp.type] || opp.type}
                        {opp.space && ` at ${opp.space.name}`}
                      </OppMeta>
                    </OppInfo>
                  </OppItem>
                ))}
              </OppList>
            ) : (
              <EmptyBlock>No opportunities posted yet.</EmptyBlock>
            )}
          </Section>

          {/* Featured Spaces */}
          <Section>
            <SectionHeader>
              <SectionTitle>Featured Spaces</SectionTitle>
              <SeeAllLink href="/spaces">View all</SeeAllLink>
            </SectionHeader>
            {featuredSpaces.length > 0 ? (
              <SpacesRow>
                {featuredSpaces.map(space => (
                  <SpaceCard key={space.id} space={space} />
                ))}
              </SpacesRow>
            ) : (
              <EmptyBlock>No featured spaces yet.</EmptyBlock>
            )}
          </Section>
        </ContentArea>
      </Main>

      <TabBarSpacer />
      <TabBar />
    </Container>
  );
};

export default DashboardPage;
