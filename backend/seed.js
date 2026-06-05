require('dotenv').config();
const { sequelize, User, Store, Rating, AuditLog } = require('./src/models');

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Create database if it does not exist
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || '3306',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'manager',
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'store_rating_platform'}\`;`);
    await connection.end();
    console.log('Database verification/creation checked for seeding.');
    
    // Sync and clear existing tables
    await sequelize.sync({ force: true });
    console.log('Database tables cleared and synchronized.');

    // 1. Create Admin (Name length must be >= 20 characters)
    const adminUser = await User.create({
      name: 'System Administrator Account',
      email: 'admin@platform.com',
      password: 'Password123!',
      address: '100 Security Boulevard, Suite 500, Admin City',
      role: 'ADMIN'
    });
    console.log('Seeded Admin user.');

    // 2. Create 5 Store Owners (Names >= 20 characters)
    const storeOwnersData = [
      { name: 'Store Owner Johnathan Doe', email: 'owner1@store.com', password: 'Password123!', address: '101 Commerce Way, Business District', role: 'STORE_OWNER' },
      { name: 'Store Owner Michael Smith', email: 'owner2@store.com', password: 'Password123!', address: '202 Retail Boulevard, Mall District', role: 'STORE_OWNER' },
      { name: 'Store Owner Elizabeth Jones', email: 'owner3@store.com', password: 'Password123!', address: '303 Market Street, Downtown Area', role: 'STORE_OWNER' },
      { name: 'Store Owner Christopher Lee', email: 'owner4@store.com', password: 'Password123!', address: '404 Industrial Avenue, Manufacturing District', role: 'STORE_OWNER' },
      { name: 'Store Owner Katherine Davis', email: 'owner5@store.com', password: 'Password123!', address: '505 Plaza Drive, Uptown District', role: 'STORE_OWNER' }
    ];
    
    const storeOwners = [];
    for (const ownerData of storeOwnersData) {
      const owner = await User.create(ownerData);
      storeOwners.push(owner);
    }
    console.log('Seeded 5 Store Owners.');

    // 3. Create 20 Users (Names >= 20 characters)
    const regularUsersData = [
      { name: 'Regular Customer John Miller', email: 'user1@consumer.com', password: 'Password123!', address: '12 Main St, Suburbia', role: 'USER' },
      { name: 'Regular Customer Emma Wilson', email: 'user2@consumer.com', password: 'Password123!', address: '34 Elm St, Suburbia', role: 'USER' },
      { name: 'Regular Customer David Thomas', email: 'user3@consumer.com', password: 'Password123!', address: '56 Pine Rd, City Center', role: 'USER' },
      { name: 'Regular Customer Olivia White', email: 'user4@consumer.com', password: 'Password123!', address: '78 Maple Lane, East Hills', role: 'USER' },
      { name: 'Regular Customer James Taylor', email: 'user5@consumer.com', password: 'Password123!', address: '90 Oak Avenue, West Park', role: 'USER' },
      { name: 'Regular Customer Sophia Moore', email: 'user6@consumer.com', password: 'Password123!', address: '11 Birch Court, South Side', role: 'USER' },
      { name: 'Regular Customer Robert Jackson', email: 'user7@consumer.com', password: 'Password123!', address: '22 Cedar Lane, North Heights', role: 'USER' },
      { name: 'Regular Customer Isabella Martin', email: 'user8@consumer.com', password: 'Password123!', address: '33 Walnut St, Lakeview', role: 'USER' },
      { name: 'Regular Customer William Garcia', email: 'user9@consumer.com', password: 'Password123!', address: '44 Chestnut Rd, Riverdale', role: 'USER' },
      { name: 'Regular Customer Mia Rodriguez', email: 'user10@consumer.com', password: 'Password123!', address: '55 Redwood Blvd, Seaside', role: 'USER' },
      { name: 'Regular Customer Richard Lewis', email: 'user11@consumer.com', password: 'Password123!', address: '66 Ash Plaza, Hillcrest', role: 'USER' },
      { name: 'Regular Customer Charlotte Lee', email: 'user12@consumer.com', password: 'Password123!', address: '77 Spruce Drive, Green Valley', role: 'USER' },
      { name: 'Regular Customer Joseph Walker', email: 'user13@consumer.com', password: 'Password123!', address: '88 Willow Lane, Pine Crest', role: 'USER' },
      { name: 'Regular Customer Amelia Hall', email: 'user14@consumer.com', password: 'Password123!', address: '99 Hickory Road, Oakridge', role: 'USER' },
      { name: 'Regular Customer Thomas Allen', email: 'user15@consumer.com', password: 'Password123!', address: '105 Alder Way, Maplewood', role: 'USER' },
      { name: 'Regular Customer Evelyn Young', email: 'user16@consumer.com', password: 'Password123!', address: '206 Cypress St, Westwood', role: 'USER' },
      { name: 'Regular Customer Charles King', email: 'user17@consumer.com', password: 'Password123!', address: '307 Poplar Ave, Eastgate', role: 'USER' },
      { name: 'Regular Customer Abigail Wright', email: 'user18@consumer.com', password: 'Password123!', address: '408 Sycamore Blvd, Northwood', role: 'USER' },
      { name: 'Regular Customer Daniel Lopez', email: 'user19@consumer.com', password: 'Password123!', address: '509 Magnolia Ct, Riverview', role: 'USER' },
      { name: 'Regular Customer Harper Hill', email: 'user20@consumer.com', password: 'Password123!', address: '610 Beechwood Rd, Stonecrest', role: 'USER' }
    ];

    const regularUsers = [];
    for (const userData of regularUsersData) {
      const user = await User.create(userData);
      regularUsers.push(user);
    }
    console.log('Seeded 20 Regular Users.');

    // 4. Create 20 Stores (distributed among the 5 store owners)
    const storesData = [
      { name: 'Aura Gourmet Organic Cafe', email: 'cafe@aura.com', address: '123 organic lane, food district', ownerId: storeOwners[0].id },
      { name: 'Apex Tech Computers Shop', email: 'tech@apex.com', address: '456 silicon boulevard, technology park', ownerId: storeOwners[0].id },
      { name: 'Velvet Bloom Flowers Boutique', email: 'flowers@velvet.com', address: '789 petal square, garden district', ownerId: storeOwners[0].id },
      { name: 'Pinnacle Fitness Gym Center', email: 'gym@pinnacle.com', address: '321 muscle avenue, active zone', ownerId: storeOwners[0].id },
      
      { name: 'Blue Ocean Seafood Grill', email: 'seafood@blueocean.com', address: '432 harbor quay, marine front', ownerId: storeOwners[1].id },
      { name: 'Urban Threads clothing Store', email: 'threads@urban.com', address: '543 fashion lane, boutique sector', ownerId: storeOwners[1].id },
      { name: 'Silver Screen Cinemas Multiplex', email: 'movies@silverscreen.com', address: '654 entertainment plaza, neon district', ownerId: storeOwners[1].id },
      { name: 'Golden Harvest Bakery Cafe', email: 'bakery@golden.com', address: '765 wheat crescent, baking square', ownerId: storeOwners[1].id },
      
      { name: 'Rustic Roast Craft Coffee', email: 'coffee@rusticroast.com', address: '876 bean boulevard, espresso corner', ownerId: storeOwners[2].id },
      { name: 'Modern Living Furniture Loft', email: 'design@modernliving.com', address: '987 home street, gallery plaza', ownerId: storeOwners[2].id },
      { name: 'Pet Paradise Care Center', email: 'pets@paradise.com', address: '109 paw crescent, animal district', ownerId: storeOwners[2].id },
      { name: 'Sizzling Wok Asian Bistro', email: 'bistro@wok.com', address: '210 spice road, culinary strip', ownerId: storeOwners[2].id },
      
      { name: 'Metro Hardware Tools Store', email: 'tools@metro.com', address: '312 build avenue, industrial complex', ownerId: storeOwners[3].id },
      { name: 'Green Leaf Vegan Kitchen', email: 'vegan@greenleaf.com', address: '423 sprout road, wellness corner', ownerId: storeOwners[3].id },
      { name: 'Radiant Skin Spa Center', email: 'spa@radiant.com', address: '534 peace boulevard, zen district', ownerId: storeOwners[3].id },
      { name: 'Total Sports Athletics Gear', email: 'sports@totalsports.com', address: '645 champion way, arena court', ownerId: storeOwners[3].id },
      
      { name: 'Vibrant Colors Art Supply', email: 'art@vibrant.com', address: '756 paint street, gallery row', ownerId: storeOwners[4].id },
      { name: 'Little Scholars Book Store', email: 'books@scholars.com', address: '867 knowledge circle, university sector', ownerId: storeOwners[4].id },
      { name: 'Sonic Wave Music Instrument', email: 'music@sonicwave.com', address: '978 melody lane, acoustics square', ownerId: storeOwners[4].id },
      { name: 'Prime Cuts Butchery Deli', email: 'meats@primecuts.com', address: '112 gourmet street, food court', ownerId: storeOwners[4].id }
    ];

    const stores = [];
    for (const storeData of storesData) {
      const store = await Store.create(storeData);
      stores.push(store);
    }
    console.log('Seeded 20 Stores.');

    // 5. Create Ratings (Each regular user rates 6 random stores with ratings 1-5)
    const sampleComments = [
      'Great experience overall. Staff was friendly and the service was quick.',
      'Good quality products but the waiting time could be improved.',
      'Excellent ambiance and very clean store. Will definitely visit again!',
      'Average experience. Nothing special but nothing terrible either.',
      'Outstanding customer service. They went above and beyond to help me.',
      'Prices are reasonable and the location is convenient.',
      'Loved the atmosphere here. Highly recommend to friends and family.',
      null,
      null
    ];

    let ratingCount = 0;
    for (const user of regularUsers) {
      // Shuffle stores and pick 6
      const shuffledStores = [...stores].sort(() => 0.5 - Math.random());
      const selectedStores = shuffledStores.slice(0, 6);

      for (const store of selectedStores) {
        const ratingVal = Math.floor(Math.random() * 5) + 1; // 1 to 5
        const comment = sampleComments[Math.floor(Math.random() * sampleComments.length)];
        await Rating.create({
          userId: user.id,
          storeId: store.id,
          rating: ratingVal,
          comment
        });
        ratingCount++;
      }
    }
    console.log(`Seeded ${ratingCount} store ratings.`);

    // 6. Create Audit Logs
    await AuditLog.create({ action: 'SYSTEM_BOOTSTRAP', performedBy: adminUser.id, targetId: '1', details: 'Database successfully seeded with standard test datasets' });
    
    // Seed some other audit logs to look realistic
    await AuditLog.create({ action: 'USER_CREATION', performedBy: adminUser.id, targetId: String(regularUsers[0].id), details: JSON.stringify({ name: regularUsers[0].name, email: regularUsers[0].email, role: 'USER' }) });
    await AuditLog.create({ action: 'STORE_CREATION', performedBy: adminUser.id, targetId: String(stores[0].id), details: JSON.stringify({ name: stores[0].name, email: stores[0].email }) });

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
