export const TasksFilter = ({ applyFilter, currentFilter }) => {
  const filterOptions = ['All', ' ', 'Active', ' ', 'Completed'].map((item) => {
    if (item === ' ') return item;
    let [action, selectionMark] = [
      item !== currentFilter ? applyFilter : null,
      item === currentFilter ? 'selected' : null,
    ];
    return (
      <li key={item}>
        <button className={selectionMark} onClick={action}>
          {item}
        </button>
      </li>
    );
  });
  return <ul className="filters">{filterOptions}</ul>;
};
