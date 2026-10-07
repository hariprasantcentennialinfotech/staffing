/**
 * Database Seed Script
 * Run with: node src/seed.js
 * 
 * Creates:
 *  - 2 Admin users
 *  - 3 Regular users
 *  - 5 Companies
 *  - 10 Skills
 *  - 8 Open Jobs (linked to admins and companies)
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Models
const Admin = require('./models/Admin');
const User = require('./models/User');
const Company = require('./models/Company');
const Skill = require('./models/Skill');
const Job = require('./models/Job');

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
};

const seed = async () => {
    await connectDB();

    // ─── Clear existing data ────────────────────────────────────────────────
    console.log('\n🗑️  Clearing existing collections...');
    await Admin.deleteMany({});
    await User.deleteMany({});
    await Company.deleteMany({});
    await Skill.deleteMany({});
    await Job.deleteMany({});
    console.log('   Done.\n');

    // ─── Skills ─────────────────────────────────────────────────────────────
    console.log('🔧 Seeding Skills...');
    const skillNames = [
        'JavaScript', 'React.js', 'Node.js', 'Python', 'Java',
        'SQL', 'MongoDB', 'AWS', 'Docker', 'TypeScript'
    ];
    const skills = await Skill.insertMany(skillNames.map(name => ({ skill_name: name })));
    console.log(`   Created ${skills.length} skills.\n`);

    // ─── Companies ───────────────────────────────────────────────────────────
    console.log('🏢 Seeding Companies...');
    const companiesData = [
        {
            name: 'TechNova Solutions',
            logo: 'https://ui-avatars.com/api/?name=TechNova&background=6366f1&color=fff&size=128',
            website: 'https://technova.example.com',
            description: 'Leading software product company specializing in SaaS platforms.',
            industry: 'Software & Technology',
            size: '500-1000',
            headquarters: 'Bangalore, India'
        },
        {
            name: 'DataPulse Analytics',
            logo: 'https://ui-avatars.com/api/?name=DataPulse&background=0ea5e9&color=fff&size=128',
            website: 'https://datapulse.example.com',
            description: 'Data analytics and business intelligence firm.',
            industry: 'Data & Analytics',
            size: '100-500',
            headquarters: 'Hyderabad, India'
        },
        {
            name: 'CloudNest Systems',
            logo: 'https://ui-avatars.com/api/?name=CloudNest&background=10b981&color=fff&size=128',
            website: 'https://cloudnest.example.com',
            description: 'Cloud infrastructure and DevOps consulting.',
            industry: 'Cloud & Infrastructure',
            size: '200-500',
            headquarters: 'Pune, India'
        },
        {
            name: 'Centennial Infotech',
            logo: 'https://ui-avatars.com/api/?name=Centennial&background=f59e0b&color=fff&size=128',
            website: 'https://centennialinfotech.com',
            description: 'IT consulting and staffing solutions since 2001.',
            industry: 'IT Consulting',
            size: '1000-5000',
            headquarters: 'Chennai, India'
        },
        {
            name: 'Quantum Apps',
            logo: 'https://ui-avatars.com/api/?name=Quantum&background=ef4444&color=fff&size=128',
            website: 'https://quantumapps.example.com',
            description: 'Mobile & web application development company.',
            industry: 'App Development',
            size: '50-100',
            headquarters: 'Mumbai, India'
        }
    ];
    const companies = await Company.insertMany(companiesData);
    console.log(`   Created ${companies.length} companies.\n`);

    // ─── Admins ──────────────────────────────────────────────────────────────
    console.log('👨‍💼 Seeding Admins...');
    const adminsData = [
        {
            name: 'Super Admin',
            email: 'admin@centennial.com',
            password: 'Admin@123'
        },
        {
            name: 'Priya Recruiter',
            email: 'priya@centennial.com',
            password: 'Admin@123'
        }
    ];

    // Admin model hashes password via pre-save hook, so use .create() not insertMany()
    const createdAdmins = [];
    for (const adminData of adminsData) {
        const admin = await Admin.create(adminData);
        createdAdmins.push(admin);
    }
    console.log(`   Created ${createdAdmins.length} admins.`);
    console.log('   Admin credentials:');
    adminsData.forEach(a => console.log(`     📧 ${a.email}  🔑 ${a.password}`));
    console.log();

    // ─── Users ───────────────────────────────────────────────────────────────
    console.log('👤 Seeding Users...');
    const usersData = [
        {
            first_name: 'Arjun',
            last_name: 'Sharma',
            email: 'arjun@example.com',
            phone: '9876543210',
            password: 'User@123',
            location_city: 'Bangalore',
            location_state: 'Karnataka',
            country: 'India',
            degree: 'B.Tech',
            branch: 'Computer Science',
            university: 'VTU',
            graduation_year: 2022,
            experience_years: 2,
            current_company: 'Infosys',
            skills: ['JavaScript', 'React.js', 'Node.js']
        },
        {
            first_name: 'Meera',
            last_name: 'Nair',
            email: 'meera@example.com',
            phone: '9123456789',
            password: 'User@123',
            location_city: 'Chennai',
            location_state: 'Tamil Nadu',
            country: 'India',
            degree: 'M.Tech',
            branch: 'Data Science',
            university: 'Anna University',
            graduation_year: 2023,
            experience_years: 1,
            current_company: 'Freshworks',
            skills: ['Python', 'SQL', 'MongoDB']
        },
        {
            first_name: 'Rohan',
            last_name: 'Verma',
            email: 'rohan@example.com',
            phone: '9000011122',
            password: 'User@123',
            location_city: 'Hyderabad',
            location_state: 'Telangana',
            country: 'India',
            degree: 'B.E',
            branch: 'Information Technology',
            university: 'JNTU',
            graduation_year: 2021,
            experience_years: 3,
            current_company: 'HCL Technologies',
            skills: ['Java', 'AWS', 'Docker']
        }
    ];

    const createdUsers = [];
    for (const userData of usersData) {
        const user = await User.create(userData);
        createdUsers.push(user);
    }
    console.log(`   Created ${createdUsers.length} users.`);
    console.log('   User credentials:');
    usersData.forEach(u => console.log(`     📧 ${u.email}  🔑 ${u.password}`));
    console.log();

    // ─── Jobs ────────────────────────────────────────────────────────────────
    console.log('💼 Seeding Jobs...');
    const adminId1 = createdAdmins[0]._id;
    const adminId2 = createdAdmins[1]._id;

    const jobsData = [
        {
            job_id: 'JOB1001',
            title: 'Senior React Developer',
            role: 'Web Development',
            company_id: companies[0]._id,
            company_name: companies[0].name,
            company_logo: companies[0].logo,
            posted_by_admin_id: adminId1,
            description: 'We are looking for an experienced React developer to join our growing product team. You will be responsible for building scalable frontend applications and collaborating with designers and backend engineers.',
            requirements: [
                '3+ years of React.js experience',
                'Strong knowledge of JavaScript ES6+',
                'Experience with REST APIs and state management',
                'Familiarity with Git and CI/CD pipelines'
            ],
            responsibilities: [
                'Build and maintain React.js applications',
                'Collaborate with UI/UX designers',
                'Write clean, maintainable code',
                'Participate in code reviews and sprints'
            ],
            salary_min: 800000,
            salary_max: 1400000,
            currency: 'INR',
            experience_required: 3,
            job_type: 'full-time',
            work_mode: 'hybrid',
            location_city: 'Bangalore',
            location_state: 'Karnataka',
            country: 'India',
            openings_count: 3,
            application_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: 'open',
            skills_required: [skills[0]._id, skills[1]._id, skills[9]._id]
        },
        {
            job_id: 'JOB1002',
            title: 'Node.js Backend Engineer',
            role: 'Web Development',
            company_id: companies[0]._id,
            company_name: companies[0].name,
            company_logo: companies[0].logo,
            posted_by_admin_id: adminId1,
            description: 'Join our backend team to build robust, high-performance APIs and microservices. You will work on designing scalable systems and integrating third-party services.',
            requirements: [
                '2+ years of Node.js experience',
                'Strong understanding of RESTful APIs',
                'Experience with MongoDB or PostgreSQL',
                'Knowledge of Docker and containerization'
            ],
            responsibilities: [
                'Design and develop RESTful APIs',
                'Optimize database queries for performance',
                'Write unit and integration tests',
                'Deploy and maintain services on AWS'
            ],
            salary_min: 700000,
            salary_max: 1200000,
            currency: 'INR',
            experience_required: 2,
            job_type: 'full-time',
            work_mode: 'onsite',
            location_city: 'Bangalore',
            location_state: 'Karnataka',
            country: 'India',
            openings_count: 2,
            application_deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
            status: 'open',
            skills_required: [skills[2]._id, skills[6]._id, skills[7]._id]
        },
        {
            job_id: 'JOB1003',
            title: 'Data Analyst',
            role: 'Software Development',
            company_id: companies[1]._id,
            company_name: companies[1].name,
            company_logo: companies[1].logo,
            posted_by_admin_id: adminId2,
            description: 'We are hiring a Data Analyst to help drive business decisions through data insights. You will work with large datasets, create dashboards, and present findings to stakeholders.',
            requirements: [
                'Proficiency in Python and SQL',
                'Experience with data visualization tools',
                'Strong analytical and problem-solving skills',
                'Knowledge of MongoDB or similar NoSQL databases'
            ],
            responsibilities: [
                'Analyse large datasets to extract insights',
                'Create dashboards and reports using BI tools',
                'Work closely with product and engineering teams',
                'Present findings to senior leadership'
            ],
            salary_min: 600000,
            salary_max: 1000000,
            currency: 'INR',
            experience_required: 1,
            job_type: 'full-time',
            work_mode: 'remote',
            location_city: 'Hyderabad',
            location_state: 'Telangana',
            country: 'India',
            openings_count: 5,
            application_deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
            status: 'open',
            skills_required: [skills[3]._id, skills[5]._id, skills[6]._id]
        },
        {
            job_id: 'JOB1004',
            title: 'DevOps Engineer',
            role: 'Software Development',
            company_id: companies[2]._id,
            company_name: companies[2].name,
            company_logo: companies[2].logo,
            posted_by_admin_id: adminId1,
            description: 'Looking for a DevOps Engineer to streamline our CI/CD pipelines, manage cloud infrastructure, and ensure high availability of our services.',
            requirements: [
                '2+ years in DevOps or Site Reliability Engineering',
                'Experience with AWS, GCP, or Azure',
                'Strong Docker and Kubernetes knowledge',
                'Proficiency with Terraform or Ansible'
            ],
            responsibilities: [
                'Manage CI/CD pipelines with GitHub Actions',
                'Provision and maintain cloud infrastructure',
                'Monitor system health and resolve incidents',
                'Automate deployments and scaling'
            ],
            salary_min: 900000,
            salary_max: 1600000,
            currency: 'INR',
            experience_required: 2,
            job_type: 'full-time',
            work_mode: 'hybrid',
            location_city: 'Pune',
            location_state: 'Maharashtra',
            country: 'India',
            openings_count: 2,
            application_deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
            status: 'open',
            skills_required: [skills[7]._id, skills[8]._id]
        },
        {
            job_id: 'JOB1005',
            title: 'IT Consultant',
            role: 'IT Consulting',
            company_id: companies[3]._id,
            company_name: companies[3].name,
            company_logo: companies[3].logo,
            posted_by_admin_id: adminId2,
            description: 'Centennial Infotech is looking for IT Consultants to advise clients on technology strategy and solutions. You will engage with enterprise clients to understand their needs and recommend tailored solutions.',
            requirements: [
                '3+ years in IT consulting or enterprise solutions',
                'Strong communication and presentation skills',
                'Knowledge of ERP, CRM, or cloud platforms',
                'Ability to travel to client sites'
            ],
            responsibilities: [
                'Understand client technology needs',
                'Propose and present IT solutions',
                'Lead implementation and onboarding',
                'Manage client relationships and escalations'
            ],
            salary_min: 1000000,
            salary_max: 2000000,
            currency: 'INR',
            experience_required: 3,
            job_type: 'full-time',
            work_mode: 'onsite',
            location_city: 'Chennai',
            location_state: 'Tamil Nadu',
            country: 'India',
            openings_count: 4,
            application_deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
            status: 'open',
            skills_required: [skills[7]._id]
        },
        {
            job_id: 'JOB1006',
            title: 'Mobile App Developer (React Native)',
            role: 'App Development',
            company_id: companies[4]._id,
            company_name: companies[4].name,
            company_logo: companies[4].logo,
            posted_by_admin_id: adminId1,
            description: 'Quantum Apps is seeking a React Native developer to build cross-platform mobile applications. You will work from concept to deployment, creating exceptional mobile experiences.',
            requirements: [
                '2+ years with React Native',
                'Solid JavaScript and TypeScript skills',
                'Experience publishing to App Store and Play Store',
                'Knowledge of REST API integration'
            ],
            responsibilities: [
                'Develop and maintain React Native mobile apps',
                'Integrate APIs and third-party SDKs',
                'Write automated tests for mobile apps',
                'Collaborate with designers on UX'
            ],
            salary_min: 700000,
            salary_max: 1300000,
            currency: 'INR',
            experience_required: 2,
            job_type: 'full-time',
            work_mode: 'remote',
            location_city: 'Mumbai',
            location_state: 'Maharashtra',
            country: 'India',
            openings_count: 2,
            application_deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
            status: 'open',
            skills_required: [skills[0]._id, skills[1]._id, skills[9]._id]
        },
        {
            job_id: 'JOB1007',
            title: 'QA Engineer',
            role: 'Quality Assurance',
            company_id: companies[0]._id,
            company_name: companies[0].name,
            company_logo: companies[0].logo,
            posted_by_admin_id: adminId2,
            description: 'We need a QA Engineer to ensure the quality of our software products through rigorous manual and automated testing. You will work closely with developers and product managers throughout the SDLC.',
            requirements: [
                '2+ years in software QA',
                'Experience with Selenium, Cypress, or Playwright',
                'Knowledge of API testing with Postman',
                'Strong attention to detail'
            ],
            responsibilities: [
                'Design and execute test plans and test cases',
                'Perform regression, integration, and performance testing',
                'Report and track bugs using Jira',
                'Collaborate with developers to resolve issues'
            ],
            salary_min: 500000,
            salary_max: 900000,
            currency: 'INR',
            experience_required: 2,
            job_type: 'full-time',
            work_mode: 'onsite',
            location_city: 'Bangalore',
            location_state: 'Karnataka',
            country: 'India',
            openings_count: 3,
            application_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: 'open',
            skills_required: [skills[5]._id]
        },
        {
            job_id: 'JOB1008',
            title: 'UI/UX Designer',
            role: 'UI/UX Design',
            company_id: companies[4]._id,
            company_name: companies[4].name,
            company_logo: companies[4].logo,
            posted_by_admin_id: adminId2,
            description: 'We are looking for a creative UI/UX Designer to create amazing user experiences. You will take complex problems and make them simple and beautiful for millions of users.',
            requirements: [
                '2+ years as a UI/UX Designer',
                'Proficiency with Figma or Adobe XD',
                'Strong portfolio showcasing product design',
                'Understanding of user research methodologies'
            ],
            responsibilities: [
                'Create wireframes, prototypes, and high-fidelity designs',
                'Conduct user research and usability testing',
                'Collaborate with engineers for pixel-perfect implementation',
                'Maintain and evolve the design system'
            ],
            salary_min: 600000,
            salary_max: 1200000,
            currency: 'INR',
            experience_required: 2,
            job_type: 'full-time',
            work_mode: 'hybrid',
            location_city: 'Mumbai',
            location_state: 'Maharashtra',
            country: 'India',
            openings_count: 1,
            application_deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
            status: 'open',
            skills_required: []
        }
    ];

    const createdJobs = await Job.insertMany(jobsData);
    console.log(`   Created ${createdJobs.length} jobs.\n`);

    // ─── Summary ─────────────────────────────────────────────────────────────
    console.log('═══════════════════════════════════════════════════════');
    console.log('🌱 DATABASE SEEDED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════════════════');
    console.log('\n📋 ADMIN LOGIN CREDENTIALS:');
    console.log('┌─────────────────────────────────────────────────────┐');
    adminsData.forEach(a => {
        console.log(`│  👤 ${a.name.padEnd(20)} 📧 ${a.email}`);
        console.log(`│     🔑 Password: ${a.password}`);
        console.log('│');
    });
    console.log('└─────────────────────────────────────────────────────┘');
    console.log('\n📋 USER LOGIN CREDENTIALS:');
    console.log('┌─────────────────────────────────────────────────────┐');
    usersData.forEach(u => {
        console.log(`│  👤 ${(u.first_name + ' ' + u.last_name).padEnd(20)} 📧 ${u.email}`);
        console.log(`│     🔑 Password: ${u.password}`);
        console.log('│');
    });
    console.log('└─────────────────────────────────────────────────────┘');
    console.log('\n✅ All done! Your site is ready to use.\n');

    await mongoose.disconnect();
    process.exit(0);
};

seed().catch(err => {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
});
