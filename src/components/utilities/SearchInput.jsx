import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export const SearchInput = ({items, url, setItemsList}) => {
    const [search, setSearch] = useState('');
      const [filteredItems, setFilteredItems] = useState([]);
    
      const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearch(query);
    
        if (query.trim() === '') {
          setFilteredItems([]);
        } else {
          const filtered = items.filter((item) =>
            item.name.toLowerCase().includes(query)
          );
          setFilteredItems(filtered);
        }
      };
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
                    className='list-group position-absolute w-100 mt-1 shadow-sm bg-white border rounded'
                    style={{ zIndex: 1000, top: '100%' }}
                  >
                    {url ?
                    filteredItems.map((item) => (
                      <li 
                        key={item.id || item.FSId} 
                        className='list-group-item list-group-item-action'
                        onClick={() => setSearch('')}
                      >
                        <Link to={`${url}/${item.id || item.FSId}`} className="text-decoration-none text-dark">
                          {item.name}
                        </Link>
                      </li>
                    )) : setItemsList(filteredItems) }
                  </ul>
                )}
              </div>
  )
}
