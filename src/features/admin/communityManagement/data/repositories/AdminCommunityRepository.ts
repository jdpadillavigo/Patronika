import type { User } from '../../../../../core/domain/models/User';
import UserRepository from '../../../../user/data/repositories/UserRepository';
import CommentRemoteDataSource, { type Comment } from '../../../../post/data/networking/CommentRemoteDataSource';
import PublicationRemoteDataSource, { type Publication } from '../../../../post/data/networking/PublicationRemoteDataSource';

export interface AdminCommentItem extends Comment {
    user?: User | null;
    publication?: Publication | null;
}

async function loadPublications(): Promise<Publication[]> {
    return PublicationRemoteDataSource.loadAll();
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

async function loadComments(): Promise<AdminCommentItem[]> {
    const [comments, publications, users] = await Promise.all([
        CommentRemoteDataSource.loadAll(),
        PublicationRemoteDataSource.loadAll(),
        UserRepository.getAllUsers(),
    ]);

    return mergeCommentsWithContext(comments, publications, users);
}

async function loadDashboard(): Promise<{ comments: AdminCommentItem[]; publications: Publication[] }> {
    const [comments, publications, users] = await Promise.all([
        CommentRemoteDataSource.loadAll(),
        PublicationRemoteDataSource.loadAll(),
        UserRepository.getAllUsers(),
    ]);

    return {
        comments: mergeCommentsWithContext(comments, publications, users),
        publications,
    };
}

async function deleteComment(commentId: string): Promise<void> {
    await CommentRemoteDataSource.remove(commentId);
}

async function deletePublication(publicationId: string): Promise<void> {
    await PublicationRemoteDataSource.remove(publicationId);
}

const AdminCommunityRepository = {
    loadDashboard,
    loadComments,
    loadPublications,
    deleteComment,
    deletePublication,
};

export default AdminCommunityRepository;
