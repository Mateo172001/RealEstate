import { z } from 'zod';

export const PropertySchema = z.object({
  id: z.string().min(1, { message: "ID is required" }),
  idOwner: z.string().min(1, { message: "Owner ID is required" }),

  name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
  address: z.string().min(5, { message: "Address is required" }),

  price: z.number().positive({ message: "Price must be a positive number" }),

  imageUrl: z.string().url({ message: "A valid image URL is required" }),
});

export type Property = z.infer<typeof PropertySchema>;


export interface PropertyFilters {
  name?: string;
  address?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
}


export interface PaginatedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export type PropertyResponse = PaginatedResult<Property>;