// components/admin/products/ProductForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Plus, Trash2 } from 'lucide-react';
import { MultiSelect } from '@/components/ui/multi-select'; // Assume a shadcn/ui compatible multi-select component
import { useCategories } from '@/hooks/admin/use-categories';
import { useIngredients } from '@/hooks/admin/use-ingredients';
import { useCreateProduct, useUpdateProduct } from '@/hooks/admin/use-products';

// Validation schema
const productItemSchema = z.object({
  price: z.number().positive('Price must be positive'),
  size: z.number().int().optional(),
  pizzaType: z.number().int().optional(),
});

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  imageUrl: z.string().url('Invalid URL').optional(),
  categoryId: z.string().min(1, 'Category is required'),
  productItems: z
    .array(productItemSchema)
    .min(1, 'At least one product item is required'),
  ingredientIds: z.array(z.string()).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: {
    id: string;
    name: string;
    imageUrl: string;
    categoryId: string;
    productItems: {
      id: string;
      price: number;
      size?: number;
      pizzaType?: number;
    }[];
    ingredients: { id: string }[];
  };
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditing = !!product;

  // Fetch categories and ingredients
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: ingredients, isLoading: ingredientsLoading } = useIngredients();

  // Form setup
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          imageUrl: product.imageUrl || '',
          categoryId: product.categoryId,
          productItems: product.productItems.map((item) => ({
            price: item.price,
            size: item.size,
            pizzaType: item.pizzaType,
          })),
          ingredientIds: product.ingredients.map((i) => i.id),
        }
      : {
          name: '',
          imageUrl: '',
          categoryId: '',
          productItems: [{ price: 0, size: undefined, pizzaType: undefined }],
          ingredientIds: [],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'productItems',
  });

  // Mutations
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const onSubmit = async (data: ProductFormValues) => {
    try {
      if (isEditing) {
        await updateProduct.mutateAsync({ id: product.id, data });
        toast({ title: 'Product updated successfully' });
      } else {
        await createProduct.mutateAsync(data);
        toast({ title: 'Product created successfully' });
      }
      queryClient.invalidateQueries({ queryKey: ['products'] });
      router.push('/admin/products');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed to save product' });
    }
  };

  // Handle image upload (client-side placeholder)
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Simulate upload to API or server action
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to upload image');
      const { url } = await res.json();
      form.setValue('imageUrl', url);
      toast({ title: 'Image uploaded successfully' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed to upload image' });
    }
  };

  if (categoriesLoading || ingredientsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter product name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Image</FormLabel>
          <FormControl>
            <Input type='file' accept='image/*' onChange={handleImageUpload} />
          </FormControl>
          {form.watch('imageUrl') && (
            <img
              src={form.watch('imageUrl')}
              alt='Preview'
              className='mt-2 h-32 w-32 object-cover rounded'
            />
          )}
          <FormMessage />
        </FormItem>

        <FormField
          control={form.control}
          name='categoryId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a category' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='ingredientIds'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ingredients</FormLabel>
              <FormControl>
                <MultiSelect
                  options={
                    ingredients?.map((ing) => ({
                      value: ing.id,
                      label: ing.name,
                    })) || []
                  }
                  selected={field.value || []}
                  onChange={field.onChange}
                  placeholder='Select ingredients'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='space-y-4'>
          <div className='flex justify-between items-center'>
            <FormLabel>Product Items</FormLabel>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={() =>
                append({ price: 0, size: undefined, pizzaType: undefined })
              }
            >
              <Plus className='w-4 h-4 mr-2' />
              Add Item
            </Button>
          </div>
          {fields.map((field, index) => (
            <div key={field.id} className='border p-4 rounded-lg space-y-4'>
              <div className='flex justify-between items-center'>
                <h4 className='text-sm font-medium'>Item {index + 1}</h4>
                <Button
                  type='button'
                  variant='destructive'
                  size='sm'
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                >
                  <Trash2 className='w-4 h-4' />
                </Button>
              </div>
              <FormField
                control={form.control}
                name={`productItems.${index}.price`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='0.01'
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`productItems.${index}.size`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? parseInt(e.target.value)
                              : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`productItems.${index}.pizzaType`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pizza Type (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? parseInt(e.target.value)
                              : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>

        <div className='flex justify-end gap-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => router.push('/admin/products')}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            disabled={createProduct.isPending || updateProduct.isPending}
          >
            {isEditing
              ? updateProduct.isPending
                ? 'Updating...'
                : 'Update Product'
              : createProduct.isPending
              ? 'Creating...'
              : 'Create Product'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
