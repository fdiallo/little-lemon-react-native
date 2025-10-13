import * as SQLite from 'expo-sqlite';

let db;
//let db = SQLite.openDatabaseAsync('little_lemon');

export async function initializeDB() {
    if (!db) {
        try {
            db = await SQLite.openDatabaseAsync('little_lemon_db');
            //console.log('Database initialized successfully!', db);
        } catch (e) {
            console.log('Error initializing database', e.message);
        }
    }
}

export async function createTable() {
    await db.withTransactionAsync(async () => {
        await db.execAsync(`
        CREATE TABLE IF NOT EXISTS menuitems (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          price TEXT,
          description TEXT,
          image TEXT,
          category TEXT
        );
      `);
       // console.log('Table "menuitems" created or already exists');
    });
}

export async function getMenuItems() {
    // Query data from the table
    const allUsers = await db.getAllAsync('SELECT * FROM menuitems;');

    //const allUsers = db.getAllAsync('SELECT * FROM menuitems;');
    //console.log('All users2:', allUsers);
    return allUsers;

}

export async function saveMenuItems(menuItems) {
    ////db.transaction((tx) => {
    // 2. Implement a single SQL statement to save all menu data in a table called menuitems.
    // Check the createTable() function above to see all the different columns the table has
    // Hint: You need a SQL statement to insert multiple rows at once.
    //// });
    ////console.log('Saving data into database....');
   // const values = menuItems
        //.map((row) => `('${row.name}', '${row.price}',  '${row.description}', '${row.category}')`)
        //.join(',');
    //const sql = `INSERT INTO menuitems (title, price, description, category) VALUES ${values};`;

    //try {
        //console.log('Inserting data into database....');
         ////(await db).prepareAsync(async () => {
        //await db.withTransactionAsync(async () => {
            //await db.runAsync(sql);
       // });
        //console.log('All data successfully inserted! ');
    //} catch (error) {
        //console.log('Error inserting multiple rows', error);
    //}

    try {
    await db.withTransactionAsync(async () => {
     for (const rowData of menuItems) {
       await db.runAsync(
       'INSERT INTO menuitems (name, price, description, image, category) VALUES (?, ?, ?, ?, ?);',
          [rowData.name, rowData.price, rowData.description, rowData.image, rowData.category]
      );
      }
     });
    console.log('Data successfully inserted!');
    } catch (error) {
     console.log('Error inserting multiple rows', error);
    }
}

/**
 * 4. Implement a transaction that executes a SQL statement to filter the menu by 2 criteria:
 * a query string and a list of categories.
 *
 * The query string should be matched against the menu item titles to see if it's a substring.
 * For example, if there are 4 items in the database with titles: 'pizza, 'pasta', 'french fries' and 'salad'
 * the query 'a' should return 'pizza' 'pasta' and 'salad', but not 'french fries'
 * since the latter does not contain any 'a' substring anywhere in the sequence of characters.
 *
 * The activeCategories parameter represents an array of selected 'categories' from the filter component
 * All results should belong to an active category to be retrieved.
 * For instance, if 'pizza' and 'pasta' belong to the 'Main Dishes' category and 'french fries' and 'salad' to the 'Sides' category,
 * a value of ['Main Dishes'] for active categories should return  only'pizza' and 'pasta'
 *
 * Finally, the SQL statement must support filtering by both criteria at the same time.
 * That means if the query is 'a' and the active category 'Main Dishes', the SQL statement should return only 'pizza' and 'pasta'
 * 'french fries' is excluded because it's part of a different category and 'salad' is excluded due to the same reason,
 * even though the query 'a' it's a substring of 'salad', so the combination of the two filters should be linked with the AND keyword
 *
 */

export async function filterByQueryAndCategories(query, activeCategories) {
  //return new Promise((resolve, reject) => {
  //resolve(SECTION_LIST_MOCK_DATA);
  //});
    const placeholders = Array(activeCategories.length).fill('?').join(',');
    const sql = `SELECT * FROM menuitems WHERE name LIKE '%${query}%' AND category IN (${placeholders})`;
    const filteredMenuItems = await db.getAllAsync(sql, activeCategories);
    console.log('Filtered Menu Items: ', filteredMenuItems);
  return filteredMenuItems;
}
