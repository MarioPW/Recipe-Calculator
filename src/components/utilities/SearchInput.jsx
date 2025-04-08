import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export const SearchInput = ({ items = [], url = null, action = null, setItemsList = null }) => {
  const [search, setSearch] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
  };

  const performLocalFilter = (query) => {
    if (!query.trim()) {
      setFilteredItems([]);
      setItemsList?.(items);
      return;
    }

    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(query)
    );

    setFilteredItems(filtered);
    setItemsList?.(filtered);
  };

  const performRemoteSearch = async (query) => {
    if (!query.trim() || !url || !action) return;

    try {
      const results = await action(`${url}?search=${encodeURIComponent(query)}`);
      setFilteredItems(results);
      setItemsList?.(results);
    } catch (error) {
      console.error('Error fetching remote search:', error);
    }
  };

  useEffect(() => {
    if (url && action) {
      performRemoteSearch(search);
    } else {
      performLocalFilter(search);
    }
  }, [search, items]);

  return (
    <div className="position-relative d-flex align-items-center">
      <i className="bi bi-search position-absolute ms-2 text-muted"></i>
      <input
        className="form-control"
        type="search"
        placeholder="Search"
        aria-label="Search"
        value={search}
        onChange={handleSearch}
        style={{ paddingLeft: '2rem' }}
      />
      {filteredItems.length > 0 && (
        <ul
          className="list-group position-absolute w-100 mt-1 shadow-sm bg-white border rounded z-10"
          style={{ zIndex: 1000, top: '100%' }}
        >
          {filteredItems.map((item) => (
            <li
              key={item.id || item.FSId}
              className="list-group-item list-group-item-action"
              onClick={() => setSearch('')}
            >
              {url && (
                <Link to={`${url}/${item.id || item.FSId}`} className="text-decoration-none text-dark">
                  {item.name}
                </Link>
              )}
              {action && (
                <button className="text-decoration-none text-dark" onClick={() => action(item)}>
                  {item.name}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
