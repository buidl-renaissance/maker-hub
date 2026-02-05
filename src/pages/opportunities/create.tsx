import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styled, { keyframes } from 'styled-components';
import { useUser } from '@/contexts/UserContext';
import { TabBar, TabBarSpacer } from '@/components/navigation';
import { communityConfig } from '@/config/community';
import { Loading } from '@/components/Loading';

const OPPORTUNITY_TYPES = [
  { value: 'collaborator', label: 'Collaborator Needed' },
  { value: 'paid_gig', label: 'Paid Gig' },
  { value: 'grant', label: 'Grant / RFP' },
  { value: 'tool_access', label: 'Tool Time / Access' },
  { value: 'materials_swap', label: 'Materials Swap' },
  { value: 'open_studio', label: 'Open Studio' },
];

interface SpaceOption {
  id: string;
  name: string;
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
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
  padding: 1.5rem 1rem 1rem;
  animation: ${fadeIn} 0.4s ease-out;
`;

const PageTitle = styled.h1`
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin: 0 0 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const Input = styled.input`
  padding: 0.875rem 1rem;
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

const Textarea = styled.textarea`
  padding: 0.875rem 1rem;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  outline: none;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;

  &::placeholder {
    color: ${({ theme }) => theme.textMuted};
  }

  &:focus {
    border-color: ${({ theme }) => theme.accent};
  }
`;

const Select = styled.select`
  padding: 0.875rem 1rem;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 10px;
  color: ${({ theme }) => theme.text};
  font-size: 16px;
  outline: none;
  appearance: auto;

  &:focus {
    border-color: ${({ theme }) => theme.accent};
  }
`;

const SubmitButton = styled.button`
  padding: 1rem;
  background: ${({ theme }) => theme.accent};
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
  margin-top: 0.5rem;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.accentHover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  padding: 0.75rem 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #EF4444;
  font-size: 0.85rem;
`;

const CreateOpportunityPage: React.FC = () => {
  const router = useRouter();
  const { user, isLoading: isUserLoading } = useUser();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [spaceId, setSpaceId] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [spaces, setSpaces] = useState<SpaceOption[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/app');
    }
  }, [isUserLoading, user, router]);

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const response = await fetch('/api/spaces');
        if (response.ok) {
          const data = await response.json();
          setSpaces(data.spaces.map((s: { id: string; name: string }) => ({ id: s.id, name: s.name })));
        }
      } catch {
        // Ignore
      }
    };
    fetchSpaces();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !type) return;

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          type,
          spaceId: spaceId || null,
          contactInfo: contactInfo.trim() || null,
        }),
      });

      if (response.ok) {
        router.push('/opportunities');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create opportunity');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isUserLoading) {
    return <Loading text="Loading..." />;
  }

  if (!user) {
    return null;
  }

  return (
    <Container>
      <Head>
        <title>Post Opportunity | {communityConfig.name}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Main>
        <ContentArea>
          <PageTitle>Post an Opportunity</PageTitle>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Form onSubmit={handleSubmit}>
            <FieldGroup>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="e.g. CNC Operator Needed for Furniture Project"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="type">Type</Label>
              <Select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value="">Select type...</option>
                {OPPORTUNITY_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </Select>
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the opportunity, what you need, and any relevant details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="space">Associated Space (optional)</Label>
              <Select
                id="space"
                value={spaceId}
                onChange={(e) => setSpaceId(e.target.value)}
              >
                <option value="">None</option>
                {spaces.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </Select>
            </FieldGroup>

            <FieldGroup>
              <Label htmlFor="contact">Contact Info (optional)</Label>
              <Input
                id="contact"
                type="text"
                placeholder="Email, phone, or how to reach you"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
              />
            </FieldGroup>

            <SubmitButton type="submit" disabled={submitting || !title.trim() || !description.trim() || !type}>
              {submitting ? 'Posting...' : 'Post Opportunity'}
            </SubmitButton>
          </Form>
        </ContentArea>

        <TabBarSpacer />
        <TabBar />
      </Main>
    </Container>
  );
};

export default CreateOpportunityPage;
