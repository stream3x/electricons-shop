const category_data = {
  categories: [
    {
      categoryName: "Desktop computers",
      avatar: "/images/desktopAvatar.jpeg",
      slug: "desktop-computers",
      subCategory: [
        {url: 'AMD-Computers', subCategoryName: 'AMD Computers', topCategoryName: 'Desktop computers', topCategoryUrl: 'desktop-computers'},
        {url: 'Dell-Computers', subCategoryName: 'Dell Computers', topCategoryName: 'Desktop computers', topCategoryUrl: 'desktop-computers'},
        {url: 'HP-Computers', subCategoryName: 'HP Computers', topCategoryName: 'Desktop computers', topCategoryUrl: 'desktop-computers'}
      ]
    },
    {
      categoryName: "Laptop computers",
      avatar: "/images/laptopAvatar.jpg",
      slug: "laptops",
      subCategory: [
        {url: 'Acer-Laptops', subCategoryName: 'Acer Laptops', topCategoryName: 'Laptop computers', topCategoryUrl: 'laptops'},
        {url: 'Lenovo-Laptops', subCategoryName: 'Lenovo Laptops', topCategoryName: 'Laptop computers', topCategoryUrl: 'laptops'},
        {url: 'Toshiba-Laptops', subCategoryName: 'Toshiba Laptops', topCategoryName: 'Laptop computers', topCategoryUrl: 'laptops'}
      ]
    },
    {
      categoryName: "Smartphones",
      avatar: "/images/mobileAvatar.png",
      slug: "smartphones",
      subCategory: [
        {url: 'Xiaomi-Smartphones', subCategoryName: 'Xiaomi Smartphones', topCategoryName: 'Smartphones', topCategoryUrl: 'smartphones'},
        {url: 'Nokia-Smartphones', subCategoryName: 'Nokia Smartphones', topCategoryName: 'Smartphones', topCategoryUrl: 'smartphones'},
        {url: 'Huawei-Smartphones', subCategoryName: 'Huawei Smartphones', topCategoryName: 'Smartphones', topCategoryUrl: 'smartphones'}
      ]
    }
  ]
}

export default category_data;