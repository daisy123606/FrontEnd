import { useState } from 'react';
import '../css/index.css'; // Ensure this CSS file is imported

function EditPost({ post, onUpdatePost, onCancel }) {
	const [updatedText, setUpdatedText] = useState(post.body);

	async function submitHandler(event) {
		event.preventDefault();
		await onUpdatePost({ ...post, body: updatedText });
	}

	return (
		<div className="edit-post"> {/* Wrapper for additional styling if needed */}
			<form onSubmit={submitHandler} className="form">
				<h2 className="cos">Edit Post</h2>
				<textarea
					className="form-textarea"
					value={updatedText}
					onChange={(e) => setUpdatedText(e.target.value)}
				/>
				<div className="actions">
					<button type="submit">Update</button>
					<button type="button" onClick={onCancel}>Cancel</button>
				</div>
			</form>
		</div>
	);
}

export default EditPost;
