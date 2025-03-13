import { useEffect, useState } from 'react';
import Post from './Post';
import NewPost from './NewPost';
import EditPost from './EditPost';
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';

function PostsList({ isPosting, onStopPosting }) {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [editingPost, setEditingPost] = useState(null);

	useEffect(() => {
		async function fetchPosts() {
			setLoading(true);
			const response = await fetch('http://localhost:8080/posts');
			const resData = await response.json();
			setPosts(resData.posts);
			setLoading(false);
		}

		fetchPosts();
	}, []);

	async function addPostHandler(postData) {
		setLoading(true);
		const response = await fetch('http://localhost:8080/posts', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(postData)
		});
		const data = await response.json();
		setPosts((prevPosts) => [data.post, ...prevPosts]);
		setLoading(false);
	}

	async function deletePostHandler(postId) {
		setLoading(true);
		await fetch(`http://localhost:8080/posts/${postId}`, {
			method: 'DELETE'
		});
		setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
		setLoading(false);
	}

	function startEditPostHandler(post) {
		setEditingPost(post);
	}

	async function updatePostHandler(updatedPost) {
		setLoading(true);
		const response = await fetch(`http://localhost:8080/posts/${updatedPost.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(updatedPost)
		});
		const data = await response.json();
		setPosts((prevPosts) =>
			prevPosts.map((post) => (post.id === data.post.id ? data.post : post))
		);
		setEditingPost(null);
		setLoading(false);
	}

	return (
		<>
			{isPosting && (
				<Modal onCloseModal={onStopPosting}>
					<NewPost onCancel={onStopPosting} onAddPost={addPostHandler} />
				</Modal>
			)}

			{editingPost && (
				<Modal onCloseModal={() => setEditingPost(null)}>
					<EditPost
						post={editingPost}
						onCancel={() => setEditingPost(null)}
						onUpdatePost={updatePostHandler}
					/>
				</Modal>
			)}

			{loading && <LoadingSpinner />}

			{!loading && posts.length > 0 && (
				<ul className="posts">
					{posts.map((post) => (
						<li key={post.id} className="post">
							<div className="post-header">
								<div className="post-actions">
									<button onClick={() => startEditPostHandler(post)}>✏️</button>
									<button onClick={() => deletePostHandler(post.id)}>🗑️</button>
								</div>
							</div>
							<Post author={post.author} body={post.body} />
						</li>
					))}
				</ul>
			)}

			{!loading && posts.length === 0 && (
				<div style={{ textAlign: 'center', color: 'white' }}>
					<h2>There is no post yet.</h2>
					<p>Try to add some!</p>
				</div>
			)}
		</>
	);
}

export default PostsList;
