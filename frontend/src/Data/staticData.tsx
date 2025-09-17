import {
  appleLogo,
  bkashCard,
  headphone,
  canonLogo,
  productImg1,
  productImg2,
  productImg3,
  momoLogo,
  car,
  correctSign,
} from "src/Assets/Images/Images.ts";
import { regexPatterns } from "./globalVariables.tsx";

export const introductionSliderData = [
  {
    productName: "Iphone 14 Series",
    productImg: productImg1,
    logoImg: appleLogo,
    discountText: "Up to 10% off Voucher",
    id: 1,
  },
  {
    productName: "Canon EOS 5D MkII",
    productImg: productImg2,
    logoImg: canonLogo,
    discountText: "Up to 30% off Voucher",
    id: 2,
  },
  {
    productName: "MacBook Pro 16",
    productImg: productImg3,
    logoImg: appleLogo,
    discountText: "Up to 15% off Voucher",
    id: 3,
  },
];

export const categoriesData = [
  {
    iconName: "mobile",
    title: "Phones",
    id: 1,
  },
  {
    iconName: "computer",
    title: "Computers",
    id: 2,
  },
  {
    iconName: "smartWatch",
    title: "SmartWatch",
    id: 3,
  },
  {
    iconName: "camera",
    title: "Camera",
    id: 4,
  },
  {
    iconName: "headphone",
    title: "HeadPhones",
    id: 5,
  },
  {
    iconName: "gamepad",
    title: "Gaming",
    id: 6,
  },
  {
    iconName: "furniture",
    title: "Furniture",
    id: 7,
  },
  {
    iconName: "shirt",
    title: "Clothes",
    id: 8,
  },
  {
    iconName: "dogHand",
    title: "Animal",
    id: 9,
  },
  {
    iconName: "makeup",
    title: "makeup",
    id: 10,
  },
];

export const aboutCardsInfo = [
  {
    iconName: "shop",
    number: "10.5k",
    text: "Sallers active our site",
    translationKey: "aboutCardsInfo1",
    id: 1,
  },
  {
    iconName: "dollarSign",
    number: "33k",
    text: "Mopnthly Produduct Sale",
    translationKey: "aboutCardsInfo2",
    id: 2,
  },
  {
    iconName: "shoppingBag",
    number: "45.5k",
    text: "Customer active in our site",
    translationKey: "aboutCardsInfo3",
    id: 3,
  },
  {
    iconName: "moneyBag",
    number: "25k",
    text: "Anual gross sale in our site",
    translationKey: "aboutCardsInfo4",
    id: 4,
  },
];

export const MomoPayment = [
  {
    img: momoLogo,
    alt: "Momo card",
    link: "https://www.momo.vn/",
    id: 1,
  },
]

// export const LANGUAGES = [
//   {
//     lang: "English",
//     flag: usaFlag,
//     flagName: "USA",
//     code: "en",
//     id: 1,
//   },
//   {
//     lang: "Russian",
//     flag: russiaFlag,
//     flagName: "Russia",
//     code: "ru",
//     id: 2,
//   },
//   {
//     lang: "Arabic",
//     flag: saudiFlag,
//     flagName: "Saudi Arabia",
//     code: "ar",
//     id: 3,
//   },
//   {
//     lang: "French",
//     flag: franceFlag,
//     flagName: "France",
//     code: "fr",
//     id: 4,
//   },
//   {
//     lang: "hungarian",
//     flag: hungaryFlag,
//     flagName: "Hungary",
//     code: "hu",
//     id: 5,
//   },
//   {
//     lang: "Japanese",
//     flag: japanFlag,
//     flagName: "Japan",
//     code: "ja",
//     id: 6,
//   },
//   {
//     lang: "Hindi",
//     flag: indiaFlag,
//     flagName: "India",
//     code: "hi",
//     id: 7,
//   },
// ];

export const productCardCustomizations = {
  categoryProducts: {
    showDiscount: true,
    showFavIcon: true,
    stopHover: false,
    showDetailsIcon: true,
    showRemoveIcon: false,
    showNewText: true,
    showWishList: true,
    // showColors: true,
    showColors: false,
  },
  allProducts: {
    showDiscount: true,
    showFavIcon: true,
    showDetailsIcon: true,
    showNewText: true,
    showWishList: true,
    stopHover: false,
    showRemoveIcon: false,
    // showColors: true,
    showColors: false,
  },
  wishListProducts: {
    showDiscount: true,
    showFavIcon: false,
    stopHover: true,
    showDetailsIcon: false,
    showRemoveIcon: true,
    showNewText: true,
    showWishList: true,
    // showColors: true,
    showColors: false,
  },
  ourProducts: {
    showDiscount: true,
    showFavIcon: true,
    stopHover: false,
    showDetailsIcon: true,
    showRemoveIcon: false,
    showNewText: true,
    showWishList: true,
    // showColors: true,
    showColors: false,
  },
};

export const mobileNavData = [
  {
    name: "Home",
    link: "/",
    icon: "home",
    requiteSignIn: false,
  },
  {
    name: "About",
    link: "/about",
    icon: "filePaper",
    requiteSignIn: false,
  },
  {
    name: "Profile",
    link: "/profile",
    icon: "user",
    requiteSignIn: true,
  },
];

export const getRestMobileNavData = ({
  cartProducts,
  orderProducts
}) => {
  return [
    {
      iconName: "cart3",
      routePath: "/cart",
      text: "my cart",
      countLength: cartProducts.length,
      id: mobileNavData.length + 1,
    },
    {
      iconName: "cart",
      routePath: "/order",
      text: "my order",
      countLength: orderProducts.length,
      id: mobileNavData.length + 2,
    },
  ];
};

export const womenFashionMenuItems = [
  { name: "Elegant Dress", url: "/#" },
  { name: "Chic Blouse", url: "/#" },
  { name: "Statement Handbag", url: "/#" },
  { name: "Versatile Jacket", url: "/#" },
  { name: "Comfortable", url: "/#" },
];

export const menFashionMenuItems = [
  { name: "Tailored Suit", url: "/#" },
  { name: "Casual Shirts", url: "/#" },
  { name: "Slim-Fit Jeans", url: "/#" },
  { name: "Leather Accessories", url: "/#" },
  { name: "Modern Sneakers", url: "/#" },
];

export const otherSectionsMenuItems = [
  { name: "Electronics", url: "/#" },
  { name: "Home & Lifestyle", url: "/#" },
  { name: "Medicine", url: "/#" },
  { name: "Sports & Outdoor", url: "/#" },
  { name: "Baby's & Toys", url: "/#" },
  { name: "Groceries & Pets", url: "/#" },
  { name: "Health & Beauty", url: "/#" },
];

export const mySocialMedia = [
  {
    name: "Facebook",
    link: "#",
    icon: "facebook",
    id: 1,
  },
  {
    name: "Twitter",
    link: "#",
    icon: "twitter",
    id: 2,
  },
  {
    name: "Instagram",
    link: "#",
    icon: "instagram",
    id: 3,
  },
  {
    name: "Linkedin",
    link: "https://www.linkedin.com/in/hqhuy/",
    icon: "linkedin",
    id: 4,
  },
];

export const featuresSectionData = [
  {
    iconImg: car,
    iconAlt: "Car",
    title: "FREE AND FAST DELIVERY",
    description: "Free delivery for all orders over $140",
    id: 1,
  },
  {
    iconImg: headphone,
    iconAlt: "Headphone",
    title: "24/7 CUSTOMER SERVICE",
    description: "Friendly 24/7 customer support",
    id: 2,
  },
  {
    iconImg: correctSign,
    iconAlt: "Correct sign",
    title: "MONEY BACK GUARANTEE",
    description: "We return money within 30 days",
    id: 3,
  },
];

export const billingInputsData = [
  {
    translationKey: "receiverName",
    label: "Receiver Name",
    name: "receiverName",
    required: true,
    id: 1,
  },
  {
    translationKey: "shippingAddress",
    label: "Shipping Address",
    name: "shippingAddress",
    required: true,
    autoComplete: true,
    id: 2,
  },
  {
    translationKey: "phoneNumber",
    label: "Phone Number",
    name: "phoneNumber",
    required: true,
    type: "tel",
    autoComplete: true,
    id: 3,
    regex: regexPatterns.iraqiPhone,
  },
  {
    translationKey: "email",
    label: "Email Address",
    name: "email",
    required: true,
    type: "email",
    autoComplete: true,
    id: 4,
    regex: regexPatterns.email,
  },
];
