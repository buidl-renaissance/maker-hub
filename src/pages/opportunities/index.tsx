import React, { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styled, { keyframes } from 'styled-components';
import { useUser } from '@/contexts/UserContext';
import { TabBar, TabBarSpacer } from '@/components/navigation';
import { communityConfig } from '@/config/community';

const TYPE_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'collaborator', label: 'Collaborator' },
  { value: 'paid_gig', label: 'Paid Gig' },
  { value: 'grant', label: 'Grant / RFP' },
  { value: 'tool_access', label: 'Tool Access' },
  { value: 'materials_swap', label: 'Materials' },
  { value: 'open_studio', label: 'Open Studio' },
];

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

interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  contactInfo: string | null;
  expiresAt: Date | null;
  createdAt: Date;
  space: { name: string; slug: string } | null;
  postedBy: {
    id: string;
    displayName: string | null;
    username: string | null;
    pfpUrl: string | null;
  };
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
  padding: 1.5rem 1rem 1rem;
  animation: ${fadeIn} 0.4s ease-out;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
`;

const PageTitleBlock = styled.div``;

const PageTitle = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin: 0 0 0.25rem;
`;

const PageSubtitle = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textMuted};
  margin: 0;
`;

const CreateButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.6rem 1rem;
  background: ${({ theme }) => theme.accent};
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.15s ease;
  flex-shrink: 0;

  &:hover {
    background: ${({ theme }) => theme.accentHover};
    color: white;
  }
`;

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const FilterChip = styled.button<{ $active: boolean }>`
  padding: 0.4rem 0.75rem;
  background: ${props => props.$active ? props.theme.accent : props.theme.surface};
  border: 1px solid ${props => props.$active ? props.theme.accent : props.theme.border};
  border-radius: 20px;
  color: ${props => props.$active ? 'white' : props.theme.text};
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.accent};
  }
`;

const OpportunitiesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const OppCard = styled(Link)`
  display: block;
  padding: 1.25rem;
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

const OppHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
`;

const OppTypeBadge = styled.span<{ $type: string }>`
  display: inline-block;
  padding: 0.2rem 0.5rem;
  background: ${({ $type }) => TYPE_COLORS[$type] || '#6B7280'}20;
  color: ${({ $type }) => TYPE_COLORS[$type] || '#6B7280'};
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-radius: 4px;
`;

const OppTitle = styled.div`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.05rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.35rem;
`;

const OppDescription = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textSecondary};
  margin: 0 0 0.75rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const OppMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textMuted};
  flex-wrap: wrap;
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const SpaceLink = styled.span`
  color: ${({ theme }) => theme.accent};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${({ theme }) => theme.textMuted};

  h3 {
    margin: 0 0 0.5rem;
    color: ${({ theme }) => theme.text};
  }

  p {
    margin: 0;
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${({ theme }) => theme.textMuted};
`;

function formatTimeAgo(date: Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const OpportunitiesPage: React.FC = () => {
  const { user } = useUser();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');

  const fetchOpportunities = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (typeFilter) params.set('type', typeFilter);

      const response = await fetch(`/api/opportunities?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setOpportunities(data.opportunities);
      }
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setLoading(false);
    }
  }, [typeFilter]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  return (
    <Container>
      <Head>
        <title>Opportunities | {communityConfig.name}</title>
        <meta name="description" content={`Collaboration, gigs, grants, and more - ${communityConfig.name}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Main>
        <ContentArea>
          <PageHeader>
            <PageTitleBlock>
              <PageTitle>Opportunities</PageTitle>
              <PageSubtitle>Gigs, collaborations, grants, and resources.</PageSubtitle>
            </PageTitleBlock>
            {user && (
              <CreateButton href="/opportunities/create">
                + Post
              </CreateButton>
            )}
          </PageHeader>

          <FilterBar>
            {TYPE_OPTIONS.map(opt => (
              <FilterChip
                key={opt.value}
                $active={typeFilter === opt.value}
                onClick={() => setTypeFilter(opt.value)}
              >
                {opt.label}
              </FilterChip>
            ))}
          </FilterBar>

          {loading ? (
            <LoadingContainer>Loading opportunities...</LoadingContainer>
          ) : opportunities.length > 0 ? (
            <OpportunitiesList>
              {opportunities.map(opp => (
                <OppCard key={opp.id} href={`/opportunities/${opp.id}`}>
                  <OppHeader>
                    <OppTypeBadge $type={opp.type}>
                      {TYPE_LABELS[opp.type] || opp.type}
                    </OppTypeBadge>
                  </OppHeader>
                  <OppTitle>{opp.title}</OppTitle>
                  <OppDescription>{opp.description}</OppDescription>
                  <OppMeta>
                    <MetaItem>
                      {opp.postedBy.displayName || opp.postedBy.username || 'Anonymous'}
                    </MetaItem>
                    {opp.space && (
                      <MetaItem>
                        <SpaceLink>{opp.space.name}</SpaceLink>
                      </MetaItem>
                    )}
                    <MetaItem>{formatTimeAgo(opp.createdAt)}</MetaItem>
                  </OppMeta>
                </OppCard>
              ))}
            </OpportunitiesList>
          ) : (
            <EmptyState>
              <h3>No opportunities yet</h3>
              <p>
                {typeFilter
                  ? 'Try a different filter.'
                  : 'Be the first to post an opportunity!'}
              </p>
            </EmptyState>
          )}
        </ContentArea>

        <TabBarSpacer />
        <TabBar />
      </Main>
    </Container>
  );
};

export default OpportunitiesPage;
