function Post({ author, body }) {
	return (
		<div className='post'>
			<p className='author'>{author}</p>
			<p className='text'>{body}</p>
		</div>
	);
}

export default Post;
