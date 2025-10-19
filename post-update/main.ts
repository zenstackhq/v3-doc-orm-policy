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
                    { id: 1, title: 'Alice Draft Post', published: false },
                    { id: 2, title: 'Alice Published Post', published: true },
                ],
            },
        },
    });

    const bob = await db.user.create({
        data: {
            email: 'bob@example.com',
        },
    });

    // install policy plugin
    const authDb = db.$use(new PolicyPlugin());

    // create user-bound clients
    const bobDb = authDb.$setAuth(bob);

    // update Alice's post as Bob (should fail)
    try {
        await bobDb.post.update({
            where: { id: 1 },
            data: { published: true },
        });
    } catch (e) {
        console.error(`Got expected post-update error: ${e}`);
    }

    // change authorId (should fail)
    try {
        await bobDb.post.update({
            where: { id: 1 },
            data: { authorId: bob.id },
        });
    } catch (e) {
        console.error(`Got expected post-update error: ${e}`);
    }
}

main();
