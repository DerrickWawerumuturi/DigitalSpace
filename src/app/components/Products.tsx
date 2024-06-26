type ProductType = {
  name: string,
  price: number,
  rating: number,
  description: string,
  image: string,
};

type ProductList = {
  [key: string]: ProductType,
};

const Product: ProductList = {
  item1: {
    name: "Socks",
    price: 100.0,
    rating: 4.5,
    description: "socks",
    image: "/images/socks.jpg"
  },
  item2: {
    name: "Jordan 1",
    price: 100.0,
    rating: 4.5,
    description: "J1 2013",
    image: "/images/shoes.jpg"
  },
  item3: {
    name: "shirt",
    price: 100.0,
    rating: 4.5,
    description: "shirt",
    image: "/images/shirt.jpg"
  },
  item4: {
    name: "blanket",
    price: 100.0,
    rating: 4.5,
    description: "blanket",
    image: "/images/blankets.jpg"
  },
  item5: {
    name: "Air Nike",
    price: 100.0,
    rating: 4.5,
    description: "Air Nike",
    image: "/images/shoes2.jpg"
  },
  item6: {
    name: "trousers",
    price: 100.0,
    rating: 4.5,
    description: "trousers",
    image: "/images/trousers.jpg"
  },
};

export default Product;