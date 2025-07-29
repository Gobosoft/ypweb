import { useEffect, useState } from 'react'
import productsService from 'src/services/Products/products'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'src/components/ui/table'
import { Badge } from 'src/components/ui/badge'
import { Product } from 'src/lib/types'
import { Button } from '../ui/button'
import { RefreshCcw } from 'lucide-react'

const ProductsList = () => {
  const [products, setProducts] = useState<Product[]>([])

  const fetchData = async () => {
    const result = await productsService.getAllProducts()
    setProducts(result)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="p-1">
      <div className="my-2">
        <Button
          variant={'secondary'}
          onClick={async () => {
            await fetchData()
          }}
        >
          <RefreshCcw />
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nimi</TableHead>
            <TableHead>Hinta (€)</TableHead>
            <TableHead>Kuvaus</TableHead>
            <TableHead>Aktiivisuus</TableHead>
            <TableHead>Messuvuosi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.price.toFixed(2)}</TableCell>
              <TableCell>{product.description || '-'}</TableCell>
              <TableCell>
                {product.is_active ? (
                  <Badge variant="default">Aktiivinen</Badge>
                ) : (
                  <Badge variant="destructive">Inaktiivinen</Badge>
                )}
              </TableCell>
              <TableCell>{product.exhibition_year?.year}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default ProductsList
