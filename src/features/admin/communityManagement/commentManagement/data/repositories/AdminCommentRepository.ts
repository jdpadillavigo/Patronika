import type { User } from '../../../../../../core/domain/models/User';
import UserRepository from '../../../../../../core/data/user/repositories/UserRepository';
import CommentRemoteDataSource, { type Comment } from '../../../../../post/data/networking/CommentRemoteDataSource';
import PublicationRemoteDataSource, { type Publication } from '../../../../../post/data/networking/PublicationRemoteDataSource';

export interface AdminCommentItem extends Comment {
    user?: User | null;
    publication?: Publication | null;
}

function mergeCommentsWithContext(
    comments: Comment[],
    publications: Publication[],
    users: User[],
): AdminCommentItem[] {
    const publicationsById = new Map(publications.map(publication => [publication.id, publication]));
    const usersById = new Map(users.map(user => [user.id, user]));

    return comments.map(comment => ({
        ...comment,
        publication: publicationsById.get(comment.publicationId) || null,
        user: usersById.get(comment.userId) || null,
    }));
}

async function loadComments(publications?: Publication[]): Promise<AdminCommentItem[]> {
    const [comments, resolvedPublications, users] = await Promise.all([
        CommentRemoteDataSource.loadAll(),
        publications ? Promise.resolve(publications) : PublicationRemoteDataSource.loadAll(),
        UserRepository.getAllUsers(),
    ]);

    return mergeCommentsWithContext(comments, resolvedPublications, users);
}

async function deleteComment(commentId: string): Promise<void> {
    await CommentRemoteDataSource.remove(commentId);
}

async function clearCommentReports(commentId: string): Promise<Comment | null> {
    return CommentRemoteDataSource.clearReports(commentId);
}

const AdminCommentRepository = {
    loadComments,
    deleteComment,
    clearCommentReports,
};

export default AdminCommentRepository;
