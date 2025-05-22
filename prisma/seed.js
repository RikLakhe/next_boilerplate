import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const rawSql = `
      -- Inserting data into the 'area' table (as in departments/domains)
      INSERT INTO area (name, description) VALUES
      ('Design', 'Focuses on user interface and user experience design.'),
      ('Quality Assurance', 'Responsible for testing and ensuring software quality.'),
      ('Development', 'Involved in writing and maintaining the software code.'),
      ('Project Management', 'Oversees and coordinates project activities.');

      -- Inserting data into the 'designation' table (as in levels within a role)
      INSERT INTO designation (title, description) VALUES
      ('Associate', 'Entry-level professional.'),
      ('Junior', 'Professional with some experience.'),
      ('Mid-Level', 'Experienced professional with moderate expertise.'),
      ('Senior', 'Highly experienced professional with significant expertise.');

      -- Inserting data into the 'employment_status' table
      INSERT INTO employment_status (status_name, description) VALUES
      ('Hired', 'Newly recruited employee.'),
      ('Probation', 'Employee undergoing a trial period.'),
      ('Permanent', 'Employee with a stable, ongoing position.'),
      ('Terminated', 'Employment has been ended.');

      -- Inserting data into the 'team' table (as in project names)
      INSERT INTO team (name, description) VALUES
      ('Project Chimera', 'A strategic, long-term initiative.'),
      ('Project Phoenix', 'Focused on revitalizing existing systems.'),
      ('Project Starlight', 'An innovative, forward-looking project.'),
      ('Project Nebula', 'A complex, multi-faceted undertaking.');

      -- Inserting data into the 'users' table (with updated area and designation IDs)
      INSERT INTO users (full_name, email, password_hash, manager_id, current_area_id, current_designation_id, current_employment_status_id) VALUES
      ('Admin Shrestha', 'admin@yopmail.com', '$2b$10$zabvb6qx1oSsC4Bmfa6Jb.LFpEXnL5SvCS1g6G0sR7e8IaTTItrVm', NULL, 4, 4, 3);

      -- Inserting data into the 'user_state_history' table (adjusting area, designation, employment status IDs)
      INSERT INTO user_state_history (user_id, area_id, designation_id, employment_status_id, start_date, end_date) VALUES
      (1, 4, 4, 3, '2020-01-01', NULL);

      -- Inserting data into the 'team_allocation' table (using the new team names)
      INSERT INTO team_allocation (user_id, team_id, role_in_team, start_date, end_date, allocation_percentage) VALUES
      (1, 2, 'Project Manager', '2024-03-01', '2025-03-01', 75.00); -- Project Phoenix

      -- Insert master_data
      INSERT INTO master_data (entity_type, code, label, color)
      VALUES ('timezone', 'Pacific/Midway', '(GMT-11:00) Midway Island, Samoa', null),
             ('timezone', 'America/Adak', '(GMT-10:00) Hawaii-Aleutian', null),
             ('timezone', 'Etc/GMT+10', '(GMT-10:00) Hawaii', null),
             ('timezone', 'Pacific/Marquesas', '(GMT-09:30) Marquesas Islands', null),
             ('timezone', 'Pacific/Gambier', '(GMT-09:00) Gambier Islands', null),
             ('timezone', 'America/Anchorage', '(GMT-09:00) Alaska', null),
             ('timezone', 'America/Los_Angeles', '(GMT-08:00) Pacific Time (US & Canada)', null),
             ('timezone', 'America/Denver', '(GMT-07:00) Mountain Time (US & Canada)', null),
             ('timezone', 'America/Chicago', '(GMT-06:00) Central Time (US & Canada)', null),
             ('timezone', 'America/New_York', '(GMT-05:00) Eastern Time (US & Canada)', null),
             ('timezone', 'America/Caracas', '(GMT-04:30) Caracas', null),
             ('timezone', 'America/Halifax', '(GMT-04:00) Atlantic Time (Canada)', null),
             ('timezone', 'America/St_Johns', '(GMT-03:30) Newfoundland', null),
             ('timezone', 'America/Argentina/Buenos_Aires', '(GMT-03:00) Buenos Aires', null),
             ('timezone', 'Atlantic/South_Georgia', '(GMT-02:00) Mid-Atlantic', null),
             ('timezone', 'Atlantic/Azores', '(GMT-01:00) Azores', null),
             ('timezone', 'Europe/London', '(GMT+00:00) London, Lisbon, Casablanca', null),
             ('timezone', 'Europe/Berlin', '(GMT+01:00) Berlin, Rome, Paris, Madrid', null),
             ('timezone', 'Europe/Athens', '(GMT+02:00) Athens, Bucharest, Istanbul', null),
             ('timezone', 'Europe/Moscow', '(GMT+03:00) Moscow, St. Petersburg', null),
             ('timezone', 'Asia/Tehran', '(GMT+03:30) Tehran', null),
             ('timezone', 'Asia/Dubai', '(GMT+04:00) Abu Dhabi, Muscat', null),
             ('timezone', 'Asia/Kabul', '(GMT+04:30) Kabul', null),
             ('timezone', 'Asia/Karachi', '(GMT+05:00) Islamabad, Karachi', null),
             ('timezone', 'Asia/Kolkata', '(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi', null),
             ('timezone', 'Asia/Kathmandu', '(GMT+05:45) Kathmandu', null),
             ('timezone', 'Asia/Dhaka', '(GMT+06:00) Astana, Dhaka', null),
             ('timezone', 'Asia/Bangkok', '(GMT+07:00) Bangkok, Hanoi, Jakarta', null),
             ('timezone', 'Asia/Shanghai', '(GMT+08:00) Beijing, Perth, Singapore, Hong Kong', null),
             ('timezone', 'Asia/Tokyo', '(GMT+09:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk', null),
             ('timezone', 'Australia/Adelaide', '(GMT+09:30) Adelaide, Darwin', null),
             ('timezone', 'Australia/Sydney', '(GMT+10:00) Sydney, Melbourne, Brisbane', null),
             ('timezone', 'Pacific/Noumea', '(GMT+11:00) Magadan, Solomon Islands, New Caledonia', null),
             ('timezone', 'Pacific/Auckland', '(GMT+12:00) Auckland, Wellington, Fiji, Kamchatka', null),
             ('values_category', 'leadership', 'Leadership', null),
             ('values_category', 'integrity', 'Integrity', null),
             ('values_category', 'innovation', 'Innovation', null),
             ('values_category', 'teamwork', 'Teamwork', null),
             ('values_category', 'excellence', 'Excellence', null),
             ('values_category', 'respect', 'Respect', null),
             ('values_category', 'accountability', 'Accountability', null),
             ('values_category', 'customer-focus', 'Customer Focus', null),
             ('holiday', 'public', 'Public Holiday', '#FF00FF'),
             ('holiday', 'religious', 'Religious Holiday', '#6600FF'),
             ('holiday', 'national', 'National Holiday', '#00FFFF'),
             ('holiday', 'bank', 'Bank Holiday', '#FFFF00'),
             ('holiday', 'company', 'Company Holiday', '#00FF00'),
             ('notice', 'annual_report', 'Annual Report', '#007BFF'),
             ('notice', 'policy_update', 'Policy Update', '#28A745'),
             ('notice', 'office_closure', 'Office Closure', '#DC3545'),
             ('notice', 'new_hire', 'New Hire Announcement', '#17A2B8'),
             ('notice', 'meeting', 'Company Meeting', '#FFC107'),
             ('urgency', 'high', 'High', '#FF0000'),
             ('urgency', 'medium', 'Medium', '#FFA500'),
             ('urgency', 'low', 'Low', '#008000'),
             ('event', 'company_anniversary', 'Company Anniversary', '#C71585'),
             ('event', 'holiday_party', 'Holiday Party', '#006400'),
             ('event', 'team_building', 'Team Building Event', '#4169E1'),
             ('event', 'product_launch', 'Product Launch', '#FF4500'),
             ('event', 'agm', 'Annual General Meeting', '#8B4513');
    `;

    // Split the raw SQL into individual statements
    const statements = rawSql.split(";");

    // Execute each statement
    for (const statement of statements) {
      const trimmedStatement = statement.trim();
      if (trimmedStatement) {
        await prisma.$executeRawUnsafe(trimmedStatement);
      }
    }

    console.log("Seeding completed successfully using raw SQL!");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
