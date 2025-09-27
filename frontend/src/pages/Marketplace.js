import React, { useEffect, useState } from 'react';
import { fetchItems } from '../services/api';
import ItemCard from '../components/ItemCard';

const Marketplace = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems().then(setItems);
  }, []);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {items.map(item => <ItemCard key={item._id} item={item} />)}
    </div>
  );
};

export default Marketplace;

