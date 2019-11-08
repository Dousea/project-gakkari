import React from 'react';

function TagsInput(props) {
	const [tags, setTags] = React.useState(props.tags);
	const removeTags = indexToRemove => {
    props.onRemoveTag(indexToRemove);
		setTags([...tags.filter((_, index) => index !== indexToRemove)]);
	};
	const addTags = event => {
    // props.handleKey will be included in the `value` so we need to remove it
    // by subbing the string
    let tag = event.target.value.substring(0, event.target.value.length-1);

		if (tag !== "") {
      setTags([...tags, tag]);
      props.onAddTag(tags.length, tag);
			event.target.value = "";
		}
	};
	return (
		<div className="tags-input">
			<ul id="tags">
				{tags.map((tag, index) => (
					<li key={index} className="tag">
						<span className='tag-title'>{tag}</span>
						<span className='tag-close-icon'
							onClick={() => removeTags(index)}>
							x
						</span>
					</li>
				))}
			</ul>
			<input
				type="text"
				onKeyUp={event => event.key === props.handleKey ? addTags(event) : null}
				placeholder={props.placeholder}
			/>
		</div>
	);
};

export default TagsInput;