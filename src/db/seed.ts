import { v4 as uuidv4 } from 'uuid';
import { db } from './drizzle';
import { users, members, messages, events, eventRsvps, posts, postLikes, postComments, spaces, opportunities, type OpportunityType } from './schema';

// Mock profile pictures (placeholder URLs)
const AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Casey',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Riley',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Avery',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Quinn',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sage',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=River',
];

// Mock users data
const MOCK_USERS = [
  { username: 'alexchen', displayName: 'Alex Chen', bio: 'Full-stack developer passionate about building communities' },
  { username: 'jordanlee', displayName: 'Jordan Lee', bio: 'UX designer | Coffee enthusiast | Dog person' },
  { username: 'taylorsmith', displayName: 'Taylor Smith', bio: 'Product manager by day, musician by night' },
  { username: 'caseykim', displayName: 'Casey Kim', bio: 'Startup founder | Always learning something new' },
  { username: 'morganwilson', displayName: 'Morgan Wilson', bio: 'Data scientist exploring the intersection of AI and creativity' },
  { username: 'rileybrown', displayName: 'Riley Brown', bio: 'Community builder | Event organizer | Connector of people' },
  { username: 'averygarcia', displayName: 'Avery Garcia', bio: 'Marketing strategist with a love for storytelling' },
  { username: 'quinnmartinez', displayName: 'Quinn Martinez', bio: 'Software engineer | Open source contributor' },
  { username: 'sageanderson', displayName: 'Sage Anderson', bio: 'Content creator | Podcaster | Lifelong learner' },
  { username: 'riverjohnson', displayName: 'River Johnson', bio: 'Designer and illustrator based in NYC' },
];

// Mock chat messages
const MOCK_MESSAGES = [
  "Hey everyone! Excited to be part of this community 👋",
  "Just discovered this place, looks amazing!",
  "Anyone going to the meetup next week?",
  "Great discussion today, learned a lot!",
  "Thanks for the warm welcome!",
  "Love the energy here. Let's build something great together!",
  "Quick question: has anyone tried the new feature?",
  "Happy Monday, team! Let's make it a productive week 💪",
  "Just wrapped up a project. Time to celebrate! 🎉",
  "Who's up for a virtual coffee chat?",
  "Sharing my latest work in the feed - would love feedback!",
  "This community keeps getting better and better",
  "Don't forget to RSVP for Thursday's event!",
  "Anyone else working on something cool this weekend?",
  "Just joined and already feeling inspired by everyone here",
];

// Mock events data
const MOCK_EVENTS = [
  {
    title: 'Community Kickoff Meetup',
    description: 'Join us for our monthly community gathering! We\'ll discuss upcoming initiatives, share wins, and connect with fellow members. Light refreshments will be provided.',
    location: 'The Hub Coworking Space, 123 Main St',
    startTime: '18:00',
    endTime: '20:00',
    daysFromNow: 7,
  },
  {
    title: 'Workshop: Building Your Personal Brand',
    description: 'Learn the fundamentals of personal branding in the digital age. We\'ll cover social media strategy, content creation, and authentic storytelling.',
    location: 'Online - Zoom',
    startTime: '14:00',
    endTime: '16:00',
    daysFromNow: 14,
  },
  {
    title: 'Networking Happy Hour',
    description: 'Casual drinks and conversation with community members. A great opportunity to meet new people and expand your network in a relaxed setting.',
    location: 'Rooftop Bar, 456 Oak Ave',
    startTime: '17:30',
    endTime: '20:00',
    daysFromNow: 21,
  },
  {
    title: 'Tech Talk: AI in 2026',
    description: 'Exploring the latest developments in artificial intelligence and what they mean for our industry. Featuring Q&A with leading practitioners.',
    location: 'Innovation Center Auditorium',
    startTime: '19:00',
    endTime: '21:00',
    daysFromNow: 28,
  },
  {
    title: 'Creative Workshop: Design Thinking',
    description: 'Hands-on workshop introducing design thinking methodology. Learn to solve problems creatively and build user-centered solutions.',
    location: 'Maker Space, 789 Creative Blvd',
    startTime: '10:00',
    endTime: '13:00',
    daysFromNow: 35,
  },
  {
    title: 'Community Potluck & Game Night',
    description: 'Bring your favorite dish and join us for an evening of food, board games, and good company. Family friendly!',
    location: 'Community Center, 321 Park Lane',
    startTime: '16:00',
    endTime: '21:00',
    daysFromNow: 42,
  },
];

// Mock posts data – event_announcement, intro, rsvp, question, resource, organizer_update, post
// eventTitle is used to resolve eventId when creating posts (must match MOCK_EVENTS title)
const MOCK_POSTS: Array<{
  content: string;
  daysAgo: number;
  imageUrl: string | null;
  type: 'post' | 'event_announcement' | 'intro' | 'rsvp' | 'question' | 'resource' | 'organizer_update';
  eventTitle?: string;
}> = [
  { content: "📅 New event: Community Kickoff Meetup is next week – Thurs 6–8pm at The Hub. RSVP on the Events tab!", daysAgo: 0, imageUrl: null, type: 'event_announcement', eventTitle: 'Community Kickoff Meetup' },
  { content: "Hi everyone! I'm new here – excited to learn from you all and contribute where I can. Say hey if you want to connect! 👋", daysAgo: 0, imageUrl: null, type: 'intro' },
  { content: "Jordan Lee is going to Community Kickoff Meetup.", daysAgo: 0, imageUrl: null, type: 'rsvp', eventTitle: 'Community Kickoff Meetup' },
  { content: "Just finished reading an incredible book on community building. Key takeaway: authenticity always wins. What's everyone reading these days? 📚", daysAgo: 1, imageUrl: null, type: 'post' },
  { content: "Question for the group: What's your favorite productivity tool? I'm always looking for ways to optimize my workflow. Drop your recommendations below! ⚡", daysAgo: 1, imageUrl: null, type: 'question' },
  { content: "Resource drop: This Notion template for community health metrics has been a game-changer. Happy to share the link if anyone wants it.", daysAgo: 2, imageUrl: null, type: 'resource' },
  { content: "Taylor Smith is going to Workshop: Building Your Personal Brand.", daysAgo: 2, imageUrl: null, type: 'rsvp', eventTitle: 'Workshop: Building Your Personal Brand' },
  { content: "Pro tip: Take breaks! Just came back from a walk and my productivity doubled. Sometimes stepping away is the best thing you can do for your work. 🌳", daysAgo: 2, imageUrl: null, type: 'post' },
  { content: "📅 Reminder: Workshop: Building Your Personal Brand – this Saturday 2–4pm on Zoom. Link in the event details.", daysAgo: 3, imageUrl: null, type: 'event_announcement', eventTitle: 'Workshop: Building Your Personal Brand' },
  { content: "New here and already feeling inspired. This is exactly the kind of community I was looking for. 🙌", daysAgo: 3, imageUrl: null, type: 'intro' },
  { content: "Quick update from the team: We're trying a new format for the next Networking Happy Hour – more mingling, fewer talks. Feedback welcome after!", daysAgo: 4, imageUrl: null, type: 'organizer_update' },
  { content: "Casey Kim is going to Networking Happy Hour.", daysAgo: 4, imageUrl: null, type: 'rsvp', eventTitle: 'Networking Happy Hour' },
  { content: "Shared a few slides from my talk last week on building in public. Hope it helps someone!", daysAgo: 4, imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800', type: 'resource' },
  { content: "Has anyone here run a design sprint? Looking for tips before we try one at work.", daysAgo: 5, imageUrl: null, type: 'question' },
  { content: "Morgan Wilson is going to Tech Talk: AI in 2026.", daysAgo: 5, imageUrl: null, type: 'rsvp', eventTitle: 'Tech Talk: AI in 2026' },
  { content: "Had an amazing conversation at yesterday's meetup. The insights shared were invaluable. This is why communities matter – we're stronger together! 💪", daysAgo: 5, imageUrl: null, type: 'post' },
  { content: "📅 Tech Talk: AI in 2026 is now open for RSVPs. Join us at the Innovation Center Auditorium – would love to see you there.", daysAgo: 6, imageUrl: null, type: 'event_announcement', eventTitle: 'Tech Talk: AI in 2026' },
  { content: "Big thanks to everyone who showed up to the Design Thinking workshop. Your energy made it. Same time next month?", daysAgo: 6, imageUrl: null, type: 'organizer_update' },
  { content: "Team photo from the last happy hour – already looking forward to the next one.", daysAgo: 6, imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800', type: 'post' },
  { content: "Riley Brown is going to Creative Workshop: Design Thinking.", daysAgo: 7, imageUrl: null, type: 'rsvp', eventTitle: 'Creative Workshop: Design Thinking' },
  { content: "Grateful for this community. In the past month alone I've made genuine connections, learned new skills, and found collaborators for my project. Thank you all! 🙏", daysAgo: 7, imageUrl: null, type: 'post' },
  { content: "Reminder: It's okay to not have everything figured out. We're all works in progress, and that's perfectly fine. Keep learning, keep growing! 🌱", daysAgo: 8, imageUrl: null, type: 'post' },
  { content: "Avery Garcia is going to Community Potluck & Game Night.", daysAgo: 8, imageUrl: null, type: 'rsvp', eventTitle: 'Community Potluck & Game Night' },
  { content: "Weekend project: Finally launched the side project I've been teasing. Link in comments for anyone curious. Feedback welcome!", daysAgo: 9, imageUrl: null, type: 'post' },
  { content: "Just shipped a new feature at work! Couldn't have done it without the support and advice from members here. You know who you are – thank you! 🎉", daysAgo: 10, imageUrl: null, type: 'post' },
];

// Mock comments – varied tone (agreement, question, thanks, follow-up)
const MOCK_COMMENTS = [
  "Love this! Totally agree 💯",
  "Great perspective, thanks for sharing!",
  "This resonates so much with me",
  "Couldn't have said it better myself",
  "Thanks for the inspiration!",
  "Yes! This is exactly what I needed to hear today",
  "Interesting take – I'd love to discuss more",
  "You nailed it! 🎯",
  "Adding this to my notes",
  "Big facts. Thanks for posting this",
  "Same here – would love to hear more",
  "I use Notion for this and it's been great",
  "Count me in for the next one!",
  "Would love the link if you're sharing",
  "So glad you're here! Welcome 👋",
  "This is why I love this community",
  "Seconded – that workshop was excellent",
  "Couldn't agree more on the quality > quantity point",
  "Let's connect! I'm always up for a coffee chat",
  "Thanks for putting this together!",
];

// Featured Spaces - Detroit Makerspaces
const MOCK_SPACES = [
  {
    name: 'TechShop Detroit',
    slug: 'techshop-detroit',
    description: `A community workshop and prototyping studio with industrial tools and equipment. Open to makers of all skill levels with classes, workshops, and open shop hours.

Our 15,000 sq ft facility includes full wood shop, metal shop, laser cutters, 3D printers, and electronics lab. Membership includes 24/7 access and tool training.`,
    shortDescription: 'Community workshop with industrial tools and prototyping equipment.',
    neighborhood: 'Midtown',
    address: '4100 Woodward Ave, Detroit, MI 48201',
    websiteUrl: 'https://techshop-detroit.example.com',
    contactEmail: 'info@techshop-detroit.example.com',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
    tools: ['metal', 'wood', 'laser', '3d_print', 'electronics', 'cnc'],
    isBeginnerFriendly: true,
    requiresMembership: true,
    isVerified: true,
    isFeatured: true,
  },
  {
    name: 'OmniCorp Labs',
    slug: 'omnicorp-labs',
    description: `A member-driven hackerspace and community lab focused on electronics, programming, and digital fabrication. Regular meetups, workshops, and open hack nights every Tuesday and Thursday.

Features electronics workbench, 3D printing farm, 80W laser cutter, and cozy lounge. No membership required for open nights!`,
    shortDescription: 'Hackerspace focused on electronics and digital fabrication.',
    neighborhood: 'Ferndale',
    address: '123 W Nine Mile Rd, Ferndale, MI 48220',
    websiteUrl: 'https://omnicorp-labs.example.com',
    contactEmail: 'hello@omnicorp-labs.example.com',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    tools: ['electronics', '3d_print', 'laser'],
    isBeginnerFriendly: true,
    requiresMembership: false,
    isVerified: true,
    isFeatured: true,
  },
  {
    name: 'Incite Focus Factory',
    slug: 'incite-focus-factory',
    description: `A creative community space in Eastern Market offering ceramics, textiles, woodworking, and printmaking. Focused on connecting artists and makers through shared studio time.

12 pottery wheels, 2 kilns, screen printing, letterpress, and industrial sewing machines. Open studio hours Tue-Sun.`,
    shortDescription: 'Creative studio for ceramics, textiles, and printmaking.',
    neighborhood: 'Eastern Market',
    address: '2940 Rivard St, Detroit, MI 48207',
    websiteUrl: 'https://incitefocus.example.com',
    contactEmail: 'studio@incitefocus.example.com',
    imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800',
    tools: ['ceramics', 'textiles', 'sewing', 'wood'],
    isBeginnerFriendly: true,
    requiresMembership: false,
    isVerified: true,
    isFeatured: true,
  },
  {
    name: 'Ponyride',
    slug: 'ponyride',
    description: `Affordable workspace for makers, entrepreneurs, and small businesses in historic Corktown. Renovated warehouse with shared and private studios plus well-equipped wood and metal shops.

8,000 sq ft wood shop, metal fabrication, 4x8 CNC router, spray booth, and loading dock access.`,
    shortDescription: 'Affordable maker workspace in Corktown.',
    neighborhood: 'Corktown',
    address: '1401 Vermont St, Detroit, MI 48216',
    websiteUrl: 'https://ponyride.org',
    contactEmail: 'studios@ponyride.org',
    imageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800',
    tools: ['wood', 'metal', 'cnc'],
    isBeginnerFriendly: false,
    requiresMembership: true,
    isVerified: true,
    isFeatured: true,
  },
  {
    name: 'Detroit Community Technology Project',
    slug: 'dctp',
    description: `Teaching community members to build and maintain their own technology infrastructure. Programs focus on digital literacy, mesh networking, and community tech solutions.

Digital Stewards training, community WiFi installations, computer repair workshops. All programs free for Detroit residents.`,
    shortDescription: 'Community technology education and digital infrastructure.',
    neighborhood: 'North End',
    address: '3914 Woodward Ave, Detroit, MI 48201',
    websiteUrl: 'https://detroitcommunitytech.org',
    contactEmail: 'info@detroitcommunitytech.org',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
    tools: ['electronics', 'other'],
    isBeginnerFriendly: true,
    requiresMembership: false,
    isVerified: true,
    isFeatured: false,
  },
  {
    name: 'Maker Works Detroit',
    slug: 'maker-works-detroit',
    description: `A full-service makerspace with everything from woodworking to metalworking, digital fabrication to textiles. Mission: provide access to tools and knowledge for all skill levels.

ShopBot CNC, Tormach metal mill, Epilog laser, industrial 3D printer, automotive lift bay, sewing and embroidery.`,
    shortDescription: 'Full-service makerspace for all skill levels.',
    neighborhood: 'Southwest Detroit',
    address: '5905 Michigan Ave, Detroit, MI 48210',
    websiteUrl: 'https://makerworks-detroit.example.com',
    contactEmail: 'make@makerworks-detroit.example.com',
    imageUrl: 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=800',
    tools: ['wood', 'metal', 'laser', '3d_print', 'cnc', 'textiles', 'sewing'],
    isBeginnerFriendly: true,
    requiresMembership: true,
    isVerified: true,
    isFeatured: true,
  },
];

// Mock Opportunities
const MOCK_OPPORTUNITIES: Array<{
  title: string;
  description: string;
  type: OpportunityType;
  contactInfo?: string;
  spaceSlug?: string; // Will be resolved to spaceId
  expiresInDays?: number;
}> = [
  {
    title: 'CNC Operator Needed for Furniture Project',
    description: `Looking for an experienced CNC operator to help with a custom furniture commission. 3-axis router experience preferred (ShopBot or similar).

Project: 12 piece dining set with compound curves in walnut and maple.
Timeline: 2-3 weeks | Pay: $35-45/hr depending on experience.
Must be comfortable with Fusion 360 or VCarve.`,
    type: 'paid_gig',
    spaceSlug: 'ponyride',
    contactInfo: 'Email: cnc.projects@example.com',
    expiresInDays: 30,
  },
  {
    title: 'Collaborator for Interactive Art Installation',
    description: `Building an interactive LED installation for a gallery show in Eastern Market. Need someone with Arduino/electronics experience.

500+ individually addressable LEDs, motion sensors, custom PCB design. This is a portfolio/credit project - materials covered, co-creator credit.`,
    type: 'collaborator',
    spaceSlug: 'incite-focus-factory',
    expiresInDays: 45,
  },
  {
    title: 'Free Scrap Metal Available',
    description: `Clearing out the shop! Large quantity of steel and aluminum scrap available.

~200 lbs mild steel (various gauges), ~50 lbs aluminum bar and sheet, some stainless and copper. First come, first served - must take at least 50 lbs.`,
    type: 'materials_swap',
    spaceSlug: 'ponyride',
    expiresInDays: 7,
  },
  {
    title: 'Knight Foundation Arts Grant - Applications Open',
    description: `Knight Foundation accepting applications for community arts projects in Detroit. Great for makers working at art/technology intersection.

Grants: $5,000 to $25,000 | Must benefit Detroit community | Preference for innovative approaches.
Deadline: March 15, 2026.`,
    type: 'grant',
    contactInfo: 'https://knightfoundation.org/grants',
    expiresInDays: 60,
  },
  {
    title: 'Laser Cutter Time Available - Weekends',
    description: `80W CO2 laser available for outside projects on weekends. Great for prototyping or small batch production.

$25/hr (you supply materials) | $35/hr (materials included) | Free if you help with a shop project!
Bed size: 24x36". Cuts up to 1/2" acrylic, 1/4" plywood.`,
    type: 'tool_access',
    spaceSlug: 'omnicorp-labs',
    contactInfo: 'DM on Slack or email laser@omnicorp-labs.example.com',
  },
  {
    title: 'Open Studio Saturday - Ceramics',
    description: `Join us for open studio ceramics every Saturday 10am-4pm!

Wheel and hand-building stations, glazing area, kiln firings (cone 6 and 10). Bring your own clay or purchase from us ($15/25lb bag). Day pass: $20 for non-members.`,
    type: 'open_studio',
    spaceSlug: 'incite-focus-factory',
  },
  {
    title: 'Welding Instructor Wanted - Part Time',
    description: `TechShop Detroit looking for part-time welding instructor to teach MIG and TIG basics.

Requirements: 3+ years experience, ability to teach beginners, evenings/weekends. AWS certification preferred.
Pay: $30-40/hr | Classes are 3 hours, 2-3 per week.`,
    type: 'paid_gig',
    spaceSlug: 'techshop-detroit',
    contactInfo: 'Apply at jobs@techshop-detroit.example.com',
    expiresInDays: 21,
  },
  {
    title: 'Free 3D Printer Filament - Moving Sale',
    description: `Moving out of state! Free to good homes:

• 8 rolls PLA (various colors, some partial)
• 3 rolls PETG (black, white, clear)
• 2 rolls TPU flexible
• Misc supports, adhesives, nozzles

All 1.75mm. Pick up in Ferndale by end of month.`,
    type: 'materials_swap',
    spaceSlug: 'omnicorp-labs',
    expiresInDays: 14,
  },
  {
    title: 'Metal Fabricator for Public Art Project',
    description: `Commission: 12-foot kinetic sculpture for downtown plaza. Need experienced metal fabricator.

Structural steel frame, kinetic elements with bearings, weather-resistant finish.
Budget: $8,000 for labor (materials separate) | Timeline: 8 weeks.`,
    type: 'paid_gig',
    contactInfo: 'Portfolio required: sculpture@example.com',
    expiresInDays: 30,
  },
  {
    title: 'Wood Shop Orientation - Free for New Makers',
    description: `Maker Works offering free wood shop orientations every Wednesday at 6pm.

Covers: Shop safety, table saw/bandsaw/jointer basics, dust collection, project storage. Required before using shop independently.`,
    type: 'open_studio',
    spaceSlug: 'maker-works-detroit',
  },
];

// Helper function to get a date relative to today
function getRelativeDate(daysFromNow: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(0, 0, 0, 0);
  return date;
}

// Helper function to get a past date
function getPastDate(daysAgo: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(12, 0, 0, 0);
  return date;
}

// Helper to pick random items from an array
function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

async function seed() {
  console.log('🌱 Starting seed...\n');

  try {
    // Create users
    console.log('👤 Creating users...');
    const createdUsers: { id: string; username: string; displayName: string }[] = [];
    
    for (let i = 0; i < MOCK_USERS.length; i++) {
      const user = MOCK_USERS[i];
      const userId = uuidv4();
      
      await db.insert(users).values({
        id: userId,
        username: user.username,
        displayName: user.displayName,
        pfpUrl: AVATARS[i],
        phone: `+1555000${(1000 + i).toString().slice(1)}`,
        role: i === 0 ? 'admin' : i < 3 ? 'organizer' : 'user',
        status: 'active',
        createdAt: getPastDate(30 - i * 2),
        updatedAt: getPastDate(Math.max(0, 10 - i)),
      }).onConflictDoNothing();
      
      createdUsers.push({ id: userId, username: user.username, displayName: user.displayName });
      console.log(`  ✓ Created user: ${user.displayName}`);
    }

    // Create members (mix of public and members_only profile visibility so directory shows when memberDirectoryPublic is true)
    console.log('\n👥 Creating members...');
    for (let i = 0; i < createdUsers.length; i++) {
      const user = createdUsers[i];
      const bio = MOCK_USERS[i].bio;
      const profileVisibility = i < 5 ? 'public' : 'members_only'; // First 5 visible to non-members
      
      await db.insert(members).values({
        id: uuidv4(),
        userId: user.id,
        bio,
        profileVisibility,
        createdAt: getPastDate(28 - i * 2),
      }).onConflictDoNothing();
      
      console.log(`  ✓ ${user.displayName} joined as member`);
    }

    // Create spaces
    console.log('\n🏭 Creating spaces...');
    const createdSpaces: { id: string; slug: string; name: string }[] = [];
    
    for (const spaceData of MOCK_SPACES) {
      const spaceId = uuidv4();
      const organizerId = createdUsers[Math.floor(Math.random() * 3)].id; // First 3 users are admins/organizers
      
      await db.insert(spaces).values({
        id: spaceId,
        name: spaceData.name,
        slug: spaceData.slug,
        description: spaceData.description,
        shortDescription: spaceData.shortDescription,
        neighborhood: spaceData.neighborhood,
        address: spaceData.address,
        websiteUrl: spaceData.websiteUrl,
        contactEmail: spaceData.contactEmail,
        imageUrl: spaceData.imageUrl,
        tools: JSON.stringify(spaceData.tools),
        isBeginnerFriendly: spaceData.isBeginnerFriendly,
        requiresMembership: spaceData.requiresMembership,
        organizerId,
        isVerified: spaceData.isVerified,
        isFeatured: spaceData.isFeatured,
        createdAt: getPastDate(60),
        updatedAt: getPastDate(7),
      }).onConflictDoNothing();
      
      createdSpaces.push({ id: spaceId, slug: spaceData.slug, name: spaceData.name });
      console.log(`  ✓ ${spaceData.name} (${spaceData.neighborhood})${spaceData.isFeatured ? ' ⭐' : ''}`);
    }

    // Create opportunities
    console.log('\n💼 Creating opportunities...');
    let opportunityCount = 0;
    
    for (const oppData of MOCK_OPPORTUNITIES) {
      const spaceId = oppData.spaceSlug 
        ? createdSpaces.find(s => s.slug === oppData.spaceSlug)?.id 
        : undefined;
      const posterId = createdUsers[Math.floor(Math.random() * createdUsers.length)].id;
      
      await db.insert(opportunities).values({
        id: uuidv4(),
        title: oppData.title,
        description: oppData.description,
        type: oppData.type,
        status: 'active',
        spaceId: spaceId || null,
        postedById: posterId,
        contactInfo: oppData.contactInfo || null,
        expiresAt: oppData.expiresInDays ? getRelativeDate(oppData.expiresInDays) : null,
        createdAt: getPastDate(Math.floor(Math.random() * 14)),
        updatedAt: new Date(),
      }).onConflictDoNothing();
      
      opportunityCount++;
      console.log(`  ✓ [${oppData.type}] ${oppData.title}`);
    }

    // Create messages
    console.log('\n💬 Creating messages...');
    for (let i = 0; i < MOCK_MESSAGES.length; i++) {
      const user = createdUsers[i % createdUsers.length];
      
      await db.insert(messages).values({
        id: uuidv4(),
        userId: user.id,
        content: MOCK_MESSAGES[i],
        createdAt: getPastDate(Math.floor(i / 2)),
      });
      
      console.log(`  ✓ Message from ${user.displayName}`);
    }

    // Create events
    console.log('\n📅 Creating events...');
    const createdEvents: { id: string; title: string }[] = [];
    
    for (const eventData of MOCK_EVENTS) {
      const creator = createdUsers[Math.floor(Math.random() * 3)]; // First 3 users are admins/organizers
      const eventId = uuidv4();
      
      await db.insert(events).values({
        id: eventId,
        creatorId: creator.id,
        title: eventData.title,
        description: eventData.description,
        location: eventData.location,
        eventDate: getRelativeDate(eventData.daysFromNow),
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        isExternal: false,
        createdAt: getPastDate(14),
        updatedAt: getPastDate(7),
      });
      
      createdEvents.push({ id: eventId, title: eventData.title });
      console.log(`  ✓ Created event: ${eventData.title}`);
    }

    // Create RSVPs for events
    console.log('\n🎟️ Creating event RSVPs...');
    for (const event of createdEvents) {
      const rsvpUsers = pickRandom(createdUsers, 3 + Math.floor(Math.random() * 5));
      
      for (const user of rsvpUsers) {
        await db.insert(eventRsvps).values({
          id: uuidv4(),
          eventId: event.id,
          userId: user.id,
          status: Math.random() > 0.2 ? 'going' : 'interested',
          createdAt: getPastDate(Math.floor(Math.random() * 7)),
        }).onConflictDoNothing();
      }
      
      console.log(`  ✓ ${rsvpUsers.length} RSVPs for: ${event.title}`);
    }

    // Create posts (event_announcement, intro, rsvp, question, resource, organizer_update, post)
    console.log('\n📝 Creating posts...');
    const createdPosts: { id: string; userId: string; createdAtDaysAgo: number }[] = [];
    
    for (let i = 0; i < MOCK_POSTS.length; i++) {
      const postData = MOCK_POSTS[i];
      const user = createdUsers[i % createdUsers.length];
      const postId = uuidv4();
      const eventId = postData.eventTitle
        ? (createdEvents.find((e) => e.title === postData.eventTitle)?.id ?? null)
        : null;
      
      await db.insert(posts).values({
        id: postId,
        userId: user.id,
        content: postData.content,
        imageUrl: postData.imageUrl ?? null,
        type: postData.type,
        eventId,
        createdAt: getPastDate(postData.daysAgo),
        updatedAt: getPastDate(postData.daysAgo),
      });
      
      createdPosts.push({ id: postId, userId: user.id, createdAtDaysAgo: postData.daysAgo });
      console.log(`  ✓ ${postData.type} post by ${user.displayName}`);
    }

    // Create likes for posts (vary: some posts get more likes)
    console.log('\n❤️ Creating post likes...');
    for (const post of createdPosts) {
      const maxLikes = createdUsers.length - 1;
      const numLikes = Math.min(maxLikes, Math.floor(Math.random() * 8) + 1);
      const likeUsers = pickRandom(
        createdUsers.filter(u => u.id !== post.userId),
        numLikes
      );
      
      for (const user of likeUsers) {
        await db.insert(postLikes).values({
          id: uuidv4(),
          postId: post.id,
          userId: user.id,
          createdAt: getPastDate(Math.min(post.createdAtDaysAgo, Math.floor(Math.random() * 6))),
        }).onConflictDoNothing();
      }
      
      console.log(`  ✓ ${likeUsers.length} likes on a post`);
    }

    // Create comments for posts (comments happen after post; 0–6 per post for variety)
    console.log('\n💬 Creating post comments...');
    for (const post of createdPosts) {
      const commentCount = Math.floor(Math.random() * 7);
      const commentUsers = pickRandom(
        createdUsers.filter(u => u.id !== post.userId),
        commentCount
      );
      
      for (let c = 0; c < commentUsers.length; c++) {
        const user = commentUsers[c];
        const comment = MOCK_COMMENTS[Math.floor(Math.random() * MOCK_COMMENTS.length)];
        // Comment date: after post, up to a few days ago
        const commentDaysAgo = Math.max(0, post.createdAtDaysAgo - Math.floor(Math.random() * 3));
        
        await db.insert(postComments).values({
          id: uuidv4(),
          postId: post.id,
          userId: user.id,
          content: comment,
          createdAt: getPastDate(commentDaysAgo),
        });
      }
      
      if (commentCount > 0) {
        console.log(`  ✓ ${commentCount} comments on a post`);
      }
    }

    console.log('\n✅ Seed completed successfully!\n');
    console.log('Summary:');
    console.log(`  • ${createdUsers.length} users created`);
    console.log(`  • ${createdUsers.length} members created`);
    console.log(`  • ${createdSpaces.length} spaces created (${createdSpaces.filter((_, i) => MOCK_SPACES[i].isFeatured).length} featured)`);
    console.log(`  • ${opportunityCount} opportunities created`);
    console.log(`  • ${MOCK_MESSAGES.length} messages created`);
    console.log(`  • ${createdEvents.length} events created`);
    console.log(`  • ${createdPosts.length} posts created`);
    console.log(`  • Multiple likes and comments added`);
    
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

// Run seed
seed().then(() => {
  console.log('\n🎉 Done! Your Maker Hub is now populated with mock data.\n');
  process.exit(0);
}).catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
