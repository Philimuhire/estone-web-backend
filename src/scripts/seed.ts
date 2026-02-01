import dotenv from 'dotenv';
dotenv.config();

import sequelize from '../config/database';
import Admin from '../models/Admin';
import Project from '../models/Project';
import TeamMember from '../models/TeamMember';
import Service from '../models/Service';
import Message from '../models/Message';

const seedAll = async (): Promise<void> => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connected');

    // Sync all models (this creates tables if they don't exist)
    await sequelize.sync({ force: true }); // force: true will drop and recreate tables
    console.log('Database synchronized - all tables created');

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('Starting database seeding...');
    console.log('═══════════════════════════════════════════════════════\n');

    // Seed Admin
    console.log('Seeding Admin...');
    const admin = await Admin.create({
      name: 'Philimuhire',
      email: 'philimuhire@gmail.com',
      password: 'admin123',
    });
    console.log(`✓ Admin created: ${admin.email}`);

    // Seed Services
    console.log('\nSeeding Services...');
    const services = await Service.bulkCreate([
      {
        title: 'Structural Engineering',
        description: 'Comprehensive structural engineering services including design, analysis, and inspection of buildings and infrastructure. We ensure safety and durability in every project.',
        features: ['Building Design', 'Structural Analysis', 'Foundation Engineering', 'Seismic Assessment', 'Structural Inspections'],
        icon: 'building',
        order: 1,
      },
      {
        title: 'Road Construction',
        description: 'Expert road construction and rehabilitation services. From highways to residential streets, we deliver quality infrastructure that stands the test of time.',
        features: ['Highway Construction', 'Road Rehabilitation', 'Pavement Design', 'Drainage Systems', 'Traffic Management'],
        icon: 'road',
        order: 2,
      },
      {
        title: 'Water & Sanitation',
        description: 'Complete water supply and sanitation solutions for communities and commercial projects. We design and implement sustainable water management systems.',
        features: ['Water Supply Systems', 'Sewage Treatment', 'Drainage Design', 'Irrigation Systems', 'Water Quality Testing'],
        icon: 'water',
        order: 3,
      },
      {
        title: 'Building Construction',
        description: 'Full-service building construction from residential homes to commercial complexes. Quality craftsmanship and timely delivery guaranteed.',
        features: ['Residential Buildings', 'Commercial Complexes', 'Industrial Facilities', 'Renovations', 'Project Management'],
        icon: 'home',
        order: 4,
      },
      {
        title: 'Environmental Consulting',
        description: 'Environmental impact assessments and sustainable engineering solutions. We help projects meet environmental regulations while minimizing ecological footprint.',
        features: ['Environmental Impact Assessment', 'Sustainability Planning', 'Waste Management', 'Green Building Design', 'Compliance Audits'],
        icon: 'leaf',
        order: 5,
      },
      {
        title: 'Project Management',
        description: 'Professional project management services ensuring your construction projects are delivered on time, within budget, and to the highest standards.',
        features: ['Planning & Scheduling', 'Cost Management', 'Quality Control', 'Risk Assessment', 'Contract Administration'],
        icon: 'clipboard',
        order: 6,
      },
    ]);
    console.log(`✓ ${services.length} services created`);

    // Seed Team Members
    console.log('\nSeeding Team Members...');
    const teamMembers = await TeamMember.bulkCreate([
      {
        name: 'Jean Pierre Habimana',
        role: 'Chief Executive Officer',
        description: 'With over 20 years of experience in civil engineering, Jean Pierre leads ESCOtech with a vision for excellence and innovation in construction.',
        image: '/uploads/team/ceo.jpg',
        order: 1,
        isCEO: true,
      },
      {
        name: 'Marie Claire Uwimana',
        role: 'Chief Operations Officer',
        description: 'Marie Claire oversees all operational aspects of the company, ensuring projects are delivered efficiently and to the highest standards.',
        image: '/uploads/team/coo.jpg',
        order: 2,
        isCEO: false,
      },
      {
        name: 'Emmanuel Nkurunziza',
        role: 'Lead Structural Engineer',
        description: 'Emmanuel brings 15 years of structural engineering expertise, specializing in complex building designs and infrastructure projects.',
        image: '/uploads/team/engineer1.jpg',
        order: 3,
        isCEO: false,
      },
      {
        name: 'Diane Mukamana',
        role: 'Project Manager',
        description: 'Diane ensures all projects are delivered on time and within budget, coordinating teams and managing client relationships.',
        image: '/uploads/team/pm.jpg',
        order: 4,
        isCEO: false,
      },
      {
        name: 'Patrick Bizimungu',
        role: 'Senior Civil Engineer',
        description: 'Patrick specializes in road construction and water systems, with extensive experience in infrastructure development across Rwanda.',
        image: '/uploads/team/engineer2.jpg',
        order: 5,
        isCEO: false,
      },
      {
        name: 'Grace Ingabire',
        role: 'Environmental Consultant',
        description: 'Grace leads our environmental consulting services, ensuring all projects meet sustainability standards and environmental regulations.',
        image: '/uploads/team/consultant.jpg',
        order: 6,
        isCEO: false,
      },
    ]);
    console.log(`✓ ${teamMembers.length} team members created`);

    // Seed Projects
    console.log('\nSeeding Projects...');
    const projects = await Project.bulkCreate([
      {
        title: 'Kigali Heights Office Complex',
        description: 'A modern 12-story office complex in the heart of Kigali, featuring state-of-the-art facilities, underground parking, and sustainable design elements.',
        category: 'commercial',
        location: 'Kigali, Rwanda',
        image: '/uploads/projects/kigali-heights.jpg',
        featured: true,
      },
      {
        title: 'Musanze-Rubavu Highway',
        description: 'Construction of a 45km highway connecting Musanze to Rubavu, improving transportation and boosting economic development in the Northern Province.',
        category: 'commercial',
        location: 'Northern Province, Rwanda',
        image: '/uploads/projects/highway.jpg',
        featured: true,
      },
      {
        title: 'Green Valley Residential Estate',
        description: 'A luxury residential estate featuring 50 modern homes with eco-friendly designs, community amenities, and beautiful landscaping.',
        category: 'residential',
        location: 'Nyarutarama, Kigali',
        image: '/uploads/projects/green-valley.jpg',
        featured: true,
      },
      {
        title: 'Huye Water Treatment Plant',
        description: 'A comprehensive water treatment facility serving over 100,000 residents, ensuring clean and safe drinking water for the Huye district.',
        category: 'commercial',
        location: 'Huye, Rwanda',
        image: '/uploads/projects/water-plant.jpg',
        featured: false,
      },
      {
        title: 'Rubangura Family Home',
        description: 'A beautiful 5-bedroom family residence with modern architecture, featuring a swimming pool, garden, and smart home technology.',
        category: 'residential',
        location: 'Kimihurura, Kigali',
        image: '/uploads/projects/family-home.jpg',
        featured: false,
      },
      {
        title: 'Kicukiro Shopping Mall',
        description: 'A contemporary shopping center with retail spaces, restaurants, entertainment facilities, and ample parking for visitors.',
        category: 'commercial',
        location: 'Kicukiro, Kigali',
        image: '/uploads/projects/shopping-mall.jpg',
        featured: true,
      },
      {
        title: 'Lake Kivu Resort Villas',
        description: 'Exclusive lakefront villas offering stunning views of Lake Kivu, designed for comfort and luxury living.',
        category: 'residential',
        location: 'Rubavu, Rwanda',
        image: '/uploads/projects/lake-villas.jpg',
        featured: false,
      },
      {
        title: 'Nyagatare Agricultural Center',
        description: 'A modern agricultural processing and storage facility supporting farmers in the Eastern Province with state-of-the-art equipment.',
        category: 'commercial',
        location: 'Nyagatare, Rwanda',
        image: '/uploads/projects/agri-center.jpg',
        featured: false,
      },
    ]);
    console.log(`✓ ${projects.length} projects created`);

    // Seed Sample Messages
    console.log('\nSeeding Sample Messages...');
    const messages = await Message.bulkCreate([
      {
        fullName: 'Alice Kamikazi',
        email: 'alice.k@example.com',
        phone: '+250788123456',
        message: 'Hello, I am interested in building a residential home in Kigali. Could you please provide information about your services and pricing?',
        isRead: false,
      },
      {
        fullName: 'Robert Mugisha',
        email: 'robert.m@company.rw',
        phone: '+250722987654',
        message: 'We are looking for a contractor for our new office building project. Please contact us to discuss the requirements and timeline.',
        isRead: true,
      },
      {
        fullName: 'Sarah Umutoni',
        email: 'sarah.u@gmail.com',
        phone: '+250733456789',
        message: 'I would like to inquire about your road construction services for a private driveway project. What is the process to get a quote?',
        isRead: false,
      },
    ]);
    console.log(`✓ ${messages.length} sample messages created`);

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('Database seeding completed successfully!');
    console.log('═══════════════════════════════════════════════════════');
    console.log('\nAdmin Credentials:');
    console.log(`  Email: ${admin.email}`);
    console.log('  Password: admin123');
    console.log('\nIMPORTANT: Change the password after first login!');
    console.log('═══════════════════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedAll();
