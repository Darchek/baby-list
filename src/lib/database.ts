import { NextRequest, NextResponse } from 'next/server';
import { supabase } from './supabase';

// User interface for the application
export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  created_at?: Date;
  token?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  url: string;
  image_url: string;
  active: boolean;
  reserved_by: number | null;
  created_at: Date;
}

// Helper function to convert Supabase row to User
function convertSupabaseRowToUser(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    password: row.password,
    created_at: new Date(row.created_at),
    token: row.token,
  };
}

function convertSupabaseRowToPartialUser(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    password: '',
    created_at: new Date(row.created_at),
    token: '',
  };
}


function convertSupabaseRowToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    url: row.url,
    image_url: row.image_url,
    active: row.active,
    reserved_by: row.reserved_by,
    created_at: new Date(row.created_at),
  };
}

export async function getUserByRequest(request: NextRequest): Promise<User> {
  const authStr = request.headers.get('Authorization') || 'Bearer ';
  const token = authStr.split('Bearer ')[1];

  if (!token || token.length < 10) {
    throw new Error('No token provided');
  }

  const user = await db.getUserByToken(token);
  if (!user || !user.id) {
    throw new Error('Token provided not valid');
  }
  return user;
}

export async function hashString(str: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

function randomHex(length = 5) {
  const hexChars = "0123456789abcdef";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += hexChars[Math.floor(Math.random() * hexChars.length)];
  }
  return result;
}

export async function generateRandomToken(prev_string: string) {
  const hex = randomHex(5);
  const token = await hashString(hex + prev_string);
  return token;
}

// Database operations using Supabase
export const db = {
  // Get all users
  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('user')
      .select('id, name, email, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }

    return data ? data.map(convertSupabaseRowToUser) : [];
  },

  // Get user by Token
  async getUserByToken(token: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('user')
      .select('*')
      .eq('token', token)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // User not found
      }
      console.error('Error fetching user:', error);
      throw new Error('Failed to fetch user');
    }

    return data ? convertSupabaseRowToUser(data) : null;
  },

  // Get users by id
  async getUsersById(id: number): Promise<User | null> {
      const { data, error } = await supabase
        .from('user')
        .select('id, name, email, created_at')
        .eq('id', id)
        .single();
  
      if (error) {
        console.error('Error fetching user by id:', error);
        throw new Error('Failed to fetch user by id');
      }
  
      return data ? convertSupabaseRowToPartialUser(data) : null;
    },

  // Create new user
  async createUser(userData: Omit<User, 'id' | 'created_at'>): Promise<User> {
    const hash_password = await hashString(userData.password);
    
    const { data, error } = await supabase
      .from('user')
      .insert({
        name: userData.name,
        email: userData.email,
        password: hash_password,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }

    return convertSupabaseRowToUser(data);
  },

  // Update user
  async updateUser(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> {
    const updateData: any = {};
    
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.password !== undefined) updateData.password = updates.password;
    if (updates.token !== undefined) updateData.token = updates.token;

    const { data, error } = await supabase
      .from('user')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // User not found
      }
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }

    return data ? convertSupabaseRowToUser(data) : null;
  },

  // Delete user
  async deleteUser(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('user')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }

    return true;
  },

    // Login user
  async loginUser(email: string, password: string): Promise<User | null> {
    const hash_password = await hashString(password);
    
    const { data, error } = await supabase
      .from('user')
      .select('*')
      .eq('email', email)
      .eq('password', hash_password)
      .single();

    if (error) {
      console.error('Error logging in user:', error);
      throw new Error('Failed to log in user');
    }

    if (!data) {
      console.error('Error logging in user:', error);
      throw new Error('Failed to log in user');
    }

    const new_token = await generateRandomToken(password);
    const new_data = await this.updateUser(data.id, { token: new_token });
    return new_data;
  },



  // Products

  async getProductsAllList(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products');
    }

    return data ? data.map(convertSupabaseRowToProduct) : [];
  },

  async getProductsActivateList(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products');
    }

    return data ? data.map(convertSupabaseRowToProduct) : [];
  },

  // Create new product
  async createProduct(productData: Omit<Product, 'id' | 'created_at' | 'reserved_by'>): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: productData.name,
        description: productData.description,
        url: productData.url,
        image_url: productData.image_url || '',
        active: productData.active,
        reserved_by: null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return null;
    }

    return data ? convertSupabaseRowToProduct(data) : null;
  },

  // Update a product
  async updateProduct(productId: number, updates: Partial<Product>): Promise<Product | null> {
    const updateData: any = {};
    
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.url !== undefined) updateData.url = updates.url;
    if (updates.active !== undefined) updateData.active = updates.active;
    if (updates.reserved_by !== undefined) updateData.reserved_by = updates.reserved_by;

    console.log(updateData);

    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', productId)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      return null;
    }

    return data ? convertSupabaseRowToProduct(data) : null;
  },

  // Reserve a product
  async reserveProduct(productId: string, userId: number): Promise<Product | null> {
    // First check if product exists and is not already reserved
    const { data: existingProduct, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (fetchError) {
      console.error('Error fetching product:', fetchError);
      return null;
    }

    if (existingProduct.reserved_by) {
      // Product is already reserved
      return null;
    }

    // Reserve the product
    const { data, error } = await supabase
      .from('products')
      .update({ reserved_by: userId })
      .eq('id', productId)
      .select()
      .single();

    if (error) {
      console.error('Error reserving product:', error);
      throw new Error('Failed to reserve product');
    }

    return data ? convertSupabaseRowToProduct(data) : null;
  },

};
