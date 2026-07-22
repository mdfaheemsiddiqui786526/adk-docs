import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default admin user
  const adminPassword = await bcrypt.hash('admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@velbers.com' },
    update: {},
    create: {
      email: 'admin@velbers.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      emailVerified: true,
      role: 'ADMIN',
      isActive: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create categories
  const categories = [
    {
      name: 'Running Shoes',
      slug: 'running-shoes',
      description: 'High-performance running shoes for every pace',
      icon: '🏃',
    },
    {
      name: 'Casual Shoes',
      slug: 'casual-shoes',
      description: 'Comfortable shoes for everyday wear',
      icon: '👟',
    },
    {
      name: 'Sports Shoes',
      slug: 'sports-shoes',
      description: 'Professional sports footwear',
      icon: '⚽',
    },
    {
      name: 'Formal Shoes',
      slug: 'formal-shoes',
      description: 'Elegant shoes for formal occasions',
      icon: '👞',
    },
    {
      name: 'Sneakers',
      slug: 'sneakers',
      description: 'Trendy sneakers and lifestyle shoes',
      icon: '✨',
    },
  ];

  const createdCategories = await Promise.all(
    categories.map((cat) =>
      prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
      })
    )
  );
  console.log(`✅ ${createdCategories.length} categories created`);

  // Create brands
  const brands = [
    { name: 'Nike', slug: 'nike', website: 'https://www.nike.com' },
    { name: 'Adidas', slug: 'adidas', website: 'https://www.adidas.com' },
    { name: 'Allbirds', slug: 'allbirds', website: 'https://www.allbirds.com' },
    { name: 'Puma', slug: 'puma', website: 'https://www.puma.com' },
    { name: 'New Balance', slug: 'new-balance', website: 'https://www.newbalance.com' },
  ];

  const createdBrands = await Promise.all(
    brands.map((brand) =>
      prisma.brand.upsert({
        where: { slug: brand.slug },
        update: {},
        create: brand,
      })
    )
  );
  console.log(`✅ ${createdBrands.length} brands created`);

  // Create sample products
  const products = [
    {
      name: 'Premium Running Pro Max',
      slug: 'premium-running-pro-max',
      description: 'Experience ultimate comfort with our premium running shoes',
      shortDescription: 'Premium running shoes for professionals',
      price: 12999,
      originalPrice: 15999,
      discount: 19,
      thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
      ],
      sku: 'PREMIUM-RUN-001',
      stock: 50,
      categoryId: createdCategories[0].id,
      brandId: createdBrands[0].id,
      seoTitle: 'Premium Running Pro Max Shoes',
      seoDescription: 'Buy premium running shoes online in India',
      isFeatured: true,
      isNew: true,
    },
    {
      name: 'Urban Casual Comfort',
      slug: 'urban-casual-comfort',
      description: 'Perfect for everyday casual wear with style and comfort',
      shortDescription: 'Stylish casual shoes for daily use',
      price: 6999,
      originalPrice: 8999,
      discount: 22,
      thumbnail: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500',
      images: [
        'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500',
      ],
      sku: 'URBAN-CASUAL-001',
      stock: 75,
      categoryId: createdCategories[1].id,
      brandId: createdBrands[1].id,
      isBestseller: true,
    },
    {
      name: 'Elite Sports Performance',
      slug: 'elite-sports-performance',
      description: 'Professional-grade sports shoes for athletes',
      shortDescription: 'Professional sports footwear',
      price: 14999,
      originalPrice: 18999,
      discount: 21,
      thumbnail: 'https://images.unsplash.com/photo-1437183972735-5f8b76e15e5d?w=500',
      images: [
        'https://images.unsplash.com/photo-1437183972735-5f8b76e15e5d?w=500',
      ],
      sku: 'ELITE-SPORTS-001',
      stock: 30,
      categoryId: createdCategories[2].id,
      brandId: createdBrands[2].id,
      isFeatured: true,
    },
  ];

  const createdProducts = await Promise.all(
    products.map((product) =>
      prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: product,
      })
    )
  );
  console.log(`✅ ${createdProducts.length} products created`);

  // Create product variants
  for (const product of createdProducts) {
    const variants = [
      { name: 'Black - Size 7', size: '7', color: 'Black', sku: `${product.sku}-BK-7` },
      { name: 'Black - Size 8', size: '8', color: 'Black', sku: `${product.sku}-BK-8` },
      { name: 'Black - Size 9', size: '9', color: 'Black', sku: `${product.sku}-BK-9` },
      { name: 'White - Size 8', size: '8', color: 'White', sku: `${product.sku}-WH-8` },
    ];

    for (const variant of variants) {
      await prisma.productVariant.upsert({
        where: { sku: variant.sku },
        update: {},
        create: {
          ...variant,
          productId: product.id,
          price: product.price,
          stock: 20,
        },
      });
    }
  }
  console.log('✅ Product variants created');

  // Create sample banners
  const banners = [
    {
      title: 'Summer Collection 2026',
      description: 'Discover our latest summer collection',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200',
      link: '/products/summer-collection',
      position: 'HOME_HERO' as const,
      displayOrder: 1,
    },
    {
      title: 'Limited Edition Drops',
      description: 'Exclusive limited edition shoes',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200',
      link: '/products/limited-edition',
      position: 'HOME_TOP' as const,
      displayOrder: 1,
    },
  ];

  const createdBanners = await Promise.all(
    banners.map((banner) =>
      prisma.banner.create({
        data: banner,
      })
    )
  );
  console.log(`✅ ${createdBanners.length} banners created`);

  // Create CMS pages
  const pages = [
    {
      title: 'About Us',
      slug: 'about-us',
      content: 'VELBERS is India\'s premium shoes brand...',
      seoTitle: 'About VELBERS',
      isPublished: true,
    },
    {
      title: 'Privacy Policy',
      slug: 'privacy-policy',
      content: 'Your privacy is important to us...',
      seoTitle: 'Privacy Policy',
      isPublished: true,
    },
    {
      title: 'Terms & Conditions',
      slug: 'terms-conditions',
      content: 'By using VELBERS, you agree to our terms...',
      seoTitle: 'Terms & Conditions',
      isPublished: true,
    },
  ];

  const createdPages = await Promise.all(
    pages.map((page) =>
      prisma.page.upsert({
        where: { slug: page.slug },
        update: {},
        create: page,
      })
    )
  );
  console.log(`✅ ${createdPages.length} CMS pages created`);

  console.log('\n✨ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
