import { useParams } from 'react-router-dom'
import { detailProducts } from '@/data/catalogProducts'
import ProductDetailContent from './components/ProductDetailContent'

// A keyed content component resets selections when following a related-product link.
export default function ProductDetail(props) {
  const { productId } = useParams()
  const product = detailProducts.find((item) => item.id === productId)
  return <ProductDetailContent key={productId} product={product} {...props} />
}
