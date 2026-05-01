import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bot, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { forumApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function ForumsPage() {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const [selectedPostId, setSelectedPostId] = useState(null);
	const [newPostContent, setNewPostContent] = useState('');
	const [replyContent, setReplyContent] = useState('');

	const { data: posts = [], isLoading, isError, isFetching } = useQuery({
		queryKey: ['forumPosts'],
		queryFn: () => forumApi.get('/forums/posts').then(r => r.data),
	});

	const selectedId = useMemo(() => {
		if (selectedPostId != null) return selectedPostId;
		return posts?.[0]?.id ?? null;
	}, [selectedPostId, posts]);

	const {
		data: selectedPost,
		isLoading: isPostLoading,
		isError: isPostError,
		isFetching: isPostFetching,
	} = useQuery({
		queryKey: ['forumPost', selectedId],
		enabled: !!selectedId,
		queryFn: () => forumApi.get(`/forums/posts/${selectedId}`).then(r => r.data),
	});

	const createPost = useMutation({
		mutationFn: (payload) => forumApi.post('/forums/posts', payload).then(r => r.data),
		onSuccess: (created) => {
			toast.success('Posted to forum');
			setNewPostContent('');
			setSelectedPostId(created?.id ?? null);
			queryClient.invalidateQueries({ queryKey: ['forumPosts'] });
			if (created?.id) {
				queryClient.invalidateQueries({ queryKey: ['forumPost', created.id] });
			}
		},
		onError: () => toast.error('Could not create post'),
	});

	const addReply = useMutation({
		mutationFn: ({ postId, payload }) => forumApi.post(`/forums/posts/${postId}/replies`, payload).then(r => r.data),
		onSuccess: () => {
			toast.success('Reply posted');
			setReplyContent('');
			queryClient.invalidateQueries({ queryKey: ['forumPosts'] });
			queryClient.invalidateQueries({ queryKey: ['forumPost', selectedId] });
		},
		onError: () => toast.error('Could not post reply'),
	});

	const handleCreatePost = (e) => {
		e.preventDefault();
		const content = newPostContent.trim();		
		const derivedTitle = content
			.split('\n')
			.map(s => s.trim())
			.find(Boolean)
			?.slice(0, 120);

		const title = derivedTitle || 'New discussion';

		createPost.mutate({
			authorName: user?.name || 'Anonymous',
			title,
			content,
		});
	};

	const handleAddReply = (e) => {
		e.preventDefault();
		if (!selectedId) return;
		addReply.mutate({
			postId: selectedId,
			payload: { authorName: user?.name || 'Anonymous', content: replyContent },
		});
	};

	return (
		<div className="page-container forum-page">
			<section className="forum-header">
				<h2>Discussion Forums</h2>
				<p>Join conversations or start your own topic!</p>
			</section>

			

			{isError && (
				<div className="empty-state error-state">
					<span>⚠️</span>
					<p>Could not connect to Forum Service on port 8084.</p>
				</div>
			)}

			<section className="forum-posts" aria-busy={isLoading ? 'true' : 'false'}>
				{isLoading && <div className="loader" />}

				{!isLoading && !isError && posts.length === 0 && (
					<div className="empty-state">
						<span>💬</span>
						<p>No forum posts yet. Be the first to ask.</p>
					</div>
				)}

				{posts.map((p) => {
					const isSelected = selectedId === p.id;
					return (
						<article key={p.id} className={`forum-post ${isSelected ? 'active' : ''}`}>
							<h4>{p.authorName || 'Anonymous'}</h4>
							<p className="forum-post-text">{p.title}</p>

							<div className="forum-post-actions">
								<button
									type="button"
									onClick={() => {
										setSelectedPostId(p.id);
									}}
									disabled={isFetching || isPostFetching}
									aria-expanded={isSelected ? 'true' : 'false'}
								>
									<MessageSquare size={16} /> Comment
								</button>
							</div>

							{isSelected && (
								<div className="forum-comments">
									{(isPostLoading || isPostFetching) && <div className="loader" />}

									{!isPostLoading && !isPostFetching && (isPostError || !selectedPost) && (
										<div className="empty-state error-state">
											<span>⚠️</span>
											<p>Could not load comments.</p>
										</div>
									)}

									{!!selectedPost && !isPostLoading && (
										<>
											{(selectedPost.replies?.length ?? 0) === 0 && (
												<div className="forum-comment forum-comment-empty">
													No comments yet.
												</div>
											)}

											{(selectedPost.replies || []).map((r) => (
												<div key={r.id} className="forum-comment">
													<strong>{r.authorName || 'Anonymous'}:</strong> {r.content}
												</div>
											))}

											<form className="forum-comment-form" onSubmit={handleAddReply}>
												<input
													type="text"
													value={replyContent}
													onChange={(e) => setReplyContent(e.target.value)}
													placeholder="Write a comment..."
													required
													maxLength={5000}
												/>
												<button className="btn" type="submit" disabled={addReply.isPending}>
													{addReply.isPending ? 'Posting…' : 'Post'}
												</button>
											</form>
										</>
									)}
								</div>
							)}
						</article>
					);
				})}
			</section>

			<section className="forum-new-post">
				<form onSubmit={handleCreatePost}>
					<textarea
						id="newPost"
						value={newPostContent}
						onChange={(e) => setNewPostContent(e.target.value)}
						placeholder="Start a discussion..."
						required
						maxLength={5000}
					/>
					<button className="btn" type="submit" disabled={createPost.isPending}>
						{createPost.isPending ? 'Posting…' : 'Post'}
					</button>
				</form>
			</section>
		</div>
	);
}
