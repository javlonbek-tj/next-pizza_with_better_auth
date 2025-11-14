// hooks/admin/use-products.ts
import { useEffect, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ProductFormValues,
  ProductItemFormValues,
  createProductSchema,
} from '@/components/admin/schemas/product-schema';
import { queryKeys } from '@/lib';
import { Api } from '@/services/api-client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ProductWithRelations } from '@/prisma/@types/prisma';
import { useGetCategories } from '@/hooks';
import { AxiosError } from 'axios';
import { ApiResponse } from '@/services/api-response';
import { deleteImageFile } from '@/app/actions';

export function useGetProducts() {
  return useQuery({
    queryKey: queryKeys.products,
    queryFn: Api.admin.getProducts,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: ProductFormValues) => Api.admin.createProduct(vars),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      toast.success('Товар успешно создан');
    },
    onError: () => {
      toast.error('Не удалось создать товар');
    },
  });
}

/**
 * Hook to manage product form state and submission
 */
export function useProductForm(
  product: ProductWithRelations | null | undefined,
  open: boolean,
  onClose: () => void
) {
  const isEditing = !!product;
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { data: categories } = useGetCategories();

  const isPending = isCreating || isUpdating;

  // Track the original image URL when editing
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);

  // Watch the selected category to determine if it's pizza
  const [isPizzaCategory, setIsPizzaCategory] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(createProductSchema(isPizzaCategory)),
    defaultValues: {
      name: '',
      imageUrl: '',
      categoryId: '',
      ingredientIds: [],
      productItems: [
        {
          price: 0,
          sizeId: null,
          typeId: null,
        },
      ],
    },
  });

  const selectedCategoryId = form.watch('categoryId');

  // Update isPizzaCategory when category changes
  useEffect(() => {
    if (!selectedCategoryId || !categories) {
      setIsPizzaCategory(false);
      return;
    }
    const selectedCategory = categories.find(
      (cat) => cat.id === selectedCategoryId
    );
    const isNowPizza = selectedCategory?.name.toLowerCase() === 'пиццы';
    setIsPizzaCategory(isNowPizza);
  }, [selectedCategoryId, categories]);

  useEffect(() => {
    if (product) {
      // Store the original image URL
      setOriginalImageUrl(product.imageUrl);

      // Determine if the product is pizza category
      const productCategory = categories?.find(
        (cat) => cat.id === product.categoryId
      );
      const isProductPizza = productCategory?.name.toLowerCase() === 'пиццы';
      setIsPizzaCategory(isProductPizza);

      form.reset({
        name: product.name,
        imageUrl: product.imageUrl,
        categoryId: product.categoryId ?? '',
        ingredientIds: product.ingredients?.map((ing) => ing.id) || [],
        productItems:
          product.productItems?.map((item) => ({
            id: item.id,
            price: item.price,
            sizeId: item.size?.id || null,
            typeId: item.type?.id || null,
          })) || [],
      });
    } else {
      setOriginalImageUrl(null);
      setIsPizzaCategory(false);
      form.reset({
        name: '',
        imageUrl: '',
        categoryId: '',
        ingredientIds: [],
        productItems: [
          {
            price: 0,
            sizeId: null,
            typeId: null,
          },
        ],
      });
    }
  }, [product, form, open, categories]);

  const onSubmit = async (data: ProductFormValues, onSuccess?: () => void) => {
    // Transform data to ensure proper types and handle edge cases
    const transformedData: ProductFormValues = {
      name: data.name.trim(),
      imageUrl: data.imageUrl.trim(),
      categoryId: data.categoryId.trim(),
      ingredientIds: data.ingredientIds,
      productItems: data.productItems.map((item) => {
        return {
          ...(item.id ? { id: item.id } : {}),
          price: item.price,
          sizeId: !item.sizeId || item.sizeId === 'none' ? null : item.sizeId,
          typeId: !item.typeId || item.typeId === 'none' ? null : item.typeId,
        };
      }),
    };

    // Check if image was changed during edit
    const imageChanged =
      isEditing &&
      originalImageUrl &&
      transformedData.imageUrl !== originalImageUrl;

    if (isEditing && product?.id) {
      // UPDATE existing product
      updateProduct(
        { productId: product.id, data: transformedData },
        {
          onSuccess: async () => {
            // Delete old image if a new one was uploaded
            if (imageChanged && originalImageUrl) {
              await deleteImageFile(originalImageUrl);
            }

            toast.success('Продукт успешно обновлен');
            onSuccess?.();
            onClose();
            form.reset();
            setOriginalImageUrl(null);
          },
          onError: () => {
            toast.error('Ошибка при обновлении продукта');
          },
        }
      );
    } else {
      // CREATE new product
      createProduct(transformedData, {
        onSuccess: () => {
          toast.success('Продукт успешно создан');
          onSuccess?.();
          onClose();
          form.reset();
        },
        onError: () => {
          toast.error('Ошибка при создании продукта');
        },
      });
    }
  };

  return {
    form,
    isEditing,
    isPending,
    onSubmit,
    isPizzaCategory,
    originalImageUrl,
  };
}

/**
 * Hook to manage product items (variations)
 */
export function useProductItems(form: UseFormReturn<ProductFormValues>) {
  const productItems = form.watch('productItems') || [];

  const addProductItem = () => {
    const currentItems = form.getValues('productItems') || [];
    form.setValue(
      'productItems',
      [
        ...currentItems,
        {
          price: 0,
          sizeId: null,
          typeId: null,
        },
      ],
      { shouldValidate: false }
    );
  };

  const updateProductItem = (
    index: number,
    updated: Partial<ProductItemFormValues>
  ) => {
    const currentItems = form.getValues('productItems') || [];
    const updatedItems = currentItems.map((item, i) =>
      i === index ? { ...item, ...updated } : item
    );
    form.setValue('productItems', updatedItems, { shouldValidate: false });

    if (form.formState.isSubmitted) {
      setTimeout(() => {
        form.trigger('productItems');
      }, 100);
    }
  };

  const removeProductItem = (index: number) => {
    const currentItems = form.getValues('productItems') || [];
    const updatedItems = currentItems.filter((_, i) => i !== index);
    form.setValue('productItems', updatedItems, { shouldValidate: false });

    if (form.formState.isSubmitted) {
      setTimeout(() => {
        form.trigger('productItems');
      }, 100);
    }
  };

  return {
    productItems,
    addProductItem,
    updateProductItem,
    removeProductItem,
  };
}

// useDeleteProduct

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => Api.admin.deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      toast.success('Товар успешно удален');
    },
    onError: () => {
      toast.error('Не удалось удалить товар');
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      data,
    }: {
      productId: string;
      data: ProductFormValues;
    }) => {
      return Api.admin.updateProduct(productId, data);
    },
    onSuccess: () => {
      // Invalidate products list to refetch
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      console.error('Update product error:', error);
    },
  });
}
