
import { apiClient } from './client';
import { 
  PropertyFilters, 
  PropertyResponse,
  Property
} from '@/types/property';

/**
 * Retrieves a paginated and filtered list of properties from the API.
 *
 * @param filters - An object with the filter and pagination parameters.
 * @returns A promise that resolves with the paginated response from the API.
 */
export async function getProperties(
  filters: PropertyFilters = {}
): Promise<PropertyResponse> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiParams: Record<string, any> = {};

  const paramMapping: Record<string, string> = {
    page: 'PageNumber',
    pageSize: 'PageSize',
    name: 'Name',
    address: 'Address',
    minPrice: 'MinPrice',
    maxPrice: 'MaxPrice',
  };

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      const apiParamName = paramMapping[key] || key;
      apiParams[apiParamName] = value;
    }
  });

  const { data } = await apiClient.get<PropertyResponse>('api/v1/properties', {
    params: apiParams,
  });

  return data;
}


/**
 * Retrieves a single property by its ID.
 *
 * @param id - The ID of the property to obtain.
 * @returns A promise that resolves with the property object.
 */
export async function getPropertyById(id: string): Promise<Property> {
  if (!id) {
    throw new Error("Property ID is required.");
  }
  
  const { data } = await apiClient.get<Property>(`api/v1/properties/${id}`);
  return data;
}