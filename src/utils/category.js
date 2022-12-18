const category_data = {
  categories: [
    {
      categoryName: "Desktop computers",
      avatar: "/images/desktopAvatar.jpeg",
      slug: "desktop-computers",
      subCategory: [
        {url: 'amd-computers', subCategoryName: 'AMD computers', topCategoryName: 'Desktop computers', topCategoryUrl: 'desktop-computers'},
        {url: 'dell-computers', subCategoryName: 'Dell Computers', topCategoryName: 'Desktop computers', topCategoryUrl: 'desktop-computers'},
        {url: 'hp-computers', subCategoryName: 'HP computers', topCategoryName: 'Desktop computers', topCategoryUrl: 'desktop-computers'}
      ]
    },
    {
      categoryName: "Laptop computers",
      avatar: "/images/laptopAvatar.jpg",
      slug: "laptops",
      subCategory: [
        {url: 'acer-laptops', subCategoryName: 'Acer laptops', topCategoryName: 'Laptop computers', topCategoryUrl: 'laptops'},
        {url: 'lenovo-laptops', subCategoryName: 'Lenovo laptops', topCategoryName: 'Laptop computers', topCategoryUrl: 'laptops'},
        {url: 'toshiba-laptops', subCategoryName: 'Toshiba laptops', topCategoryName: 'Laptop computers', topCategoryUrl: 'laptops'}
      ]
    },
    {
      categoryName: "Smartphones",
      avatar: "/images/mobileAvatar.png",
      slug: "smartphones",
      subCategory: [
        {url: 'xiaomi-smartphones', subCategoryName: 'Xiaomi smartphones', topCategoryName: 'Smartphones', topCategoryUrl: 'smartphones'},
        {url: 'nokia-smartphones', subCategoryName: 'Nokia smartphones', topCategoryName: 'Smartphones', topCategoryUrl: 'smartphones'},
        {url: 'huawei-smartphones', subCategoryName: 'Huawei smartphones', topCategoryName: 'Smartphones', topCategoryUrl: 'smartphones'}
      ]
    }
  ]
}

export default category_data;