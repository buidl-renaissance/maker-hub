/**
 * Seed script for Detroit Maker Hub spaces and opportunities
 * Run with: npx tsx src/db/seed-spaces.ts
 */
import { v4 as uuidv4 } from 'uuid';
import { getDb } from './drizzle';
import { spaces, opportunities } from './schema';

async function seedSpaces() {
  const db = getDb();

  const sampleSpaces = [
    {
      id: uuidv4(),
      name: 'TechShop Detroit',
      slug: 'techshop-detroit',
      description: 'A community workshop and prototyping studio with industrial tools and equipment. Open to makers of all skill levels with classes, workshops, and open shop hours.',
      shortDescription: 'Community workshop with industrial tools and prototyping equipment.',
      neighborhood: 'Midtown',
      address: '4100 Woodward Ave, Detroit, MI 48201',
      tools: JSON.stringify(['metal', 'wood', 'laser', '3d_print', 'electronics', 'cnc']),
      isBeginnerFriendly: true,
      requiresMembership: true,
      isVerified: true,
      isFeatured: true,
    },
    {
      id: uuidv4(),
      name: 'OmniCorp Detroit',
      slug: 'omnicorp-detroit',
      description: 'A member-driven hackerspace and community lab focused on electronics, programming, and digital fabrication. Regular meetups, workshops, and open hack nights.',
      shortDescription: 'Hackerspace focused on electronics and digital fabrication.',
      neighborhood: 'Ferndale',
      address: '123 W Nine Mile Rd, Ferndale, MI 48220',
      tools: JSON.stringify(['electronics', '3d_print', 'laser']),
      isBeginnerFriendly: true,
      requiresMembership: false,
      isVerified: true,
      isFeatured: true,
    },
    {
      id: uuidv4(),
      name: 'Incite Focus Factory',
      slug: 'incite-focus-factory',
      description: 'A creative community space offering ceramics, textiles, woodworking, and printmaking. Focused on connecting artists and makers through shared studio time.',
      shortDescription: 'Creative studio for ceramics, textiles, and printmaking.',
      neighborhood: 'Eastern Market',
      address: '2940 Rivard St, Detroit, MI 48207',
      tools: JSON.stringify(['ceramics', 'textiles', 'sewing', 'wood']),
      isBeginnerFriendly: true,
      requiresMembership: false,
      isVerified: true,
      isFeatured: false,
    },
    {
      id: uuidv4(),
      name: 'Detroit Community Technology Project',
      slug: 'dctp',
      description: 'Teaching community members to build and maintain their own technology infrastructure. Focus on digital literacy, networking, and community tech.',
      shortDescription: 'Community technology education and digital infrastructure.',
      neighborhood: 'North End',
      address: '3914 Woodward Ave, Detroit, MI 48201',
      tools: JSON.stringify(['electronics', 'other']),
      isBeginnerFriendly: true,
      requiresMembership: false,
      isVerified: true,
      isFeatured: false,
    },
    {
      id: uuidv4(),
      name: 'Ponyride',
      slug: 'ponyride',
      description: 'Affordable workspace for makers, entrepreneurs, and small businesses. Wood shop, metal shop, and co-working space in Corktown.',
      shortDescription: 'Affordable maker workspace in Corktown.',
      neighborhood: 'Corktown',
      address: '1401 Vermont St, Detroit, MI 48216',
      tools: JSON.stringify(['wood', 'metal', 'cnc']),
      isBeginnerFriendly: false,
      requiresMembership: true,
      isVerified: true,
      isFeatured: true,
    },
  ];

  console.log('Seeding spaces...');
  for (const space of sampleSpaces) {
    await db.insert(spaces).values(space).onConflictDoNothing();
  }
  console.log(`Seeded ${sampleSpaces.length} spaces.`);

  // Seed sample opportunities
  const sampleOpps = [
    {
      id: uuidv4(),
      title: 'CNC Operator Needed for Furniture Project',
      description: 'Looking for an experienced CNC operator to help with a custom furniture commission. 3-axis router experience preferred. Paid per piece, expected 2-week project.',
      type: 'paid_gig' as const,
      postedById: 'seed-user',
      spaceId: sampleSpaces[0].id,
      contactInfo: 'DM or email maker@example.com',
    },
    {
      id: uuidv4(),
      title: 'Collaborator for Interactive Art Installation',
      description: 'Building an interactive LED installation for a gallery show in Eastern Market. Need someone with Arduino/electronics experience. This is a portfolio/credit project, not paid.',
      type: 'collaborator' as const,
      postedById: 'seed-user',
      spaceId: sampleSpaces[2].id,
    },
    {
      id: uuidv4(),
      title: 'Free Scrap Metal Available',
      description: 'Clearing out the shop and have a large quantity of steel and aluminum scrap. Various sizes and gauges. Come pick up anytime this week.',
      type: 'materials_swap' as const,
      postedById: 'seed-user',
      spaceId: sampleSpaces[4].id,
    },
    {
      id: uuidv4(),
      title: 'Knight Foundation Arts Grant - Applications Open',
      description: 'Knight Foundation is accepting applications for community arts projects in Detroit. Grants range from $5,000 to $25,000. Deadline: March 15.',
      type: 'grant' as const,
      postedById: 'seed-user',
      contactInfo: 'https://knightfoundation.org/grants',
    },
    {
      id: uuidv4(),
      title: 'Laser Cutter Time Available - Weekends',
      description: 'Our 60W CO2 laser is available for outside projects on weekends. $25/hour or bring your own materials for free if you help with a shop project.',
      type: 'tool_access' as const,
      postedById: 'seed-user',
      spaceId: sampleSpaces[1].id,
    },
    {
      id: uuidv4(),
      title: 'Open Studio Saturday - Ceramics',
      description: 'Join us for open studio ceramics every Saturday 10am-4pm. Wheel and hand-building stations available. Bring your own clay or purchase from us.',
      type: 'open_studio' as const,
      postedById: 'seed-user',
      spaceId: sampleSpaces[2].id,
    },
  ];

  console.log('Seeding opportunities...');
  for (const opp of sampleOpps) {
    await db.insert(opportunities).values(opp).onConflictDoNothing();
  }
  console.log(`Seeded ${sampleOpps.length} opportunities.`);
}

seedSpaces()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error seeding:', err);
    process.exit(1);
  });
