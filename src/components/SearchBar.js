function SearchBar({ value, onChange }) {
  return (
    <div id="search-bar">
      <input
        type="text"
        placeholder="Start typing ..."
        value={value}
        onChange={onChange}
      ></input>
    </div>
  );
}

export default SearchBar;
