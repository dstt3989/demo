import React from 'react';

const ItemCard = ({ item }) => (
  <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
    <img src={item.imageUrl} alt={item.title} style={{ width: '100%' }} />
    <h3>{item.title}</h3>
    <p>{item.description}</p>
    <p><strong>Price:</strong> ${item.price}</p>
  </div>
);

export default ItemCard;
