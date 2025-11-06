'use client';

import { Plus, AlertCircle, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

import { ImageUploadInput } from '@/components/shared/ImageUploadInput';
import { FormActions } from '@/components/shared/FormActions';

import { ProductWithRelations } from '@/prisma/@types/prisma';
import { MultiSelect } from '@/components/shared/MultiSelect';
import { Category, Ingredient, ProductItem } from '@/lib/generated/prisma';
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

interface Props {
  open: boolean;
  onClose: () => void;
  product?: ProductWithRelations | null;
}

export function ProductFormDialog({ open, onClose, product }: Props) {
  const { form, isEditing, isPending, onSubmit } = useProductForm(
    product,
    open,
    onClose
  );

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

  console.log('[PRODUCTITEMS]', productItems);

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

  const handleSubmit = (data: any) => {
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[850px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold'>
            {isEditing ? 'Редактировать продукт' : 'Создать новый продукт'}
          </DialogTitle>
          <DialogDescription className='text-base'>
            {isEditing
              ? 'Измените информацию о продукте и его вариантах'
              : 'Заполните информацию о новом продукте и создайте варианты'}
          </DialogDescription>
        </DialogHeader>

        {isLoadingOptions ? (
          <div className='space-y-4 py-4'>
            <Skeleton className='h-48 w-full rounded-lg' />
            <Skeleton className='h-12 w-full' />
            <Skeleton className='h-12 w-full' />
            <Skeleton className='h-32 w-full' />
            <Skeleton className='h-32 w-full' />
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
                    <Info className='h-4 w-4 text-primary' />
                  </div>
                  <h3 className='font-semibold text-lg'>Основная информация</h3>
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
                      <FormDescription>
                        Введите название продукта на русском языке
                      </FormDescription>
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
                      <FormLabel className='text-base'>Категория</FormLabel>
                      <Select
                        value={field.value ?? 'none'}
                        onValueChange={(value) =>
                          field.onChange(value === 'none' ? null : value)
                        }
                        disabled={isPending || !categories?.length}
                      >
                        <FormControl>
                          <SelectTrigger className='text-base'>
                            <SelectValue placeholder='Выберите категорию' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='none'>Без категории</SelectItem>
                          {categories?.map((category: Category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {categories?.length
                          ? 'Выберите категорию для организации продуктов в меню'
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
                          ? 'Выберите ингредиенты, входящие в состав продукта'
                          : 'Сначала создайте ингредиенты в разделе "Ингредиенты"'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Product Items Section */}
              <div className='space-y-4'>
                <div className='flex justify-between items-start'>
                  <div className='space-y-1'>
                    <h3 className='font-semibold text-lg flex items-center gap-2'>
                      Варианты продукта
                      <span className='text-red-500'>*</span>
                    </h3>
                    <p className='text-muted-foreground text-sm'>
                      Создайте варианты с разными размерами, типами теста и
                      ценами
                    </p>
                  </div>
                  <Button
                    type='button'
                    variant='default'
                    size='sm'
                    onClick={addProductItem}
                    disabled={isPending}
                    className='cursor-pointer'
                  >
                    <Plus className='mr-2 h-4 w-4' />
                    Добавить вариант
                  </Button>
                </div>

                {/* Info Alert */}
                {!pizzaSizes?.length && !pizzaTypes?.length && (
                  <Alert className='bg-amber-50 border-amber-200'>
                    <AlertCircle className='h-4 w-4 text-amber-600' />
                    <AlertTitle className='text-amber-900'>Внимание</AlertTitle>
                    <AlertDescription className='text-amber-800'>
                      Для создания вариантов с размерами и типами, сначала
                      создайте их в разделах "Размеры пиццы" и "Типы пиццы"
                    </AlertDescription>
                  </Alert>
                )}

                {productItems.length === 0 ? (
                  <Alert variant='destructive'>
                    <AlertCircle className='h-4 w-4' />
                    <AlertTitle>Нет вариантов продукта</AlertTitle>
                    <AlertDescription>
                      Добавьте хотя бы один вариант продукта. Нажмите "Добавить
                      вариант" чтобы создать.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className='space-y-3'>
                    {productItems.map((item: ProductItem, index: number) => (
                      <ProductItemCard
                        key={index}
                        item={item}
                        index={index}
                        pizzaSizes={pizzaSizes || []}
                        pizzaTypes={pizzaTypes || []}
                        onUpdate={updateProductItem}
                        onRemove={removeProductItem}
                        disabled={isPending}
                        canRemove={productItems.length > 1}
                      />
                    ))}
                  </div>
                )}

                {form.formState.errors.productItems && (
                  <Alert variant='destructive'>
                    <AlertCircle className='h-4 w-4' />
                    <AlertDescription>
                      {form.formState.errors.productItems.message}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Usage Examples */}
                {productItems.length > 0 && (
                  <Alert className='bg-blue-50 border-blue-200'>
                    <Info className='h-4 w-4 text-blue-600' />
                    <AlertTitle className='text-blue-900'>
                      Примеры вариантов
                    </AlertTitle>
                    <AlertDescription className='text-blue-800 space-y-1'>
                      <p>• Маленькая + Традиционное = 399₽</p>
                      <p>• Средняя + Традиционное = 549₽</p>
                      <p>• Большая + Тонкое = 699₽</p>
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
