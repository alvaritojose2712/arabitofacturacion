import React, { createContext, useContext, useState } from 'react';

// Crear el contexto general de la aplicación
const AppContext = createContext();

// Hook personalizado para usar el contexto
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser usado dentro de un AppProvider');
  }
  return context;
};

// Provider del contexto general
export const AppProvider = ({ children }) => {
  // Estados globales de la aplicación
  const [activeProductCart, setActiveProductCart] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [currentView, setCurrentView] = useState('pagar');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [modalStates, setModalStates] = useState({});
  const [theme, setTheme] = useState('light');

  // Funciones de utilidad
  const addNotification = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    const notification = { id, message, type, duration };
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const openModal = (modalName) => {
    setModalStates(prev => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName) => {
    setModalStates(prev => ({ ...prev, [modalName]: false }));
  };

  const toggleModal = (modalName) => {
    setModalStates(prev => ({ ...prev, [modalName]: !prev[modalName] }));
  };

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartItemQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    // Estados
    activeProductCart,
    setActiveProductCart,
    user,
    setUser,
    loading,
    setLoading,
    notifications,
    currentView,
    setCurrentView,
    selectedProduct,
    setSelectedProduct,
    cartItems,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    modalStates,
    theme,
    setTheme,

    // Funciones de utilidad
    addNotification,
    removeNotification,
    openModal,
    closeModal,
    toggleModal,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
