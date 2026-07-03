// Translation utilities
import { getStoredLanguage, type LanguageCode } from './language';

export const translations = {
  en: {
    stock: {
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
    },
    cart: {
      title: 'Shopping Cart',
      empty: 'Your cart is empty',
      orderSummary: 'Order Summary',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      tax: 'Tax',
      total: 'Total',
      free: 'Free',
      proceedToCheckout: 'Proceed to Checkout',
      remove: 'Remove',
      items: 'items',
      item: 'item',
    },
    wishlist: {
      title: 'My Wishlist',
      empty: 'Your wishlist is empty',
      emptyDescription: 'Start adding products to your wishlist to save them for later.',
      browseProducts: 'Browse Products',
      remove: 'Remove',
      items: 'items',
      item: 'item',
      totalCount: 'Total items in wishlist',
    },
    compare: {
      title: 'Compare Products',
      empty: 'No products to compare',
      emptyDescription: 'Add up to 4 products to compare their features and prices.',
      browseProducts: 'Browse Products',
      remove: 'Remove',
      products: 'products',
      product: 'product',
    },
    product: {
      addToCart: 'Add to Cart',
      addToWishlist: 'Add to Wishlist',
      viewProduct: 'View Product',
      viewDetails: 'View Details',
      productInformation: 'Product Information',
      browseProducts: 'Browse Products',
    },
    reviews: {
      title: 'Reviews',
      writeReview: 'Write a Review',
      rating: 'Rating',
      comment: 'Your Review',
      commentPlaceholder: 'Share your thoughts about this product...',
      submit: 'Submit Review',
      submitting: 'Submitting...',
      cancel: 'Cancel',
      loginRequired: 'Please login to write a review',
      ratingRequired: 'Please select a rating',
      commentRequired: 'Please write a comment',
      submitError: 'Failed to submit review',
      noReviews: 'No reviews yet. Be the first to review this product!',
      review: 'review',
      reviews: 'reviews',
    },
  },
  hy: {
    stock: {
      inStock: 'Պահեստում',
      outOfStock: 'Արտադրված',
    },
    cart: {
      title: 'Գնումների զամբյուղ',
      empty: 'Ձեր զամբյուղը դատարկ է',
      orderSummary: 'Պատվերի ամփոփում',
      subtotal: 'Ենթագումար',
      shipping: 'Առաքում',
      tax: 'Հարկ',
      total: 'Ընդամենը',
      free: 'Անվճար',
      proceedToCheckout: 'Անցնել վճարման',
      remove: 'Հեռացնել',
      items: 'ապրանք',
      item: 'ապրանք',
    },
    wishlist: {
      title: 'Իմ ցանկությունների ցուցակ',
      empty: 'Ձեր ցանկությունների ցուցակը դատարկ է',
      emptyDescription: 'Սկսեք ավելացնել ապրանքներ ձեր ցանկությունների ցուցակին՝ հետագա օգտագործման համար:',
      browseProducts: 'Դիտել ապրանքները',
      remove: 'Հեռացնել',
      items: 'ապրանք',
      item: 'ապրանք',
      totalCount: 'Ընդհանուր ապրանքներ ցանկությունների ցուցակում',
    },
    compare: {
      title: 'Համեմատել ապրանքները',
      empty: 'Համեմատելու ապրանքներ չկան',
      emptyDescription: 'Ավելացրեք մինչև 4 ապրանք՝ դրանց հատկանիշներն ու գները համեմատելու համար:',
      browseProducts: 'Դիտել ապրանքները',
      remove: 'Հեռացնել',
      products: 'ապրանք',
      product: 'ապրանք',
    },
    product: {
      addToCart: 'Ավելացնել զամբյուղ',
      addToWishlist: 'Ավելացնել ցանկությունների ցուցակ',
      viewProduct: 'Դիտել ապրանքը',
      viewDetails: 'Դիտել մանրամասները',
      productInformation: 'Ապրանքի տեղեկություն',
      browseProducts: 'Դիտել ապրանքները',
    },
    reviews: {
      title: 'Կարծիքներ',
      writeReview: 'Գրել կարծիք',
      rating: 'Գնահատական',
      comment: 'Ձեր կարծիքը',
      commentPlaceholder: 'Կիսվեք ձեր մտքերով այս ապրանքի մասին...',
      submit: 'Ուղարկել կարծիք',
      submitting: 'Ուղարկվում է...',
      cancel: 'Չեղարկել',
      loginRequired: 'Խնդրում ենք մուտք գործել կարծիք գրելու համար',
      ratingRequired: 'Խնդրում ենք ընտրել գնահատական',
      commentRequired: 'Խնդրում ենք գրել կարծիք',
      submitError: 'Չհաջողվեց ուղարկել կարծիքը',
      noReviews: 'Կարծիքներ դեռ չկան: Դարձեք առաջինը, ով կգրի կարծիք:',
      review: 'կարծիք',
      reviews: 'կարծիք',
    },
  },
  ru: {
    stock: {
      inStock: 'В наличии',
      outOfStock: 'Нет в наличии',
    },
    cart: {
      title: 'Корзина покупок',
      empty: 'Ваша корзина пуста',
      orderSummary: 'Сводка заказа',
      subtotal: 'Промежуточный итог',
      shipping: 'Доставка',
      tax: 'Налог',
      total: 'Итого',
      free: 'Бесплатно',
      proceedToCheckout: 'Перейти к оплате',
      remove: 'Удалить',
      items: 'товаров',
      item: 'товар',
    },
    wishlist: {
      title: 'Мой список желаний',
      empty: 'Ваш список желаний пуст',
      emptyDescription: 'Начните добавлять товары в список желаний, чтобы сохранить их на потом.',
      browseProducts: 'Просмотреть товары',
      remove: 'Удалить',
      items: 'товаров',
      item: 'товар',
      totalCount: 'Всего товаров в списке желаний',
    },
    compare: {
      title: 'Сравнить товары',
      empty: 'Нет товаров для сравнения',
      emptyDescription: 'Добавьте до 4 товаров, чтобы сравнить их характеристики и цены.',
      browseProducts: 'Просмотреть товары',
      remove: 'Удалить',
      products: 'товаров',
      product: 'товар',
    },
    product: {
      addToCart: 'Добавить в корзину',
      addToWishlist: 'Добавить в список желаний',
      viewProduct: 'Просмотреть товар',
      viewDetails: 'Просмотреть детали',
      productInformation: 'Информация о товаре',
      browseProducts: 'Просмотреть товары',
    },
    reviews: {
      title: 'Отзывы',
      writeReview: 'Написать отзыв',
      rating: 'Оценка',
      comment: 'Ваш отзыв',
      commentPlaceholder: 'Поделитесь своими мыслями об этом товаре...',
      submit: 'Отправить отзыв',
      submitting: 'Отправка...',
      cancel: 'Отмена',
      loginRequired: 'Пожалуйста, войдите, чтобы написать отзыв',
      ratingRequired: 'Пожалуйста, выберите оценку',
      commentRequired: 'Пожалуйста, напишите отзыв',
      submitError: 'Не удалось отправить отзыв',
      noReviews: 'Отзывов пока нет. Будьте первым, кто оставит отзыв!',
      review: 'отзыв',
      reviews: 'отзывов',
    },
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function getTranslation(key: string, language?: LanguageCode): string {
  const lang = language || getStoredLanguage();
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k as keyof typeof value];
    } else {
      // Fallback to English if translation not found
      value = translations.en;
      for (const k2 of keys) {
        if (value && typeof value === 'object' && k2 in value) {
          value = value[k2 as keyof typeof value];
        } else {
          return key;
        }
      }
      break;
    }
  }
  
  return typeof value === 'string' ? value : key;
}

// Simple hook for client components
export function useTranslation() {
  // This will be implemented in client components using useState/useEffect
  // For now, just return a function that uses current language
  return {
    t: (key: string) => getTranslation(key),
  };
}

