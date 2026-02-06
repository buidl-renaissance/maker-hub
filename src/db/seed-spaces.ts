/**
 * Seed script for Detroit Maker Hub spaces, opportunities, and events
 * Run with: npx tsx src/db/seed-spaces.ts
 */
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';
import { getDb } from './drizzle';
import { spaces, opportunities, events, users, type OpportunityType } from './schema';

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

async function seedSpaces() {
  const db = getDb();

  console.log('🏭 Detroit Maker Hub - Seeding spaces, opportunities, and events...\n');

  // First, get or create a seed user to own the data
  let seedUserId: string;
  const existingUsers = await db.select().from(users).limit(1);
  
  if (existingUsers.length > 0) {
    seedUserId = existingUsers[0].id;
    console.log(`📌 Using existing user: ${existingUsers[0].displayName || existingUsers[0].username || seedUserId}`);
  } else {
    // Create a seed admin user
    seedUserId = uuidv4();
    await db.insert(users).values({
      id: seedUserId,
      username: 'makerhub_admin',
      displayName: 'Maker Hub Admin',
      phone: '+15550001234',
      role: 'admin',
      status: 'active',
      createdAt: getPastDate(90),
      updatedAt: new Date(),
    });
    console.log(`📌 Created seed admin user`);
  }

  // ============================================
  // SPACES - Detroit Makerspaces & Hubs
  // ============================================
  const sampleSpaces = [
    {
      id: uuidv4(),
      name: 'TechShop Detroit',
      slug: 'techshop-detroit',
      description: `A community workshop and prototyping studio with industrial tools and equipment. Open to makers of all skill levels with classes, workshops, and open shop hours.

Our 15,000 sq ft facility includes:
• Full wood shop with table saws, jointers, planers, and CNC router
• Metal shop with MIG/TIG welding, plasma cutter, and mill
• Laser cutters (60W and 120W CO2)
• 3D printers (FDM and SLA)
• Electronics lab with soldering stations and oscilloscopes

Membership includes 24/7 access, tool training, and discounts on classes.`,
      shortDescription: 'Community workshop with industrial tools and prototyping equipment.',
      neighborhood: 'Midtown',
      address: '4100 Woodward Ave, Detroit, MI 48201',
      websiteUrl: 'https://techshop-detroit.example.com',
      contactEmail: 'info@techshop-detroit.example.com',
      contactPhone: '+13135551234',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
      tools: JSON.stringify(['metal', 'wood', 'laser', '3d_print', 'electronics', 'cnc']),
      isBeginnerFriendly: true,
      requiresMembership: true,
      organizerId: seedUserId,
      isVerified: true,
      isFeatured: true,
    },
    {
      id: uuidv4(),
      name: 'OmniCorp Labs',
      slug: 'omnicorp-labs',
      description: `A member-driven hackerspace and community lab focused on electronics, programming, and digital fabrication. We host regular meetups, workshops, and open hack nights every Tuesday and Thursday.

Our space features:
• Electronics workbench with component library
• 3D printing farm (8 Prusa MK4s, 2 resin printers)
• 80W laser cutter with 24x36" bed
• Vinyl cutter and heat press
• Meeting room with projector
• Cozy lounge area

No membership required for open nights - just show up!`,
      shortDescription: 'Hackerspace focused on electronics and digital fabrication.',
      neighborhood: 'Ferndale',
      address: '123 W Nine Mile Rd, Ferndale, MI 48220',
      websiteUrl: 'https://omnicorp-labs.example.com',
      contactEmail: 'hello@omnicorp-labs.example.com',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
      tools: JSON.stringify(['electronics', '3d_print', 'laser']),
      isBeginnerFriendly: true,
      requiresMembership: false,
      organizerId: seedUserId,
      isVerified: true,
      isFeatured: true,
    },
    {
      id: uuidv4(),
      name: 'Incite Focus Factory',
      slug: 'incite-focus-factory',
      description: `A creative community space in the heart of Eastern Market offering ceramics, textiles, woodworking, and printmaking. We focus on connecting artists and makers through shared studio time and collaborative projects.

Studio offerings:
• 12 pottery wheels and 2 kilns (cone 10)
• Screen printing and letterpress equipment
• Industrial sewing machines and sergers
• Hand-building ceramics area
• Wood shop for furniture and sculpture

Open studio hours Tue-Sun. Drop-in day passes available.`,
      shortDescription: 'Creative studio for ceramics, textiles, and printmaking.',
      neighborhood: 'Eastern Market',
      address: '2940 Rivard St, Detroit, MI 48207',
      websiteUrl: 'https://incitefocus.example.com',
      contactEmail: 'studio@incitefocus.example.com',
      contactPhone: '+13135552345',
      imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800',
      tools: JSON.stringify(['ceramics', 'textiles', 'sewing', 'wood']),
      isBeginnerFriendly: true,
      requiresMembership: false,
      organizerId: seedUserId,
      isVerified: true,
      isFeatured: false,
    },
    {
      id: uuidv4(),
      name: 'Detroit Community Technology Project',
      slug: 'dctp',
      description: `Teaching community members to build and maintain their own technology infrastructure. Our programs focus on digital literacy, mesh networking, and community tech solutions.

Programs include:
• Digital Stewards training program
• Community WiFi network installations
• Basic computer repair workshops
• Intro to programming for all ages
• Tech support drop-in hours

All programs are free and open to Detroit residents.`,
      shortDescription: 'Community technology education and digital infrastructure.',
      neighborhood: 'North End',
      address: '3914 Woodward Ave, Detroit, MI 48201',
      websiteUrl: 'https://detroitcommunitytech.org',
      contactEmail: 'info@detroitcommunitytech.org',
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
      tools: JSON.stringify(['electronics', 'other']),
      isBeginnerFriendly: true,
      requiresMembership: false,
      organizerId: seedUserId,
      isVerified: true,
      isFeatured: false,
    },
    {
      id: uuidv4(),
      name: 'Ponyride',
      slug: 'ponyride',
      description: `Affordable workspace for makers, entrepreneurs, and small businesses in historic Corktown. Our renovated warehouse provides shared and private studio spaces alongside well-equipped wood and metal shops.

Facilities:
• 8,000 sq ft wood shop with full dust collection
• Metal fabrication shop with welding bays
• 4x8 CNC router and panel saw
• Dedicated spray booth
• Private studios from 200-1500 sq ft
• Loading dock access

Membership required for shop access. Tours available by appointment.`,
      shortDescription: 'Affordable maker workspace in Corktown.',
      neighborhood: 'Corktown',
      address: '1401 Vermont St, Detroit, MI 48216',
      websiteUrl: 'https://ponyride.org',
      contactEmail: 'studios@ponyride.org',
      contactPhone: '+13135553456',
      imageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800',
      tools: JSON.stringify(['wood', 'metal', 'cnc']),
      isBeginnerFriendly: false,
      requiresMembership: true,
      organizerId: seedUserId,
      isVerified: true,
      isFeatured: true,
    },
    {
      id: uuidv4(),
      name: 'Build Institute',
      slug: 'build-institute',
      description: `A small business incubator and maker space supporting Detroit entrepreneurs. We offer affordable workspace, business education, and access to tools and equipment.

Resources:
• Coworking desks and private offices
• Small-scale production equipment
• Business coaching and mentorship
• Grant writing assistance
• Retail pop-up opportunities
• Community networking events

Sliding scale membership based on income.`,
      shortDescription: 'Small business incubator with maker resources.',
      neighborhood: 'Grandmont-Rosedale',
      address: '19725 Grand River Ave, Detroit, MI 48223',
      websiteUrl: 'https://buildinstitute.org',
      contactEmail: 'hello@buildinstitute.org',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      tools: JSON.stringify(['other']),
      isBeginnerFriendly: true,
      requiresMembership: true,
      organizerId: seedUserId,
      isVerified: true,
      isFeatured: false,
    },
    {
      id: uuidv4(),
      name: 'Maker Works Detroit',
      slug: 'maker-works-detroit',
      description: `A full-service makerspace with everything from woodworking to metalworking, digital fabrication to textiles. Our mission is to provide access to tools and knowledge for all skill levels.

Equipment highlights:
• ShopBot PRSalpha CNC (4x8 bed)
• Tormach PCNC 440 metal mill
• Epilog laser cutter 36x24
• Stratasys industrial 3D printer
• Complete automotive lift bay
• Industrial sewing and embroidery

Classes offered daily. Day passes available for trained members.`,
      shortDescription: 'Full-service makerspace for all skill levels.',
      neighborhood: 'Southwest Detroit',
      address: '5905 Michigan Ave, Detroit, MI 48210',
      websiteUrl: 'https://makerworks-detroit.example.com',
      contactEmail: 'make@makerworks-detroit.example.com',
      contactPhone: '+13135554567',
      imageUrl: 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=800',
      tools: JSON.stringify(['wood', 'metal', 'laser', '3d_print', 'cnc', 'textiles', 'sewing']),
      isBeginnerFriendly: true,
      requiresMembership: true,
      organizerId: seedUserId,
      isVerified: true,
      isFeatured: true,
    },
    {
      id: uuidv4(),
      name: 'Artisan Alley Studios',
      slug: 'artisan-alley-studios',
      description: `A collective of artist studios and workshops in a converted industrial building. We specialize in traditional crafts including blacksmithing, glasswork, and jewelry making.

Studios include:
• Blacksmith forge with power hammer
• Lampworking and kiln-forming glass studio
• Jewelry bench with casting equipment
• Leatherworking studio
• Photography darkroom
• Shared gallery space

Monthly open house events. Apprenticeship programs available.`,
      shortDescription: 'Traditional craft studios: blacksmithing, glass, jewelry.',
      neighborhood: 'New Center',
      address: '6568 Woodward Ave, Detroit, MI 48202',
      websiteUrl: 'https://artisan-alley.example.com',
      contactEmail: 'info@artisan-alley.example.com',
      imageUrl: 'https://images.unsplash.com/photo-1567016526105-22da7c13161a?w=800',
      tools: JSON.stringify(['metal', 'other']),
      isBeginnerFriendly: false,
      requiresMembership: true,
      organizerId: seedUserId,
      isVerified: true,
      isFeatured: false,
    },
  ];

  console.log('🔧 Seeding spaces...');
  for (const space of sampleSpaces) {
    await db.insert(spaces).values(space).onConflictDoNothing();
    console.log(`  ✓ ${space.name} (${space.neighborhood})`);
  }
  console.log(`  Total: ${sampleSpaces.length} spaces\n`);

  // ============================================
  // OPPORTUNITIES
  // ============================================
  const sampleOpps: Array<{
    id: string;
    title: string;
    description: string;
    type: OpportunityType;
    postedById: string;
    spaceId?: string;
    contactInfo?: string;
    expiresAt?: Date;
  }> = [
    {
      id: uuidv4(),
      title: 'CNC Operator Needed for Furniture Project',
      description: `Looking for an experienced CNC operator to help with a custom furniture commission. 3-axis router experience preferred (ShopBot or similar).

Project details:
• 12 piece dining set with compound curves
• Material: walnut and maple hardwoods
• Timeline: 2-3 weeks
• Pay: $35-45/hr depending on experience

Must be comfortable with Fusion 360 or VCarve. Can work at Ponyride or TechShop.`,
      type: 'paid_gig',
      postedById: seedUserId,
      spaceId: sampleSpaces[4].id,
      contactInfo: 'Email: cnc.projects@example.com',
      expiresAt: getRelativeDate(30),
    },
    {
      id: uuidv4(),
      title: 'Collaborator for Interactive Art Installation',
      description: `Building an interactive LED installation for a gallery show in Eastern Market this spring. Need someone with Arduino/electronics experience.

The installation:
• 500+ individually addressable LEDs
• Motion sensors and touch input
• Custom PCB design (we have the schematic)
• Projection mapping component

This is a portfolio/credit project, not paid, but materials are covered and you'll be featured as co-creator.`,
      type: 'collaborator',
      postedById: seedUserId,
      spaceId: sampleSpaces[2].id,
      expiresAt: getRelativeDate(45),
    },
    {
      id: uuidv4(),
      title: 'Free Scrap Metal Available',
      description: `Clearing out the shop and have a large quantity of steel and aluminum scrap. Perfect for welding practice or small projects.

Available:
• ~200 lbs mild steel (various gauges, cutoffs)
• ~50 lbs aluminum bar and sheet
• Some stainless and copper scraps
• Assorted hardware and fasteners

First come, first served. Come pick up anytime this week. Must take at least 50 lbs to make it worth the trip!`,
      type: 'materials_swap',
      postedById: seedUserId,
      spaceId: sampleSpaces[4].id,
      expiresAt: getRelativeDate(7),
    },
    {
      id: uuidv4(),
      title: 'Knight Foundation Arts Grant - Applications Open',
      description: `Knight Foundation is accepting applications for community arts projects in Detroit. Great opportunity for makers working at the intersection of art and technology.

Details:
• Grants range from $5,000 to $25,000
• Projects must benefit Detroit community
• Preference for innovative approaches
• Can be individual or collaborative

Deadline: March 15, 2026. I applied last year and happy to share tips!`,
      type: 'grant',
      postedById: seedUserId,
      contactInfo: 'https://knightfoundation.org/grants',
      expiresAt: getRelativeDate(60),
    },
    {
      id: uuidv4(),
      title: 'Laser Cutter Time Available - Weekends',
      description: `Our 80W CO2 laser is available for outside projects on weekends. Great for prototyping or small batch production.

Rates:
• $25/hour (you supply materials)
• $35/hour (materials included for basic acrylic/wood)
• Free if you help with a shop project!

Bed size: 24x36 inches. Can cut up to 1/2" acrylic, 1/4" plywood. Perfect for signage, enclosures, or decorative work.`,
      type: 'tool_access',
      postedById: seedUserId,
      spaceId: sampleSpaces[1].id,
      contactInfo: 'DM on Slack or email laser@omnicorp-labs.example.com',
    },
    {
      id: uuidv4(),
      title: 'Open Studio Saturday - Ceramics',
      description: `Join us for open studio ceramics every Saturday 10am-4pm at Incite Focus Factory!

What's included:
• Wheel and hand-building stations
• Glazing area access
• Kiln firings (cone 6 and 10)
• Tool library

Bring your own clay or purchase from us ($15/25lb bag). Day pass: $20 for non-members.`,
      type: 'open_studio',
      postedById: seedUserId,
      spaceId: sampleSpaces[2].id,
    },
    {
      id: uuidv4(),
      title: 'Welding Instructor Wanted - Part Time',
      description: `TechShop Detroit is looking for a part-time welding instructor to teach MIG and TIG basics.

Requirements:
• 3+ years welding experience
• Ability to teach beginners
• Evenings/weekends availability
• AWS certification preferred but not required

This is a paid position: $30-40/hr. Classes are 3 hours, typically 2-3 per week.`,
      type: 'paid_gig',
      postedById: seedUserId,
      spaceId: sampleSpaces[0].id,
      contactInfo: 'Apply at jobs@techshop-detroit.example.com',
      expiresAt: getRelativeDate(21),
    },
    {
      id: uuidv4(),
      title: 'Looking for Sewing Machine Repair Help',
      description: `Our industrial Juki is making a clicking noise and I can't figure it out. Looking for someone who knows their way around sewing machine mechanics.

Details:
• Juki DDL-5550N straight stitch
• Click happens at specific point in cycle
• Already cleaned and oiled
• Happy to pay for diagnosis/repair

Can bring to you or you can come to Eastern Market.`,
      type: 'collaborator',
      postedById: seedUserId,
      spaceId: sampleSpaces[2].id,
      contactInfo: 'Text: 313-555-7890',
    },
    {
      id: uuidv4(),
      title: 'Michigan Council for Arts Grant - Deadline Soon',
      description: `Quick heads up: Michigan Council for Arts and Cultural Affairs has operational grants available for maker spaces and community workshops.

Up to $20,000 for:
• Equipment purchases
• Program development
• Facility improvements
• Accessibility upgrades

Deadline: February 28. They fund about 60% of applicants.`,
      type: 'grant',
      postedById: seedUserId,
      contactInfo: 'https://michigan.gov/arts',
      expiresAt: getRelativeDate(21),
    },
    {
      id: uuidv4(),
      title: 'Wood Shop Orientation - Free for New Makers',
      description: `Maker Works is offering free wood shop orientations every Wednesday at 6pm. Perfect for beginners or those new to our space.

Covers:
• Shop safety and PPE
• Table saw, bandsaw, jointer basics
• Dust collection system
• Project storage and cleanup

Must complete orientation before using shop independently. Sign up on our website.`,
      type: 'open_studio',
      postedById: seedUserId,
      spaceId: sampleSpaces[6].id,
    },
    {
      id: uuidv4(),
      title: 'Seeking Metal Fabricator for Public Art Project',
      description: `Commission opportunity: We're building a 12-foot kinetic sculpture for a downtown plaza. Need an experienced metal fabricator to join the team.

Project scope:
• Structural steel frame
• Kinetic elements with bearings
• Weather-resistant finish
• Installation support

Budget: $8,000 for fabrication labor (materials covered separately). Timeline: 8 weeks.`,
      type: 'paid_gig',
      postedById: seedUserId,
      contactInfo: 'Portfolio required: sculpture@example.com',
      expiresAt: getRelativeDate(30),
    },
    {
      id: uuidv4(),
      title: 'Free 3D Printer Filament - Moving Sale',
      description: `Moving out of state and can't take it all with me! Free to good homes:

• 8 rolls PLA (various colors, some partial)
• 3 rolls PETG (black, white, clear)
• 2 rolls TPU flexible
• Misc supports, adhesives, nozzles

All 1.75mm. Some opened but stored properly. Pick up in Ferndale by end of month.`,
      type: 'materials_swap',
      postedById: seedUserId,
      spaceId: sampleSpaces[1].id,
      expiresAt: getRelativeDate(14),
    },
  ];

  console.log('💼 Seeding opportunities...');
  for (const opp of sampleOpps) {
    await db.insert(opportunities).values({
      ...opp,
      status: 'active',
      createdAt: getPastDate(Math.floor(Math.random() * 14)),
      updatedAt: new Date(),
    }).onConflictDoNothing();
    console.log(`  ✓ [${opp.type}] ${opp.title}`);
  }
  console.log(`  Total: ${sampleOpps.length} opportunities\n`);

  // ============================================
  // MAKER-FOCUSED EVENTS
  // ============================================
  const makerEvents = [
    {
      id: uuidv4(),
      title: 'Intro to Laser Cutting Workshop',
      description: `Learn the fundamentals of laser cutting in this hands-on beginner workshop at OmniCorp Labs.

You'll learn:
• Laser safety and operation
• Setting up files in Lightburn
• Material selection (acrylic, wood, leather)
• Vector vs raster engraving
• Making your first cut!

Leave with a custom-designed coaster or keychain. All materials included.

Cost: $45 (free for OmniCorp members)`,
      location: 'OmniCorp Labs, 123 W Nine Mile Rd, Ferndale',
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
      startTime: '14:00',
      endTime: '17:00',
      daysFromNow: 5,
    },
    {
      id: uuidv4(),
      title: 'Maker Meetup: Show & Tell',
      description: `Monthly gathering where makers share what they've been working on. All skill levels and project types welcome!

Format:
• 5-minute presentations
• Q&A and feedback
• Open networking time
• Refreshments provided

Bring your project, prototype, or just your curiosity. Great way to get inspired and meet fellow makers.

Free and open to all.`,
      location: 'TechShop Detroit, 4100 Woodward Ave',
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
      startTime: '18:30',
      endTime: '20:30',
      daysFromNow: 10,
    },
    {
      id: uuidv4(),
      title: 'Ceramics Open Throw Night',
      description: `Join us for an evening of wheel throwing at Incite Focus Factory. Experienced throwers and curious beginners all welcome.

What to expect:
• Wheels available first-come-first-served
• Instructors on hand for guidance
• Clay and tools provided
• Pieces can be fired for additional fee

Wear clothes you don't mind getting dirty. $15 drop-in fee for non-members.`,
      location: 'Incite Focus Factory, 2940 Rivard St, Eastern Market',
      imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800',
      startTime: '18:00',
      endTime: '21:00',
      daysFromNow: 3,
    },
    {
      id: uuidv4(),
      title: 'Woodworking Basics: Build a Cutting Board',
      description: `A perfect first woodworking project! Learn fundamental techniques while creating a beautiful hardwood cutting board.

Skills covered:
• Wood selection and grain orientation
• Table saw safety and operation
• Edge gluing and clamping
• Planing and surface prep
• Food-safe finishing

All materials and tools provided. Take home your finished cutting board!

Cost: $85 (includes materials)`,
      location: 'Maker Works Detroit, 5905 Michigan Ave',
      imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
      startTime: '10:00',
      endTime: '15:00',
      daysFromNow: 12,
    },
    {
      id: uuidv4(),
      title: 'Arduino Night: Build a Weather Station',
      description: `Hands-on electronics workshop where you'll build a WiFi-connected weather station that reports to your phone.

Project includes:
• ESP8266 microcontroller
• Temperature/humidity sensor
• Barometric pressure sensor
• OLED display
• 3D printed enclosure

No prior experience needed - we'll walk through every step. Kit included in workshop fee.

Cost: $65 (kit yours to keep)`,
      location: 'OmniCorp Labs, 123 W Nine Mile Rd, Ferndale',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
      startTime: '18:00',
      endTime: '21:00',
      daysFromNow: 8,
    },
    {
      id: uuidv4(),
      title: 'Welding 101: MIG Fundamentals',
      description: `Start your welding journey with this comprehensive MIG welding introduction at TechShop Detroit.

Class covers:
• Welding safety and PPE
• MIG machine setup and operation
• Running beads and basic joints
• Common mistakes and troubleshooting
• Practice on steel plate and tubing

Must be 18+. All safety equipment provided.

Cost: $125 (includes practice materials)`,
      location: 'TechShop Detroit, 4100 Woodward Ave',
      imageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800',
      startTime: '09:00',
      endTime: '13:00',
      daysFromNow: 15,
    },
    {
      id: uuidv4(),
      title: 'Repair Café Detroit',
      description: `Bring your broken stuff! Volunteer fixers help repair electronics, small appliances, clothing, and more.

What we fix:
• Electronics (computers, phones, speakers)
• Small appliances (lamps, fans, toasters)
• Clothing (buttons, zippers, tears)
• Bicycles and small mechanical items

Free repairs! Donations appreciated to keep the café running.

Learn repair skills by watching or helping. All ages welcome.`,
      location: 'Build Institute, 19725 Grand River Ave',
      imageUrl: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800',
      startTime: '11:00',
      endTime: '15:00',
      daysFromNow: 6,
    },
    {
      id: uuidv4(),
      title: '3D Printing Deep Dive: Advanced Techniques',
      description: `Level up your 3D printing skills with this advanced workshop covering multi-material printing, supports, and troubleshooting.

Topics:
• Slicer settings optimization
• Multi-color/multi-material prints
• Support strategies for complex geometries
• Print failure troubleshooting
• Post-processing techniques

Bring your tough print challenges - we'll solve them together!

Cost: $55 (free for members)`,
      location: 'OmniCorp Labs, 123 W Nine Mile Rd, Ferndale',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
      startTime: '13:00',
      endTime: '16:00',
      daysFromNow: 20,
    },
    {
      id: uuidv4(),
      title: 'Digital Stewards Training Info Session',
      description: `Learn about the Digital Stewards program at Detroit Community Technology Project. Train to become a community tech leader!

Program overview:
• 20-week paid training program
• Learn networking, repair, and teaching skills
• Help build community internet infrastructure
• Stipend and certification provided

Info session covers application process, timeline, and Q&A with current stewards.

Free and open to Detroit residents.`,
      location: 'DCTP, 3914 Woodward Ave',
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
      startTime: '17:00',
      endTime: '18:30',
      daysFromNow: 4,
    },
    {
      id: uuidv4(),
      title: 'Blacksmithing Intro: Forge a Hook',
      description: `Experience the art of blacksmithing! In this introductory class, you'll learn to work hot metal and forge a functional wall hook.

You'll learn:
• Forge and anvil setup
• Heating metal to forging temperature
• Basic hammer techniques
• Tapering, bending, and scrolling
• Finishing and coating

Take home your hand-forged hook! All tools and materials provided.

Cost: $95 | Must be 18+`,
      location: 'Artisan Alley Studios, 6568 Woodward Ave',
      imageUrl: 'https://images.unsplash.com/photo-1567016526105-22da7c13161a?w=800',
      startTime: '10:00',
      endTime: '14:00',
      daysFromNow: 18,
    },
    {
      id: uuidv4(),
      title: 'CNC Router Certification',
      description: `Get certified to use the ShopBot CNC router at Ponyride. Required for independent CNC access.

Certification covers:
• Machine operation and safety
• File setup and toolpath basics
• Workholding and material prep
• Feeds, speeds, and bit selection
• Emergency procedures

Must have basic CAD experience. Bring your laptop with VCarve or Fusion 360 installed.

Cost: $150 (includes 2 hours supervised practice time)`,
      location: 'Ponyride, 1401 Vermont St, Corktown',
      imageUrl: 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=800',
      startTime: '09:00',
      endTime: '13:00',
      daysFromNow: 22,
    },
    {
      id: uuidv4(),
      title: 'Sewing Circle: Mending & Alterations',
      description: `Join our weekly sewing circle for a relaxed evening of mending, alterations, and skill sharing.

Bring:
• Items that need repair
• Alterations projects
• Questions about sewing techniques

Machines available, or bring your own handwork. Experienced sewists on hand to help beginners.

Free! Donations to supply fund appreciated.`,
      location: 'Incite Focus Factory, 2940 Rivard St, Eastern Market',
      imageUrl: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800',
      startTime: '18:00',
      endTime: '20:00',
      daysFromNow: 2,
    },
  ];

  console.log('📅 Seeding maker events...');
  for (const eventData of makerEvents) {
    await db.insert(events).values({
      id: eventData.id,
      creatorId: seedUserId,
      title: eventData.title,
      description: eventData.description,
      location: eventData.location,
      imageUrl: eventData.imageUrl,
      eventDate: getRelativeDate(eventData.daysFromNow),
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      isExternal: false,
      createdAt: getPastDate(7),
      updatedAt: new Date(),
    }).onConflictDoNothing();
    console.log(`  ✓ ${eventData.title} (in ${eventData.daysFromNow} days)`);
  }
  console.log(`  Total: ${makerEvents.length} events\n`);

  // ============================================
  // SUMMARY
  // ============================================
  console.log('✅ Seed completed successfully!\n');
  console.log('Summary:');
  console.log(`  • ${sampleSpaces.length} makerspaces`);
  console.log(`  • ${sampleOpps.length} opportunities`);
  console.log(`  • ${makerEvents.length} events`);
}

seedSpaces()
  .then(() => {
    console.log('\n🎉 Done! Your Maker Hub is now populated with Detroit-area maker data.\n');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error seeding:', err);
    process.exit(1);
  });
