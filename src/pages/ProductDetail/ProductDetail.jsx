import { useParams } from 'react-router-dom'
import { useProducts } from '@/context/productsContext'
import ProductDetailContent from './components/ProductDetailContent'

// A keyed content component resets selections when following a related-product link.
export default function ProductDetail(props) {
  const { products: detailProducts } = useProducts()
  const { productId } = useParams()
  const product = detailProducts.find(
    (item) => item.id === productId && item.isLiveOnWebsite,
  )
  return <ProductDetailContent key={productId} product={product} {...props} />
}
