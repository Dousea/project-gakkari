import React from 'react';

class TagsInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: []
    }
  }

  componentDidUpdate(prevProps) {
    // It will be probably error-prone
    if (JSON.stringify(prevProps.tags) !== JSON.stringify(this.props.tags))
      this.setState({ tags: this.props.tags });
  }

  handleRemoveTag(index) {
    this.props.onRemoveTag(index);
    this.state.tags.splice(index, 1);
    this.setState({ tags: this.state.tags });
  }

  handleAddTag(event) {
    // props.handleKey will be included in the `value` so we need to remove it
    // by subbing the string
    let tag = event.target.value.substring(0, event.target.value.length-1);

		if (tag !== "") {
      this.state.tags.push(tag);
      this.setState({ tags: this.state.tags });
      this.props.onAddTag(this.state.tags.length-1, tag);
			event.target.value = "";
		}
  }

  render() {
    return (
      <div className="tags-input">
        <ul id="tags">
          {this.state.tags.map((tag, index) => {
            return (
              <li key={index} className="tag">
                <span className='tag-title'>{tag}</span>
                <span className='tag-close-icon'
                  onClick={() => this.handleRemoveTag(index)}>
                  x
                </span>
              </li>
            );
          })}
        </ul>
        <input
          type="text"
          onKeyUp={event => event.key === this.props.handleKey ? this.handleAddTag(event) : null}
          placeholder={this.props.placeholder}
        />
      </div>
    );
  }
}

export default TagsInput;