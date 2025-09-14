


export const loginUser = async (email: string, password: string) => {
    const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    const { data, error } = await response.json();
    return data;
}
    

export const fetchProducts = async () => {
    const response = await fetch('/api/products');
    const { data, error } = await response.json();
    return data;
}