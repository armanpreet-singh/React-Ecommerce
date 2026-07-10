
import { useEffect,useState } from "react";
import { Header } from "../../components/Header.jsx";
import "./HomePage.css";
import {ProductGrid} from  "./ProductsGrid"
import api from "../../api.js";


export function HomePage({cart,loadCart }) {
  const [products,setProducts] = useState([ ])
  
 
 useEffect(() =>{
const getHomeData = async () => {
const response = await api.get('/api/products');
setProducts(response.data);
}
getHomeData();
}, []);

    return (
    <>
      <title>GuildMart.</title>
      <Header cart ={cart} />

      <div className="home-page">
      <ProductGrid products = {products} loadCart = {loadCart} />
      </div>
    </>
  );
}
