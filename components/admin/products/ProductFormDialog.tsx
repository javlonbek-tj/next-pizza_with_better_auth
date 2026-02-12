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
import { Checkbox } from '@/components/ui/checkbox';

import { ImageUploadInput } from '@/components/shared/ImageUploadInput';
import { FormActions } from '@/components/shared/FormActions';

import {
  ProductWithRelations,
  Category,
  Ingredient,
  PizzaSize,
  PizzaType,
} from '@/types';
import { MultiSelect } from '@/components/shared/MultiSelect';
import { useProductForm, useProductItems, useImageUpload } from '@/hooks';
import { ProductItemCard } from './ProductItemCard';

interface Props {
  open: boolean;
  onClose: () => void;
  product: ProductWithRelations | null;
  categories: Category[];
  ingredients: Ingredient[];
  sizes: PizzaSize[];
  types: PizzaType[];
}

export function ProductFormDialog({
  open,
  onClose,
  product,
  categories,
  ingredients,
  sizes,
  types,
}: Props) {
  const {
    previewUrl,
    removeImage,
    isUploading: isImageUploading,
    uploadFile,
    cleanupOrphanedImage,
    markAsSubmitted,
  } = useImageUpload(product?.imageUrl, open, 'products', product?.imageUrl);

  const { form, isEditing, isPending, onSubmit, isPizza } = useProductForm({
    product,
    open,
    onClose,
    markAsSubmitted,
  });

  const { productItems, addProductItem, removeProductItem } =
    useProductItems(form);

  const handleClose = async (isOpen: boolean) => {
    if (!isOpen) {
      await cleanupOrphanedImage();
    }
    onClose();
  };

  const handleRemoveImage = async () => {
    await removeImage();
    form.setValue('imageUrl', '', { shouldValidate: true });
  };

  const handleUploadFile = async (file: File) => {
    const res = await uploadFile(file);
    if (!res.success) {
      form.setError('imageUrl', {
        type: 'manual',
        message: res.message,
      });
      return;
    }
    form.clearErrors('imageUrl');
    form.setValue('imageUrl', res.data?.imageUrl || '', {
      shouldValidate: true,
    });
  };

  const handleCategoryChange = (value: string) => {
    const newCategoryId = value === 'none' ? '' : value;
    form.setValue('categoryId', newCategoryId, { shouldValidate: true });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-thin'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold'>
            {isEditing ? 'Редактировать продукт' : 'Создать новый продукт'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
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
                render={() => (
                  <FormItem>
                    <FormLabel className='text-base'>
                      Изображение продукта{' '}
                      <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <ImageUploadInput
                        value={previewUrl}
                        onUpload={handleUploadFile}
                        onRemove={handleRemoveImage}
                        isUploading={isImageUploading}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Is Pizza Toggle */}
              <FormField
                control={form.control}
                name='isPizza'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center p-4 space-x-3 space-y-0 border rounded-md bg-gray-50/50'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                      />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel className='text-base font-semibold cursor-pointer'>
                        Это пицца
                      </FormLabel>
                      <FormDescription>
                        Включите, если продукт является пиццей (будут доступны
                        размеры и типы теста)
                      </FormDescription>
                    </div>
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
                      Название продукта <span className='text-red-500'>*</span>
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

              {/* Category - Only shown if not pizza */}
              {!form.watch('isPizza') && (
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
                          {categories
                            ?.filter(
                              (cat) => cat.name.toLowerCase() !== 'пиццы',
                            )
                            .map((category: Category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className='text-red-500' />
                    </FormItem>
                  )}
                />
              )}

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
              {/* Only show button container for pizza category */}
              {isPizza && (
                <div className='flex justify-end'>
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
                </div>
              )}

              <div className={isPizza ? 'space-y-3' : ''}>
                {productItems.map((_, index: number) => (
                  <ProductItemCard
                    key={index}
                    form={form}
                    index={index}
                    pizzaSizes={sizes || []}
                    pizzaTypes={types || []}
                    onRemove={removeProductItem}
                    disabled={isPending}
                    canRemove={isPizza ? productItems.length > 1 : false}
                    isPizzaCategory={isPizza}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <FormActions
              isEditing={isEditing}
              isPending={isPending}
              isLoading={isImageUploading}
              onCancel={() => handleClose(false)}
              className='pt-2'
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
