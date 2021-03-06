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

##### SQLite DB - see the contents

1. Install SQLite extension and install
2. In the vscode command pallete search for SQLite: Open Database, the sqlite explorer will appear in the left panel

##### TypeOrm Details

1. synchronize option generates migrations, and is used only in development envs.
2. The @Entity decorator instructs the table generation
3. All typeOrm decorators translates to sql scripts.
4. There are various ways of implementing typeOrm

##### Repository API

- has create(), save(), find(), findOne(), remove() out of the box.

###### save() vs. create()

- save() persists a record in DB, executes hooks if defined, also updates, depending on the use case.
- create() makes a new instance of an entity, but does not save in DB, also no hooks are executed

###### insert() and update()

- Meant to be used with plain objects, no hooks are executed

- find returns an array with all the records matching the query criteria, or empty array
- findOne returns one record matching the query criteria (usually a pk), or null

###### delete() vs. remove()

- remove uses entities, delete uses plain objects

##### Controllers and request body validations

1. To validate a req body, and so, we need to create a dto
2. Set validations to the dto with the help of class-validators library npm i class-validator class-transformer
3. Update the main.ts to use the globalValidationPipe with a conf object and property whitelist:true
4. whitelist: true incoming request preventing from passing with extraneous properties in the body, the extra properties will be stripped out from the body

##### Services and DI with repositories

1. Import Repository from typeorm , InjectRepository from @nestjs/typeorm, and the Entity.
2. In the class constructor inject a private property that is a repository with the generic class of the Entity, Preceed the injection with the decorator @InjectRepository <br />
   <code>
   @Injectable() export class UsersService { constructor(@InjectRepository(User) private \_repo: Repository<User>) {} }}
   </code>

##### Excluding response properties

1. Turn the instance of a class into a plain object in the entity definition
2. Turn the instance into a plain object based on some rules using a Serializer Interceptor in the controller.
3. 1 and 2 are the recommended steps by nestjs. But there is a downside (4).
4. If there is a use case where the full user information is needed (admins), we have to figure out a different solution: create a custom interceptor using a dto that describes how to serialize this entity.

##### Interceptors

1. Act on incoming requests or outgoing responses
2. It is applied to individual route handlers, a controller class or globally
3. Create a class and the only requirement is that it implements the intercept method with the parameters context and next. The first is the information on the incoming request and the second is kind of a reference to the request handler of interest.
4. Add the serialize logic with a DTO (UserDto in this project)

##### Cookies flavors

- Use library cookie-session that runs the logic:
  - Looks at the 'Cookie' header
  - Decodes the string, resulting in an object
- We get access to session object in a request handler using a decorator
- Add/Remove/Change the properties on the session object
- Use library cookie-session that runs the logic:

  - Sees the updated session and turns it into an encrypted string
  - String sent back in the 'Set-cookie' header on the response object

- The cookie-session library must be wired up globally in the app
- Cookie session library does not work well with some tsconfig settings, the import that worked for this project is `//eslint-disable-next-line @typescript-eslint/no-var-requires const cookieSession = require('cookie-session');`

- The session is modifyed in the route handler function, and that function receives a parameter decorated with @Session()
- The Cookie header is added in the response header only when a change in session is detected. That is why, we must access to the user's session property each time a protected route is receiving requests

#### Guards / Interceptors / Decorators

- Because of the need to indentify or authorize a user to access some routes, the process can be authomated using guards, or Interceptors+Decorators

- Guards: Rejects the access to the route if some condition is not met

- To tell which user is accessing, an Interceptor checks the incoming request and a Decorator massages the header / header properties
