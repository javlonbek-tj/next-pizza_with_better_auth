// hooks/admin/use-products.ts
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ProductFormValues,
  ProductItemFormValues,
  productSchema,
} from '@/components/admin/schemas/product-schema';
import { queryKeys } from '@/lib';
import { Api } from '@/services/api-client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { deleteImageFile } from '@/app/actions';
import { ACCEPTED_IMAGE_TYPES, MAX_UPLOAD_SIZE } from '@/lib';
import { ProductWithRelations } from '@/prisma/@types/prisma';
import { useUploadImage } from './use-ingredients';
import { ProductItem } from '@/lib/generated/prisma';

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
  /* const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct(); */
  const isPending = isCreating; /* || isUpdating; */

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
      categoryId: null,
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

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        imageUrl: product.imageUrl,
        categoryId: product.categoryId,
        ingredientIds: product.ingredients?.map((ing) => ing.id) || [],
        productItems:
          product.productItems?.map((item) => ({
            id: item.id,
            price: item.price,
            sizeId: item.sizeId,
            typeId: item.typeId,
          })) || [],
      });
    } else {
      form.reset({
        name: '',
        imageUrl: '',
        categoryId: null,
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
  }, [product, form, open]);

  const onSubmit = (data: ProductFormValues, onSuccess?: () => void) => {
    /* if (isEditing) {
      updateProduct(
        { id: product.id, dto: data },
        {
          onSuccess: () => {
            onSuccess?.();
            onClose();
            form.reset();
            toast.success('Продукт успешно обновлен');
          },
          onError: () => {
            toast.error('Не удалось обновить продукт');
          },
        }
      );
    } else { */
    // Transform data to ensure proper types
    const transformedData: ProductFormValues = {
      ...data,
      categoryId: data.categoryId === 'none' ? null : data.categoryId,
      productItems: data.productItems.map((item) => ({
        ...item,
        price:
          typeof item.price === 'string'
            ? parseFloat(item.price as any)
            : item.price,
        sizeId: item.sizeId === 'none' ? null : item.sizeId,
        typeId: item.typeId === 'none' ? null : item.typeId,
      })),
    };

    console.log('Submitting:', transformedData); // Debug
    createProduct(transformedData, {
      onSuccess: () => {
        onSuccess?.();
        onClose();
        form.reset();
        toast.success('Продукт успешно создан');
      },
      onError: () => {
        toast.error('Не удалось создать продукт');
      },
    });
    /* } */
  };

  return {
    form,
    isEditing,
    isPending,
    onSubmit,
  };
}

/**
 * Hook to manage product image upload
 */
export function useProductImageUpload(
  product: ProductWithRelations | null | undefined,
  open: boolean,
  form: any
) {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { mutateAsync: uploadImage } = useUploadImage();

  useEffect(() => {
    if (product) {
      setPreviewUrl(product.imageUrl);
      setNewImageUrl(null);
    } else {
      setPreviewUrl('');
      setNewImageUrl(null);
    }
    setIsSubmitted(false);
  }, [product, open]);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return 'Неверный формат файла. Разрешены только JPG, PNG и WebP';
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      return 'Размер файла превышает 5MB';
    }

    return null;
  };

  const uploadFile = async (file: File) => {
    const error = validateFile(file);
    if (error) {
      form.setError('imageUrl', {
        type: 'manual',
        message: error,
      });
      return;
    }

    form.clearErrors('imageUrl');

    // Delete previous new image if exists
    if (newImageUrl) {
      try {
        await deleteImageFile(newImageUrl);
      } catch (error) {
        console.error('Failed to delete previous image:', error);
      }
    }

    setIsUploading(true);
    try {
      const result = await uploadImage(file);
      const imageUrl = result?.imageUrl;

      if (!imageUrl) {
        throw new Error('No imageUrl in response');
      }

      form.setValue('imageUrl', result.imageUrl, { shouldValidate: true });
      setPreviewUrl(result.imageUrl);
      setNewImageUrl(result.imageUrl);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Не удалось загрузить изображение');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (newImageUrl) {
      try {
        await deleteImageFile(newImageUrl);
      } catch (error) {
        console.error('Failed to delete image:', error);
      }
      setNewImageUrl(null);
    }
    form.setValue('imageUrl', '', { shouldValidate: true });
    setPreviewUrl('');
  };

  const cleanupOrphanedImage = async () => {
    if (newImageUrl && !isSubmitted) {
      try {
        await deleteImageFile(newImageUrl);
      } catch (error) {
        console.error('Failed to delete orphaned image:', error);
      }
    }
  };

  const markAsSubmitted = () => {
    setIsSubmitted(true);
  };

  const resetImageState = () => {
    setPreviewUrl('');
    setNewImageUrl(null);
    setIsSubmitted(false);
  };

  return {
    previewUrl,
    isUploading,
    uploadFile,
    handleRemoveImage,
    cleanupOrphanedImage,
    markAsSubmitted,
    resetImageState,
  };
}

/**
 * Hook to manage product items (variations)
 */
export function useProductItems(form: any) {
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
      { shouldValidate: true }
    );
  };

  const updateProductItem = (index: number, updated: Partial<ProductItem>) => {
    const currentItems = form.getValues('productItems') || [];
    const updatedItems = currentItems.map((item, i) =>
      i === index ? { ...item, ...updated } : item
    );
    form.setValue('productItems', updatedItems, { shouldValidate: true });
    console.log('[UPDATED PRODUCT ITEMS]', updatedItems);
  };

  const removeProductItem = (index: number) => {
    const currentItems = form.getValues('productItems') || [];
    const updatedItems = currentItems.filter((_, i) => i !== index);
    form.setValue('productItems', updatedItems, { shouldValidate: true });
  };

  return {
    productItems,
    addProductItem,
    updateProductItem,
    removeProductItem,
  };
}

/**
 * Hook to manage price input formatting for product items
 */
export function usePriceInput(initialValue: number = 0) {
  const [priceInput, setPriceInput] = useState<string>(
    initialValue > 0 ? initialValue.toString() : ''
  );

  useEffect(() => {
    setPriceInput(initialValue > 0 ? initialValue.toString() : '');
  }, [initialValue]);

  const handlePriceChange = (
    value: string,
    onChange: (value: number) => void
  ) => {
    // Allow empty string
    if (value === '') {
      setPriceInput('');
      onChange(0);
      return;
    }

    // Allow only valid number format with max 2 decimals
    if (!/^\d*\.?\d{0,2}$/.test(value)) {
      return;
    }

    // Update local state (keep string with decimal point)
    setPriceInput(value);

    // Update form state with number (for validation)
    const numValue = parseFloat(value);
    onChange(isNaN(numValue) ? 0 : numValue);
  };

  const handlePriceBlur = (onChange: (value: number) => void) => {
    // Format on blur only if there's content
    if (priceInput === '' || priceInput === '.') {
      setPriceInput('');
      onChange(0);
      return;
    }

    const numValue = parseFloat(priceInput);
    if (!isNaN(numValue)) {
      // Only format to 2 decimals if the input had a decimal point
      const formatted = priceInput.includes('.')
        ? numValue.toFixed(2)
        : numValue.toString();
      setPriceInput(formatted);
      onChange(parseFloat(formatted));
    }
  };

  return {
    priceInput,
    setPriceInput,
    handlePriceChange,
    handlePriceBlur,
  };
}
