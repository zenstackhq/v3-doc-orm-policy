import { ClientContract } from "@zenstackhq/runtime";
import { SchemaType } from "./zenstack/schema";

export function createPosts(db: ClientContract<SchemaType>) {
  return db.post.createMany({
    data: [ 
      { id: 1, title: 'Post1', slug: 'post1', content: 'First post' },
      { id: 2, title: 'Post2', slug: 'post2', published: true, viewCount: 1 },
  ]})
}

export async function createUsersAndPosts(db: ClientContract<SchemaType>) {
    // user1 with 1 post
    await db.user.create({
        data: {
            id: 1,
            email: 'u1@test.com',
            posts: {
                create: [
                    { id: 1, title: 'Post1', content: 'First post', slug: 'post1' },
                ]
            }
        }
    });

    // user2 with two posts
    await db.user.create({
        data: {
            id: 2,
            email: 'u2@test.com',
            posts: {
                create: [
                    { id: 2, title: 'Post2', slug: 'post2', viewCount: 2 },
                    { id: 3, title: 'Post3', slug: 'post3', published: true, viewCount: 1 },
                ]
            }
        }
    });

    // a post not owned by any user
    await db.post.create({ data: { id: 4, title: 'Post4', slug: 'post4', viewCount: 3 }});
}
