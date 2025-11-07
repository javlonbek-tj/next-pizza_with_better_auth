'use client';

import { Plus, AlertCircle, Info } from 'lucide-react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

import { ImageUploadInput } from '@/components/shared/ImageUploadInput';
import { FormActions } from '@/components/shared/FormActions';

import { ProductWithRelations } from '@/prisma/@types/prisma';
import { MultiSelect } from '@/components/shared/MultiSelect';
import { Category, Ingredient } from '@/lib/generated/prisma';
import {
  useProductForm,
  useProductImageUpload,
  useProductItems,
} from '@/hooks/admin/use-products';
import {
  useGetCategories,
  useGetIngredients,
  useGetPizzaSizes,
  useGetPizzaTypes,
} from '@/hooks';
import { ProductItemCard } from './ProductItemCard';
import {
  ProductFormValues,
  ProductItemFormValues,
} from '../schemas/product-schema';

interface Props {
  open: boolean;
  onClose: () => void;
  product?: ProductWithRelations | null;
}

export function ProductFormDialog({ open, onClose, product }: Props) {
  const { form, isEditing, isPending, onSubmit, isPizzaCategory } =
    useProductForm(product, open, onClose);

  const {
    previewUrl,
    isUploading,
    uploadFile,
    handleRemoveImage,
    cleanupOrphanedImage,
    markAsSubmitted,
    resetImageState,
  } = useProductImageUpload(product, open, form);

  const { productItems, addProductItem, removeProductItem, updateProductItem } =
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

    if (wasPizza !== isNewPizza) {
      form.setValue(
        'productItems',
        [
          {
            price: 0,
            sizeId: null,
            typeId: null,
          },
        ],
        { shouldValidate: true } // <-- THIS IS KEY
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[850px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold'>
            {isEditing ? 'Редактировать продукт' : 'Создать новый продукт'}
          </DialogTitle>
        </DialogHeader>

        {isLoadingOptions ? (
          <div className='py-4 space-y-4'>
            <Skeleton className='w-full h-48 rounded-lg' />
            <Skeleton className='w-full h-12' />
            <Skeleton className='w-full h-12' />
            <Skeleton className='w-full h-32' />
            <Skeleton className='w-full h-32' />
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className='space-y-6'
            >
              {/* Basic Information Section */}
              <div className='space-y-4'>
                <div className='flex items-center gap-2'>
                  <div className='bg-primary/10 p-1.5 rounded-md'>
                    <Info className='w-4 h-4 text-primary' />
                  </div>
                  <h3 className='text-lg font-semibold'>Основная информация</h3>
                </div>

                {/* Image Upload */}
                <FormField
                  control={form.control}
                  name='imageUrl'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-base'>
                        Изображение продукта{' '}
                        <span className='text-red-500'>*</span>
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
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-base'>
                        Название продукта{' '}
                        <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Например: Пепперони, Маргарита, Четыре сыра'
                          {...field}
                          disabled={isPending}
                          autoComplete='off'
                          className='text-base'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={form.control}
                  name='categoryId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-base'>
                        Категория <span className='text-red-500'>*</span>
                      </FormLabel>
                      <Select
                        value={field.value ?? 'none'}
                        onValueChange={handleCategoryChange}
                        disabled={isPending || !categories?.length}
                      >
                        <FormControl>
                          <SelectTrigger className='text-base'>
                            <SelectValue placeholder='Выберите категорию' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='none'>
                            Выберите категорию
                          </SelectItem>
                          {categories?.map((category: Category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {categories?.length
                          ? ''
                          : 'Сначала создайте категории в разделе "Категории"'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Ingredients */}
                <FormField
                  control={form.control}
                  name='ingredientIds'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-base'>Ингредиенты</FormLabel>
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
                          placeholder='Выберите ингредиенты'
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
              <div className='space-y-4'>
                <div className='flex justify-end'>
                  {isPizzaCategory && (
                    <Button
                      type='button'
                      variant='default'
                      size='sm'
                      onClick={addProductItem}
                      disabled={isPending}
                      className='cursor-pointer'
                    >
                      <Plus className='w-4 h-4 mr-2' />
                      Добавить вариант
                    </Button>
                  )}
                </div>

                <div className='space-y-3'>
                  {productItems.map(
                    (item: ProductItemFormValues, index: number) => (
                      <ProductItemCard
                        key={index}
                        item={item}
                        index={index}
                        pizzaSizes={pizzaSizes || []}
                        pizzaTypes={pizzaTypes || []}
                        onUpdate={updateProductItem}
                        onRemove={removeProductItem}
                        disabled={isPending}
                        canRemove={
                          isPizzaCategory ? productItems.length > 1 : false
                        }
                        isPizzaCategory={isPizzaCategory}
                      />
                    )
                  )}
                </div>

                {form.formState.errors.productItems && (
                  <Alert variant='destructive'>
                    <AlertCircle className='w-4 h-4' />
                    <AlertDescription>
                      {(() => {
                        const error = form.formState.errors.productItems;

                        // If it's a root error (like minimum items)
                        if (error.message) {
                          return error.message;
                        }

                        // If it's an array of errors for individual items
                        if (Array.isArray(error)) {
                          const errorMessages = error
                            .map((item, index) => {
                              if (!item) return null;
                              const errors = [];
                              if (item.price?.message)
                                errors.push(
                                  `Вариант ${index + 1}: ${item.price.message}`
                                );
                              if (item.sizeId?.message)
                                errors.push(
                                  `Вариант ${index + 1}: ${item.sizeId.message}`
                                );
                              if (item.typeId?.message)
                                errors.push(
                                  `Вариант ${index + 1}: ${item.typeId.message}`
                                );
                              return errors.join(', ');
                            })
                            .filter(Boolean);

                          return errorMessages.length > 0
                            ? errorMessages.join(' • ')
                            : 'Исправьте ошибки в вариантах продукта';
                        }

                        return 'Исправьте ошибки в вариантах продукта';
                      })()}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Actions */}
              <FormActions
                isEditing={isEditing}
                isPending={isPending}
                isLoading={isUploading}
                onCancel={() => handleClose(false)}
                className='pt-2'
              />
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
