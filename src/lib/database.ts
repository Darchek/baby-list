import { supabase } from './supabase';

// User interface for the application
export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  created_at?: Date;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  url: string;
  active: boolean;
  reserved_by: number;
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
  };
}

function convertSupabaseRowToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    url: row.url,
    active: row.active,
    reserved_by: row.reserved_by,
    created_at: new Date(row.created_at),
  };
}


// Database operations using Supabase
export const db = {
  // Get all users
  async getAllUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('user')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }

    return data ? data.map(convertSupabaseRowToUser) : [];
  },

  // Get user by ID
  async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('user')
      .select('*')
      .eq('id', id)
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

  // Get users by email (search)
  async getUsersByEmail(email: string): Promise<User[]> {
    const { data, error } = await supabase
      .from('user')
      .select('*')
      .ilike('email', `%${email}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users by email:', error);
      throw new Error('Failed to fetch users by email');
    }

    return data ? data.map(convertSupabaseRowToUser) : [];
  },

  // Create new user
  async createUser(userData: Omit<User, 'id' | 'created_at'>): Promise<User> {
    const { data, error } = await supabase
      .from('user')
      .insert({
        name: userData.name,
        email: userData.email,
        password: userData.password,
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
  async loginUser(email: string, password: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('user')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();


    if (error) {
      console.error('Error logging in user:', error);
      throw new Error('Failed to log in user');
    }

    return data;
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

    if (existingProduct.reverved_by) {
      // Product is already reserved
      return null;
    }

    // Reserve the product
    const { data, error } = await supabase
      .from('products')
      .update({ reverved_by: userId })
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
