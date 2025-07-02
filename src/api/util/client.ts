import { LoginRequestSchema } from '@/auth/schemas/login-request';
import { LoginResponseSchema } from '@/auth/schemas/login-response';
import { RegisterRequestSchema } from '@/auth/schemas/register-request';
import { CommentSchema } from '@/comment/schemas/comment';
import { CreateCommentSchema } from '@/comment/schemas/create-comment';
import { CreateDegreeSchema } from '@/degree/schemas/create-degree';
import { DegreeSchema } from '@/degree/schemas/degree';
import { DegreeWithStatsSchema } from '@/degree/schemas/degree-with-stats';
import { UpdateDegreeSchema } from '@/degree/schemas/update-degree';
import { PostPageSchema, PostSchema } from '@/post/schemas/post';
import { UpdatePostSchema } from '@/post/schemas/update-post';
import { CreateUniversitySchema } from '@/university/schemas/create-university';
import { UniversitySchema } from '@/university/schemas/university';
import { UniversityWithStatsSchema } from '@/university/schemas/university-with-stats';
import { UpdateUniversitySchema } from '@/university/schemas/update-university';
import { RoleSchema } from '@/user/schemas/role';
import { UpdatePasswordSchema } from '@/user/schemas/update-password';
import { UpdateUserSchema } from '@/user/schemas/update-user';
import { UserSchema } from '@/user/schemas/user';
import { makeApi, ZodiosInstance } from '@zodios/core';
import { z } from 'zod';
import { DetailResponseSchema } from '../schemas/detail-response';

export type Api = typeof api;
export type ApiClient = ZodiosInstance<Api>;

export const api = makeApi([
  {
    alias: 'register',
    method: 'post',
    path: '/auth/register',
    parameters: [{ name: 'body', type: 'Body', schema: RegisterRequestSchema }],
    response: LoginResponseSchema,
    errors: [{ status: 409, schema: DetailResponseSchema }],
  },
  {
    alias: 'login',
    method: 'post',
    path: '/auth/login',
    parameters: [{ name: 'body', type: 'Body', schema: LoginRequestSchema }],
    response: LoginResponseSchema,
    errors: [{ status: 401, schema: DetailResponseSchema }],
  },
  {
    alias: 'resendVerificationEmail',
    method: 'post',
    path: '/auth/verify-resend',
    response: z.void(),
    errors: [{ status: 429, schema: DetailResponseSchema }],
  },
  {
    alias: 'verify',
    method: 'post',
    path: '/auth/verify',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: z.object({ verificationId: z.string() }),
      },
    ],
    response: UserSchema,
  },
  {
    alias: 'getSelf',
    method: 'get',
    path: '/users/@self',
    response: UserSchema,
  },
  {
    alias: 'updateSelf',
    method: 'put',
    path: '/users/@self',
    parameters: [{ type: 'Body', name: 'body', schema: UpdateUserSchema }],
    response: UserSchema,
  },
  {
    alias: 'updateSelfPicture',
    method: 'patch',
    path: '/users/@self/picture',
    requestFormat: 'form-data',
    parameters: [
      {
        type: 'Body',
        name: 'body',
        schema: z.object({ picture: z.instanceof(File) }),
      },
    ],
    response: UserSchema,
  },
  {
    alias: 'deleteSelfPicture',
    method: 'delete',
    path: '/users/@self/picture',
    response: z.void(),
  },
  {
    alias: 'updateSelfPassword',
    method: 'patch',
    path: '/users/@self/password',
    parameters: [{ type: 'Body', name: 'body', schema: UpdatePasswordSchema }],
    errors: [{ status: 401, schema: DetailResponseSchema }],
    response: z.void(),
  },
  {
    alias: 'deleteSelf',
    method: 'delete',
    path: '/users/@self',
    response: z.void(),
  },
  {
    alias: 'getUserById',
    method: 'get',
    path: '/users/:id',
    errors: [
      { status: 404, schema: DetailResponseSchema },
      { status: 400, schema: DetailResponseSchema },
    ],
    response: UserSchema,
  },
  {
    alias: 'getUserByUsername',
    method: 'get',
    path: '/users/username/:username',
    errors: [{ status: 404, schema: DetailResponseSchema }],
    response: UserSchema,
  },
  {
    alias: 'updateUserRole',
    method: 'patch',
    path: '/users/:id/role',
    parameters: [
      { type: 'Body', name: 'body', schema: z.object({ role: RoleSchema }) },
    ],
    response: UserSchema,
  },
  {
    alias: 'deleteUser',
    method: 'delete',
    path: '/users/:id',
    response: z.void(),
  },
  {
    alias: 'getPosts',
    method: 'get',
    path: '/posts',
    parameters: [
      { name: 'query', type: 'Query', schema: z.string().optional() },
      { name: 'authorId', type: 'Query', schema: z.string().optional() },
      { name: 'universityId', type: 'Query', schema: z.string().optional() },
      { name: 'degreeId', type: 'Query', schema: z.string().optional() },
      { name: 'tags', type: 'Query', schema: z.string().array().optional() },
      { name: 'page', type: 'Query', schema: z.number().optional() },
      { name: 'size', type: 'Query', schema: z.number().optional() },
    ],
    response: PostPageSchema,
  },
  {
    alias: 'getPost',
    method: 'get',
    path: '/posts/:id',
    response: PostSchema,
    errors: [
      { status: 404, schema: DetailResponseSchema },
      { status: 400, schema: DetailResponseSchema },
    ],
  },
  {
    alias: 'createPost',
    method: 'post',
    path: '/posts',
    parameters: [
      { type: 'Body', name: 'body', schema: z.instanceof(FormData) },
    ],
    response: PostSchema,
    errors: [{ status: 403, schema: DetailResponseSchema }],
  },
  {
    alias: 'updatePost',
    method: 'put',
    path: '/posts/:id',
    parameters: [{ type: 'Body', name: 'body', schema: UpdatePostSchema }],
    response: PostSchema,
  },
  {
    alias: 'getPostComments',
    method: 'get',
    path: '/posts/:id/comments',
    response: CommentSchema.array(),
  },
  {
    alias: 'createPostComment',
    method: 'post',
    path: '/posts/:id/comments',
    parameters: [{ type: 'Body', name: 'body', schema: CreateCommentSchema }],
    response: CommentSchema,
    errors: [{ status: 403, schema: DetailResponseSchema }],
  },
  {
    alias: 'createPostCommentReply',
    method: 'post',
    path: '/posts/:id/comments/:parentId/replies',
    parameters: [{ type: 'Body', name: 'body', schema: CreateCommentSchema }],
    response: CommentSchema,
    errors: [{ status: 403, schema: DetailResponseSchema }],
  },
  {
    alias: 'deletePostComment',
    method: 'delete',
    path: '/posts/:id/comments/:commentId',
    response: z.void(),
  },
  {
    alias: 'upvotePost',
    method: 'put',
    path: '/posts/:id/upvotes',
    response: z.void(),
  },
  {
    alias: 'downvotePost',
    method: 'put',
    path: '/posts/:id/downvotes',
    response: z.void(),
  },
  {
    alias: 'removePostVote',
    method: 'delete',
    path: '/posts/:id/votes',
    response: z.void(),
  },
  {
    alias: 'deletePost',
    method: 'delete',
    path: '/posts/:id',
    response: z.void(),
  },
  {
    alias: 'getUniversities',
    method: 'get',
    path: '/universities',
    response: UniversitySchema.array(),
  },
  {
    alias: 'getUniversityById',
    method: 'get',
    path: '/universities/:id',
    response: UniversitySchema,
    errors: [
      { status: 404, schema: DetailResponseSchema },
      { status: 400, schema: DetailResponseSchema },
    ],
  },
  {
    alias: 'getUniversityWithStatsById',
    method: 'get',
    path: '/universities/with-stats/:id',
    response: UniversityWithStatsSchema,
    errors: [
      { status: 404, schema: DetailResponseSchema },
      { status: 400, schema: DetailResponseSchema },
    ],
  },
  {
    alias: 'getUniversityByEmailDomain',
    method: 'get',
    path: '/universities/domain/:emailDomain',
    response: UniversitySchema,
    errors: [{ status: 404, schema: DetailResponseSchema }],
  },
  {
    alias: 'createUniversity',
    method: 'post',
    path: '/universities',
    parameters: [
      { type: 'Body', name: 'body', schema: CreateUniversitySchema },
    ],
    response: UniversitySchema,
  },
  {
    alias: 'updateUniversity',
    method: 'put',
    path: '/universities/:id',
    parameters: [
      { type: 'Body', name: 'body', schema: UpdateUniversitySchema },
    ],
    response: UniversitySchema,
  },
  {
    alias: 'removeUniversity',
    method: 'delete',
    path: '/universities/:id',
    response: z.void(),
  },
  {
    alias: 'getDegrees',
    method: 'get',
    path: '/degrees',
    parameters: [
      {
        name: 'universityId',
        type: 'Query',
        schema: z.string().optional(),
      },
    ],
    response: DegreeSchema.array(),
  },
  {
    alias: 'getDegreeById',
    method: 'get',
    path: '/degrees/:id',
    response: DegreeWithStatsSchema,
    errors: [
      { status: 404, schema: DetailResponseSchema },
      { status: 400, schema: DetailResponseSchema },
    ],
  },
  {
    alias: 'createDegree',
    method: 'post',
    path: '/degrees',
    parameters: [{ type: 'Body', name: 'body', schema: CreateDegreeSchema }],
    response: DegreeSchema,
  },
  {
    alias: 'updateDegree',
    method: 'put',
    path: '/degrees/:id',
    parameters: [{ type: 'Body', name: 'body', schema: UpdateDegreeSchema }],
    response: DegreeSchema,
  },
  {
    alias: 'removeDegree',
    method: 'delete',
    path: '/degrees/:id',
    response: z.void(),
  },
]);
