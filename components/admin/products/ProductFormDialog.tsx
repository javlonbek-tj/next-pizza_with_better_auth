'use client';

import { Plus, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
import { Skeleton } from '@/components/ui/skeleton';

import { ImageUploadInput } from '@/components/shared/ImageUploadInput';
import { FormActions } from '@/components/shared/FormActions';

import { ProductWithRelations, Category, Ingredient } from '@/types';
import { MultiSelect } from '@/components/shared/MultiSelect';
import { useProductForm, useProductItems, useImageUpload } from '@/hooks';
import {
  useGetCategories,
  useGetIngredients,
  useGetPizzaSizes,
  useGetPizzaTypes,
} from '@/hooks';
import { ProductItemCard } from './ProductItemCard';
import { ProductFormValues } from '../schemas/product-schema';

interface Props {
  open: boolean;
  onClose: () => void;
  product?: ProductWithRelations | null;
}

export function ProductFormDialog({ open, onClose, product = null }: Props) {
  const {
    form,
    isEditing,
    isPending,
    onSubmit,
    isPizzaCategory,
    originalImageUrl,
  } = useProductForm(product, open, onClose);

  const {
    previewUrl,
    isUploading,
    uploadFile,
    handleRemoveImage,
    cleanupOrphanedImage,
    markAsSubmitted,
    resetImageState,
  } = useImageUpload(
    product?.imageUrl,
    open,
    {
      setValue: form.setValue,
      setError: form.setError,
      clearErrors: form.clearErrors,
    },
    'products',
    originalImageUrl
  );

  const { productItems, addProductItem, removeProductItem } =
    useProductItems(form);

  // Fetch select options
  const { data: categories, isPending: isCategoriesLoading } =
    useGetCategories();
  const { data: ingredients, isPending: isIngredientsLoading } =
    useGetIngredients();
  const { data: pizzaSizes, isPending: isSizesLoading } = useGetPizzaSizes();
  const { data: pizzaTypes, isPending: isTypesLoading } = useGetPizzaTypes();

  const isLoadingOptions =
    isCategoriesLoading ||
    isIngredientsLoading ||
    isSizesLoading ||
    isTypesLoading;

  const handleSubmit = (data: ProductFormValues) => {
    onSubmit(data, () => {
      markAsSubmitted();
      resetImageState();
    });
  };

  const handleClose = async (isOpen: boolean) => {
    if (!isOpen) {
      await cleanupOrphanedImage();
    }
    onClose();
  };

  const handleCategoryChange = (value: string) => {
    const newCategoryId = value === 'none' ? '' : value;
    const wasPizza = isPizzaCategory;

    form.setValue('categoryId', newCategoryId, { shouldValidate: true });

    const newCategory = categories?.find((cat) => cat.id === newCategoryId);
    const isNewPizza = newCategory?.name.toLowerCase() === 'пиццы';

    // If switching between pizza and non-pizza categories, reset product items
    if (wasPizza !== isNewPizza) {
      // Clear any existing validation errors
      form.clearErrors('productItems');

      // Reset product items with appropriate default values
      form.setValue(
        'productItems',
        [
          {
            price: 0,
            sizeId: null,
            typeId: null,
          },
        ],
        { shouldValidate: false } // Don't validate immediately on reset
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[850px] max-h-[90vh] overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">
            {isEditing ? 'Редактировать продукт' : 'Создать новый продукт'}
          </DialogTitle>
        </DialogHeader>

        {isLoadingOptions ? (
          <div className="space-y-4 py-4">
            <Skeleton className="rounded-lg w-full h-48" />
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-32" />
            <Skeleton className="w-full h-32" />
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {/* Basic Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-1.5 rounded-md">
                    <Info className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Основная информация</h3>
                </div>

                {/* Image Upload */}
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        Изображение продукта{' '}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <ImageUploadInput
                          value={previewUrl}
                          onChange={field.onChange}
                          onUpload={uploadFile}
                          onRemove={handleRemoveImage}
                          isUploading={isUploading}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        Название продукта{' '}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Например: Пепперони, Маргарита, Четыре сыра"
                          {...field}
                          disabled={isPending}
                          autoComplete="off"
                          className="text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        Категория <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        value={field.value ?? 'none'}
                        onValueChange={handleCategoryChange}
                        disabled={isPending || !categories?.length}
                      >
                        <FormControl>
                          <SelectTrigger className="text-base">
                            <SelectValue placeholder="Выберите категорию" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">
                            Выберите категорию
                          </SelectItem>
                          {categories?.map((category: Category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Ingredients */}
                <FormField
                  control={form.control}
                  name="ingredientIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Ингредиенты</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={
                            ingredients?.map((ing: Ingredient) => ({
                              label: ing.name,
                              value: ing.id,
                            })) || []
                          }
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Выберите ингредиенты"
                          disabled={isPending || !ingredients?.length}
                        />
                      </FormControl>
                      <FormDescription>
                        {ingredients?.length
                          ? ''
                          : 'Сначала создайте ингредиенты в разделе "Ингредиенты"'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Product Items Section */}
              <div className="space-y-4">
                {/* Only show button container for pizza category */}
                {isPizzaCategory && (
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      onClick={addProductItem}
                      disabled={isPending}
                      className="cursor-pointer"
                    >
                      <Plus className="mr-2 w-4 h-4" />
                      Добавить вариант
                    </Button>
                  </div>
                )}

                <div className={isPizzaCategory ? 'space-y-3' : ''}>
                  {productItems.map((_, index: number) => (
                    <ProductItemCard
                      key={index}
                      form={form}
                      index={index}
                      pizzaSizes={pizzaSizes || []}
                      pizzaTypes={pizzaTypes || []}
                      onRemove={removeProductItem}
                      disabled={isPending}
                      canRemove={
                        isPizzaCategory ? productItems.length > 1 : false
                      }
                      isPizzaCategory={isPizzaCategory}
                    />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <FormActions
                isEditing={isEditing}
                isPending={isPending}
                isLoading={isUploading}
                onCancel={() => handleClose(false)}
                className="pt-2"
              />
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
