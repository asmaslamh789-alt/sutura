// cart.js - Cart management with Firebase Firestore & LocalStorage Sync
import { db, doc, setDoc, getDoc } from './firebase.js';

const CART_SESSION_KEY = 'sutura_cart_session';

function getSessionId() {
  let id = localStorage.getItem(CART_SESSION_KEY);
  if (!id) {
    id = 'guest_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem(CART_SESSION_KEY, id);
  }
  return id;
}

// Function to update badges in the UI
export function updateCartBadge(count) {
  const countStr = String(count || 0);
  document.querySelectorAll('.shopping-bag-badge, [data-cart-badge]').forEach(badge => {
    badge.textContent = countStr;
    badge.style.display = count > 0 ? 'flex' : 'none';
  });
}

// Get Cart items
export async function getCart() {
  const sessionId = getSessionId();
  try {
    const cartRef = doc(db, 'carts', sessionId);
    const snap = await getDoc(cartRef);
    if (snap.exists()) {
      const data = snap.data();
      const items = data.items || [];
      localStorage.setItem('sutura_local_cart', JSON.stringify(items));
      return items;
    }
  } catch (err) {
    console.warn('Firebase getCart fallback to localStorage:', err);
  }
  
  // Fallback to local storage
  try {
    const local = localStorage.getItem('sutura_local_cart');
    return local ? JSON.parse(local) : [];
  } catch (e) {
    return [];
  }
}

// Add Item to Cart
export async function addToCart(product) {
  const sessionId = getSessionId();
  try {
    let items = await getCart();
    
    // Check if matching item exists
    const existingIndex = items.findIndex(
      i => i.id === product.id && i.color === product.color && i.size === product.size
    );

    const qtyToAdd = product.qty || 1;
    if (existingIndex > -1) {
      items[existingIndex].qty = (items[existingIndex].qty || 1) + qtyToAdd;
    } else {
      items.push({
        id: product.id || 'prod_' + Date.now(),
        name: product.name || 'منتج طبي',
        price: product.price || '0 ر.س',
        color: product.color || 'افتراضي',
        size: product.size || 'M',
        qty: qtyToAdd,
        embroidery: product.embroidery || false,
        embroideryDetails: product.embroideryDetails || null,
        addedAt: new Date().toISOString()
      });
    }

    // Save to local storage first for snappy UI
    localStorage.setItem('sutura_local_cart', JSON.stringify(items));
    const totalCount = items.reduce((sum, item) => sum + (item.qty || 1), 0);
    updateCartBadge(totalCount);

    // Save to Firebase Firestore
    const cartRef = doc(db, 'carts', sessionId);
    await setDoc(cartRef, {
      items: items,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return true;
  } catch (error) {
    console.error('Error adding to Firebase cart:', error);
    return false;
  }
}

// Initialize Cart Badge on page load
export async function initCartBadge() {
  try {
    // Immediate render from localStorage
    const local = localStorage.getItem('sutura_local_cart');
    if (local) {
      const items = JSON.parse(local);
      const totalCount = items.reduce((sum, item) => sum + (item.qty || 1), 0);
      updateCartBadge(totalCount);
    }
    
    // Then sync with Firestore
    const items = await getCart();
    const totalCount = items.reduce((sum, item) => sum + (item.qty || 1), 0);
    updateCartBadge(totalCount);
  } catch (e) {
    console.warn('initCartBadge error:', e);
  }
}
