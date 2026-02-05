import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

// Tool label map
const TOOL_LABELS: Record<string, string> = {
  wood: 'Wood',
  metal: 'Metal',
  '3d_print': '3D Print',
  laser: 'Laser',
  electronics: 'Electronics',
  sewing: 'Sewing',
  ceramics: 'Ceramics',
  textiles: 'Textiles',
  cnc: 'CNC',
  other: 'Other',
};

export interface SpaceData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  neighborhood: string | null;
  address: string | null;
  imageUrl: string | null;
  tools: string[];
  isBeginnerFriendly: boolean;
  requiresMembership: boolean;
  isFeatured: boolean;
  isVerified: boolean;
  nextEvent?: { id: string; title: string; eventDate: Date } | null;
}

interface SpaceCardProps {
  space: SpaceData;
}

const Card = styled.div`
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.accent};
    transform: translateY(-2px);
    box-shadow: 0 4px 16px ${({ theme }) => theme.shadow};
  }
`;

const CardImageArea = styled.div`
  height: 140px;
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
`;

const PlaceholderIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  
  svg {
    width: 48px;
    height: 48px;
    color: ${({ theme }) => theme.textMuted};
    opacity: 0.4;
  }
`;

const FeaturedBadge = styled.span`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: ${({ theme }) => theme.accent};
  color: white;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 4px;
`;

const CardBody = styled.div`
  padding: 1rem;
`;

const SpaceName = styled(Link)`
  display: block;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  line-height: 1.3;
  margin-bottom: 0.35rem;

  &:hover {
    color: ${({ theme }) => theme.accent};
  }
`;

const Neighborhood = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textMuted};
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

const ToolChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-bottom: 0.75rem;
`;

const ToolChip = styled.span`
  display: inline-block;
  padding: 0.2rem 0.5rem;
  background: ${({ theme }) => theme.accentMuted};
  color: ${({ theme }) => theme.accent};
  font-size: 0.7rem;
  font-weight: 500;
  border-radius: 4px;
  letter-spacing: 0.02em;
`;

const TagChip = styled.span<{ $variant?: 'beginner' | 'membership' }>`
  display: inline-block;
  padding: 0.2rem 0.5rem;
  background: ${({ theme, $variant }) =>
    $variant === 'beginner' ? 'rgba(34, 197, 94, 0.12)' : theme.surfaceHover};
  color: ${({ theme, $variant }) =>
    $variant === 'beginner' ? '#22C55E' : theme.textMuted};
  font-size: 0.7rem;
  font-weight: 500;
  border-radius: 4px;
`;

const NextEventRow = styled.div`
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid ${({ theme }) => theme.borderSubtle};
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textSecondary};
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const NextEventLabel = styled.span`
  color: ${({ theme }) => theme.textMuted};
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  flex-shrink: 0;
`;

const NextEventTitle = styled.span`
  color: ${({ theme }) => theme.text};
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const ViewButton = styled(Link)`
  flex: 1;
  text-align: center;
  padding: 0.5rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  background: ${({ theme }) => theme.surfaceHover};
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.accent};
    color: white;
  }
`;

const ContactButton = styled.a`
  flex: 1;
  text-align: center;
  padding: 0.5rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: ${({ theme }) => theme.accent};
  border: 1px solid ${({ theme }) => theme.accent};
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.accentMuted};
  }
`;

// Wrench icon for placeholder
const WrenchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

export const SpaceCard: React.FC<SpaceCardProps> = ({ space }) => {
  return (
    <Card>
      <CardImageArea>
        {space.imageUrl ? (
          <img src={space.imageUrl} alt={space.name} />
        ) : (
          <PlaceholderIcon>
            <WrenchIcon />
          </PlaceholderIcon>
        )}
        {space.isFeatured && <FeaturedBadge>Featured</FeaturedBadge>}
      </CardImageArea>

      <CardBody>
        <SpaceName href={`/spaces/${space.slug}`}>{space.name}</SpaceName>
        {space.neighborhood && (
          <Neighborhood>{space.neighborhood}</Neighborhood>
        )}

        <ToolChips>
          {space.tools.slice(0, 5).map((tool) => (
            <ToolChip key={tool}>{TOOL_LABELS[tool] || tool}</ToolChip>
          ))}
          {space.tools.length > 5 && (
            <ToolChip>+{space.tools.length - 5}</ToolChip>
          )}
        </ToolChips>

        <ToolChips>
          {space.isBeginnerFriendly && (
            <TagChip $variant="beginner">Beginner Friendly</TagChip>
          )}
          {space.requiresMembership && (
            <TagChip $variant="membership">Membership Required</TagChip>
          )}
        </ToolChips>

        {space.nextEvent && (
          <NextEventRow>
            <NextEventLabel>Next:</NextEventLabel>
            <NextEventTitle>{space.nextEvent.title}</NextEventTitle>
          </NextEventRow>
        )}
      </CardBody>

      <CardFooter>
        <ViewButton href={`/spaces/${space.slug}`}>View Space</ViewButton>
      </CardFooter>
    </Card>
  );
};

export default SpaceCard;
