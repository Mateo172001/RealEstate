import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getProperties, getPropertyById } from '../properties';
import { apiClient } from '../client';

vi.mock('../client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe('API: getProperties', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call the API with the correct parameters', async () => {
    const mockResponse = {
      data: {
        items: [],
        pageNumber: 1,
        pageSize: 12,
        totalCount: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      },
    };

    vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

    const filters = {
      page: 1,
      pageSize: 12,
      name: 'Villa',
      address: 'Miami',
      minPrice: 100000,
      maxPrice: 500000,
    };

    await getProperties(filters);

    expect(apiClient.get).toHaveBeenCalledWith('api/v1/properties', {
      params: {
        PageNumber: 1,
        PageSize: 12,
        Name: 'Villa',
        Address: 'Miami',
        MinPrice: 100000,
        MaxPrice: 500000,
      },
    });
  });

  it('should omit empty or null parameters', async () => {
    const mockResponse = {
      data: {
        items: [],
        pageNumber: 1,
        pageSize: 12,
        totalCount: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      },
    };

    vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

    const filters = {
      name: '',
      address: undefined,
      minPrice: undefined,
    };

    await getProperties(filters);

    expect(apiClient.get).toHaveBeenCalledWith('api/v1/properties', {
      params: {},
    });
  });

  it('should return the data from the response', async () => {
    const mockData = {
      items: [
        {
          id: '1',
          idOwner: 'owner1',
          name: 'Modern Villa',
          address: '123 Miami Beach',
          price: 350000,
          imageUrl: 'https://example.com/image.jpg',
        },
      ],
      pageNumber: 1,
      pageSize: 12,
      totalCount: 1,
      totalPages: 1,
      hasPreviousPage: false,
      hasNextPage: false,
    };

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockData });

    const result = await getProperties();

    expect(result).toEqual(mockData);
  });

  it('should handle API errors', async () => {
    const error = new Error('Network error');
    vi.mocked(apiClient.get).mockRejectedValue(error);

    await expect(getProperties()).rejects.toThrow('Network error');
  });

  it('should work without filters (default call)', async () => {
    const mockResponse = {
      data: {
        items: [],
        pageNumber: 1,
        pageSize: 12,
        totalCount: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      },
    };

    vi.mocked(apiClient.get).mockResolvedValue(mockResponse);

    await getProperties();

    expect(apiClient.get).toHaveBeenCalledWith('api/v1/properties', {
      params: {},
    });
  });
});

describe('API: getPropertyById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call the API with the correct ID', async () => {
    const mockProperty = {
      id: '123',
      idOwner: 'owner1',
      name: 'Luxury Apartment',
      address: '456 Park Avenue',
      price: 750000,
      imageUrl: 'https://example.com/apt.jpg',
    };

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockProperty });

    await getPropertyById('123');

    expect(apiClient.get).toHaveBeenCalledWith('api/v1/properties/123');
  });

  it('should return the property data', async () => {
    const mockProperty = {
      id: '123',
      idOwner: 'owner1',
      name: 'Luxury Apartment',
      address: '456 Park Avenue',
      price: 750000,
      imageUrl: 'https://example.com/apt.jpg',
    };

    vi.mocked(apiClient.get).mockResolvedValue({ data: mockProperty });

    const result = await getPropertyById('123');

    expect(result).toEqual(mockProperty);
  });

  it('should throw an error if no ID is provided', async () => {
    await expect(getPropertyById('')).rejects.toThrow('Property ID is required.');
  });

  it('should handle API errors (property not found)', async () => {
    const error = new Error('Property not found');
    vi.mocked(apiClient.get).mockRejectedValue(error);

    await expect(getPropertyById('999')).rejects.toThrow('Property not found');
  });
});

