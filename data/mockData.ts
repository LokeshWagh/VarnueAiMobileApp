// =====================
// MENU CATEGORIES
// =====================
export const menuCategories = [
  { id: "1", name: "Soups", description: "Warm and comforting soups", icon: "🍲" },
  { id: "2", name: "Starters", description: "Appetizers and finger foods", icon: "🥗" },
  { id: "3", name: "Main Course", description: "Hearty main dishes", icon: "🍛" },
  { id: "4", name: "Breads", description: "Freshly baked breads", icon: "🍞" },
  { id: "5", name: "Rice and Biryani", description: "Fragrant rice dishes", icon: "🍚" },
  { id: "6", name: "Rolls", description: "Wraps and rolls", icon: "🌯" },
];

// =====================
// MENU ITEMS
// =====================
export const menuItems = {
  "1": [
    { id: "101", name: "Veg Manchow Soup", description: "A spicy, flavorful vegetable soup with crispy noodles.", price: 89, image: "https://images.unsplash.com/photo-1535923054316-5f75572def8c?w=400", categoryId: "1", cuisine: "Chinese", rating: 4.3, dietary: "veg", hasDeals: false },
    { id: "102", name: "Veg Sweet Corn Soup", description: "A creamy, comforting soup made with sweet corn and herbs.", price: 79, image: "https://images.unsplash.com/photo-1665594051407-7385d281ad76?w=400", categoryId: "1", cuisine: "Chinese", rating: 4.4, dietary: "veg", hasDeals: false },
    { id: "103", name: "Chicken Manchow Soup", description: "A hearty chicken soup with a spicy, tangy flavor.", price: 109, image: "https://images.unsplash.com/photo-1612966948332-81d747414a8f?w=400", categoryId: "1", cuisine: "Chinese", rating: 4.5, dietary: "non-veg", hasDeals: false },
    { id: "104", name: "Chicken Sweet Corn Soup", description: "A mild and nourishing soup with tender chicken and corn.", price: 99, image: "https://images.unsplash.com/photo-1665594051407-7385d281ad76?w=400", categoryId: "1", cuisine: "Chinese", rating: 4.4, dietary: "non-veg", hasDeals: false },
  ],

  "2": [
    { id: "201", name: "Paneer Tikka", description: "Grilled cubes of marinated paneer cooked in a tandoor.", price: 249, image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400", categoryId: "2", cuisine: "North Indian", rating: 4.7, dietary: "veg", hasDeals: true },
    { id: "202", name: "Chilli Paneer", description: "Crispy paneer tossed in a spicy Indo-Chinese sauce.", price: 229, image: "https://images.unsplash.com/photo-1650080892550-c3a9a3ed1345?w=400", categoryId: "2", cuisine: "Chinese", rating: 4.6, dietary: "veg", hasDeals: false },
    { id: "203", name: "Veg Manchurian", description: "Fried vegetable balls tossed in a tangy Manchurian sauce.", price: 209, image: "https://images.unsplash.com/photo-1628474476846-a6f5b5cfc2f4?w=400", categoryId: "2", cuisine: "Chinese", rating: 4.5, dietary: "veg", hasDeals: false },
    { id: "204", name: "Veg Spring Roll", description: "Crispy rolls filled with seasoned mixed vegetables.", price: 189, image: "https://images.unsplash.com/photo-1577859584099-38d38a4aacb5?w=400", categoryId: "2", cuisine: "Chinese", rating: 4.4, dietary: "veg", hasDeals: true },
    { id: "205", name: "Chicken Tikka", description: "Juicy marinated chicken pieces grilled to perfection.", price: 299, image: "https://images.unsplash.com/photo-1718421670841-19501b4a9e03?w=400", categoryId: "2", cuisine: "North Indian", rating: 4.8, dietary: "non-veg", hasDeals: true },
    { id: "206", name: "Chicken Malai Tikka", description: "Tender chicken in a creamy, mildly spiced marinade.", price: 319, image: "https://images.unsplash.com/photo-1753939844802-98d5e8a4ee48?w=400", categoryId: "2", cuisine: "North Indian", rating: 4.7, dietary: "non-veg", hasDeals: false },
    { id: "207", name: "Chicken Lollipop", description: "Deep-fried chicken wings coated in spicy batter.", price: 279, image: "https://images.unsplash.com/photo-1741390723048-81412cd557a8?w=400", categoryId: "2", cuisine: "Chinese", rating: 4.6, dietary: "non-veg", hasDeals: false },
    { id: "208", name: "Chilli Chicken", description: "Crispy chicken tossed in hot and tangy Chinese sauce.", price: 289, image: "https://images.unsplash.com/photo-1696340034876-6245523babfa?w=400", categoryId: "2", cuisine: "Chinese", rating: 4.7, dietary: "non-veg", hasDeals: true },
    { id: "209", name: "Chicken Seekh Kabab", description: "Spiced minced chicken grilled on skewers.", price: 309, image: "https://images.unsplash.com/photo-1749802585605-a459271b4358?w=400", categoryId: "2", cuisine: "North Indian", rating: 4.8, dietary: "non-veg", hasDeals: false },
    { id: "210", name: "Fish Tikka", description: "Soft fish cubes marinated with spices.", price: 349, image: "https://images.unsplash.com/photo-1581337205199-d8a6eb81a406?w=400", categoryId: "2", cuisine: "North Indian", rating: 4.6, dietary: "non-veg", hasDeals: false },
    { id: "211", name: "Chilli Fish", description: "Crispy fried fish tossed in spicy Chinese-style sauce.", price: 359, image: "https://images.unsplash.com/photo-1560855471-5d6ac07fed94?w=400", categoryId: "2", cuisine: "Chinese", rating: 4.5, dietary: "non-veg", hasDeals: true },
  ],

  "3": [
    { id: "301", name: "Butter Chicken", description: "Creamy tomato gravy with tender chicken pieces.", price: 329, image: "https://images.unsplash.com/photo-1707448829764-9474458021ed?w=400", categoryId: "3", cuisine: "North Indian", rating: 4.9, dietary: "non-veg", hasDeals: true },
    { id: "302", name: "Chicken Curry", description: "Traditional spiced chicken curry.", price: 299, image: "https://images.unsplash.com/photo-1707448829764-9474458021ed?w=400", categoryId: "3", cuisine: "North Indian", rating: 4.6, dietary: "non-veg", hasDeals: false },
    { id: "303", name: "Chicken Tikka Masala", description: "Grilled chicken tikka cooked in rich gravy.", price: 349, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400", categoryId: "3", cuisine: "North Indian", rating: 4.8, dietary: "non-veg", hasDeals: true },
    { id: "304", name: "Chicken Kolhapuri", description: "Fiery and flavorful chicken dish.", price: 339, image: "https://images.unsplash.com/photo-1728542575492-47e02eb3305c?w=400", categoryId: "3", cuisine: "North Indian", rating: 4.7, dietary: "non-veg", hasDeals: false },
    { id: "305", name: "Chicken Bhuna", description: "Chicken slow-cooked in thick masala.", price: 319, image: "https://images.unsplash.com/photo-1723169863726-fa6c9262c086?w=400", categoryId: "3", cuisine: "North Indian", rating: 4.6, dietary: "non-veg", hasDeals: false },

    { id: "306", name: "Mutton Rogan Josh", description: "Kashmiri-style mutton curry.", price: 449, image: "https://images.unsplash.com/photo-1659716307017-dc91342ec2b8?w=400", categoryId: "3", cuisine: "North Indian", rating: 4.8, dietary: "non-veg", hasDeals: true },
    { id: "307", name: "Mutton Masala", description: "Spicy curry with tender mutton.", price: 429, image: "https://images.unsplash.com/photo-1640542509430-f529fdfce835?w=400", categoryId: "3", cuisine: "North Indian", rating: 4.7, dietary: "non-veg", hasDeals: false },
    { id: "308", name: "Mutton Mughlai", description: "Creamy Mughlai-style curry.", price: 469, image: "https://images.unsplash.com/photo-1686998423980-ab223d183055?w=400", categoryId: "3", cuisine: "North Indian", rating: 4.8, dietary: "non-veg", hasDeals: false },
    { id: "309", name: "Mutton Saoji", description: "Nagpur-style spicy mutton curry.", price: 459, image: "https://images.unsplash.com/photo-1606843046080-45bf7a23c39f?w=400", categoryId: "3", cuisine: "North Indian", rating: 4.9, dietary: "non-veg", hasDeals: true },

    { id: "310", name: "Fish Tikka Masala", description: "Grilled fish in creamy masala.", price: 379, image: "https://images.unsplash.com/photo-1612426357506-8b66a851fbe6?w=400", categoryId: "3", cuisine: "North Indian", rating: 4.6, dietary: "non-veg", hasDeals: false },
    { id: "311", name: "Tawa Fish", description: "Pan-fried fish with spices.", price: 349, image: "https://images.unsplash.com/photo-1602022131768-033a8796e78d?w=400", categoryId: "3", cuisine: "North Indian", rating: 4.5, dietary: "non-veg", hasDeals: false },
    { id: "312", name: "Fish Curry", description: "Traditional spicy fish curry.", price: 359, image: "https://images.unsplash.com/photo-1682622110397-37f6e928f890?w=400", categoryId: "3", cuisine: "North Indian", rating: 4.7, dietary: "non-veg", hasDeals: true },

    { id: "313", name: "Paneer Butter Masala", description: "Paneer in buttery tomato gravy.", price: 269, image: "https://images.unsplash.com/photo-1701579231378-3726490a407b?w=400", categoryId: "3", cuisine: "North Indian", rating: 4.8, dietary: "veg", hasDeals: true },
    { id: "314", name: "Kadai Paneer", description: "Paneer cooked in kadai masala.", price: 259, image: "https://images.unsplash.com/photo-1589656613433-b06c8ea9a46b?w=400", categoryId: "3", cuisine: "North Indian", rating: 4.6, dietary: "veg", hasDeals: false },
    { id: "315", name: "Palak Paneer", description: "Paneer simmered in spinach gravy.", price: 249, image: "https://images.unsplash.com/photo-1589647363585-f4a7d3877b10?w=400", categoryId: "3", cuisine: "North Indian", rating: 4.7, dietary: "veg", hasDeals: false },
    { id: "316", name: "Veg Kofta", description: "Vegetable dumplings in brown gravy.", price: 239, image: "https://images.unsplash.com/photo-1708782340377-882559d544fb?w=400", categoryId: "3", cuisine: "North Indian", rating: 4.5, dietary: "veg", hasDeals: false },
    { id: "317", name: "Mix Veg", description: "Seasonal vegetables cooked in masala.", price: 219, image: "https://images.unsplash.com/photo-1637194502510-09d5a08e7535?w=400", categoryId: "3", cuisine: "North Indian", rating: 4.4, dietary: "veg", hasDeals: true },
    { id: "318", name: "Dal Tadka", description: "Yellow lentils tempered with ghee.", price: 179, image: "https://images.unsplash.com/photo-1624243037263-01bb87a0a0c7?w=400", categoryId: "3", cuisine: "North Indian", rating: 4.6, dietary: "veg", hasDeals: false },
    { id: "319", name: "Dal Makhani", description: "Creamy black lentils cooked slow.", price: 199, image: "https://images.unsplash.com/photo-1651779472865-9f4b7389b7b1?w=400", categoryId: "3", cuisine: "North Indian", rating: 4.7, dietary: "veg", hasDeals: true },
  ],

  "4": [
    { id: "401", name: "Tandoori Roti", description: "Whole wheat roti cooked in tandoor.", price: 25, image: "https://images.unsplash.com/photo-1653550027228-e3202a24ccc1?w=400", categoryId: "4", cuisine: "North Indian", rating: 4.5, dietary: "veg", hasDeals: false },
    { id: "402", name: "Butter Naan", description: "Soft naan brushed with butter.", price: 45, image: "https://images.unsplash.com/photo-1637471631117-ded3d248c468?w=400", categoryId: "4", cuisine: "North Indian", rating: 4.7, dietary: "veg", hasDeals: false },
    { id: "403", name: "Garlic Naan", description: "Naan infused with garlic.", price: 55, image: "https://images.unsplash.com/photo-1697155406014-04dc649b0953?w=400", categoryId: "4", cuisine: "North Indian", rating: 4.8, dietary: "veg", hasDeals: true },
    { id: "404", name: "Paratha", description: "Flaky layered flatbread.", price: 35, image: "https://images.unsplash.com/photo-1653550027228-e3202a24ccc1?w=400", categoryId: "4", cuisine: "North Indian", rating: 4.4, dietary: "veg", hasDeals: false },
    { id: "405", name: "Cheese Kulcha", description: "Kulcha stuffed with cheese.", price: 75, image: "https://images.unsplash.com/photo-1723473620176-8d26dc6314cf?w=400", categoryId: "4", cuisine: "North Indian", rating: 4.6, dietary: "veg", hasDeals: false },
  ],

  "5": [
    { id: "501", name: "Veg Biryani", description: "Rice cooked with spices and vegetables.", price: 229, image: "https://images.unsplash.com/photo-1505216980056-a7b7b1c6e000?w=400", categoryId: "5", cuisine: "North Indian", rating: 4.6, dietary: "veg", hasDeals: true },
    { id: "502", name: "Chicken Biryani", description: "Layered rice with tender chicken.", price: 289, image: "https://images.unsplash.com/photo-1697155406055-2db32d47ca07?w=400", categoryId: "5", cuisine: "North Indian", rating: 4.8, dietary: "non-veg", hasDeals: true },
    { id: "503", name: "Mutton Biryani", description: "Rice with juicy mutton and masala.", price: 389, image: "https://images.unsplash.com/photo-1691170979035-27e5ec943205?w=400", categoryId: "5", cuisine: "North Indian", rating: 4.9, dietary: "non-veg", hasDeals: false },
    { id: "504", name: "Veg Fried Rice", description: "Stir-fried rice with veggies.", price: 179, image: "https://images.unsplash.com/photo-1664717698774-84f62382613b?w=400", categoryId: "5", cuisine: "Chinese", rating: 4.4, dietary: "veg", hasDeals: false },
    { id: "505", name: "Chicken Fried Rice", description: "Indo-Chinese style fried rice.", price: 219, image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400", categoryId: "5", cuisine: "Chinese", rating: 4.5, dietary: "non-veg", hasDeals: true },
  ],

  "6": [
    { id: "601", name: "Paneer Tikka Roll", description: "Wrap filled with grilled paneer.", price: 149, image: "https://images.unsplash.com/photo-1560340841-eefc7aa04432?w=400", categoryId: "6", cuisine: "North Indian", rating: 4.6, dietary: "veg", hasDeals: true },
    { id: "602", name: "Chicken Tikka Roll", description: "Rumali roti stuffed with chicken.", price: 169, image: "https://images.unsplash.com/photo-1719329466073-56fb768d7d44?w=400", categoryId: "6", cuisine: "North Indian", rating: 4.7, dietary: "non-veg", hasDeals: false },
  ],
};


// =====================
// COUPONS
// =====================
export const coupons = [
  { id: "1", code: "WELCOME10", discountPercent: 10, expiryDate: "2026-12-31", isActive: true, description: "10% off on your order" },
  { id: "2", code: "SAVE20", discountPercent: 20, expiryDate: "2026-12-31", isActive: true, description: "20% off on orders above $50" },
  { id: "3", code: "FIRST50", discountPercent: 50, expiryDate: "2026-12-31", isActive: true, description: "50% off on first order" },
];


export const offers = [
  { id: "1", title: "20% OFF on First Order", description: "Use code FIRST50", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800" },
  { id: "2", title: "Free Delivery on Orders Above $30", description: "Limited time offer", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800" },
];

// =====================
// RESTAURANT INFO
// =====================
export const restaurantInfo = {
  name: "The Golden Fork",
  logo: "🍴",
  address: "123 Gourmet Street, Food District, City 12345",
  rating: 4.5,
  phone: "+1 (555) 123-4567",
  email: "info@goldenfork.com",
  hours: "Mon-Sun: 11:00 AM - 11:00 PM",
};

