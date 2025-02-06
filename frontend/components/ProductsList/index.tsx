import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Row, Col, Button, Table, Form } from 'react-bootstrap';
import { useAdmin, useProductsActions, useTypedSelector } from '../../hooks';
import Loader from '../Loader';
import Message from '../Message';
import Paginate from '../Paginate';

interface ProductListProps {
  pageId?: string;
}

const ProductsList: React.FC<ProductListProps> = ({ pageId }) => {
  useAdmin();

  const { fetchProducts, deleteProduct, createProduct } = useProductsActions();

  const {
    loading,
    error,
    data: { products, pages, page },
  } = useTypedSelector(state => state.products);

  const { success: successDelete } = useTypedSelector(
    state => state.productDelete
  );

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    price: 0,
    description: '',
    countInStock: 0,
  });

  useEffect(() => {
    fetchProducts('', parseInt(pageId || '1', 10));
  }, [fetchProducts, successDelete, pageId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: name === 'price' || name === 'countInStock' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProduct(formData);
    setShowForm(false);
    setFormData({
      name: '',
      brand: '',
      category: '',
      price: 0,
      description: '',
      countInStock: 0,
    });
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-right">
          <Button
            className="my-3"
            onClick={() => setShowForm(!showForm)}
            style={{ float: 'right' }}
          >
            {showForm ? 'Cancel' : <><i className="fas fa-plus"></i> Create Product</>}
          </Button>
        </Col>
      </Row>

      {showForm && (
        <Form onSubmit={handleSubmit} className="mb-4">
          <Row>
            <Col md={6}>
              <Form.Group controlId="name" className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter product name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="brand" className="mb-3">
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter brand name"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="category" className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="price" className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="countInStock" className="mb-3">
                <Form.Label>Stock Count</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter stock count"
                  name="countInStock"
                  value={formData.countInStock}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="description" className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter product description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Button type="submit" variant="primary">
            Create Product
          </Button>
        </Form>
      )}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map(_product => (
                <tr key={_product._id}>
                  <td>{_product._id}</td>
                  <td>{_product.name}</td>
                  <td>${_product.price}</td>
                  <td>{_product.category}</td>
                  <td>{_product.brand}</td>
                  <td>
                    <Link href={`/admin/products/edit/${_product._id}`} passHref>
                      <Button variant="light" className="btn-sm">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => {
                        if (
                          window.confirm('Are you sure you want to delete this product?')
                        ) {
                          deleteProduct(_product._id);
                        }
                      }}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Paginate pages={pages} page={page} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default ProductsList;
