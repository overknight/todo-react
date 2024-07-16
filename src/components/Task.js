import { Component } from 'react';
import { formatDistanceToNow } from 'date-fns';

const taskEditorField = (taskRef) => {
  return <input type="text" className="edit" value={taskRef.state.value} onChange={taskRef.onTitleEdited} autoFocus />;
};

export class Task extends Component {
  static defaultProps = {
    creationDate: Date.now(),
  };

  state = {
    editingTitle: false,
    value: this.props.title,
  };

  editTitle = (e) => {
    this.setState({
      editingTitle: true,
      newValue: this.props.title,
    });
    this.props.onEditStart(e);
  };

  onTitleEdited = (e) => {
    this.setState({ value: e.target.value });
  };

  remove = () => {
    this.props.onRemove();
  };

  render() {
    const { title, completed = false, isEditingOtherTask = false, onStatusChange, creationDate } = this.props;
    const { editingTitle } = this.state;
    const editable = completed ? false : !isEditingOtherTask;
    const view = (
      <div className="view">
        <label>
          <input
            className="toggle"
            type="checkbox"
            title="Toggle status"
            defaultChecked={completed}
            onChange={onStatusChange}
          />
          <span className="status-indicator"></span>
          <span className="description">{title}</span>
          <span className="created">{formatDistanceToNow(creationDate)}</span>
        </label>
        <button
          className={editable ? 'icon icon-edit' : 'icon icon-edit disabled'}
          title="Edit task"
          onClick={editable ? this.editTitle : null}
        ></button>
        <button className="icon icon-destroy" title="Destroy task" onClick={this.remove}></button>
      </div>
    );
    let taskStatus = completed ? 'completed' : null;
    if (editingTitle) taskStatus = 'editing';
    return (
      <li className={taskStatus}>
        {view}
        {editingTitle ? taskEditorField(this) : null}
      </li>
    );
  }
}
