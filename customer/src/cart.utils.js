// cart.utils.js
export const getLocalCart = () => {
  const cart = JSON.parse(localStorage.getItem('local_cart'));
  return cart || { items: [] };
};

export const saveLocalCart = (cart) => {
  localStorage.setItem('local_cart', JSON.stringify(cart));
};

export const clearLocalCart = () => {
  localStorage.removeItem('local_cart');
};
