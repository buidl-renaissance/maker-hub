import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styled, { keyframes } from 'styled-components';
import Link from 'next/link';
import { TabBar, TabBarSpacer } from '@/components/navigation';
import { EventCard } from '@/components/events';
import { communityConfig } from '@/config/community';
import { Loading } from '@/components/Loading';

const TOOL_LABELS: Record<string, string> = {
  wood: 'Wood Shop',
  metal: 'Metal Shop',
  '3d_print': '3D Printing',
  laser: 'Laser Cutting',
  electronics: 'Electronics Lab',
  sewing: 'Sewing',
  ceramics: 'Ceramics Studio',
  textiles: 'Textiles',
  cnc: 'CNC Machining',
  other: 'Other',
};

interface SpaceDetail {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  neighborhood: string | null;
  address: string | null;
  imageUrl: string | null;
  websiteUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  tools: string[];
  isBeginnerFriendly: boolean;
  requiresMembership: boolean;
  isFeatured: boolean;
  isVerified: boolean;
  organizerId: string | null;
}

interface SpaceEvent {
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
}

interface SpaceOpportunity {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  createdAt: Date;
  postedByName: string | null;
  postedByUsername: string | null;
}

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
  flex: 1;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  padding: 0 0 1rem;
  animation: ${fadeIn} 0.4s ease-out;
`;

const HeroImage = styled.div`
  height: 200px;
  background: ${({ theme }) => theme.backgroundAlt};
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (min-width: 600px) {
    height: 260px;
  }
`;

const PlaceholderHero = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.surface} 0%, ${({ theme }) => theme.backgroundAlt} 100%);

  svg {
    width: 64px;
    height: 64px;
    color: ${({ theme }) => theme.textMuted};
    opacity: 0.3;
  }
`;

const BackLink = styled(Link)`
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.75rem;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  color: white;
  font-size: 0.8rem;
  text-decoration: none;
  z-index: 1;
  backdrop-filter: blur(4px);

  &:hover {
    background: rgba(0, 0, 0, 0.7);
    color: white;
  }
`;

const BodyContent = styled.div`
  padding: 1.25rem 1rem;
`;

const SpaceName = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin: 0 0 0.25rem;

  @media (min-width: 600px) {
    font-size: 1.75rem;
  }
`;

const LocationRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textMuted};
  margin-bottom: 0.75rem;
`;

const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1rem;
`;

const Badge = styled.span<{ $variant?: 'featured' | 'verified' | 'beginner' | 'membership' }>`
  display: inline-block;
  padding: 0.25rem 0.6rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-radius: 4px;
  background: ${({ theme, $variant }) => {
    switch ($variant) {
      case 'featured': return theme.accent;
      case 'verified': return '#22C55E';
      case 'beginner': return 'rgba(34, 197, 94, 0.15)';
      case 'membership': return theme.surfaceHover;
      default: return theme.surfaceHover;
    }
  }};
  color: ${({ $variant }) => {
    switch ($variant) {
      case 'featured': case 'verified': return 'white';
      case 'beginner': return '#22C55E';
      default: return 'inherit';
    }
  }};
`;

const Description = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.textSecondary};
  line-height: 1.6;
  margin: 0 0 1.5rem;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0 0 1rem;
`;

const ToolsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ToolTag = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.75rem;
  background: ${({ theme }) => theme.accentMuted};
  color: ${({ theme }) => theme.accent};
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: 6px;
`;

const EventsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const EmptySection = styled.div`
  padding: 1.5rem;
  text-align: center;
  color: ${({ theme }) => theme.textMuted};
  background: ${({ theme }) => theme.surface};
  border: 1px dashed ${({ theme }) => theme.border};
  border-radius: 12px;
  font-size: 0.9rem;
`;

const OpportunityCard = styled(Link)`
  display: block;
  padding: 1rem;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.accent};
  }
`;

const OppTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.25rem;
`;

const OppType = styled.span`
  display: inline-block;
  padding: 0.15rem 0.4rem;
  background: ${({ theme }) => theme.accentMuted};
  color: ${({ theme }) => theme.accent};
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  border-radius: 3px;
  margin-right: 0.5rem;
`;

const OppDescription = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.textMuted};
  margin: 0.35rem 0 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ContactSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ContactLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.accent};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const TYPE_LABELS: Record<string, string> = {
  collaborator: 'Collaborator',
  paid_gig: 'Paid Gig',
  grant: 'Grant/RFP',
  tool_access: 'Tool Access',
  materials_swap: 'Materials',
  open_studio: 'Open Studio',
};

const WrenchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const SpaceProfilePage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [space, setSpace] = useState<SpaceDetail | null>(null);
  const [spaceEvents, setSpaceEvents] = useState<SpaceEvent[]>([]);
  const [spaceOpportunities, setSpaceOpportunities] = useState<SpaceOpportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug || typeof slug !== 'string') return;

    const fetchSpace = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/spaces/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setSpace(data.space);
          setSpaceEvents(data.events || []);
          setSpaceOpportunities(data.opportunities || []);
        } else if (response.status === 404) {
          router.push('/spaces');
        }
      } catch (error) {
        console.error('Error fetching space:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpace();
  }, [slug, router]);

  if (loading) {
    return <Loading text="Loading space..." />;
  }

  if (!space) {
    return null;
  }

  return (
    <Container>
      <Head>
        <title>{space.name} | {communityConfig.name}</title>
        <meta name="description" content={space.shortDescription || space.description || `${space.name} - Detroit Makerspace`} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Main>
        <ContentArea>
          <HeroImage>
            {space.imageUrl ? (
              <img src={space.imageUrl} alt={space.name} />
            ) : (
              <PlaceholderHero>
                <WrenchIcon />
              </PlaceholderHero>
            )}
            <BackLink href="/spaces">Back to Spaces</BackLink>
          </HeroImage>

          <BodyContent>
            <SpaceName>{space.name}</SpaceName>

            {(space.neighborhood || space.address) && (
              <LocationRow>
                {space.neighborhood}{space.address && ` - ${space.address}`}
              </LocationRow>
            )}

            <BadgeRow>
              {space.isFeatured && <Badge $variant="featured">Featured</Badge>}
              {space.isVerified && <Badge $variant="verified">Verified</Badge>}
              {space.isBeginnerFriendly && <Badge $variant="beginner">Beginner Friendly</Badge>}
              {space.requiresMembership && <Badge $variant="membership">Membership Required</Badge>}
            </BadgeRow>

            {space.description && (
              <Description>{space.description}</Description>
            )}

            {space.tools && space.tools.length > 0 && (
              <Section>
                <SectionTitle>Tools & Capabilities</SectionTitle>
                <ToolsGrid>
                  {space.tools.map((tool) => (
                    <ToolTag key={tool}>{TOOL_LABELS[tool] || tool}</ToolTag>
                  ))}
                </ToolsGrid>
              </Section>
            )}

            <Section>
              <SectionTitle>Upcoming Events</SectionTitle>
              {spaceEvents.length > 0 ? (
                <EventsList>
                  {spaceEvents.map(event => (
                    <EventCard key={event.id} event={event} compact />
                  ))}
                </EventsList>
              ) : (
                <EmptySection>No upcoming events at this space.</EmptySection>
              )}
            </Section>

            <Section>
              <SectionTitle>Opportunities</SectionTitle>
              {spaceOpportunities.length > 0 ? (
                <EventsList>
                  {spaceOpportunities.map(opp => (
                    <OpportunityCard key={opp.id} href={`/opportunities/${opp.id}`}>
                      <OppType>{TYPE_LABELS[opp.type] || opp.type}</OppType>
                      <OppTitle>{opp.title}</OppTitle>
                      <OppDescription>{opp.description}</OppDescription>
                    </OpportunityCard>
                  ))}
                </EventsList>
              ) : (
                <EmptySection>No active opportunities at this space.</EmptySection>
              )}
            </Section>

            {(space.websiteUrl || space.contactEmail || space.contactPhone) && (
              <Section>
                <SectionTitle>Contact & Links</SectionTitle>
                <ContactSection>
                  {space.websiteUrl && (
                    <ContactLink href={space.websiteUrl} target="_blank" rel="noopener noreferrer">
                      Website
                    </ContactLink>
                  )}
                  {space.contactEmail && (
                    <ContactLink href={`mailto:${space.contactEmail}`}>
                      {space.contactEmail}
                    </ContactLink>
                  )}
                  {space.contactPhone && (
                    <ContactLink href={`tel:${space.contactPhone}`}>
                      {space.contactPhone}
                    </ContactLink>
                  )}
                </ContactSection>
              </Section>
            )}
          </BodyContent>
        </ContentArea>

        <TabBarSpacer />
        <TabBar />
      </Main>
    </Container>
  );
};

export default SpaceProfilePage;
