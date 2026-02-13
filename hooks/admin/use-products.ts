import { useEffect, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProductSchema, ProductFormValues } from '@/lib';
import toast from 'react-hot-toast';
import { ActionResult, Product, ProductWithRelations } from '@/types';
import { createProduct, updateProduct } from '@/app/actions';

interface Props {
  product: ProductWithRelations | null;
  open: boolean;
  onClose: () => void;
  markAsSubmitted: () => void;
  isPizza: boolean;
}

export function useProductForm({
  product,
  open,
  onClose,
  markAsSubmitted,
  isPizza,
}: Props) {
  const [isPending, setIsPending] = useState(false);
  const isEditing = !!product;

  const form = useForm<ProductFormValues>({
    resolver: (values, context, options) => {
      return zodResolver(createProductSchema(isPizza))(
        values,
        context,
        options,
      );
    },
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

  useEffect(() => {
    if (!open) return;

    if (product) {
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
  }, [product, form, open]);

  const onSubmit = async (data: ProductFormValues) => {
    setIsPending(true);
    try {
      let result: ActionResult<Product>;
      if (isEditing) {
        result = await updateProduct(product.id, data);
      } else {
        result = await createProduct(data);
      }

      if (!result.success) {
        toast.error(
          result.message ||
            `Не удалось ${isEditing ? 'изменить' : 'создать'} продукт`,
        );
        return;
      }

      markAsSubmitted();
      toast.success(`Продукт успешно ${isEditing ? 'изменен' : 'создан'}`);
      onClose();
    } catch (error) {
      console.error('[ProductFormDialog] Error:', error);
      toast.error(`Не удалось ${isEditing ? 'изменить' : 'создать'} продукт`);
    } finally {
      setIsPending(false);
    }
  };

  return {
    form,
    isEditing,
    isPending,
    onSubmit,
  };
}

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
      { shouldValidate: false },
    );
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
    removeProductItem,
  };
}
