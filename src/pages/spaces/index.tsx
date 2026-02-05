import React, { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import styled, { keyframes } from 'styled-components';
import { TabBar, TabBarSpacer } from '@/components/navigation';
import { SpaceCard, SpaceData } from '@/components/spaces';
import { communityConfig } from '@/config/community';

const TOOL_OPTIONS = [
  { value: 'wood', label: 'Wood' },
  { value: 'metal', label: 'Metal' },
  { value: '3d_print', label: '3D Print' },
  { value: 'laser', label: 'Laser' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'sewing', label: 'Sewing' },
  { value: 'ceramics', label: 'Ceramics' },
  { value: 'cnc', label: 'CNC' },
];

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
  max-width: 960px;
  margin: 0 auto;
  width: 100%;
  padding: 1.5rem 1rem 1rem;
  animation: ${fadeIn} 0.4s ease-out;
`;

const PageHeader = styled.div`
  margin-bottom: 1.5rem;
`;

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

const SearchBar = styled.div`
  margin-bottom: 1rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.textMuted};
  }

  &:focus {
    border-color: ${({ theme }) => theme.accent};
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

const SpacesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
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

const SpacesPage: React.FC = () => {
  const [spaces, setSpaces] = useState<SpaceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [beginnerOnly, setBeginnerOnly] = useState(false);

  const fetchSpaces = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (selectedTools.length > 0) params.set('tools', selectedTools.join(','));
      if (beginnerOnly) params.set('beginnerFriendly', 'true');

      const response = await fetch(`/api/spaces?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setSpaces(data.spaces);
      }
    } catch (error) {
      console.error('Error fetching spaces:', error);
    } finally {
      setLoading(false);
    }
  }, [search, selectedTools, beginnerOnly]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSpaces();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchSpaces]);

  const toggleTool = (tool: string) => {
    setSelectedTools(prev =>
      prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool]
    );
  };

  return (
    <Container>
      <Head>
        <title>Spaces | {communityConfig.name}</title>
        <meta name="description" content={`Discover makerspaces and workshops - ${communityConfig.name}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Main>
        <ContentArea>
          <PageHeader>
            <PageTitle>Spaces</PageTitle>
            <PageSubtitle>Discover makerspaces, studios, and workshops across Detroit.</PageSubtitle>
          </PageHeader>

          <SearchBar>
            <SearchInput
              type="text"
              placeholder="Search by name or neighborhood..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </SearchBar>

          <FilterBar>
            {TOOL_OPTIONS.map(tool => (
              <FilterChip
                key={tool.value}
                $active={selectedTools.includes(tool.value)}
                onClick={() => toggleTool(tool.value)}
              >
                {tool.label}
              </FilterChip>
            ))}
            <FilterChip
              $active={beginnerOnly}
              onClick={() => setBeginnerOnly(!beginnerOnly)}
            >
              Beginner Friendly
            </FilterChip>
          </FilterBar>

          {loading ? (
            <LoadingContainer>Loading spaces...</LoadingContainer>
          ) : spaces.length > 0 ? (
            <SpacesGrid>
              {spaces.map(space => (
                <SpaceCard key={space.id} space={space} />
              ))}
            </SpacesGrid>
          ) : (
            <EmptyState>
              <h3>No spaces found</h3>
              <p>
                {search || selectedTools.length > 0
                  ? 'Try adjusting your search or filters.'
                  : 'No makerspaces have been added yet.'}
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

export default SpacesPage;
