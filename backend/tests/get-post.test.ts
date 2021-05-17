import supertest from 'supertest';

import { signIn } from './utils/auth';

import app from '@/main/app';
import { PostBuilder } from '@/tests/builders';
import { PostRepository, UserRepository } from '@/tests/repositories';

const postRepository = new PostRepository();
const userRepository = new UserRepository();

describe('GetPost', () => {
  beforeEach(async () => {
    await postRepository.deleteAll();
    await userRepository.deleteAll();
    expect(await postRepository.count()).toBe(0);
    expect(await userRepository.count()).toBe(0);
  });

  test('should return 401 when try acesss route without authorization', async () => {
    const response = await supertest(app).get('/posts/1').send();

    expect(response.status).toBe(401);
  });

  test('should get a post by id', async () => {
    const { author, ...post } = new PostBuilder().build();

    const createdAuthor = await userRepository.create(author);
    const createdPost = await postRepository.create({
      ...post,
      authorId: createdAuthor.id,
    });

    const { authorization } = await signIn(app);
    const response = await supertest(app)
      .get(`/posts/${createdPost.id}`)
      .set('authorization', authorization)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdPost.id);
    expect(response.body.title).toBe(createdPost.title);
    expect(response.body.description).toBe(createdPost.description);
    expect(response.body.image).toBe(createdPost.image);
    expect(response.body.body).toBe(createdPost.body);
  });

  test('should return 400 when try get a post with invalid id', async () => {
    const { authorization } = await signIn(app);
    const response = await supertest(app)
      .get(`/posts/1`)
      .set('authorization', authorization)
      .send();

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('invalid post');
  });
});
