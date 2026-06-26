import axios from "axios";
import { useEffect,useState } from "react";
import { Header } from "../../components/Header.jsx";
import "./HomePage.css";
import {ProductGrid} from  "./ProductsGrid"


export function HomePage({cart,loadCart }) {
  const [products,setProducts] = useState([ ])
  
 
 useEffect(() =>{
const getHomeData = async () => {
const response = await axios.get('/api/products');
setProducts(response.data);
}
getHomeData();
}, []);

    return (
    <>
      <title>react-e_commerce</title>
      <Header cart ={cart} />

      <div className="home-page">
      <ProductGrid products = {products} loadCart = {loadCart} />
      </div>
    </>
  );
}
