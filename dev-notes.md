#### About Databases, repositories and ORM's

1. TypeORM and SQLite will be configured in dev, and then for production will be PostgreSQL
2. Install @nestjs/typeorm typeorm sqlite3
3. Set up the DB connection, will be shared with all modules.
   in app.module, imports
   `TypeOrmModule.forRoot({ type: 'sqlite', database: 'db.sqlite', entities: [], synchronize: true, }),`
4. Entity defines a single kind of resoure( equivalent to models), create them and the feed them to nest.
5. 4. creates a repository for us, we don't have to create them manually.

##### Creating an Entity

1. Create entity file with a class that lists all the entity properties
2. Connect entity to the parent module, this creates a repository.
   `imports: [TypeOrmModule.forFeature([User])]`,
3. Connect the entity to the root connection. By adding the entity to the entities property array

##### To see the contents of the sqlite db

1. Install SQLite extension and install
2. In the vscode command pallete search for sqlite / open db, the sqlite explorer will appear in the left panel

##### TypeOrm Details

1. synchronize option generates migrations, and is used only in development envs.
2. The @Entity decorator instructs the table generation
3. All typeOrm decorators translates to sql scripts.
