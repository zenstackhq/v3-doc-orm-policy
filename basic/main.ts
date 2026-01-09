import { PolicyPlugin } from '@zenstackhq/plugin-policy';
import { createClient } from '../db';
import { schema } from './zenstack/schema';

async function main() {
  const db = await createClient(schema);

  // create users and posts with raw client
  const alice = await db.user.create({
    data: {
      email: 'alice@example.com',
      posts: {
        create: [
          { title: 'Alice Draft Post', published: false },
          { title: 'Alice Published Post', published: true }
        ]
      }
    }
  });

  const bob = await db.user.create({
    data: {
      email: 'bob@example.com',
      posts: {
        create: [{ title: 'Bob Draft Post', published: false }]
      }
    }
  });

  // install policy plugin
  const authDb = db.$use(new PolicyPlugin());

  // create user-bound clients
  const aliceDb = authDb.$setAuth(alice);
  const bobDb = authDb.$setAuth(bob);

  // query posts as Alice
  console.log('Alice sees posts:');
  console.table(
    await aliceDb.post.findMany({
      select: { title: true, published: true }
    })
  );

  // query posts as Bob
  console.log('Bob sees posts:');
  console.table(
    await bobDb.post.findMany({
      select: { title: true, published: true }
    })
  );
}

main();
