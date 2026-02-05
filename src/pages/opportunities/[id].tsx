import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled, { keyframes } from 'styled-components';
import { useUser } from '@/contexts/UserContext';
import { TabBar, TabBarSpacer } from '@/components/navigation';
import { communityConfig } from '@/config/community';
import { Loading } from '@/components/Loading';

const TYPE_LABELS: Record<string, string> = {
  collaborator: 'Collaborator Needed',
  paid_gig: 'Paid Gig',
  grant: 'Grant / RFP',
  tool_access: 'Tool Access',
  materials_swap: 'Materials Swap',
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

interface OpportunityDetail {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  contactInfo: string | null;
  expiresAt: Date | null;
  createdAt: Date;
  space: { id: string; name: string; slug: string } | null;
  postedBy: {
    id: string;
    displayName: string | null;
    username: string | null;
    pfpUrl: string | null;
  };
}

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  user: {
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
  max-width: 700px;
  margin: 0 auto;
  width: 100%;
  padding: 1.5rem 1rem 1rem;
  animation: ${fadeIn} 0.4s ease-out;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.textMuted};
  text-decoration: none;
  margin-bottom: 1.5rem;

  &:hover {
    color: ${({ theme }) => theme.accent};
  }
`;

const Header = styled.div`
  margin-bottom: 1.5rem;
`;

const TypeBadge = styled.span<{ $type: string }>`
  display: inline-block;
  padding: 0.3rem 0.6rem;
  background: ${({ $type }) => TYPE_COLORS[$type] || '#6B7280'}20;
  color: ${({ $type }) => TYPE_COLORS[$type] || '#6B7280'};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-radius: 4px;
  margin-bottom: 0.75rem;
`;

const Title = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin: 0.5rem 0 0.75rem;

  @media (min-width: 600px) {
    font-size: 1.75rem;
  }
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.textMuted};
  flex-wrap: wrap;
`;

const MetaItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const SpaceLink = styled(Link)`
  color: ${({ theme }) => theme.accent};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const DescriptionBlock = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.textSecondary};
  line-height: 1.7;
  margin-bottom: 2rem;
  white-space: pre-wrap;
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

const ContactBlock = styled.div`
  padding: 1rem;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.text};
  line-height: 1.5;
`;

const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CommentCard = styled.div`
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.35rem;
`;

const CommentAvatar = styled.div<{ $hasImage: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${props => props.$hasImage ? 'transparent' : props.theme.surfaceHover};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CommentAuthor = styled.span`
  font-weight: 600;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.text};
`;

const CommentTime = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.textMuted};
`;

const CommentContent = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textSecondary};
  margin: 0;
  line-height: 1.5;
`;

const CommentForm = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const CommentInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
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

const CommentSubmit = styled.button`
  padding: 0.75rem 1.25rem;
  background: ${({ theme }) => theme.accent};
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.accentHover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyComments = styled.div`
  padding: 1rem;
  text-align: center;
  color: ${({ theme }) => theme.textMuted};
  font-size: 0.9rem;
`;

function formatDate(date: Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function getInitials(name: string | null): string {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

const OpportunityDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useUser();
  const [opportunity, setOpportunity] = useState<OpportunityDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id || typeof id !== 'string') return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/opportunities/${id}`);
        if (response.ok) {
          const data = await response.json();
          setOpportunity(data.opportunity);
          setComments(data.comments || []);
        } else if (response.status === 404) {
          router.push('/opportunities');
        }
      } catch (error) {
        console.error('Error fetching opportunity:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !id || submitting) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/opportunities/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentText.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments(prev => [...prev, data.comment]);
        setCommentText('');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading text="Loading opportunity..." />;
  }

  if (!opportunity) {
    return null;
  }

  const posterName = opportunity.postedBy.displayName || opportunity.postedBy.username || 'Anonymous';

  return (
    <Container>
      <Head>
        <title>{opportunity.title} | {communityConfig.name}</title>
        <meta name="description" content={opportunity.description.slice(0, 160)} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Main>
        <ContentArea>
          <BackLink href="/opportunities">Back to Opportunities</BackLink>

          <Header>
            <TypeBadge $type={opportunity.type}>
              {TYPE_LABELS[opportunity.type] || opportunity.type}
            </TypeBadge>
            <Title>{opportunity.title}</Title>
            <MetaRow>
              <MetaItem>Posted by {posterName}</MetaItem>
              <MetaItem>{formatDate(opportunity.createdAt)}</MetaItem>
              {opportunity.space && (
                <MetaItem>
                  at <SpaceLink href={`/spaces/${opportunity.space.slug}`}>{opportunity.space.name}</SpaceLink>
                </MetaItem>
              )}
            </MetaRow>
          </Header>

          <DescriptionBlock>{opportunity.description}</DescriptionBlock>

          {opportunity.contactInfo && (
            <Section>
              <SectionTitle>Contact</SectionTitle>
              <ContactBlock>{opportunity.contactInfo}</ContactBlock>
            </Section>
          )}

          {opportunity.expiresAt && (
            <Section>
              <SectionTitle>Deadline</SectionTitle>
              <ContactBlock>{formatDate(opportunity.expiresAt)}</ContactBlock>
            </Section>
          )}

          <Section>
            <SectionTitle>Discussion ({comments.length})</SectionTitle>
            {comments.length > 0 ? (
              <CommentsList>
                {comments.map(comment => {
                  const authorName = comment.user.displayName || comment.user.username || 'Anonymous';
                  return (
                    <CommentCard key={comment.id}>
                      <CommentHeader>
                        <CommentAvatar $hasImage={!!comment.user.pfpUrl}>
                          {comment.user.pfpUrl ? (
                            <img src={comment.user.pfpUrl} alt={authorName} />
                          ) : (
                            <span style={{ fontSize: '0.6rem', color: '#999' }}>{getInitials(authorName)}</span>
                          )}
                        </CommentAvatar>
                        <CommentAuthor>{authorName}</CommentAuthor>
                        <CommentTime>{formatDate(comment.createdAt)}</CommentTime>
                      </CommentHeader>
                      <CommentContent>{comment.content}</CommentContent>
                    </CommentCard>
                  );
                })}
              </CommentsList>
            ) : (
              <EmptyComments>No comments yet. Be the first to respond.</EmptyComments>
            )}

            {user && (
              <CommentForm onSubmit={handleSubmitComment}>
                <CommentInput
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <CommentSubmit type="submit" disabled={!commentText.trim() || submitting}>
                  {submitting ? '...' : 'Send'}
                </CommentSubmit>
              </CommentForm>
            )}
          </Section>
        </ContentArea>

        <TabBarSpacer />
        <TabBar />
      </Main>
    </Container>
  );
};

export default OpportunityDetailPage;
