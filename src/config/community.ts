/**
 * Community Configuration
 * 
 * This file provides the configuration for the community template.
 * In a multi-tenant setup, this config is loaded from the tenant configuration.
 * 
 * For standalone use, edit the defaultConfig below.
 * For multi-tenant use, the config is loaded via TenantProvider.
 */

// Default tenant ID - used when no tenant is specified
export const DEFAULT_TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || 'default';

/**
 * Default community configuration
 * This is used when no tenant-specific config is provided
 */
export const defaultCommunityConfig = {
  // Basic Info
  name: process.env.NEXT_PUBLIC_COMMUNITY_NAME || "Detroit Maker Hub",
  tagline: process.env.NEXT_PUBLIC_COMMUNITY_TAGLINE || "Build. Share. Make.",
  description: "A shared digital hub connecting makers, builders, and makerspaces across Detroit. Discover spaces, find events, and collaborate.",
  
  // Branding
  branding: {
    logo: null as string | null,
    favicon: "/favicon.ico",
  },
  
  // Home page copy
  home: {
    missionStatement: "Connecting Detroit's makers, builders, and makerspaces into one shared ecosystem. Discover tools, attend workshops, find collaborators, and grow your craft.",
    whoIsThisFor: "Artists, fabricators, engineers, tinkerers, students, space organizers, and anyone who builds things.",
    whoIsThisNotFor: null as string | null,
    howToParticipate: [
      "Explore spaces and tools",
      "Attend events",
      "Post or join opportunities",
      "Join chat",
      "Introduce yourself",
    ],
    howToContributeLead: [
      "Organize workshops and events",
      "Claim and manage a makerspace profile",
      "Share gigs, grants, and tool access",
      "Mentor new makers",
    ],
    memberValue: "Members get access to a network of makerspaces, upcoming events, collaboration opportunities, and direct connection with Detroit's maker community.",
    faqUrl: null as string | null,
    guidelinesUrl: null as string | null,
  },

  // Feature Toggles
  features: {
    members: true,
    chat: true,
    events: true,
    socialFeed: true,
    spaces: true,
    opportunities: true,
    showLikes: false,
    showComments: true,
    memberDirectoryPublic: true,
    eventsPublic: true,
    attendeeVisibility: 'public' as 'public' | 'members' | 'attendees_only',
    externalEventsApi: null as string | null,
    autoEventRecap: false,
    chatChannels: 'topic_based' as 'single' | 'event_based' | 'topic_based',
    allowPublicViewing: true,
    requireMembershipToPost: false,
    requireMembershipToChat: false,
    requireMembershipToRsvp: false,
  },
  
  // Theme customization
  theme: {
    primary: "#E85D2A",
    primaryHover: "#D14E1F",
    accent: "#E85D2A",
    background: "#0D0D0F",
    surface: "#18191D",
    text: "#F0F0F0",
    textMuted: "#8A8A8F",
  },
  
  // Social links
  social: {
    twitter: null as string | null,
    discord: null as string | null,
    telegram: null as string | null,
    instagram: null as string | null,
    website: null as string | null,
  },
  
  // Contact info
  contact: {
    email: null as string | null,
    supportUrl: null as string | null,
  },
  
  // API configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '',
    externalEventsApi: null as string | null,
  },
  
  // Limits
  limits: {
    maxPostLength: 2000,
    maxCommentLength: 500,
    maxChatMessageLength: 500,
    maxBioLength: 300,
  },
};

// Current active config (can be overridden by tenant config)
let activeConfig = { ...defaultCommunityConfig };

/**
 * Set the active community configuration
 * Called by TenantProvider when loading tenant-specific config
 */
export function setActiveConfig(config: Partial<CommunityConfig>): void {
  activeConfig = {
    ...defaultCommunityConfig,
    ...config,
    branding: { ...defaultCommunityConfig.branding, ...config.branding },
    home: { ...defaultCommunityConfig.home, ...config.home },
    features: { ...defaultCommunityConfig.features, ...config.features },
    theme: { ...defaultCommunityConfig.theme, ...config.theme },
    social: { ...defaultCommunityConfig.social, ...config.social },
    contact: { ...defaultCommunityConfig.contact, ...config.contact },
    api: { ...defaultCommunityConfig.api, ...config.api },
    limits: { ...defaultCommunityConfig.limits, ...config.limits },
  };
}

/**
 * Get the current community configuration
 */
export function getCommunityConfig(): CommunityConfig {
  return activeConfig;
}

/**
 * Reset to default config
 */
export function resetConfig(): void {
  activeConfig = { ...defaultCommunityConfig };
}

// Export as communityConfig for backward compatibility
export const communityConfig = activeConfig;

// Type for the config
export type CommunityConfig = typeof defaultCommunityConfig;

// Helper to check if a feature is enabled
export function isFeatureEnabled(feature: keyof typeof defaultCommunityConfig.features): boolean {
  return getCommunityConfig().features[feature] === true;
}

// Helper to get config value with fallback
export function getConfigValue<K extends keyof CommunityConfig>(
  key: K,
  fallback?: CommunityConfig[K]
): CommunityConfig[K] {
  const config = getCommunityConfig();
  return config[key] ?? fallback ?? defaultCommunityConfig[key];
}

// Helper to get theme value
export function getThemeValue(key: keyof CommunityConfig['theme']): string {
  return getCommunityConfig().theme[key] || defaultCommunityConfig.theme[key];
}

// Helper to get branding value
export function getBrandingValue<K extends keyof CommunityConfig['branding']>(
  key: K
): CommunityConfig['branding'][K] {
  return getCommunityConfig().branding[key];
}
