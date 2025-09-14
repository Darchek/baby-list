import { Product } from "./database";


function getUserToken() {
    const userStorage = localStorage.getItem('baby-list-user-storage');
    if (userStorage) {
        try {
            const { state } = JSON.parse(userStorage);
            const user = state?.user;
            return user.token
        } catch (error) {
            console.error('Error parsing user storage:', error);
        }
    }
    return null;
}


export const loginUser = async (email: string, password: string) => {
    const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    const { data, error } = await response.json();
    return { data, error };
}
    
export const getProductList = async () => {
    const response = await fetch('/api/products');
    const { data, error } = await response.json();
    return data;
}

export const getProductAllList = async () => {
    try {
      const response = await fetch('/api/products/all');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
};

export const updateProduct = async (id: number, product: Partial<Product>) => {
    const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product: product }),
      });
    const { data, error } = await response.json();
    return { data, error };
}

export const reserveProduct = async (id: number) => {
    const userToken = getUserToken();
    if (!userToken) {
        return null;
    }
    const response = await fetch(`/api/products/${id}/reserve`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
        }
    });
    const { data, error } = await response.json();
    console.log(data);
    return data;
}