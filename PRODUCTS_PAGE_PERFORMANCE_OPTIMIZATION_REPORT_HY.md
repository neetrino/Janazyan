# `/products` էջի performance փոփոխությունների ամփոփում

## Ինչ խնդիր կար

`/products` էջը արդեն ուներ լավ հիմք՝ SSR, `Suspense`, Redis cache, `fastCatalog` և թեթև DB select։ Բայց առաջին բացման ժամանակ էջը կարող էր ծանր զգացվել, որովհետև product card-երի մեծ մասը client-side էր hydrate լինում։

Գլխավոր խնդիրները՝

- Յուրաքանչյուր card hydrate էր անում client hooks՝ wishlist, cart, auth, currency, translation։
- Grid mode-ում նույն card-ը երկու անգամ էր render լինում՝ mobile և desktop տարբերակներով։
- Առաջին 8 product image-ները priority/eager էին բեռնվում, ինչը ավելացնում էր initial network load-ը։

## Ինչ եմ փոխել

- `ProductCard`-ի visual մասը դարձրել եմ server-rendered։
- Wishlist և add-to-cart կոճակները առանձնացրել եմ փոքր client component-ի մեջ։
- Currency price rendering-ը առանձնացրել եմ առանձին փոքր client component-ի մեջ, որ user-selected currency behavior-ը չկոտրվի։
- `ProductsGrid`-ը դարձրել եմ server-rendered, իսկ view mode-ի localStorage/event logic-ը տեղափոխել եմ մեկ փոքր client wrapper-ի մեջ՝ `ProductsGridViewMode.client.tsx`։
- Հանել եմ կրկնվող mobile/desktop card DOM-ը։ Հիմա յուրաքանչյուր product-ի համար render է լինում մեկ responsive card։
- Product image priority count-ը իջեցրել եմ 8-ից 2-ի։
- Catalog cache-ի համար ավելացրել եմ անվտանգ debug logging՝ cache hit/miss տեսնելու համար։
- Prisma schema-ում ավելացրել եմ նպատակային index-ներ catalog cold miss query-ների համար։
- Fix եմ արել `/products/[slug]` էջի `revalidate` export-ի համար, որպեսզի production build-ը անցնի։

## Ինչու է սա արագացնում էջը

- Էջը ավելի քիչ JavaScript է ուղարկում browser-ին։
- Card-ի ամբողջ UI-ն այլևս client-side hydrate չի լինում։
- Hydration մնում է միայն իրական interactive մասերի վրա։
- DOM-ը փոքրացել է, որովհետև mobile և desktop card տարբերակները այլևս կրկնակի չեն render լինում։
- Առաջին load-ի ժամանակ browser-ը ավելի քիչ image է eager բեռնում։
- Cache logging-ը օգնում է հասկանալ Redis-ն է աշխատում, թե fallback memory cache-ը։

## Փոփոխված հիմնական ֆայլերը

- `src/components/ProductsGrid.tsx`
- `src/components/ProductsGridViewMode.client.tsx`
- `src/components/ProductCard.tsx`
- `src/components/home/FeaturedProductCard.tsx`
- `src/components/home/FeaturedProductCardActions.client.tsx`
- `src/components/home/FeaturedProductCardPrice.client.tsx`
- `src/components/home/FeaturedProductCardSlot.tsx`
- `src/app/globals.css`
- `src/lib/cache/products-catalog-redis-cache.ts`
- `shared/db/prisma/schema.prisma`
- `src/app/products/[slug]/page.tsx`

## Ինչ դիտմամբ չեմ փոխել

- Catalog architecture-ը չեմ rewrite արել։
- Product filtering/sorting business logic-ը չեմ փոխել։
- Wishlist, cart և auth behavior-ը չեմ հեռացրել։
- Նոր library չեմ ավելացրել։
- Cache TTL արժեքները չեմ փոխել, որովհետև դրանք business freshness որոշումներ են։

## Ստուգումներ

Աշխատացրել եմ և բոլորը անցել են՝

- `corepack pnpm lint`
- `corepack pnpm exec tsc --noEmit`
- `corepack pnpm run build`
- `corepack pnpm test`

Build-ի ժամանակ մնացել է միայն unrelated font warning՝ `Special Gothic Expanded One` font fallback-ի մասին։

## Մնացած կարևոր նշում

Prisma schema-ում index-ներ ավելացվել են, բայց database migration-ը դեռ պետք է generate/apply անել project-ի Prisma workflow-ով։
