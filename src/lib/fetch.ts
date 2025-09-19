import { Product, User } from "./database";


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

export const getUserList = async () => {
    const userToken = getUserToken();
    if (!userToken) {
        return null;
    }
    const response = await fetch('/api/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
        },
    });
    const { data, error } = await response.json();
    if (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
    return data;
}

export const getUserByToken = async (token: string) => {
    const response = await fetch('/api/users/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
    });
    const { data, error } = await response.json();
    return { data, error };
}

export const createUser = async (formUser: Partial<User>) => {
    const userToken = getUserToken();
    if (!userToken) {
        return null;
    }
    const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify(formUser),
      });

      const result = await response.json();
      return result;
}

export const resetPassword = async (formUser: Partial<User>) => {
    const userToken = getUserToken();
    if (!userToken) {
        return null;
    }
    const response = await fetch('/api/users/token', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify(formUser),
      });

      const result = await response.json();
      return result;
}

// PRODUCTS
    
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

export const updateProduct = async (id: number, product: Partial<Product>) => {s
    const userToken = getUserToken();
    if (!userToken) {
        return { data: null, error: 'No token provided' };
    }
    const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({ product: product }),
      });
    const { data, error } = await response.json();
    return { data, error };
}

export const deleteProduct = async (id: number) => {
    const userToken = getUserToken();
    if (!userToken) {
        return null;
    }
    const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
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
    return data;
}

export const createProduct = async (product: Partial<Product>) => {
    const response = await fetch(`/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product: product }),
      });
    const { data, error } = await response.json();
    return { data, error };
}


// GEMINI

export const geminitGenerateText = async (prompt: string) => {
    const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt }),
      });
    const { data, error } = await response.json();
    return data;
}