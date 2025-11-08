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
  const { mutate: createProduct, isPending } = useCreateProduct();
  const { data: categories } = useGetCategories();

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

    createProduct(transformedData, {
      onSuccess: () => {
        toast.success(
          isEditing ? 'Продукт успешно обновлен' : 'Продукт успешно создан'
        );
        onSuccess?.();
        onClose();
        form.reset();
      },
      onError: () => {
        toast.error(
          isEditing
            ? 'Ошибка при обновлении продукта'
            : 'Ошибка при создании продукта'
        );
      },
    });
  };

  return {
    form,
    isEditing,
    isPending,
    onSubmit,
    isPizzaCategory,
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
