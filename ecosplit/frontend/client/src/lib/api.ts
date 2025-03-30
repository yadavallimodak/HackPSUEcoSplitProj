// API connector to the Python backend

const API_URL = 'http://104.39.101.163:5000/api';

export const api = {
  // Split bill endpoint
  splitBill: async (userData: Record<string, Array<{name: string, price: number}>>) => {
    const response = await fetch(`${API_URL}/split`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ users: userData }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
  },
  
  // Get eco-friendly suggestions
  getSuggestions: async (items: Array<{name: string}>) => {
    const response = await fetch(`${API_URL}/suggestions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
  },
  
  // OCR processing with Gemini
  processReceipt: async (imageFile: File) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await fetch(`${API_URL}/ocr-gemini`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return response.json();
  }
}; 