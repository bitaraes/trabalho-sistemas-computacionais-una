import { PostComment, PostRating, RatingValues } from '@/domain/models';

export function mapComment(dbComment): PostComment {
  return {
    id: dbComment.id,
    text: dbComment.text,
    author: {
      id: dbComment.author_id,
      email: dbComment.author_email,
      name: dbComment.author_name,
    },
    createdAt: dbComment.created_at,
  };
}

export function mapRating(dbRating): PostRating {
  return {
    value: Number(dbRating.rating) as RatingValues,
    author: {
      id: dbRating.author_id,
      email: dbRating.author_email,
      name: dbRating.author_name,
    },
  };
}
